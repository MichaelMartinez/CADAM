<div align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./public/Github-Banner-Dark.png">
    <source media="(prefers-color-scheme: light)" srcset="./public/Github-Banner-Light.png">
    <img src="./public/Github-Banner-Light.png" alt="CADAM Banner" width="100%"/>
  </picture>
</div>

<h1 align="center"> ⛮ The Open Source Text to CAD Web App ⛮ </h1>

## Fork Changes

This fork adds several enhancements to the original CADAM project:

### New Features

- **STEP File Export** - Export models to STEP format via FreeCAD Docker service for CAD tool compatibility (Fusion 360, SolidWorks, etc.)
- **Real-Time Compilation Events** - Streaming compilation feedback showing library loading, render progress, timing, and detailed errors
- **Code Panel with Source Mapping** - Click-to-code navigation linking 3D geometry back to OpenSCAD source lines
- **4-Panel Resizable Layout** - Chat, Code, Viewer, and Parameters panels with collapse/resize support
- **Enhanced Image-to-CAD** - Improved sketch interpretation with 2D object detection for better parametric model generation
- **BOSL2 Output Modes** - Printable (manifold) and Assembly (multi-part) generation modes

### Infrastructure

- **OpenRouter Migration** - Prompt and title generation moved to OpenRouter for flexibility
- **Services Manager** - `scripts/start-services.sh` for managing all development services
- **Comprehensive Logging** - Full request/response logging for LLM calls with persistent timestamped log files
- **Claude Code Skills** - `/blog-screenshots` command for automated blog post creation with screenshots

### Debugging & Logging

Logs are persisted to the `logs/` directory with timestamps:

```bash
# View available log files
./scripts/start-services.sh logs

# Tail edge function logs (includes all workflow and LLM logging)
./scripts/start-services.sh tail functions

# Tail vite dev server logs
./scripts/start-services.sh tail vite

# Tail ngrok logs
./scripts/start-services.sh tail ngrok
```

Log files:

- `logs/supabase-functions-{timestamp}.log` - Edge function logs with full LLM request/response data
- `logs/supabase-functions-latest.log` - Symlink to most recent edge function log
- `logs/vite-{timestamp}.log` - Frontend dev server logs
- `logs/ngrok-{timestamp}.log` - ngrok tunnel logs

The logging captures:

- Full LLM prompts and responses
- Token usage and latency metrics
- Image preprocessing steps
- Workflow state transitions
- Error stack traces

### Quick Start (This Fork)

```bash
# Start all services (Supabase, Edge Functions, STEP converter)
./scripts/start-services.sh start

# Check service status
./scripts/start-services.sh status

# View logs (useful for debugging)
./scripts/start-services.sh tail functions

# Stop all services
./scripts/start-services.sh stop
```

For development with GOD_MODE (bypasses authentication):

```bash
# First, get your service role key
supabase status  # Look for "service_role key"

# Add to .env.local (required for storage uploads to work in god mode)
# VITE_GOD_MODE="true"
# VITE_SUPABASE_SERVICE_KEY="<service_role key>"

# Then start with god mode flag
./scripts/start-services.sh start --god-mode
```

### Troubleshooting & Maintenance

The start script automatically cleans up development artifacts that cause issues:

```bash
# Clean up manually (removes deno.lock, caches)
./scripts/start-services.sh clean

# Full restart (recommended when things go wrong)
./scripts/start-services.sh restart --god-mode
```

**Common issues the cleanup fixes:**

- `Unsupported lockfile version '5'` - Deno version mismatch between local and Supabase runtime
- `Worker failed to boot` - Stale Deno cache after adding new files
- Edge functions returning 503 - Usually a lockfile or cache issue

**Files that are auto-cleaned:**
| File | Reason |
|------|--------|
| `supabase/functions/deno.lock` | Local Deno creates v5, Supabase runtime needs older version |
| `supabase/functions/.deno/` | Stale module cache |

See [docs/lessons-learned.md](docs/lessons-learned.md) for more troubleshooting tips.

---

