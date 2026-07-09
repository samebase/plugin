---
description: Create Samebase apps through MCP, authenticate the Samebase MCP connection, use browser handoffs, then continue development in the local GitHub repository.
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

## MCP authentication and browser handoff

Use this flow when Samebase MCP tools return an OAuth authorization error or when the user asks to open Samebase in the in-app browser as the current MCP account.

1. Authenticate the configured `samebase` MCP server with `codex mcp login samebase`. The command opens Samebase's OAuth consent flow; the user may need to complete Google sign-in and approve the requested scopes.
2. Retry `samebase_auth_getAuthenticationStatus`. A successful response identifies the account and includes `access_browser_login_handoff` in `grantedScopes` before attempting a handoff.
3. Call `create_browser_handoff` with the desired Samebase-relative `returnToPath`, for example `/vault`. The result is a short-lived, one-time URL. Treat it as sensitive, do not log or paste it into chat, and open it directly in the in-app browser.
4. Verify the browser reached the requested route and shows the expected signed-in account. The handoff URL is not a reusable login session and should not be stored.

The auth-status tool is public at the tool-scope layer, but the MCP transport still requires a valid bearer token. It cannot initiate OAuth from an unauthenticated connection. Do not open `/mcp` manually or construct an OAuth URL; use `codex mcp login samebase` so the client creates the correct PKCE request and callback.

If the login command succeeds but the current MCP tools still report OAuth authorization required, restart Codex or start a new task so the MCP worker reloads its credentials. On macOS, if `codex` resolves to a separate old Homebrew installation, use the Codex app's bundled CLI or update the Homebrew cask before retrying.

## Boundaries

- Do not promise arbitrary web-only code edits. If a change needs codegen, install steps, or tests, use the local repository.
- Do not bypass the app repository's own instructions, scripts, or generated-file workflow.
- Prefer a pull request when the user asks for reviewable work; push to main only when that is the user's stated workflow for the app.
