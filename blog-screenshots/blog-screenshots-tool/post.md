**Built a Claude Code skill that writes blog posts and captures screenshots automatically.**

Writing technical posts is tedious. You write the content, then alt-tab to capture screenshots, crop them, add annotations, resize for LinkedIn... it breaks flow.

So I built `/blog-screenshots` - a Claude Code custom command that handles the whole pipeline:

1. Asks what you want to write about (topic, platform, tone)
2. Creates an outline for approval
3. Writes the post section by section
4. Captures screenshots via Playwright MCP when needed
5. Annotates and crops with ImageMagick
6. Generates hero images sized for LinkedIn/Twitter

[IMAGE: 01-workflow-cropped.png]

The skill is just a markdown file in `.claude/commands/` - about 250 lines of instructions that Claude follows. It has access to browser automation, file operations, and can ask clarifying questions.

The meta part: I'm using the tool right now to write this post about the tool.

Claude Code skills are underrated. You can encode entire workflows into reusable commands. No code, just structured prompts.

#ClaudeCode #BuildInPublic #DeveloperTools #AI #Automation
