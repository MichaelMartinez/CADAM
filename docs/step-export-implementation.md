# STEP Export Pipeline - Implementation Summary

## Overview

This document summarizes the implementation of a STEP file export feature for the Adam CAD application. The feature enables users to export their OpenSCAD models to STEP format, which is essential for professional CAD interoperability and CNC manufacturing.

## Problem Solved

OpenSCAD produces STL files (tessellated meshes), which:

- Approximate curves with straight line segments
- Are unsuitable for CNC machining requiring precise tolerances
- Cannot be edited in professional CAD software (SolidWorks, Fusion 360)

STEP files preserve:

- Mathematical curve definitions (circles stay circles)
- Precise geometry for manufacturing
- Interoperability with professional CAD tools

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                           FRONTEND                                   │
├─────────────────────────────────────────────────────────────────────┤
│  ParameterSection.tsx                                                │
│  └── Export dropdown now includes .STEP option                       │
│                                                                      │
│  useStepExport.ts (hook)                                            │
│  └── Handles async job submission, polling, download                │
│                                                                      │
│  stepExportService.ts                                               │
│  └── API client for step-converter edge function                    │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    SUPABASE EDGE FUNCTION                            │
├─────────────────────────────────────────────────────────────────────┤
│  supabase/functions/step-converter/index.ts                         │
│  └── Proxies requests with JWT authentication                       │
│  └── Routes: /convert, /status/{id}, /download/{id}                 │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    FREECAD DOCKER SERVICE                            │
├─────────────────────────────────────────────────────────────────────┤
│  services/step-converter/                                            │
│  ├── Dockerfile          - Ubuntu 22.04 + FreeCAD + OpenSCAD        │
│  ├── main.py             - FastAPI server with async job queue      │
│  ├── converter.py        - FreeCAD conversion logic                 │
│  └── docker-compose.yml  - Container configuration                  │
└─────────────────────────────────────────────────────────────────────┘
```

## Files Created/Modified

### New Files

| File                                          | Purpose                              |
| --------------------------------------------- | ------------------------------------ |
| `services/step-converter/Dockerfile`          | Docker image with FreeCAD + OpenSCAD |
| `services/step-converter/main.py`             | FastAPI server with job queue        |
| `services/step-converter/converter.py`        | OpenSCAD → STEP conversion logic     |
| `services/step-converter/docker-compose.yml`  | Container orchestration              |
| `services/step-converter/README.md`           | Service documentation                |
| `supabase/functions/step-converter/index.ts`  | Edge function proxy                  |
| `supabase/functions/step-converter/deno.json` | Deno configuration                   |
| `src/types/stepExport.ts`                     | TypeScript type definitions          |
| `src/services/stepExportService.ts`           | Frontend API client                  |
| `src/hooks/useStepExport.ts`                  | React hook for export flow           |

### Modified Files

| File                                            | Changes                                    |
| ----------------------------------------------- | ------------------------------------------ |
| `supabase/config.toml`                          | Added step-converter function registration |
| `src/components/parameter/ParameterSection.tsx` | Added STEP to export dropdown              |
| `src/utils/downloadUtils.ts`                    | Added downloadSTEPFile function            |

## Conversion Flow

1. **User clicks "STEP" in export dropdown**
2. **Frontend** extracts `artifact.code` (OpenSCAD source)
3. **useStepExport hook** calls `submitStepConversion(code, filename)`
4. **stepExportService** POSTs to `/functions/v1/step-converter/convert`
5. **Edge Function** authenticates via JWT, forwards to Docker service
6. **FreeCAD Service** creates async job, returns `jobId`
7. **Frontend** polls `/status/{jobId}` every 1.5 seconds
8. **FreeCAD** runs conversion:
   - Writes .scad code to temp file
   - Calls `freecadcmd` with Python script
   - FreeCAD's importCSG loads OpenSCAD file
   - CSG tree converted to B-Rep shapes
   - Exported to STEP format
9. **Job completes**, frontend calls `/download/{jobId}`
10. **STEP file** downloaded to user's browser

## Key Technical Decisions

### Why FreeCAD?

- Open source with mature OpenSCAD import capability
- Can interpret CSG operations and produce true B-Rep
- Supports STEP export via Open CASCADE (OCCT)

### Why Docker?

- FreeCAD requires many system dependencies
- Isolated environment for headless operation
- Consistent behavior across deployments

### Why Async with Polling?

- Conversions can take 5-30 seconds
- Prevents HTTP timeout issues
- Better user experience with progress indication
- Scalable (job queue with concurrency limits)

### Why Edge Function Proxy?

- JWT authentication handled by Supabase
- Service can run without public exposure
- Centralized API gateway

## Environment Setup

### Docker Service

```bash
cd services/step-converter
DOCKER_BUILDKIT=0 docker build -t step-converter:latest .
docker run -d --name step-converter -p 8080:8080 step-converter:latest
```

### Supabase Configuration

Add to `supabase/functions/.env`:

```
STEP_CONVERTER_URL=http://localhost:8080
STEP_CONVERTER_API_SECRET=  # Optional for dev
```

## Testing

### Manual Test

```bash
# Test the Docker service directly
curl -X POST http://localhost:8080/convert \
  -H "Content-Type: application/json" \
  -d '{"code": "cube([10,10,10]);", "filename": "test"}'

# Check status
curl http://localhost:8080/status/{jobId}

# Download
curl http://localhost:8080/download/{jobId} -o test.step
```

### Verification

1. Export a simple cube → verify STEP opens in FreeCAD
2. Export a model with cylinders → verify circles are preserved (not polygons)
3. Test error handling with invalid OpenSCAD code
4. Verify loading states in UI

## Performance

- Simple cube: ~0.8 seconds
- Complex models: up to 2 minutes (timeout limit)
- Concurrent jobs: 10 max (configurable)

## Known Limitations

1. **Library imports**: OpenSCAD code with `use`/`include` statements needs libraries in the container
2. **Timeout**: 2-minute limit on conversions
3. **Memory**: Complex models may require increased container memory
4. **No caching**: STEP files generated on-demand each time

## Future Improvements

- [ ] Add BOSL2 library to container for common imports
- [ ] Implement caching for repeated exports
- [ ] Add progress streaming during conversion
- [ ] Support batch export of multiple models
