---
name: samebase-building
description:
  Build or change Samebase web apps, including websites, landing pages, dashboards, portals,
  trackers, and internal tools. Use Samebase MCP for app creation, connection, inventory, provider
  wiring, and repair, then work in the local GitHub repository.
---

# Samebase building

Create or identify the app through Samebase, then implement and validate the requested product in
its real local GitHub repository.

## Scope gate

Do not call Samebase MCP when the user explicitly excludes Samebase, requests only Git or GitHub
work, or requests a standalone provider resource. Use the available GitHub or provider capability
for that work.

If the user asks to delete a Samebase app or provider resource, do not perform the deletion through
this plugin or a provider capability. The plugin has no deletion action. Explain that the user must
use the Samebase dashboard, and do not claim that a resource was removed.

## Communicate clearly

Talk about the user's app, visible progress, choices, and results. Keep access scopes, provider IDs,
generated files, setup commands, and control-plane details out of user-facing messages unless the
user must act or asks for them. Do not claim that a requested provisioning step or Git push is a
successful deployment.

## Choose the app path

- For a new app, use the create action. Prefer a private repository unless the user explicitly asks
  for public visibility. Ask only for required values that cannot be inferred safely.
- For an existing GitHub repository that is not in Samebase, use the connect action. Connecting the
  repository must not imply that Convex or Cloudflare was attached.
- For an existing Samebase app, read the app inventory first and reuse its exact app, repository,
  and provider identifiers. Do not create a duplicate because a display name is ambiguous.
- When the local repository already exists and no Samebase control-plane work is needed, preserve
  the normal local workflow instead of calling MCP gratuitously.

Read [Control plane](references/control-plane.md) when creating, connecting, attaching, or repairing
an app.

## Preserve continuity

1. Read the current inventory before a write whenever the app may already exist.
2. Keep the returned app ID, repository coordinates, app root, provider identifiers, and URLs
   together for the rest of the task.
3. For asynchronous provisioning, reread the inventory until it reaches a terminal ready or failed
   state. A started run is not a completed app.
4. When state is degraded, follow its `nextAction` through the matching live MCP tool contract, then
   reread the inventory. Do not guess a repair sequence from a label alone.
5. If authentication is missing, use the authentication status or browser handoff capability. Do not
   recreate the app under another identity.

## Work in the repository

1. Use the returned GitHub repository. Clone it when no local checkout exists, then work inside that
   checkout rather than inside the plugin or an unrelated workspace.
2. Read the repository's agent instructions, README, package scripts, and provider configuration
   before editing. Preserve its package manager, lockfile, architecture, and generated-file policy.
3. Run the repository's setup or development entrypoint before backend work. Run code generation
   through the repository's own command and never hand-edit generated Convex bindings.
4. Build the requested app as the smallest coherent product change. Add authentication, durable
   data, uploads, or other capabilities only when the request needs them.
5. Keep the local preview available when the environment supports it and the task benefits from
   direct review. Perform browser QA when the user asks or the changed behavior requires it.
6. Run the repository's relevant validation command against the final source state. Fix real
   failures before handing the work off.

Read [Local repository](references/local-repository.md) for the source, setup, and validation
contract.

## Hosting handoff

Use `samebase-hosting` after validation when the request includes publishing, deployment, shipping,
or provider operation. For local-only work, stop after validation and report the local result.
