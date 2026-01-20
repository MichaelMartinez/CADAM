"""
FastAPI HTTP server for OpenSCAD to STEP conversion service.
Provides async job submission with polling for results.
"""
import os
import uuid
import asyncio
from datetime import datetime, timedelta
from typing import Dict, Optional
from enum import Enum
from dataclasses import dataclass
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Header, BackgroundTasks, File, UploadFile, Form
from fastapi.responses import Response, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json

from converter import convert_scad_to_step, validate_scad_code
from mesh_analysis import analyze_mesh
from mold_generator import generate_mold


# Configuration
API_SECRET = os.environ.get("STEP_CONVERTER_API_SECRET", "")
JOB_TTL_SECONDS = int(os.environ.get("JOB_TTL_SECONDS", "300"))  # 5 minutes
CLEANUP_INTERVAL_SECONDS = 60
MAX_CODE_SIZE_KB = int(os.environ.get("MAX_CODE_SIZE_KB", "500"))  # 500KB
MAX_CONCURRENT_JOBS = int(os.environ.get("MAX_CONCURRENT_JOBS", "10"))


class JobStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"


@dataclass
class ConversionJob:
    id: str
    status: JobStatus
    created_at: datetime
    completed_at: Optional[datetime] = None
    result: Optional[bytes] = None
    error: Optional[str] = None
    filename: str = "model"


# In-memory job storage
jobs: Dict[str, ConversionJob] = {}
job_semaphore = asyncio.Semaphore(MAX_CONCURRENT_JOBS)


# Request/Response models
class ConvertRequest(BaseModel):
    code: str
    filename: Optional[str] = "model"


class ConvertResponse(BaseModel):
    jobId: str
    status: str


class StatusResponse(BaseModel):
    jobId: str
    status: str
    error: Optional[str] = None
    createdAt: str
    completedAt: Optional[str] = None


class ErrorResponse(BaseModel):
    error: str
    detail: Optional[str] = None


class HealthResponse(BaseModel):
    status: str
    activeJobs: int


async def cleanup_expired_jobs():
    """Remove expired jobs from memory."""
    while True:
        await asyncio.sleep(CLEANUP_INTERVAL_SECONDS)
        now = datetime.utcnow()
        expired = [
            job_id for job_id, job in jobs.items()
            if (now - job.created_at) > timedelta(seconds=JOB_TTL_SECONDS)
        ]
        for job_id in expired:
            del jobs[job_id]
        if expired:
            print(f"Cleaned up {len(expired)} expired jobs")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown lifecycle management."""
    # Start cleanup task
    cleanup_task = asyncio.create_task(cleanup_expired_jobs())
    print(f"STEP Converter Service started. Max concurrent jobs: {MAX_CONCURRENT_JOBS}")
    yield
    # Cancel cleanup task on shutdown
    cleanup_task.cancel()
    try:
        await cleanup_task
    except asyncio.CancelledError:
        pass


app = FastAPI(
    title="STEP Converter Service",
    description="Convert OpenSCAD code to STEP format using FreeCAD",
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def verify_auth(authorization: Optional[str]) -> bool:
    """Verify API authentication."""
    if not API_SECRET:
        return True  # No auth required if secret not set
    if not authorization:
        return False
    # Expect "Bearer <secret>" format
    parts = authorization.split(" ")
    if len(parts) != 2 or parts[0].lower() != "bearer":
        return False
    return parts[1] == API_SECRET


async def process_conversion(job_id: str, scad_code: str):
    """Background task to process OpenSCAD to STEP conversion."""
    async with job_semaphore:
        job = jobs.get(job_id)
        if not job:
            return

        job.status = JobStatus.PROCESSING
        print(f"Processing job {job_id}")

        # Run conversion in thread pool (FreeCAD is blocking)
        loop = asyncio.get_event_loop()
        try:
            result, error = await loop.run_in_executor(
                None,
                convert_scad_to_step,
                scad_code
            )

            if error:
                job.status = JobStatus.FAILED
                job.error = error
                print(f"Job {job_id} failed: {error}")
            else:
                job.status = JobStatus.COMPLETED
                job.result = result
                print(f"Job {job_id} completed: {len(result)} bytes")

            job.completed_at = datetime.utcnow()

        except Exception as e:
            job.status = JobStatus.FAILED
            job.error = str(e)
            job.completed_at = datetime.utcnow()
            print(f"Job {job_id} error: {e}")


@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint."""
    return HealthResponse(
        status="healthy",
        activeJobs=len([j for j in jobs.values() if j.status in [JobStatus.PENDING, JobStatus.PROCESSING]])
    )


