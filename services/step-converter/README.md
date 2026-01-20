# STEP Converter Service

A Docker-based service that provides:

1. **OpenSCAD → STEP conversion** - Convert OpenSCAD code to STEP format using FreeCAD's B-Rep engine
2. **Mesh Analysis** - Analyze STL meshes for moldability (manifold check, orientation, undercuts, draft angles)
3. **Mold Generation** - Generate forged carbon compression molds (piston + bucket) from STL files using Build123D/OpenCascade

## Overview

The service provides multiple capabilities:

- **STEP Conversion**: Receives OpenSCAD code, processes it through FreeCAD's OpenSCAD workbench, and exports to STEP (ISO 10303) format with true mathematical curves
- **Mesh Analysis**: Uses Trimesh, Shapely, and SciPy to analyze STL meshes for manufacturing feasibility
- **Mold Generation**: Uses Build123D (OpenCascade) to generate two-part compression molds with proper shear edge geometry

## Architecture

```
┌─────────────┐     ┌──────────────────┐     ┌────────────────────┐
│   Frontend  │────▶│ Supabase Edge Fn │────▶│ FreeCAD Container  │
│ (React App) │◀────│ (step-converter) │◀────│ (This Service)     │
└─────────────┘     └──────────────────┘     └────────────────────┘

Endpoints:
  /convert           - OpenSCAD → STEP conversion
  /analyze-mesh      - STL mesh analysis for moldability
  /generate-mold     - Generate piston + bucket mold from STL
  /analyze-and-generate - Combined analysis + mold generation
```

## Quick Start

### Build the Docker Image

**IMPORTANT:** Use the legacy Docker builder. BuildKit/buildx has issues on some systems.

```bash
cd services/step-converter

# Build with legacy builder (REQUIRED if you see "buildx component is missing" errors)
DOCKER_BUILDKIT=0 docker build -t step-converter:latest .
```

If you try to use the default builder or `docker compose build` without disabling BuildKit, you may see:

```
failed to fetch metadata: exit status 1
ERROR: BuildKit is enabled but the buildx component is missing or broken.
```

### Create Required Network

The container needs to join a Docker network that Supabase Edge Functions can access:

```bash
# Create the network (only needed once)
docker network create supabase_network_cadam
```

### Run the Container

```bash
# Using docker compose (recommended)
docker compose up -d

# Or run standalone
docker run -d \
  --name step-converter \
  --network supabase_network_cadam \
  -p 8080:8080 \
  step-converter:latest
```

### Verify It's Working

```bash
# Health check
curl http://localhost:8080/health
# Expected: {"status":"healthy","activeJobs":0}

# Test mesh analysis
curl -X POST http://localhost:8080/analyze-mesh \
  -F "stl=@test.stl" \
  -F 'options={"repair": true}'
```

## Complete Build Process

For a fresh build from scratch:

```bash
cd services/step-converter

# 1. Create the network (if not exists)
docker network create supabase_network_cadam 2>/dev/null || true

# 2. Stop any existing container
docker compose down 2>/dev/null || true

# 3. Build with legacy builder
DOCKER_BUILDKIT=0 docker build -t step-converter:latest .

# 4. Start the container
docker compose up -d

# 5. Verify
sleep 3
curl http://localhost:8080/health
```

### Using the Start Script

The project's start script handles all of this automatically:

```bash
./scripts/start-services.sh step
```

**Note:** When using docker compose, the container connects to the `supabase_network_cadam` network so that Supabase Edge Functions can reach it via `http://step-converter:8080`. Ensure Supabase is running first (`supabase start`).

### Test the Service

```bash
# Health check
curl http://localhost:8080/health

# Submit a conversion job
curl -X POST http://localhost:8080/convert \
  -H "Content-Type: application/json" \
  -d '{"code": "cube([10, 10, 10]);", "filename": "test_cube"}'

# Check job status (use the returned jobId)
curl http://localhost:8080/status/{jobId}

# Download the STEP file
curl http://localhost:8080/download/{jobId} -o model.step
```

## API Reference

### POST /convert

Submit OpenSCAD code for conversion.

**Request:**

```json
{
  "code": "cube([10, 10, 10]);",
  "filename": "my_model"
}
```

**Response:**

```json
{
  "jobId": "uuid",
  "status": "pending"
}
```

### GET /status/{jobId}

Check conversion job status.

**Response:**

```json
{
  "jobId": "uuid",
  "status": "completed",
  "error": null,
  "createdAt": "2024-01-01T00:00:00",
  "completedAt": "2024-01-01T00:00:01"
}
```

**Status values:** `pending`, `processing`, `completed`, `failed`

### GET /download/{jobId}

