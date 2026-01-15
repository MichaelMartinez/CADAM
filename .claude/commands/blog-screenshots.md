---
description: Generate complete screenshot package for blog posts
allowed-tools: Bash, Read, Write, Glob, AskUserQuestion, mcp__plugin_playwright_playwright__*
argument-hint: <post-name>
---

# Blog Post Screenshot Package Generator

Generate blog posts with integrated screenshot capture. Can either write new content from a topic or process existing drafts.

## Quick Start

```
/blog-screenshots my-new-post
```

## Workflow Overview

```
┌─────────────────────────────────────────────────────────────┐
│  1. GATHER        Ask user for topic, platform, preferences │
│  2. OUTLINE       Create post structure with screenshot     │
│                   placeholders                              │
│  3. WRITE         Draft content section by section          │
│  4. CAPTURE       Take screenshots when user requests them  │
│  5. ANNOTATE      Add text labels/callouts to screenshots   │
│  6. HERO          Generate social media hero images         │
│  7. FINALIZE      Output final post + asset manifest        │
└─────────────────────────────────────────────────────────────┘
```

---

## Phase 1: Gather Requirements

**IMPORTANT: Start by asking the user these questions using AskUserQuestion:**

1. **Topic**: "What would you like to write about?"
   - Let user describe the subject freely

2. **Platform**: "Which platform is this for?"
   - LinkedIn post (short, professional)
   - Blog article (longer, detailed)
   - Twitter/X thread
   - Other

3. **Screenshots**: "Would you like screenshots included?"
   - Yes, capture as we go
   - No, text only
   - I'll provide my own images

4. **Tone**: "What tone should the post have?"
   - Professional/formal
   - Casual/conversational
   - Technical/detailed

**Setup directory:**

```bash
mkdir -p blog-screenshots/$ARGUMENTS
```

---

## Phase 2: Create Outline

Based on user input, create a structured outline:

**For LinkedIn posts:**

- Hook (1-2 sentences)
- Main point (2-3 short paragraphs)
- Key takeaway or CTA
- Hashtags

**For blog articles:**

- Introduction
- 3-5 main sections with headers
- Screenshot opportunities marked as `[Screenshot: description]`
- Conclusion

**Present outline to user for approval before proceeding.**

---

## Phase 3: Write Content

Write the post section by section. After each major section:

- Show the user what you've written
- Ask if they want any changes
- If screenshots were requested, ask: "Should I capture a screenshot for this section?"

**Screenshot placeholder format in draft:**

```markdown
[Screenshot: Brief description of what to capture]
```

---

## Phase 4: Capture Screenshots

When the user requests a screenshot, use Playwright MCP tools:

```
browser_navigate → browser_snapshot → browser_click → browser_take_screenshot
```

**Filename convention:** `##-feature-name.png`

**For each screenshot:**

1. Ask user what URL/state to capture
2. Navigate and interact to reach desired UI state
3. Wait for animations/loading
4. Capture full viewport
5. Ask if user wants zoom/annotation

---

## Phase 5: Annotate Screenshots

**Zoom to feature (ImageMagick):**

```bash
convert input.png -crop WIDTHxHEIGHT+X+Y +repage output-zoom.png
```

**Add text label:**

```bash
convert input.png \
  -fill 'rgba(26,26,46,0.85)' -draw 'rectangle 0,0 WIDTH,60' \
  -font DejaVu-Sans-Bold -pointsize 24 -fill white \
  -gravity NorthWest -annotate +15+18 'Your Label Here' \
  output-annotated.png
```

**Add highlight border:**

```bash
convert input.png -bordercolor '#00A6FF' -border 3 output-highlighted.png
```

---

## Phase 6: Hero Image Generation

Create social media optimized images when requested.

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
convert input.png -resize 1200x675^ -gravity center -extent 1200x675 hero-twitter.png
```

---

## Phase 7: Finalize

1. **Save the post** to `blog-screenshots/<post-name>/post.md`
2. **Generate MANIFEST.md** listing all assets
3. **Present summary** to user with:
   - Final post content
   - List of screenshots captured
   - Hero images generated
   - Any next steps (publish, review, etc.)

**Output folder structure:**

```
blog-screenshots/<post-name>/
├── post.md                         # The written post
├── 01-feature.png                  # Screenshots
├── 01-feature-annotated.png
├── hero-linkedin.png
├── hero-twitter.png
└── MANIFEST.md
```

---

## Alternative Mode: Process Existing Draft

If user has an existing draft, skip to screenshot extraction:

1. Read `blog-post-draft.md` or user-specified file
2. Look for patterns like:
   - `![Screenshot: description]`
   - `*📸 Capture instruction*`
3. Capture and annotate each screenshot
4. Replace placeholders with actual image paths

---

## CADAM-Specific Reference

**Routes:**
| Route | View | Key Features |
|-------|------|--------------|
| `/cadam/` | PromptView | Landing, chat input, file upload |
| `/cadam/editor/:id` | EditorView | 4-panel layout, model, code, params |
| `/cadam/history` | HistoryView | Past creations grid |

**Common crop targets:**

| Feature            | Gravity   | Crop Size | Description                      |
| ------------------ | --------- | --------- | -------------------------------- |
| Export dropdown    | SouthEast | 350x250   | Parameters panel, export buttons |
| Compilation events | West      | 450x400   | Chat panel, event stream         |
| 3D Viewer          | Center    | 500x400   | Model preview                    |
| Code panel         | Center    | 400x350   | Monaco editor                    |
| Parameters         | East      | 300x400   | Right panel sliders              |

---

## Example Session

```
User: /blog-screenshots my-new-feature

Claude: What would you like to write about?
        - Platform: LinkedIn / Blog / Twitter
        - Screenshots: Yes / No
        - Tone: Professional / Casual / Technical

User: I want to write a LinkedIn post about the new export feature.
      Include screenshots, keep it professional.

Claude: Here's an outline:
        1. Hook - "Just shipped STEP export..."
        2. Main point - Why this matters for CAD workflows
        3. Screenshot of export dropdown
        4. CTA - Try it out

        Does this look good?

User: Yes, proceed

Claude: [Writes post, captures screenshots as needed, delivers final package]
```
