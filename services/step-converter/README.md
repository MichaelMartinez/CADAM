# STEP Converter Service

A Docker-based service that converts OpenSCAD code to STEP format using FreeCAD's B-Rep engine. This enables export of parametric models to professional CAD formats with true mathematical curves (not tessellated meshes).

## Overview

The service receives OpenSCAD code, processes it through FreeCAD's OpenSCAD workbench, and exports to STEP (ISO 10303) format. Unlike STL export which produces triangulated meshes, STEP files preserve mathematical definitions of curves and surfaces.

## Architecture

```
┌─────────────┐     ┌──────────────────┐     ┌────────────────────┐
│   Frontend  │────▶│ Supabase Edge Fn │────▶│ FreeCAD Container  │
│ (React App) │◀────│ (step-converter) │◀────│ (This Service)     │
└─────────────┘     └──────────────────┘     └────────────────────┘
```

## Quick Start

### Build and Run

```bash
# Build the image (use legacy builder if BuildKit has issues)
DOCKER_BUILDKIT=0 docker build -t step-converter:latest .

# Run the container (standalone)
docker run -d --name step-converter -p 8080:8080 step-converter:latest

# Or use docker compose (connects to Supabase network automatically)
docker compose up -d
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

### BuildKit Issues

If `docker compose build` fails with "buildx component is missing", use the legacy builder:

```bash
DOCKER_BUILDKIT=0 docker build -t step-converter:latest .
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

### FreeCAD Import Errors

The service automatically configures FreeCAD to find OpenSCAD at `/usr/bin/openscad`. If you see "OpenSCAD executable unavailable", ensure OpenSCAD is installed in the container.

### Job Timeouts

Conversions timeout after 2 minutes. Complex models with many operations may need optimization or simplification.