<div align="center">

[![Stars](https://img.shields.io/github/stars/Adam-CAD/cadam?style=social&logo=github)](https://github.com/Adam-CAD/cadam/stargazers)
[![Forks](https://img.shields.io/github/forks/Adam-CAD/CADAM?style=flat)](https://github.com/Adam-CAD/CADAM/network)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg?style=flat)](https://www.gnu.org/licenses/gpl-3.0)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19.1-61DAFB.svg?style=flat&logo=react&logoColor=black)](https://reactjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E.svg?style=flat&logo=supabase&logoColor=white)](https://supabase.com/)
[![OpenSCAD](https://img.shields.io/badge/OpenSCAD-WASM-F9D64F.svg?style=flat)](https://openscad.org/)
[![Website](https://img.shields.io/badge/website-adam.new-blue?style=flat)](https://adam.new)
[![Discord](https://img.shields.io/badge/Discord-Join-5865F2?style=flat&logo=discord&logoColor=white)](https://discord.com/invite/HKdXDqAHCs)
[![Follow Zach Dive](https://img.shields.io/badge/Follow-Zach%20Dive-1DA1F2?style=flat&logo=x&logoColor=white)](https://x.com/zachdive)
[![Follow Aaron Li](https://img.shields.io/badge/Follow-Aaron%20Li-1DA1F2?style=flat&logo=x&logoColor=white)](https://x.com/aaronhetengli)
[![Follow Dylan Anderson](https://img.shields.io/badge/Follow-tsadpbb-1DA1F2?style=flat&logo=x&logoColor=white)](https://x.com/tsadpbb)

</div>

---

## ✨ Features

- 🤖 **AI-Powered Generation** - Transform natural language and images into 3D models
- 🎛️ **Parametric Controls** - Interactive sliders for instant dimension adjustments
- 📦 **Multiple Export Formats** - Export as .STL or .SCAD files
- 🌐 **Browser-Based** - Runs entirely in your browser using WebAssembly
- 📚 **Library Support** - Includes BOSL, BOSL2, and MCAD libraries

## 🎯 Key Capabilities

| Feature                    | Description                                          |
| -------------------------- | ---------------------------------------------------- |
| **Natural Language Input** | Describe your 3D model in plain English              |
| **Image References**       | Upload images to guide model generation              |
| **Real-time Preview**      | See your model update instantly with Three.js        |
| **Parameter Extraction**   | Automatically identifies adjustable dimensions       |
| **Smart Updates**          | Efficient parameter changes without AI re-generation |
| **Custom Fonts**           | Built-in Geist font support for text in models       |

## 📸 Demo

<!-- Add demo GIFs or screenshots here -->
<!-- Example format:
![CADAM Demo](./demo/demo.gif)

### Example: Creating a parametric gear
![Gear Example](./demo/gear-example.png)
-->

> 🎬 **Try it live:** https://adam.new/cadam

## 📺 Screenshots

<img src="./public/screenshot-2.jpeg" alt="CADAM Screenshot 2" />

<details>
  <summary>More screenshots</summary>

  <br/>
  <img src="./public/screenshot-1.jpeg" alt="CADAM Screenshot 1" />
  <br/>
  <img src="./public/screenshot-3.jpeg" alt="CADAM Screenshot 3" />

</details>

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/Adam-CAD/CADAM.git
cd CADAM

# Install dependencies
npm install

# Start all services (interactive - will prompt for ngrok/vite)
./scripts/start-services.sh start

# Or start everything with god mode (no auth required)
./scripts/start-services.sh start --god-mode
```

<details>
<summary>Manual startup (alternative)</summary>

```bash
npx supabase start
npx supabase functions serve --no-verify-jwt
npm run dev
```

</details>

## 📋 Prerequisites

- Node.js and npm
- Supabase CLI
- ngrok (for local webhook development)

## 🔧 Setting Up Environment Variables

### 1. Frontend Environment:

- Copy `.env.local.template` to `.env.local`
- Update all required keys in `.env.local`:
  ```
  VITE_SUPABASE_ANON_KEY="<Test Anon Key>"
  VITE_SUPABASE_URL='http://127.0.0.1:54321'
  ```

### 2. Supabase Functions Environment:

- Copy `supabase/functions/.env.template` to `supabase/functions/.env`
- Update all required keys in `supabase/functions/.env`, including:
  ```
  ANTHROPIC_API_KEY="<Test Anthropic API Key>"
  ENVIRONMENT="local"
  NGROK_URL="<NGROK URL>" # Your ngrok tunnel URL, e.g., https://xxxx-xx-xx-xxx-xx.ngrok.io
  ```

## 🌐 Setting Up ngrok for Local Development

CADAM uses ngrok to send image URLs to Anthropic:

1. Install ngrok if you haven't already:

   ```bash
   npm install -g ngrok
   # or
   brew install ngrok
   ```

2. Start an ngrok tunnel pointing to your Supabase instance:

   ```bash
   ngrok http 54321
   ```

3. Copy the generated ngrok URL (e.g., https://xxxx-xx-xx-xxx-xx.ngrok.io) and add it to your `supabase/functions/.env` file:

   ```
   NGROK_URL="https://xxxx-xx-xx-xxx-xx.ngrok.io"
   ```

4. Ensure `ENVIRONMENT="local"` is set in the same file.

## 💻 Development Workflow

### Install Dependencies

```bash
npm i
```

### Start All Services (Recommended)

Use the services manager script for a clean, reproducible startup:

```bash
# Interactive start - prompts for ngrok and vite
./scripts/start-services.sh start

# Or with god mode for development without auth
./scripts/start-services.sh start --god-mode
```

### Manual Supabase Services (Alternative)

```bash
npx supabase start
npx supabase functions serve --no-verify-jwt
```

### Service Manager Commands

```bash
./scripts/start-services.sh start      # Start all services
./scripts/start-services.sh stop       # Stop all services
./scripts/start-services.sh restart    # Full restart
./scripts/start-services.sh status     # Check what's running
./scripts/start-services.sh clean      # Clean caches/locks
./scripts/start-services.sh logs       # List log files
./scripts/start-services.sh tail f     # Tail function logs
```

## 🛠️ Built With

- **Frontend:** React 18 + TypeScript + Vite
- **3D Rendering:** Three.js + React Three Fiber
- **CAD Engine:** OpenSCAD WebAssembly
- **Backend:** Supabase (PostgreSQL + Edge Functions)
- **AI:** Anthropic Claude API
- **Styling:** Tailwind CSS + shadcn/ui
- **Libraries:** BOSL, BOSL2, MCAD

## 🤝 Contributing

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also [open an issue](https://github.com/Adam-CAD/CADAM/issues).

See the [CONTRIBUTING.md](CONTRIBUTING.md) for instructions and [code of conduct](CODE_OF_CONDUCT.md).

## 🙏 Credits

This app wouldn't be possible without the work of:

- [OpenSCAD](https://github.com/openscad/openscad)
- [openscad-wasm](https://github.com/openscad/openscad-wasm)
- [openscad-playground](https://github.com/openscad/openscad-playground)
- [openscad-web-gui](https://github.com/seasick/openscad-web-gui)
- [dingcad](https://github.com/yacineMTB/dingcad)

## 📄 License

This distribution is licensed under the GNU General Public License v3.0 (GPLv3). See `LICENSE`.

Components and attributions:

- Portions of this project are derived from `openscad-web-gui` (GPLv3).
- This distribution includes unmodified binaries from OpenSCAD WASM under
  GPL v2 or later; distributed here under GPLv3 as part of the combined work.
  See `src/vendor/openscad-wasm/SOURCE-OFFER.txt`.

---

<div align="center">
  
**⭐ If you find CADAM useful, please consider giving it a star!**

[![Stars](https://img.shields.io/github/stars/Adam-CAD/cadam?style=social&logo=github)](https://github.com/Adam-CAD/cadam/stargazers)

Made with 💙 for the 3D printing and CAD community

</div>
