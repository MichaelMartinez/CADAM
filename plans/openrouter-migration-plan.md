# OpenRouter Migration Plan for Prompt Generator

## Current Situation

You are correct - there is an inconsistency between the two functions:

- **`chat/index.ts`**: Uses OpenRouter API (OpenAI-compatible format)
- **`prompt-generator/index.ts`**: Uses Anthropic SDK directly

Both should use OpenRouter for consistency and to leverage the same API key.

## Key Differences Identified

### chat/index.ts (OpenRouter Implementation)

```typescript
// Uses OpenRouter API URL
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY') ?? '';

// Makes fetch requests with OpenAI-compatible format
const response = await fetch(OPENROUTER_API_URL, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${OPENROUTER_API_KEY}`,
    'HTTP-Referer': 'https://adam-cad.com',
    'X-Title': 'Adam CAD',
  },
  body: JSON.stringify({
    model: 'anthropic/claude-3.5-haiku',
    max_tokens: 30,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
  }),
});
```

### prompt-generator/index.ts (Anthropic SDK Implementation)

```typescript
// Imports Anthropic SDK
import { Anthropic } from 'npm:@anthropic-ai/sdk';

// Creates Anthropic client
const anthropic = new Anthropic({
  apiKey: Deno.env.get('ANTHROPIC_API_KEY') ?? '',
});

// Uses Anthropic's native format
const response = await anthropic.messages.create({
  model: 'claude-3-haiku-20240307',
  max_tokens: maxTokens,
  system: systemPrompt,
  messages: [
    {
      role: 'user',
      content: userPrompt,
    },
  ],
});
```

## Required Changes

### 1. Remove Anthropic SDK Dependency

- Remove: `import { Anthropic } from 'npm:@anthropic-ai/sdk';`
- Add OpenRouter configuration constants

### 2. Update API Configuration

```typescript
// Add at top of file
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY') ?? '';
```

### 3. Convert Model Names

- Anthropic: `'claude-3-haiku-20240307'`
- OpenRouter: `'anthropic/claude-3-haiku-20240307'` or `'anthropic/claude-3.5-haiku'`

### 4. Convert API Call Format

**From:**

```typescript
const response = await anthropic.messages.create({
  model: 'claude-3-haiku-20240307',
  max_tokens: maxTokens,
  system: systemPrompt,
  messages: [{ role: 'user', content: userPrompt }],
});
```

**To:**

```typescript
const response = await fetch(OPENROUTER_API_URL, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${OPENROUTER_API_KEY}`,
    'HTTP-Referer': 'https://adam-cad.com',
    'X-Title': 'Adam CAD',
  },
  body: JSON.stringify({
    model: 'anthropic/claude-3.5-haiku',
    max_tokens: maxTokens,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
  }),
});

if (!response.ok) {
  throw new Error(`OpenRouter API error: ${response.statusText}`);
}

const data = await response.json();
```

### 5. Update Response Parsing

**From (Anthropic format):**

```typescript
let prompt = '';
if (Array.isArray(response.content) && response.content.length > 0) {
  const lastContent = response.content[response.content.length - 1];
  if (lastContent.type === 'text') {
    prompt = lastContent.text.trim();
  }
}
```

**To (OpenAI/OpenRouter format):**

```typescript
let prompt = '';
if (data.choices && data.choices[0]?.message?.content) {
  prompt = data.choices[0].message.content.trim();
}
```

## Benefits of This Migration

1. **Consistency**: All functions use the same API provider
2. **Single API Key**: Only need `OPENROUTER_API_KEY` instead of both keys
3. **Flexibility**: OpenRouter provides access to multiple models through one API
4. **Simplified Dependencies**: Remove the Anthropic SDK dependency
5. **Cost Management**: Unified billing through OpenRouter

## Implementation Steps

1. Update imports and configuration
2. Replace Anthropic client initialization with fetch configuration
3. Convert API call to OpenRouter format
4. Update response parsing logic
5. Test the function with both new prompt generation and existing text enhancement
6. Verify error handling works correctly

## Testing Checklist

- [ ] Generate new prompt (no `existingText`)
- [ ] Enhance existing prompt (with `existingText`)
- [ ] Verify authentication still works
- [ ] Check error handling for API failures
- [ ] Validate response format matches expected structure

## Notes

- The `ANTHROPIC_API_KEY` environment variable can be removed after migration
- Keep the same model (`claude-3-haiku` or `claude-3.5-haiku`) for consistency
- OpenRouter requires the `HTTP-Referer` and `X-Title` headers for proper attribution
