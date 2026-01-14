---
description: Generate complete screenshot package for blog posts
allowed-tools: Bash, Read, Write, Glob, mcp__plugin_playwright_playwright__*
argument-hint: <post-name>
---

# Blog Post Screenshot Package Generator

Generate a complete screenshot package for a blog post, including full captures, feature zooms with annotations, and social media hero images.

## Quick Start

```
/blog-screenshots building-on-cadam
```

## Workflow Overview

```
┌─────────────────────────────────────────────────────────────┐
│  1. PARSE         Read blog post, extract screenshot needs  │
│  2. CAPTURE       Take full-page screenshots                │
│  3. ZOOM          Crop to feature areas                     │
│  4. ANNOTATE      Add text labels/callouts                  │
│  5. HERO          Generate LinkedIn/social images           │
│  6. PACKAGE       Organize and summarize                    │
└─────────────────────────────────────────────────────────────┘
```

---

## Phase 1: Parse Blog Post

**Setup:**

```bash
mkdir -p blog-screenshots/$ARGUMENTS
```

**Find screenshot requirements:**

1. Read `blog-post-draft.md` or user-specified file
2. Look for patterns like:
   - `![Screenshot: description]`
   - `*📸 Capture instruction*`
   - Section headers describing features

**Extract for each screenshot:**

- What to capture (full page, specific panel, dropdown open, etc.)
- What feature to highlight (the zoom target)
- What text annotation to add

**Example parsing:**

```markdown
![Screenshot: Export dropdown]
_📸 Show the export dropdown with all three options_
```

→ Capture: Editor with dropdown open
→ Zoom: Bottom-right corner (Parameters panel, export area)
→ Annotate: "STL • SCAD • STEP Export Options"

---

## Phase 2: Capture Full Screenshots

Use Playwright MCP tools to capture base screenshots:

```
browser_navigate → browser_snapshot → browser_click → browser_take_screenshot
```

**Filename convention:** `##-feature-name.png`

**For each screenshot:**

1. Navigate to correct URL/state
2. Interact to reach desired UI state (open dropdowns, load models)
3. Wait for animations/loading
4. Capture full viewport

---

## Phase 3: Feature Zoom

Crop screenshots to focus on the specific feature being highlighted.

**Using ImageMagick:**

```bash
# Crop to specific region (x, y, width, height)
convert input.png -crop WIDTHxHEIGHT+X+Y +repage output-zoom.png

# Example: Crop bottom-right quadrant for export dropdown
convert 01-full.png -gravity SouthEast -crop 400x300+0+0 +repage 01-export-zoom.png
```

**Common crop targets for CADAM:**

| Feature            | Gravity   | Crop Size | Description                      |
| ------------------ | --------- | --------- | -------------------------------- |
| Export dropdown    | SouthEast | 350x250   | Parameters panel, export buttons |
| Compilation events | West      | 450x400   | Chat panel, event stream         |
| 3D Viewer          | Center    | 500x400   | Model preview                    |
| Code panel         | Center    | 400x350   | Monaco editor                    |
| Parameters         | East      | 300x400   | Right panel sliders              |

---

## Phase 4: Annotate with Text Labels

Add text callouts to highlight the feature.

**Basic annotation:**

```bash
convert input.png \
  -fill 'rgba(26,26,46,0.85)' -draw 'rectangle 0,0 WIDTH,60' \
  -font DejaVu-Sans-Bold -pointsize 24 -fill white \
  -gravity NorthWest -annotate +15+18 'Your Label Here' \
  output-annotated.png
```

**Annotation with bottom label:**

```bash
convert input.png \
  -fill 'rgba(26,26,46,0.85)' -draw "rectangle 0,$((HEIGHT-50)) WIDTH,HEIGHT" \
  -font DejaVu-Sans-Bold -pointsize 20 -fill white \
  -gravity South -annotate +0+15 'Feature Description' \
  output-annotated.png
```

**Add highlight border:**

```bash
convert input.png \
  -bordercolor '#00A6FF' -border 3 \
  output-highlighted.png
```

**Combined (zoom + annotate):**

```bash
# Crop, add border, add label
convert input.png \
  -gravity SouthEast -crop 400x300+0+0 +repage \
  -bordercolor '#00A6FF' -border 3 \
  -fill 'rgba(26,26,46,0.9)' -draw 'rectangle 0,0 406,50' \
  -font DejaVu-Sans-Bold -pointsize 18 -fill white \
  -gravity NorthWest -annotate +12+15 'STEP Export Options' \
  output-zoom-annotated.png
```

---

## Phase 5: Hero Image Generation

Create social media optimized images.

**LinkedIn (1200x627):**

```bash
convert input.png \
  -resize 1200x627^ -gravity center -extent 1200x627 \
  -fill 'rgba(26,26,46,0.85)' -draw 'rectangle 0,0 1200,70' \
  -font DejaVu-Sans-Bold -pointsize 32 -fill white \
  -gravity NorthWest -annotate +20+22 'Post Title Here' \
  hero-linkedin.png
```

**Twitter/X (1200x675):**

```bash
convert input.png \
  -resize 1200x675^ -gravity center -extent 1200x675 \
  hero-twitter.png
```

**Square for Instagram (1080x1080):**

```bash
convert input.png \
  -resize 1080x1080^ -gravity center -extent 1080x1080 \
  hero-instagram.png
```

---

## Phase 6: Package Summary

After generating all assets, create a manifest:

**Output folder structure:**

```
blog-screenshots/<post-name>/
├── 01-export-dropdown.png          # Full screenshot
├── 01-export-dropdown-zoom.png     # Cropped to feature
├── 01-export-dropdown-final.png    # Zoom + annotation
├── 02-compilation.png
├── 02-compilation-zoom.png
├── 02-compilation-final.png
├── ...
├── hero-linkedin.png
├── hero-twitter.png
└── MANIFEST.md                     # Summary of all assets
```

**Generate MANIFEST.md:**

```markdown
# Screenshot Package: [Post Name]

## Full Screenshots

- 01-export-dropdown.png - Export menu with STL/SCAD/STEP
- 02-compilation.png - Compilation event stream
  ...

## Feature Zooms (for blog embedding)

- 01-export-dropdown-final.png - "STEP Export Options"
- 02-compilation-final.png - "Real-Time Compilation Events"
  ...

## Social Media

- hero-linkedin.png (1200x627)
- hero-twitter.png (1200x675)
```

---

## CADAM-Specific Reference

**Routes:**
| Route | View | Key Features |
|-------|------|--------------|
| `/cadam/` | PromptView | Landing, chat input, file upload |
| `/cadam/editor/:id` | EditorView | 4-panel layout, model, code, params |
| `/cadam/history` | HistoryView | Past creations grid |

**Panel positions for cropping:**

- Chat: Left ~25% of viewport
- Code: Left-center ~20%
- Viewer: Center ~35%
- Parameters: Right ~20%

**Common feature locations:**

- Export dropdown: Bottom-right corner (Parameters panel)
- Compilation events: Chat panel, middle section
- Model viewer: Center of viewport
- Parameter sliders: Right panel

---

## Example Session

```
User: /blog-screenshots building-on-cadam
```
