---
name: samebase
description: Create Samebase apps through MCP, then continue development in the local GitHub repository.
---

# Samebase

Use this skill when the user wants to create, inspect, or continue work on a Samebase app.

Samebase creates a real GitHub repository, deployment target, and backend wiring. Treat the MCP server as the app control plane, not as a replacement for a local development environment.

## Workflow

1. If the user wants a new app, use the Samebase MCP tools to create it. Ask only for missing required values such as app name, GitHub owner, or visibility.
2. After the app exists, identify the GitHub repository URL and live app URL.
3. For code changes, work in a local clone of the GitHub repository. If the repository is not present locally, clone it before editing.
4. Before Convex or backend changes, run the repository's setup/codegen command first. Do not hand-edit generated Convex files unless the app's own workflow requires it.
5. Make the smallest coherent change, run the relevant validation command, then commit and push through Git when the user asks you to ship it.

## Boundaries

- Do not promise arbitrary web-only code edits. If a change needs codegen, install steps, or tests, use the local repository.
- Do not bypass the app repository's own instructions, scripts, or generated-file workflow.
- Prefer a pull request when the user asks for reviewable work; push to main only when that is the user's stated workflow for the app.