Download the converted STEP file.

**Response:** Binary STEP file with `Content-Type: application/step`

### GET /health

Health check endpoint.

**Response:**

```json
{
  "status": "healthy",
  "activeJobs": 0
}
```

### POST /analyze-mesh

Analyze an STL mesh for moldability.

**Request:** `multipart/form-data`

| Field     | Type | Description                 |
| --------- | ---- | --------------------------- |
| `stl`     | File | STL file to analyze         |
| `options` | JSON | Analysis options (optional) |

**Options:**

```json
{
  "repair": true, // Attempt mesh repair if not manifold
  "demoldAxis": "z", // Axis for undercut analysis (x, y, z)
  "projectionAxis": "z", // Axis for alpha shape projection
  "alphaValue": 0.1 // Alpha value for concave hull
}
```

**Response:**

```json
{
  "success": true,
  "isManifold": true,
  "volume": 1000.0,
  "surfaceArea": 600.0,
  "triangleCount": 12,
  "vertexCount": 8,
  "boundingBox": [10.0, 10.0, 10.0],
  "orientationScores": [
    {
      "axis": "z",
      "projectedArea": 100,
      "undercutPercentage": 0.0,
      "height": 10.0,
      "score": 10.0
    }
  ],
  "recommendedOrientation": "z",
  "undercutAnalysis": {
    "z": {
      "undercutVertexCount": 0,
      "undercutPercentage": 0.0,
      "severity": "none"
    }
  },
  "draftAnalysis": {
    "minDraft": 0.0,
    "maxDraft": 90.0,
    "avgDraft": 30.0,
    "problemFaceCount": 8,
    "recommendedDraft": 2.0
  },
  "alphaShape": {
    "points": [
      [0, 0],
      [0, 10],
      [10, 10],
      [10, 0]
    ],
    "area": 100.0
  },
  "isMoldable": true,
  "analysisTimeMs": 6
}
```

### POST /generate-mold

Generate a forged carbon compression mold (piston + bucket) from an STL mesh.

**Request:** `multipart/form-data`

| Field         | Type | Description                                |
| ------------- | ---- | ------------------------------------------ |
| `stl`         | File | STL file of the part                       |
| `config`      | JSON | Mold generation configuration              |
| `alpha_shape` | JSON | Pre-computed alpha shape points (optional) |

**Config:**

```json
{
  "moldType": "forged-carbon",
  "moldShape": "round",
  "orientation": "z",
  "shearEdgeGap": 0.075, // mm - tight seal tolerance (0.05-0.15)
  "shearEdgeDepth": 2.5, // mm - vertical seal length (2-5)
  "clearanceRunout": 0.4, // mm - clearance after seal region
  "draftAngle": 2.0, // degrees - draft for demolding
  "wallThickness": 5.0, // mm
  "useAlphaShapeProfile": true,
  "outputFormat": "stl" // "stl", "step", or "both"
}
```

**Response:**

```json
{
  "success": true,
  "generationTimeMs": 177,
  "pistonStl": "<base64-encoded STL>",
  "bucketStl": "<base64-encoded STL>",
  "pistonStep": "<base64-encoded STEP>", // if outputFormat includes step
  "bucketStep": "<base64-encoded STEP>",
  "stats": {
    "pistonVolume": 5000.0,
    "bucketVolume": 8000.0
  }
}
```

### POST /analyze-and-generate

Combined mesh analysis and mold generation in one call.

**Request:** `multipart/form-data`

| Field              | Type | Description                         |
| ------------------ | ---- | ----------------------------------- |
| `stl`              | File | STL file                            |
| `config`           | JSON | Mold generation config (partial OK) |
| `analysis_options` | JSON | Analysis options                    |

**Response:**

```json
{
  "success": true,
  "analysis": {
    /* MeshAnalysisResult */
  },
  "generation": {
    /* MoldGenerationResult */
  }
}
```

## Configuration

Environment variables:

| Variable                    | Default | Description                                                                               |
| --------------------------- | ------- | ----------------------------------------------------------------------------------------- |
| `STEP_CONVERTER_API_SECRET` | (empty) | API authentication secret. If set, requests must include `Authorization: Bearer <secret>` |
| `JOB_TTL_SECONDS`           | 300     | How long to keep completed jobs in memory                                                 |
| `MAX_CODE_SIZE_KB`          | 500     | Maximum OpenSCAD code size                                                                |
| `MAX_CONCURRENT_JOBS`       | 10      | Maximum parallel conversions                                                              |

## Docker Image Details