@app.post(
    "/convert",
    response_model=ConvertResponse,
    responses={
        400: {"model": ErrorResponse},
        401: {"model": ErrorResponse},
        413: {"model": ErrorResponse}
    }
)
async def submit_conversion(
    request: ConvertRequest,
    background_tasks: BackgroundTasks,
    authorization: Optional[str] = Header(None)
):
    """
    Submit OpenSCAD code for conversion to STEP format.
    Returns a jobId for polling status.
    """
    if not verify_auth(authorization):
        raise HTTPException(status_code=401, detail="Invalid or missing authorization")

    # Validate code
    validation_error = validate_scad_code(request.code)
    if validation_error:
        raise HTTPException(status_code=400, detail=validation_error)

    # Check code size
    code_size_kb = len(request.code.encode('utf-8')) / 1024
    if code_size_kb > MAX_CODE_SIZE_KB:
        raise HTTPException(
            status_code=413,
            detail=f"Code size ({code_size_kb:.1f}KB) exceeds maximum of {MAX_CODE_SIZE_KB}KB"
        )

    # Sanitize filename
    filename = request.filename or "model"
    filename = "".join(c for c in filename if c.isalnum() or c in "._- ")[:100]

    # Create job
    job_id = str(uuid.uuid4())
    job = ConversionJob(
        id=job_id,
        status=JobStatus.PENDING,
        created_at=datetime.utcnow(),
        filename=filename
    )
    jobs[job_id] = job

    # Start background conversion
    background_tasks.add_task(process_conversion, job_id, request.code)

    print(f"Created job {job_id} for file '{filename}'")

    return ConvertResponse(jobId=job_id, status=job.status.value)


@app.get(
    "/status/{job_id}",
    response_model=StatusResponse,
    responses={
        401: {"model": ErrorResponse},
        404: {"model": ErrorResponse}
    }
)
async def get_status(
    job_id: str,
    authorization: Optional[str] = Header(None)
):
    """Get the status of a conversion job."""
    if not verify_auth(authorization):
        raise HTTPException(status_code=401, detail="Invalid or missing authorization")

    job = jobs.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found or expired")

    return StatusResponse(
        jobId=job.id,
        status=job.status.value,
        error=job.error,
        createdAt=job.created_at.isoformat(),
        completedAt=job.completed_at.isoformat() if job.completed_at else None
    )


@app.get(
    "/download/{job_id}",
    responses={
        400: {"model": ErrorResponse},
        401: {"model": ErrorResponse},
        404: {"model": ErrorResponse},
        425: {"model": ErrorResponse}
    }
)
async def download_result(
    job_id: str,
    authorization: Optional[str] = Header(None)
):
    """Download the converted STEP file."""
    if not verify_auth(authorization):
        raise HTTPException(status_code=401, detail="Invalid or missing authorization")

    job = jobs.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found or expired")

    if job.status == JobStatus.FAILED:
        raise HTTPException(status_code=400, detail=job.error or "Conversion failed")

    if job.status != JobStatus.COMPLETED:
        raise HTTPException(status_code=425, detail="Job not yet completed")

    if not job.result:
        raise HTTPException(status_code=500, detail="Result data missing")

    filename = f"{job.filename}.step"

    return Response(
        content=job.result,
        media_type="application/step",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"'
        }
    )


# =============================================================================
# Mesh Analysis Endpoint
# =============================================================================

class AnalyzeRequest(BaseModel):
    options: Optional[dict] = None


@app.post("/analyze-mesh")
async def analyze_mesh_endpoint(
    stl: UploadFile = File(...),
    options: str = Form("{}"),
    authorization: Optional[str] = Header(None)
):
    """
    Analyze an STL mesh for moldability.

    Returns manifold status, orientation recommendations, undercut detection,
    draft angle analysis, and alpha shape for shear edge generation.
    """
    if not verify_auth(authorization):
        raise HTTPException(status_code=401, detail="Invalid or missing authorization")

    try:
        # Parse options
        opts = json.loads(options)
    except json.JSONDecodeError:
        opts = {}

    # Read STL data
    stl_data = await stl.read()

    if len(stl_data) == 0:
        raise HTTPException(status_code=400, detail="Empty STL file")

    # Check file size (max 50MB)
    if len(stl_data) > 50 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="STL file too large (max 50MB)")

    print(f"Analyzing mesh: {len(stl_data)} bytes, options: {opts}")

    # Run analysis in thread pool (can be CPU-intensive)
    loop = asyncio.get_event_loop()
    try:
        result = await loop.run_in_executor(None, analyze_mesh, stl_data, opts)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

    if not result.get("success", False):
        raise HTTPException(
            status_code=400,
            detail=result.get("error", "Analysis failed with unknown error")
        )

    return JSONResponse(content=result)


