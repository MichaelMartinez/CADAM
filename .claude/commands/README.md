# Claude Code Commands

Custom slash commands for the CADAM project.

---

## `/blog-screenshots`

Generate a complete screenshot package for blog posts.

### Usage

```
/blog-screenshots <post-name>
```

**Example:**

```
/blog-screenshots building-on-cadam
```

### Prerequisites

| Requirement     | Details                                           |
| --------------- | ------------------------------------------------- |
| App running     | Default: `localhost:3000/cadam`                   |
| Playwright MCP  | Browser automation (should be configured)         |
| ImageMagick     | For cropping/annotations (`convert` command)      |
| Blog post draft | Optional - with `![Screenshot: ...]` placeholders |

### What It Does

1. **Parses** your blog post draft for screenshot placeholders
2. **Captures** full-page screenshots using Playwright
3. **Zooms** to highlight specific features
4. **Annotates** with title bars and borders
5. **Generates** LinkedIn hero images
6. **Creates** a manifest listing all files

### Output

```
blog-screenshots/<post-name>/
├── 01-feature-name.png           # Full screenshot (source)
├── 01-feature-name-final.png     # Zoomed + annotated ← USE THIS
├── 02-another-feature.png
├── 02-another-feature-final.png
├── hero-linkedin.png             # 1200x627 plain
├── hero-linkedin-branded.png     # 1200x627 with title
└── MANIFEST.md                   # File listing
```

### Interactive Workflow

The skill guides you through an interactive session:

1. **Setup** - Creates output folder, confirms app URL
2. **Capture** - You may need to:
   - Dismiss login dialogs
   - Navigate to specific pages
   - Generate sample content
   - Open dropdowns or interact with UI
3. **Process** - Claude crops, annotates, and packages everything
4. **Deliver** - Final files ready for your blog post

### Example Session

```
User: /blog-screenshots building-on-cadam

Claude: I'll generate screenshots for "building-on-cadam".

        Found these screenshot needs in your blog draft:
        1. Export dropdown (STL/SCAD/STEP options)
        2. Compilation progress events
        3. Full 4-panel layout
        4. Sketch-to-model conversion

        Is the app running at localhost:3000/cadam?

User: Yes

Claude: [Navigates browser to app]
        [Dismisses login dialog]
        [Generates a sample model]
        [Captures screenshots]
        [Creates zoomed/annotated versions]
        [Generates hero images]

        Done! Your screenshot package:

        blog-screenshots/building-on-cadam/
        ├── 01-export-dropdown-final.png    "STL • SCAD • STEP Export"
        ├── 02-compilation-final.png        "Real-Time Compilation Events"
        ├── 03-full-layout-final.png        "4-Panel Resizable Layout"
        ├── 04-sketch-to-model-final.png    "Image-to-CAD: Sketch → Model"
        ├── hero-linkedin-branded.png
        └── MANIFEST.md
```

### Customization

**Different app URL:**

```
The app is running at localhost:5173
```

**Specific features to highlight:**

```
Focus on the parameter sliders with real-time updates
```

**Different styling:**

```
Use red borders instead of blue
```

**Additional social formats:**

```
Also create Twitter (1200x675) and Instagram (1080x1080) versions
```

### Tips

- **Blog post draft**: Add placeholders like `![Screenshot: Export dropdown]` with capture instructions `*📸 Show the dropdown open*`
- **Sample data**: The skill can generate sample content (models, conversations) if needed
- **File uploads**: Files must be in the project directory for Playwright to access them
- **Naming**: Use `-final.png` files in your blog - they're the polished versions

### Troubleshooting

| Issue                       | Solution                                            |
| --------------------------- | --------------------------------------------------- |
| Login dialog blocks capture | Close it before proceeding                          |
| File upload fails           | Copy file to project directory first                |
| Screenshots in wrong folder | Move from `.playwright-mcp/` to `blog-screenshots/` |
| Model takes too long        | Wait 20-30 seconds for compilation                  |
