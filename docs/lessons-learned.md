# Lessons Learned

Common issues encountered in this codebase and their solutions.

---

## Supabase Edge Functions

### Deno Lockfile Version Incompatibility

**Symptom:** `worker boot error: Unsupported lockfile version '5'. Try upgrading Deno or recreating the lockfile`

**Cause:** Your local Deno (v2.x) creates lockfile version 5, but Supabase edge runtime uses an older Deno version (compatible with ~v2.1.4) that only supports earlier lockfile versions.

**Solution:** Delete the lockfile before starting edge functions. The runtime recreates it with a compatible version.

```bash
# Manual fix
rm supabase/functions/deno.lock

# Or use the start script (automatic)
./scripts/start-services.sh functions
```

**Prevention:**

- `deno.lock` is added to `.gitignore` - never commit it
- The start script automatically cleans it up before starting functions
- Use `./scripts/start-services.sh clean` to manually clean artifacts

**Related files:**

- `.gitignore` - excludes `supabase/functions/deno.lock`
- `scripts/start-services.sh` - `cleanup_dev_artifacts()` function

---

### Boot Error After Adding New Files

**Symptom:** `Worker failed to boot (please check logs)` error when calling edge functions.

**Cause:** The `supabase functions serve` process caches file state. Adding new files (especially in `_shared/`) requires a restart.

**Solution:** Restart `supabase functions serve` after adding new files to `supabase/functions/`.

---

### Import Paths in Edge Functions

**Convention:** Use relative imports (`../_shared/`) rather than the `@shared/` alias for files within `supabase/functions/`.

**Reason:** The `@shared/` alias in `deno.json` points to `../../shared/` (the frontend shared folder), not the edge functions `_shared/` folder.

**Structure:**

- `shared/` - Frontend shared types (used by `src/`)
- `supabase/functions/_shared/` - Edge function shared types (used by edge functions)

---

### Deno Lint: require-await

**Symptom:** `error[require-await]: Async method has no 'await' expression`

**Cause:** Deno's linter requires async functions to have at least one `await` expression.

**Solution:** Add explicit `await` even when returning another async function's result:

```typescript
// Bad - lint error
private async findImagePath(id: string): Promise<string | null> {
  return this.findImagePathByListing(id);
}

// Good
private async findImagePath(id: string): Promise<string | null> {
  return await this.findImagePathByListing(id);
}
```

---

## OpenRouter / AI Models

### Model ID Format

**Issue:** Model IDs must exactly match OpenRouter's naming convention.

**Example:** `google/gemini-2.5-flash-preview` is invalid; the correct ID is `google/gemini-2.5-flash`.

**Verification:** Check https://openrouter.ai/models for exact model IDs before adding to `modelRegistry.ts`.

---

### Model Type is a String

**Symptom:** "No models provided" error from OpenRouter API despite passing a model.

**Cause:** The `Model` type in `shared/types.ts` is defined as `type Model = string`, not an object with an `.id` property. Using `model.id` returns `undefined`.

**Solution:** Use the model value directly since it's already a string:

```typescript
// WRONG - Model is a string, not an object
const requestBody = {
  model: model.id,  // undefined!
  ...
};

// CORRECT
const requestBody = {
  model,  // Model is already a string (model ID)
  ...
};
```

**Files affected:** `supabase/functions/chat/index.ts` - both the main request and code generation request.

---

## UI / Styling

### Dark Mode Text Visibility

**Issue:** shadcn/ui components use CSS variables like `text-popover-foreground` that may not be defined in custom themes.

**Solution:** Use explicit Tailwind classes for dark mode:

```typescript
// Instead of
'text-popover-foreground focus:text-accent-foreground';

// Use explicit colors
'text-adam-neutral-50 focus:text-adam-neutral-100';
```

**Affected components:** `dropdown-menu.tsx`, `select.tsx`, `toggle.tsx`

**Pattern:** Always check that inactive/default states have explicit text colors, not just hover/active states.

---

### Dark Mode Class Required

**Issue:** Text appears dark/invisible despite having dark mode CSS variables defined.

**Root Cause:** The `<html>` tag in `index.html` was missing the `dark` class. Tailwind's class-based dark mode (`darkMode: ['class']`) requires this class to enable dark mode CSS variables.