# =============================================================================
# Mold Generation Endpoint
# =============================================================================

@app.post("/generate-mold")
async def generate_mold_endpoint(
    stl: UploadFile = File(...),
    config: str = Form("{}"),
    alpha_shape: str = Form("null"),
    authorization: Optional[str] = Header(None)
):
    """
    Generate a compression mold from an STL mesh.

    Supports forged carbon two-part molds with proper shear edge geometry.
    Returns STL and/or STEP files for piston and bucket.
    """
    if not verify_auth(authorization):
        raise HTTPException(status_code=401, detail="Invalid or missing authorization")

    try:
        cfg = json.loads(config)
    except json.JSONDecodeError:
        cfg = {}

    try:
        alpha_pts = json.loads(alpha_shape) if alpha_shape != "null" else None
    except json.JSONDecodeError:
        alpha_pts = None

    # Read STL data
    stl_data = await stl.read()

    if len(stl_data) == 0:
        raise HTTPException(status_code=400, detail="Empty STL file")

    # Check file size (max 50MB)
    if len(stl_data) > 50 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="STL file too large (max 50MB)")

    print(f"Generating mold: {len(stl_data)} bytes, config: {cfg}")

    # Run generation in thread pool (CPU-intensive)
    loop = asyncio.get_event_loop()
    try:
        result = await loop.run_in_executor(
            None,
            generate_mold,
            stl_data,
            cfg,
            alpha_pts
        )
    except Exception as e:
        import traceback
        raise HTTPException(
            status_code=500,
            detail=f"Generation failed: {str(e)}\n{traceback.format_exc()}"
        )

    if not result.get("success", False):
        raise HTTPException(
            status_code=400,
            detail=result.get("error", "Generation failed with unknown error")
        )

    return JSONResponse(content=result)


# =============================================================================
# Combined Analysis + Generation Endpoint (convenience)
# =============================================================================

@app.post("/analyze-and-generate")
async def analyze_and_generate_endpoint(
    stl: UploadFile = File(...),
    config: str = Form("{}"),
    analysis_options: str = Form("{}"),
    authorization: Optional[str] = Header(None)
):
    """
    Combined endpoint: analyze mesh and generate mold in one call.

    This is more efficient than calling /analyze-mesh then /generate-mold
    when you want to use analysis results (like alpha shape) for generation.
    """
    if not verify_auth(authorization):
        raise HTTPException(status_code=401, detail="Invalid or missing authorization")

    try:
        cfg = json.loads(config)
    except json.JSONDecodeError:
        cfg = {}

    try:
        analysis_opts = json.loads(analysis_options)
    except json.JSONDecodeError:
        analysis_opts = {}

    # Read STL data
    stl_data = await stl.read()

    if len(stl_data) == 0:
        raise HTTPException(status_code=400, detail="Empty STL file")

    print(f"Analyze + Generate: {len(stl_data)} bytes")

    loop = asyncio.get_event_loop()

    # First: analyze
    try:
        analysis_result = await loop.run_in_executor(
            None, analyze_mesh, stl_data, analysis_opts
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

    if not analysis_result.get("success", False):
        return JSONResponse(content={
            "success": False,
            "phase": "analysis",
            "error": analysis_result.get("error"),
            "analysis": analysis_result
        })

    # Use analysis results for generation
    alpha_pts = None
    if cfg.get("useAlphaShapeProfile", True) and analysis_result.get("alphaShape"):
        alpha_pts = analysis_result["alphaShape"].get("points")

    # Apply recommended orientation if not specified
    if "orientation" not in cfg:
        cfg["orientation"] = analysis_result.get("recommendedOrientation", "z")

    # Apply recommended draft if not specified and draft is 0
    if cfg.get("draftAngle", 0) == 0:
        recommended = analysis_result.get("draftAnalysis", {}).get("recommendedDraft", 0)
        if recommended > 0:
            cfg["draftAngle"] = recommended

    # Second: generate
    try:
        generation_result = await loop.run_in_executor(
            None, generate_mold, stl_data, cfg, alpha_pts
        )
    except Exception as e:
        import traceback
        raise HTTPException(
            status_code=500,
            detail=f"Generation failed: {str(e)}\n{traceback.format_exc()}"
        )

    # Return combined result
    return JSONResponse(content={
        "success": generation_result.get("success", False),
        "analysis": analysis_result,
        "generation": generation_result
    })


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)
