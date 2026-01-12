"""
FreeCAD OpenSCAD to STEP conversion module.
Uses FreeCAD's OpenSCAD workbench to interpret CSG and produce B-Rep STEP output.
"""
import os
import sys
import tempfile
import shutil
import subprocess
from typing import Tuple, Optional


def convert_scad_to_step(
    scad_code: str,
    refine_shape: bool = True
) -> Tuple[bytes, Optional[str]]:
    """
    Convert OpenSCAD code to STEP format using FreeCAD.

    This function:
    1. Writes the .scad code to a temp file
    2. Uses FreeCAD's Python API to import and export
    3. Returns the STEP file content

    Args:
        scad_code: OpenSCAD source code string
        refine_shape: Whether to refine the shape (merge coplanar faces)

    Returns:
        Tuple of (step_bytes, error_message)
        If successful, error_message is None
    """
    temp_dir = tempfile.mkdtemp(prefix="scad_convert_")
    scad_path = os.path.join(temp_dir, "input.scad")
    step_path = os.path.join(temp_dir, "output.step")
    freecad_script = os.path.join(temp_dir, "convert.py")

    try:
        # Write OpenSCAD code to temp file
        with open(scad_path, 'w', encoding='utf-8') as f:
            f.write(scad_code)

        # Create FreeCAD conversion script
        script_content = f'''
import sys
import os

# Add FreeCAD lib path
freecad_paths = [
    "/usr/lib/freecad/lib",
    "/usr/lib/freecad-python3/lib",
    "/usr/share/freecad/lib",
    "/usr/share/freecad/Mod",
]
for p in freecad_paths:
    if os.path.exists(p) and p not in sys.path:
        sys.path.insert(0, p)

# Set FreeCAD home for module loading
os.environ["FREECAD_USER_HOME"] = "/tmp"

import FreeCAD
import Part

# Configure OpenSCAD executable path before importing importCSG
FreeCAD.ParamGet("User parameter:BaseApp/Preferences/Mod/OpenSCAD").SetString("openscadexecutable", "/usr/bin/openscad")

import importCSG

# Create document
doc = FreeCAD.newDocument("ConversionDoc")

try:
    # Import OpenSCAD file
    importCSG.insert("{scad_path}", doc.Name)

    # Collect all shapes
    refine = {refine_shape}
    shapes = []
    for obj in doc.Objects:
        if hasattr(obj, 'Shape') and obj.Shape and not obj.Shape.isNull():
            shape = obj.Shape.copy()
            # Check if shape has actual geometry (volume > 0 or has faces)
            has_geometry = False
            try:
                if hasattr(shape, 'Volume') and shape.Volume > 1e-9:
                    has_geometry = True
                elif hasattr(shape, 'Faces') and len(shape.Faces) > 0:
                    has_geometry = True
                elif hasattr(shape, 'Solids') and len(shape.Solids) > 0:
                    has_geometry = True
            except:
                pass

            if not has_geometry:
                print(f"WARNING: Shape has no geometry (Volume=0, no faces)", file=sys.stderr)
                continue

            if refine:
                try:
                    shape = shape.removeSplitter()
                except:
                    pass
            shapes.append(shape)

    if not shapes:
        print("ERROR: No valid shapes found. This usually means:", file=sys.stderr)
        print("  - OpenSCAD code has syntax errors", file=sys.stderr)
        print("  - Missing library imports (e.g., BOSL2 is not installed)", file=sys.stderr)
        print("  - The model produces no geometry", file=sys.stderr)
        sys.exit(1)

    # Combine shapes
    if len(shapes) == 1:
        final_shape = shapes[0]
    else:
        final_shape = Part.makeCompound(shapes)

    # Verify final shape has geometry
    try:
        bbox = final_shape.BoundBox
        if bbox.DiagonalLength < 1e-6:
            print("ERROR: Final shape has zero size bounding box", file=sys.stderr)
            sys.exit(1)
        print(f"Shape bounding box: {{bbox.XLength:.2f}} x {{bbox.YLength:.2f}} x {{bbox.ZLength:.2f}}")
    except Exception as e:
        print(f"WARNING: Could not compute bounding box: {{e}}", file=sys.stderr)

    # Export to STEP
    final_shape.exportStep("{step_path}")

    if not os.path.exists("{step_path}"):
        print("ERROR: STEP file not created", file=sys.stderr)
        sys.exit(1)

    print("SUCCESS")

finally:
    FreeCAD.closeDocument(doc.Name)
'''

        with open(freecad_script, 'w') as f:
            f.write(script_content)

        # Run FreeCAD Python script
        # Use freecadcmd or freecad with -c flag for headless mode
        result = subprocess.run(
            ['freecadcmd', freecad_script],
            capture_output=True,
            text=True,
            timeout=300,  # 5 minute timeout
            cwd=temp_dir
        )

        if result.returncode != 0:
            error_msg = result.stderr.strip() or result.stdout.strip() or "Unknown FreeCAD error"
            return b'', f"FreeCAD conversion failed: {error_msg}"

        if "SUCCESS" not in result.stdout:
            return b'', f"FreeCAD conversion failed: {result.stderr or result.stdout}"

        # Verify the file was created
        if not os.path.exists(step_path):
            return b'', "STEP file was not created"

        # Read and return the STEP file content
        with open(step_path, 'rb') as f:
            step_content = f.read()

        if len(step_content) == 0:
            return b'', "STEP file is empty"

        return step_content, None

    except subprocess.TimeoutExpired:
        return b'', "FreeCAD conversion timed out (exceeded 5 minutes)"
    except FileNotFoundError:
        return b'', "FreeCAD (freecadcmd) not found. Is FreeCAD installed?"
    except Exception as e:
        return b'', f"Conversion error: {str(e)}"

    finally:
        # Cleanup temp directory
        try:
            shutil.rmtree(temp_dir)
        except Exception:
            pass


def validate_scad_code(code: str) -> Optional[str]:
    """
    Basic validation of OpenSCAD code.

    Returns None if valid, or an error message if invalid.
    """
    if not code or not code.strip():
        return "Empty OpenSCAD code"

    # Check for basic syntax issues
    code_stripped = code.strip()

    # Must contain at least one shape-creating function or module
    # Includes standard OpenSCAD and common BOSL2 functions
    shape_keywords = [
        # Standard OpenSCAD primitives
        'cube', 'sphere', 'cylinder', 'polyhedron',
        'circle', 'square', 'polygon', 'text',
        'linear_extrude', 'rotate_extrude',
        'import', 'surface',
        'union', 'difference', 'intersection',
        'hull', 'minkowski',
        # BOSL2 primitives and shapes
        'cuboid', 'cyl', 'xcyl', 'ycyl', 'zcyl',
        'tube', 'torus', 'spheroid', 'onion',
        'prismoid', 'rounded_prism', 'rect_tube',
        'wedge', 'pie_slice', 'teardrop',
        'path_sweep', 'skin', 'vnf_polyhedron',
        # BOSL2 includes (indicates BOSL2 usage)
        'bosl2', 'std.scad'
    ]

    has_shape = any(keyword in code_stripped.lower() for keyword in shape_keywords)
    if not has_shape:
        return "Code does not contain any recognizable OpenSCAD shape operations"

    return None


if __name__ == "__main__":
    # Simple test
    test_code = """
    // Test cube
    cube([10, 10, 10]);
    """

    result, error = convert_scad_to_step(test_code)
    if error:
        print(f"Error: {error}")
    else:
        print(f"Success! Generated {len(result)} bytes of STEP data")