**Solution:** Ensure `index.html` has:

```html
<html lang="en" class="dark" ...></html>
```

**CSS Variables:** The dark mode CSS variables in `src/index.css` should use adam color values:

- `--foreground`: adam-neutral-50 (#E5E5E5)
- `--muted-foreground`: adam-neutral-300 (#949494)
- `--popover-foreground`: adam-neutral-50 (#E5E5E5)
- etc.

---

## Git / Pre-commit Hooks

### Lint-staged Failures

**Symptom:** Commit fails with lint errors from pre-commit hooks.

**Solution:** Fix the lint error, then retry the commit. Don't use `--no-verify` unless absolutely necessary.

**Common causes:**

- Deno lint errors in `supabase/functions/`
- ESLint errors in `src/`
- Prettier formatting issues

---

## Database

### RLS (Row Level Security)

**Context:** Tables have RLS policies that restrict access based on user ownership.

**GOD_MODE:** When `GOD_MODE=true` is set in edge function env, use service role key to bypass RLS:

```typescript
const supabase =
  isGodMode && supabaseServiceRoleKey
    ? createClient(supabaseUrl, supabaseServiceRoleKey)
    : createClient(supabaseUrl, supabaseAnonKey, {
        global: { headers: { Authorization: authHeader } },
      });
```

### 406 Not Acceptable on Table Queries

**Symptom:** `GET /rest/v1/tablename?... 406 (Not Acceptable)` error in browser console.

**Cause:** Table has RLS enabled but no policy allows access for the current user/role. In GOD_MODE, `auth.uid()` returns NULL so standard policies using `auth.uid() = user_id` fail.

**Solution:** Add god mode RLS policies for each table that needs to be accessed:

```sql
-- Example for workflows table
CREATE POLICY "God mode workflows access"
ON public.workflows
FOR ALL
TO public
USING (conversation_id IN (
    SELECT id FROM conversations
    WHERE user_id = '00000000-0000-0000-0000-000000000000'::uuid
))
WITH CHECK (conversation_id IN (
    SELECT id FROM conversations
    WHERE user_id = '00000000-0000-0000-0000-000000000000'::uuid
));
```

**Tables needing god mode policies:**

- `conversations` - direct user_id check
- `messages` - via conversation_id FK
- `workflows` - via conversation_id FK
- `workflow_steps` - via workflow_id → conversation_id
- `inflection_points` - via workflow_id → conversation_id
- `storage.objects` - via folder name matching user UUID

---

### Frontend Services in GOD_MODE

**Symptom:** `User must be authenticated` error even with GOD_MODE enabled.

**Cause:** Frontend service functions may check for `session.access_token` which doesn't exist in GOD_MODE (mock session in AuthProvider only has user object, no access_token).

**Solution:** Import `isGodMode` from `@/lib/supabase` and skip access_token check when in GOD_MODE:

```typescript
import { supabase, isGodMode } from '@/lib/supabase';

async function getAuthHeaders(): Promise<Record<string, string>> {
  if (isGodMode) {
    return { 'Content-Type': 'application/json' };
  }
  // ... normal auth flow with access_token check
}
```

**Backend compatibility:** The workflow-orchestrator and other edge functions accept missing Authorization headers when `GOD_MODE=true` is set on the backend (they use service_role key internally).

**Related files:**

- `src/lib/supabase.ts` - exports `isGodMode`
- `src/services/workflowService.ts` - `getAuthHeaders()` function
- `src/contexts/AuthProvider.tsx` - creates mock session in GOD_MODE

---

### GOD_MODE User ID Mismatch

**Symptom:** Storage access fails with `StorageUnknownError` or `400 Bad Request` when trying to download images in GOD_MODE.

**Cause:** The frontend (AuthProvider) uses `00000000-0000-0000-0000-000000000000` as the user ID, but backend edge functions that call `supabaseClient.auth.getUser()` get no user (since there's no auth token), and may fall back to a different value like `'anonymous'`.

**Example mismatch:**

- Frontend uploads to: `00000000-0000-0000-0000-000000000000/{conversationId}/{imageId}`
- Backend looks for: `anonymous/{conversationId}/{imageId}` (WRONG!)

**Solution:** In edge functions, use the god mode user ID constant when `isGodMode` is true:

```typescript
const GOD_MODE_USER_ID = '00000000-0000-0000-0000-000000000000';
const userId = userData?.user?.id ?? (isGodMode ? GOD_MODE_USER_ID : null);
```

**Files affected:**

- `supabase/functions/chat/index.ts` - image download for chat
- `supabase/functions/title-generator/index.ts` - image access for title generation
- `supabase/functions/workflow-orchestrator/` - image processing in pipelines

---

## Development Workflow

### Clean Start (Recommended)

**When to use:** Whenever you encounter strange errors after stopping/starting services, or after pulling new code.

**Command:**

```bash
./scripts/start-services.sh restart --god-mode
```

**What gets cleaned automatically:**

- `supabase/functions/deno.lock` - Prevents lockfile version errors
- `supabase/functions/.deno/` - Deno cache directory
- Python `__pycache__` in step-converter

**Manual cleanup (if needed):**

```bash
./scripts/start-services.sh clean
```

---

### Files That Should Never Be Committed

These are generated/cache files that cause issues when shared between environments:

| File/Directory                 | Reason                           |
| ------------------------------ | -------------------------------- |
| `supabase/functions/deno.lock` | Deno version incompatibility     |
| `supabase/functions/.deno/`    | Deno module cache                |
| `node_modules/`                | Dependencies - use `npm install` |
| `.env.local`                   | Local secrets                    |
| `logs/`                        | Development logs                 |

---

### After Schema Changes

1. Edit schema files in `supabase/schemas/`
2. `supabase stop`
3. `supabase db diff -f <migration_name>`
4. `supabase start && supabase migration up`
5. `supabase gen types typescript --local > shared/database.ts`
6. Run type checks

### Type Checking

- **Frontend:** `npm run typecheck`
- **Edge Functions:** `cd supabase/functions/<name> && deno check index.ts`
- **All Supabase:** `npm run lint:supabase`

---

## Three.js / WebGL

### Capturing Screenshots from WebGL Canvas

**Symptom:** `canvas.toBlob()` returns null when trying to capture a screenshot from a Three.js/WebGL canvas.

**Cause:** WebGL contexts clear their drawing buffer after each frame by default. If you try to capture after the buffer is cleared, you get null/empty data.

**Solution:**

1. **Enable `preserveDrawingBuffer`** in the Three.js Canvas configuration:

```tsx
<Canvas gl={{ preserveDrawingBuffer: true }}>{/* ... */}</Canvas>
```

2. **Use toDataURL as fallback** when toBlob returns null:

```typescript
canvas.toBlob((blob) => {
  if (blob) {
    resolve(blob);
  } else {
    // Fallback to toDataURL
    const dataUrl = canvas.toDataURL('image/png');
    // Convert dataURL to Blob manually
    const byteString = atob(dataUrl.split(',')[1]);
    const mimeType = dataUrl.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    resolve(new Blob([ab], { type: mimeType }));
  }
});
```

3. **Wait for render frames** before capturing:

```typescript
await new Promise((resolve) => requestAnimationFrame(resolve));
await new Promise((resolve) => requestAnimationFrame(resolve));
```

**Note:** `preserveDrawingBuffer: true` has a slight performance impact as the buffer isn't cleared automatically.

**Related files:**

- `src/components/viewer/ThreeScene.tsx` - Canvas configuration
- `src/utils/screenshotUtils.ts` - Screenshot capture utilities

---

### SSE Event State Synchronization

**Symptom:** UI shows stale state even after receiving SSE events (e.g., inflection point card not appearing).

**Cause:** SSE event handlers may update one piece of state (e.g., refetch inflection point) but not another (e.g., refetch workflow status), leading to mismatched conditions.

**Example:**

```tsx
// Incomplete - only refetches inflection point, not workflow status
case 'workflow.inflection_point':
  refetchInflectionPoint();
  break;

// The UI condition needs BOTH to be true:
{inflectionPoint && workflow.status === 'awaiting_decision' && (
  <InflectionPointCard />
)}
```

**Solution:** Refetch all related state when receiving events that affect multiple conditions:

```tsx
case 'workflow.inflection_point':
  refetchInflectionPoint();
  refetchWorkflow();  // Also update workflow status
  break;
```

**Related files:**

- `src/components/workflow/WorkflowPanel.tsx` - SSE event handling

---

## Workflow System

### Workflow Mode Must Be Handled in ALL Entry Points

**Symptom:** Workflow mode is selected (e.g., "Vision to CAD"), content shows `workflowMode` in logs, but workflow doesn't trigger - falls through to regular chat.

**Root Cause:** The `TextAreaChat` component can be used in multiple places with different `onSubmit` handlers. Each handler must check for `content.workflowMode` and route accordingly.

**Entry points to check:**

1. `PromptView.tsx` - Initial "Good morning" page, uses `handleGenerate`
2. `ChatSection.tsx` - Editor view chat, uses `handleSubmit`

**Solution:** Every `onSubmit` handler that receives content from TextAreaChat must:

1. Check if `content.workflowMode` is set
2. If yes: Insert user message, then call `startWorkflow()`
3. If no: Send to regular chat API

**Example pattern:**

```typescript
const handleSubmit = async (content: Content) => {
  if (content.workflowMode) {
    // Workflow path: insert message, start workflow
    const userMessage = await insertMessage({
      role: 'user',
      content,
      parent_message_id: null,
      conversation_id: conversationId,
    });

    await startWorkflow({
      conversationId,
      triggerMessageId: userMessage.id,
      workflowType: content.workflowMode,
    });
  } else {
    // Standard chat path
    sendMessage(content);
  }
};
```

**Debugging tips:**

- Add logging with `workflowLogger` from `@/lib/logger.ts`
- Check which edge function is called in Supabase logs (`chat` vs `workflow-orchestrator`)
- Verify the `workflowMode` prop is passed through to `TextAreaChat`

**Related files:**

- `src/views/PromptView.tsx` - Must handle `content.workflowMode`
- `src/components/chat/ChatSection.tsx` - Must handle `content.workflowMode`
- `src/components/TextAreaChat.tsx` - Creates content with `workflowMode`
- `src/services/workflowService.ts` - `startWorkflow()` function

---

### Auto-Reset Workflow Mode After Submission

**Symptom:** Workflow mode auto-resets to 'chat' immediately after submission, but the workflow still triggers correctly.

**Cause:** `TextAreaChat.handleSubmit` clears images with `setImages([])` after submission. The auto-reset useEffect sees no images and resets workflow mode.

**Solution:** Track "just submitted" state to skip auto-reset during normal submission flow:

```typescript
const justSubmittedRef = useRef(false);

const handleSubmit = async () => {
  // ... create content ...

  justSubmittedRef.current = true;
  onSubmit(content);
  setImages([]);

  setTimeout(() => {
    justSubmittedRef.current = false;
  }, 100);
};

// In auto-reset effect:
useEffect(() => {
  if (justSubmittedRef.current) return; // Skip during submission
  // ... rest of auto-reset logic ...
}, [workflowMode, images]);
```

**Related files:**

- `src/components/TextAreaChat.tsx` - Auto-reset effect and submission handling

---

### Workflow Visual Indicator

**Best Practice:** Show a clear visual indicator when a workflow mode is active so users know their submission will trigger a workflow.

**Implementation:** Add a banner above the chat input:

```tsx
{
  isWorkflowMode(workflowMode) && activeWorkflowDef && (
    <div className="flex items-center justify-between rounded-lg border border-adam-blue/30 bg-adam-blue/10 px-4 py-2">
      <div className="flex items-center gap-2">
        <activeWorkflowDef.icon className="h-4 w-4 text-adam-blue" />
        <span className="text-sm font-medium text-adam-blue">
          {activeWorkflowDef.label} Mode Active
        </span>
      </div>
      <span className="text-xs text-adam-text-secondary">
        Your next message will trigger this workflow
      </span>
    </div>
  );
}
```

**Related files:**

- `src/components/TextAreaChat.tsx` - Banner rendering
- `src/lib/workflowRegistry.ts` - `getWorkflowDefinition()` for metadata

---

### Workflow Handoff Between Views (PromptView → EditorView)

**Symptom:** Workflow triggers successfully (backend logs show events), but UI shows nothing. No inflection points appear.

**Root Cause:** When a workflow is started in `PromptView` (the initial landing page), it uses its own `WorkflowContext`. Upon navigation to `EditorView`, the `PromptView` unmounts, and `ChatSection` in `EditorView` creates a fresh `WorkflowProvider` with no knowledge of the running workflow. SSE events emitted by the workflow are received by the now-unmounted component.

**Solution:** Don't start the workflow in `PromptView`. Instead:

1. Insert the user message in `PromptView`
2. Return a `workflowIntent` object with the workflow details
3. Pass `workflowIntent` via React Router navigation state
4. Let `ChatSection` (which has the visible `WorkflowContext`) start the workflow on mount

**Implementation pattern:**

```typescript
// PromptView.tsx - Return workflow intent instead of starting workflow
if (content.workflowMode) {
  const userMessage = await insertMessage({...});
  return {
    conversationId: conversation.id,
    content,
    workflowIntent: {
      triggerMessageId: userMessage.id,
      workflowType: content.workflowMode,
    },
  };
}

// In onSuccess handler:
navigate(`/editor/${data.conversationId}`, {
  state: data.workflowIntent ? { workflowIntent: data.workflowIntent } : undefined,
});

// EditorView.tsx - Extract from navigation state
const location = useLocation();
const workflowIntent = (location.state as { workflowIntent?: WorkflowIntent } | null)?.workflowIntent;
// Pass to ParametricEditor → ChatSection

// ChatSection.tsx - Start workflow on mount
const workflowIntentHandledRef = useRef(false);

useEffect(() => {
  if (workflowIntent && !workflowIntentHandledRef.current && conversation.id) {
    workflowIntentHandledRef.current = true;
    startWorkflow({
      conversationId: conversation.id,
      triggerMessageId: workflowIntent.triggerMessageId,
      workflowType: workflowIntent.workflowType,
    });
  }
}, [workflowIntent, conversation.id, startWorkflow]);
```

**Key insight:** The component that will display workflow UI (SSE events, inflection points) must be the one that starts the workflow and subscribes to events.

**Related files:**

- `src/views/PromptView.tsx` - Returns workflowIntent, passes via navigation state
- `src/views/EditorView.tsx` - Extracts workflowIntent from location.state
- `src/components/ParametricEditor.tsx` - Passes workflowIntent prop through
- `src/components/chat/ChatSection.tsx` - Starts workflow on mount using intent

---

## OpenSCAD / BOSL2

### 2D Primitives Used as 3D (star(), hexagon(), etc.)

**Symptom:** OpenSCAD compilation error:

```
WARNING: variable h not specified as parameter
WARNING: Mixing 2D and 3D objects is not supported
Current top level object is not a 3D object.
```

**Cause:** BOSL2 has many 2D-only primitives that don't accept 3D parameters like `h=` or `rounding=`:

- `star()` - 2D only
- `hexagon()` - 2D only
- `octagon()` - 2D only
- `regular_ngon()` - 2D only
- `ellipse()` - 2D only
- `rect()` - 2D only (use `cuboid()` instead)

**Wrong (will fail):**

```openscad
// star() does NOT accept h= or rounding= parameters!
star(n=4, r=45, ir=20, h=15, rounding=3);  // ERROR!
```

**Correct:**

```openscad
// Extrude the 2D star to make it 3D
linear_extrude(height=15)
  star(n=4, r=45, ir=20);
```

**Better approach:** Build star/cross shapes from 3D primitives:

```openscad
// Using cuboid() union for a cross/star shape
module cross_shape() {
  union() {
    cuboid([arm_length*2, arm_width, thickness], anchor=BOTTOM);
    cuboid([arm_width, arm_length*2, thickness], anchor=BOTTOM);
  }
}
```

**Related files:**

- `supabase/functions/workflow-orchestrator/config/promptLibrary.ts` - v2.0 prompts include this warning
- `supabase/functions/_shared/prompts.ts` - Main chat prompts

---

### Rounding Value Too Large

**Symptom:** OpenSCAD warning: `rounding ... too large`

**Cause:** BOSL2's `rounding=` parameter must be less than half the smallest dimension.

**Formula:** `rounding_value < min(x, y, z) / 2`

**Examples:**

- `cuboid([50, 30, 20], rounding=8)` → OK (min=20, 20/2=10 > 8)
- `cuboid([3, 70, 32], rounding=3)` → FAILS! (3/2=1.5, need rounding<1.5)
- `cuboid([1.5, 60, 40], rounding=2)` → FAILS! (1.5/2=0.75)

**Solution:** For thin parts (<5mm), omit rounding entirely:

```openscad
// Bad - thin plate with large rounding
cuboid([1.5, 60, 40], rounding=2);  // FAILS

// Good - omit rounding for thin parts
cuboid([1.5, 60, 40]);  // OK
```

---

## Docker / step-converter Service

### BuildKit Errors When Building Docker Image

**Symptom:**

```
failed to fetch metadata: exit status 1
ERROR: BuildKit is enabled but the buildx component is missing or broken.
```

**Cause:** Docker's BuildKit/buildx component is not properly installed or missing on the system.

**Solution:** Use the legacy Docker builder by disabling BuildKit:

```bash
DOCKER_BUILDKIT=0 docker build -t step-converter:latest .
```

**Note:** This only affects the build step. `docker compose up -d` works fine with the pre-built image.

**Related files:**

- `services/step-converter/README.md` - Build documentation

---

### External Docker Network Not Found

**Symptom:**

```
network supabase_network_cadam declared as external, but could not be found
```

**Cause:** The docker-compose.yml declares `supabase_network_cadam` as an external network that must exist before starting the container.

**Solution:** Create the network before running docker compose:

```bash
docker network create supabase_network_cadam
docker compose up -d
```

---

## Build123D / OpenCascade (OCP)

### import_stl() Returns Face, Not Solid

**Symptom:** Segmentation fault (exit code 139) when performing boolean operations on an imported STL mesh.

**Cause:** Build123D's `import_stl()` function returns a `Face` object, not a `Solid`. When you try to use this Face in boolean operations (like `add(..., mode=Mode.SUBTRACT)`), the OpenCascade kernel may crash with a segfault.

```python
# WRONG - causes segfault
from build123d import import_stl, BuildPart, Box, add, Mode

stl_shape = import_stl('/path/to/file.stl')
print(type(stl_shape))  # <class 'build123d.topology.two_d.Face'>  <-- NOT a Solid!

with BuildPart() as p:
    Box(20, 20, 20)
    add(stl_shape, mode=Mode.SUBTRACT)  # CRASH!
```

**Solution:** Use OCP's `StlAPI_Reader` + `BRepBuilderAPI_Sewing` + `BRepBuilderAPI_MakeSolid` to properly convert STL meshes to Solids:

```python
from build123d import Solid
from OCP.StlAPI import StlAPI_Reader
from OCP.TopoDS import TopoDS_Shape, TopoDS
from OCP.BRepBuilderAPI import BRepBuilderAPI_MakeSolid, BRepBuilderAPI_Sewing

def mesh_to_solid(stl_path: str) -> Solid:
    # Read STL as compound of faces
    reader = StlAPI_Reader()
    shape = TopoDS_Shape()
    reader.Read(shape, stl_path)

    # Sew faces into a shell
    sew = BRepBuilderAPI_Sewing(1e-6)
    sew.Add(shape)
    sew.Perform()
    sewn = sew.SewedShape()

    # Convert shell to solid
    shell = TopoDS.Shell_s(sewn)
    builder = BRepBuilderAPI_MakeSolid()
    builder.Add(shell)
    return Solid(builder.Solid())
```

**Note:** Always call `trimesh.fix_normals()` on the mesh before exporting to STL for OCP import, otherwise the solid may have inverted volume.

**Related files:**

- `services/step-converter/mold_generator.py` - `mesh_to_solid_build123d()` function

---

### Build123D Kind Enum Usage

**Symptom:** `KeyError: 'intersection'` when using `offset()` function.

**Cause:** Build123D's `offset()` function requires the `Kind` enum, not a string.

```python
# WRONG - string argument
offset(amount=-0.4, kind="intersection")  # KeyError!

# CORRECT - enum value
from build123d import Kind
offset(amount=-0.4, kind=Kind.INTERSECTION)
```

**Valid Kind values:** `Kind.ARC`, `Kind.INTERSECTION`, `Kind.TANGENT`

**Related files:**

- `services/step-converter/mold_generator.py` - Uses `Kind.INTERSECTION` for offset operations

---
