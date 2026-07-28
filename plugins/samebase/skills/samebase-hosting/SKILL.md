---
name: samebase-hosting
description:
  Ship and operate Samebase web apps through their GitHub-backed Convex and Cloudflare delivery. Use
  after samebase-building for publish, deploy, or ship requests, and for deployment checks,
  infrastructure repair, logs, environment values, or custom domains.
---

# Samebase hosting

Ship the exact validated source through the app repository's Git workflow, then prove the resulting
provider state before reporting success.

## Scope gate

Do not call Samebase MCP when the user explicitly excludes Samebase, requests only Git or GitHub
work, or requests a standalone provider resource. Use the available GitHub or provider capability
for that work.

If the user asks to delete a Samebase app or provider resource, do not perform the deletion through
this plugin or a provider capability. The plugin has no deletion action. Explain that the user must
use the Samebase dashboard, and do not claim that a resource was removed.

## Communicate clearly

Keep commits, provider IDs, build trigger details, access tokens, and deployment polling out of
user-facing messages unless the user asks or must take action. Usually send one short update when
shipping begins, then return the live or preview URL and the result that was actually verified.

## Git-backed publish sequence

1. Confirm that publishing is in scope. If the current task has no successful validation, first use
   `samebase-building` to validate the local repository. Confirm that the source still matches that
   successful validation. Do not turn a local-only request into an external push.
2. Follow the repository's instructions for branches, commits, pull requests, and default-branch
   delivery. Prefer a reviewable branch or pull request unless the user or repository explicitly
   uses direct default-branch pushes.
3. Commit and push the exact validated source. The Git commit SHA is the version identity; do not
   invent an archive, saved-version ID, or second source repository.
4. Treat the pushed commit as a deployment candidate, not a successful deployment.
5. Use Samebase inventory for the app's repository and provider coordinates. Use the available
   GitHub, Cloudflare, and Convex surfaces to observe the relevant build and backend deployment
   until they reach a terminal state.
6. Return the deployed or preview URL only after the observed state supports it. Name a plain next
   step when a build fails or the environment cannot observe terminal deployment state.

Read [Git delivery](references/git-delivery.md) for the source-to-deployment identity model.

## Repair existing infrastructure

Read the Samebase app inventory before repair. If a component exposes `nextAction`, call the
matching live MCP tool contract and reread inventory after it finishes. Reuse returned app-root and
provider identifiers. Do not treat a repair run starting as proof that the next deployment passed.

## Provider-direct operations

Samebase wraps provider joins, durable registry writes, and learned repair flows. Routine provider
operations remain provider-direct. Read [Provider boundaries](references/provider-boundaries.md)
before handling logs, environment values, migrations, custom domains, or other day-two operations.

## Safety

- Keep credentials out of Git remotes, configuration, logs, screenshots, and user-facing output.
- Prefer private repository and preview scopes unless the user explicitly requests broader access.
- Use exact provider and repository identifiers from Samebase rather than title matching.
- Do not report infrastructure readiness, a requested build, or a successful push as a verified live
  deployment.