- **Base:** Ubuntu 22.04
- **FreeCAD:** From PPA (freecad-maintainers/freecad-stable)
- **OpenSCAD:** 2021.01
- **Python:** 3.10 with FastAPI/Uvicorn
- **BOSL2:** Included at `/usr/share/openscad/libraries/BOSL2`

### Python Dependencies

| Package   | Version | Purpose                                      |
| --------- | ------- | -------------------------------------------- |
| FastAPI   | 0.109.0 | HTTP API framework                           |
| Uvicorn   | 0.27.0  | ASGI server                                  |
| Trimesh   | 4.5.3   | Mesh loading, analysis, and repair           |
| Shapely   | 2.0.6   | 2D geometry for alpha shape computation      |
| SciPy     | 1.14.1  | Delaunay triangulation for alpha shapes      |
| NumPy     | 1.26.4  | Numerical operations                         |
| rtree     | 1.3.0   | Spatial indexing for undercut detection      |
| Build123D | 0.10.0  | CAD kernel for mold generation (OpenCascade) |

### Supported Libraries

The container includes the [BOSL2](https://github.com/BelfrySCAD/BOSL2) library. Use it in your OpenSCAD code:

```openscad
include <BOSL2/std.scad>
cuboid([20, 20, 10], rounding=2);
```

## Integration with Supabase

The companion Edge Function (`supabase/functions/step-converter/`) proxies requests from the frontend to this service with JWT authentication.

### Network Configuration

The Edge Runtime container must be able to reach this service. When using docker compose, the container automatically joins the `supabase_network_cadam` network and is accessible via hostname `step-converter`.

### Environment Variables

Add to `supabase/functions/.env`:

```
STEP_CONVERTER_URL=http://step-converter:8080
STEP_CONVERTER_API_SECRET=your-secret-here  # Optional for dev
```

**Important:** Use `http://step-converter:8080` (container hostname), not `http://localhost:8080`, since the Edge Runtime runs in a separate Docker container.

## Troubleshooting

### BuildKit / Buildx Errors

**Symptom:**

```
failed to fetch metadata: exit status 1
ERROR: BuildKit is enabled but the buildx component is missing or broken.
```

**Cause:** Docker's BuildKit/buildx component is not properly installed or configured on the system.

**Solution:** Use the legacy Docker builder by setting the `DOCKER_BUILDKIT=0` environment variable:

```bash
# Instead of: docker build ...
# Use:
DOCKER_BUILDKIT=0 docker build -t step-converter:latest .

# Instead of: docker compose build
# Use:
DOCKER_BUILDKIT=0 docker compose build
```

**Note:** The `docker compose up -d` command works fine once the image is built - this only affects the build step.

### Network Not Found

**Symptom:**

```
network supabase_network_cadam declared as external, but could not be found
```

**Solution:** Create the network before running docker compose:

```bash
docker network create supabase_network_cadam
```

### Edge Function Cannot Connect

If you see `error sending request for url (http://localhost:8080/convert)`:

1. Ensure the container is connected to the Supabase network:
   ```bash
   docker network connect supabase_network_cadam step-converter
   ```
2. Verify DNS resolution works:
   ```bash
   docker exec supabase_edge_runtime_cadam getent hosts step-converter
   ```
3. Check that `STEP_CONVERTER_URL=http://step-converter:8080` is set in `supabase/functions/.env`
4. Restart Edge Functions: `supabase functions serve`

### Mold Generation Segfaults

**Symptom:** Server returns empty response or crashes when calling `/generate-mold`.

**Cause:** Build123D's `import_stl()` function returns a `Face` object, not a `Solid`. Boolean operations on a Face can cause segmentation faults in the OpenCascade kernel.

**Solution:** The service uses a custom `mesh_to_solid_build123d()` function that properly converts STL meshes to Solids using:

1. `StlAPI_Reader` to read the STL as a compound of faces
2. `BRepBuilderAPI_Sewing` to sew faces into a shell
3. `BRepBuilderAPI_MakeSolid` to convert the shell to a solid

If you're modifying the mold generation code, never use `import_stl()` for meshes that will be used in boolean operations.

### FreeCAD Import Errors

The service automatically configures FreeCAD to find OpenSCAD at `/usr/bin/openscad`. If you see "OpenSCAD executable unavailable", ensure OpenSCAD is installed in the container.

### Job Timeouts

Conversions timeout after 2 minutes. Complex models with many operations may need optimization or simplification.

### Container Keeps Restarting

**Symptom:** `docker ps` shows the container restarting repeatedly.

**Cause:** Usually a Python import error or missing dependency.

**Diagnosis:**

```bash
# Check logs for import errors
docker logs step-converter 2>&1 | head -50

# Test imports directly
docker exec step-converter python3 -c "from mold_generator import generate_mold; print('OK')"
```
