# Building on CADAM: STEP Export, Real-Time Feedback, and Professional CAD Workflows

I've been continuing to hack on my CADAM fork. If you saw my previous post, that fork added BOSL2 prompt tuning, SCAD uploads, and compilation overlays using Gemini.

This fork takes a different approach. I've been working with **Claude Code** as my coding partner—I handle the architecture decisions and direction, Claude handles the implementation. It's a productive workflow for moving fast on a side project.

Here's what we've built so far:

---

## STEP File Export

This was the main goal. STL is fine for 3D printing, but I wanted to bring AI-generated models into real CAD tools like Fusion 360 or SolidWorks.

I set up a FreeCAD-based backend service that converts OpenSCAD output to STEP format. The export dropdown now has three options:

- **STL** - 3D printing
- **SCAD** - Source code
- **STEP** - CAD interchange

![Screenshot: Export dropdown]
_📸 Show the export dropdown with all three options_

This lets me iterate quickly in CADAM, then pull the STEP into a proper CAD tool for refinement or integration into larger assemblies.

---

## Real-Time Compilation Events

I wanted better visibility into what's happening during compilation. The chat now streams granular events:

- Library loading (BOSL2, MCAD)
- Render progress
- Completion with timing
- Errors with full stderr

![Screenshot: Compilation progress]
_📸 Capture the event stream during compilation_

These events persist to the conversation, so you can debug failed compilations later.

---

## 4-Panel Resizable Layout

The editor has four panels now: Chat, Code, Viewer, and Parameters. Each is collapsible and resizable.

| Panel      | What it does                        |
| ---------- | ----------------------------------- |
| Chat       | AI conversation, compilation events |
| Code       | Monaco editor with OpenSCAD syntax  |
| Viewer     | Three.js preview with gizmo         |
| Parameters | Sliders for real-time tweaks        |

![Screenshot: Full layout]
_📸 Show all four panels with a model loaded_

The layout adapts to window size and remembers panel states.

---

## BOSL2 Output Modes

I added output mode selection to the BOSL2 integration:

- **Printable** - Manifold geometry ready for slicing
- **Assembly** - Multi-part visualization

The prompts prioritize BOSL2's attachment system and distribution arrays for cleaner generated code.

---

## Image-to-CAD

Upload a sketch or reference image, and the AI interprets it as a parametric model. I've been tuning the image interpretation prompts and added 2D object detection to improve results.

![Screenshot: Sketch to model]
_📸 Show an uploaded sketch converted to geometry_

---

## Work in Progress: Code-to-Geometry Mapping

I'm working on connecting the code panel to the 3D viewer. The idea is to click geometry and see which code produced it.

Currently, clicking the model highlights the entire source—individual face-to-line mapping isn't there yet. This is the next thing I'm tackling.

When it's working, you'll be able to click a face and jump to the exact line that created it, which should make understanding AI-generated code much easier.

---

## Stack

- React 19 + TypeScript + Vite
- Three.js + React Three Fiber
- Monaco Editor (custom OpenSCAD syntax)
- Supabase Edge Functions
- FreeCAD Docker service for STEP conversion
- Claude via OpenRouter

---

Fork: [https://github.com/MichaelMartinez/CADAM](https://github.com/MichaelMartinez/CADAM)

More to come as I continue building.

---

#OpenSource #OpenSCAD #CADAM #CAD #3DPrinting #BOSL2 #BuildInPublic
