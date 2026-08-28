---
name: samebase
description:
  Use Samebase to create and manage web apps with a GitHub repository and optional Convex and
  Cloudflare resources. Use when the user asks to list, create, connect, configure, repair, open,
  publish, or operate a Samebase app, review or apply changes from the starter changelog, or submit
  feedback about Samebase.
---

# Samebase

## Choose the control surface

- Use Samebase actions to list apps, create or connect an app repository, attach or repair provider
  resources for a Samebase app, and open the Samebase dashboard.
- Use GitHub, Convex, or Cloudflare tools for direct work in those systems. For a standalone
  provider resource, use only provider tools and do not propose a Samebase workflow. A provider
  action does not change the Samebase app unless the action says that it does.
- When Samebase actions are registered but no action supports the requested operation, explain where
  the user can do it and offer to open the dashboard. Do not read inventory or call an action before
  the user accepts. Then call only `create_browser_handoff`. Do not claim that the operation
  finished.
- Choose the action from the user's request. Follow the live MCP server and tool instructions for
  the current actions, arguments, effects, and required order.
- If a required Samebase action is absent, read
  [Recover missing actions](references/recover-missing-actions.md).
- For a request about Samebase connection or authentication status, call the authentication-status
  action directly. Do not read app inventory.
- Call only the actions needed for that route. Do not read app or authentication state as a generic
  preflight.
- Never offer feedback for a standalone GitHub, Convex, Cloudflare, or agent problem.
- When the feedback action is available, offer once without being asked after an unexpected Samebase
  failure, a wrong Samebase result, or clear frustration with Samebase or its plugin. Draft a short
  report that states what the user tried, what happened, and what should improve. Show the exact
  report, then say,
  `I can automatically send this exact report to Samebase. No form is needed, and nothing is sent unless you approve. Send it?`

## Open Samebase

- Treat `open @samebase` and another request to open the Samebase dashboard as a request to use the
  in-app Browser.
  1. If `create_browser_handoff` is absent, read
     [Recover missing actions](references/recover-missing-actions.md).
  2. Call `create_browser_handoff` directly. Do not call authentication status first.
  3. If the callable action reports missing authorization or scope, explain the requirement. Ask,
     `Would you like me to start authorization with Samebase?`
  4. Start authorization only through the current plugin or connection flow after the user agrees.
     Wait for it to finish, then call `create_browser_handoff` again.
  5. Select the in-app Browser. Do not select Chrome or another external browser.
  6. Open only the URL returned by `create_browser_handoff`, before it expires.
- If the in-app Browser is unavailable, say so. Do not open Chrome.

## Protect app identity

- Read app inventory before a Samebase write when a repository can already be connected.
- Managed app creation always uses all four steps:
  1. Read inventory.
  2. List the selected organization's current Workers Builds tokens, then select exactly:
     - If the last-used token is current, use it.
     - Otherwise, if one token exists, use it.
     - Otherwise, if several tokens exist, stop and ask the user to choose by name and UUID.
     - Otherwise, the list is empty, so pass null.
  3. Call the create action once.
  4. Poll only inventory until both source and provider setup reach `ready` or `failed`. Stop and
     report a failed state. With a null token, report Cloudflare setup as pending after the other
     setup reaches `ready`.
- Reuse returned app, repository, provider account, and attachment identifiers without changing
  them. Treat identifiers as opaque.
- Source setup and provider setup are separate states. Source work can continue while provider setup
  is incomplete or failed.

## Approve provider writes

- A direct request to create a Samebase app approves one managed creation sequence after inventory
  and token selection. State the resolved repository, provider account, and effects before the
  create call, but do not ask again unless the target, effects, or scope changes.
- Before a Samebase sequence can create or change provider resources or start a production build,
  state the repository, provider account, expected changes, and whether Samebase will attach an
  existing resource or create a new one. Get explicit approval.
- Ask again if the target, effects, or approved scope changes.

## Work in the repository

- Use the selected app's GitHub repository for code work. Follow its instructions and validation
  commands.
- For a request to review or apply newer Samebase starter changes, read the
  [Samebase starter changelog](references/starter-changelog.md).

## Verify the result

- Reread Samebase inventory after an attachment, configuration, or repair action.
- Inventory reports Samebase workflow state and stable resource identifiers. Use provider tools for
  live state, logs, environment values, migrations, domains, and final build status when Samebase
  has no matching read.
- A started run, build request, commit, or push does not prove that a deployment is live.
- Never put credentials in Git, logs, screenshots, or responses. Report only verified state.
