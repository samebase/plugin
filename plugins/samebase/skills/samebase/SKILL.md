---
name: samebase
description:
  Build, connect, change, publish, or operate Samebase web apps through GitHub, Convex, and
  Cloudflare. Use for Samebase app inventory, provisioning, provider attachment, repair, browser
  handoff, repository work, deployment checks, logs, environment values, migrations, and domains.
---

# Samebase

## Scope gate

- Samebase is only for repository-backed apps and explicit provider attachments.
- Do not use Samebase for unrelated Git work or standalone provider resources. A standalone
  Cloudflare Worker means no Samebase.
- For a deletion request, direct the user to the Samebase dashboard. Do not call any Samebase or
  provider tool, including app inventory and browser handoff, and do not delete attached resources.

Use Samebase for repository-backed apps and work that joins GitHub, Convex, and Cloudflare.

## Route the request

Choose the route from the user request before you read live tool descriptions. Do not add preflight
actions. Each action reports missing authentication itself.

- For an app-inventory request, call only the Samebase app inventory. Do not call authentication
  status or browser handoff as a preflight.
- For a Cloudflare account-list request, call only the Cloudflare account list. Do not call app
  inventory, authentication status, or browser handoff as a preflight.
- For a dashboard request, call only browser handoff. Do not call app inventory or authentication
  status as a preflight.
- Use authentication status only when the user asks about authentication or after an action reports
  missing authentication.
- For a new app, use only this closed flow:
  1. Read the app inventory.
  2. Create the app.
  3. Read only the inventory until source setup is `ready` or `failed`.
  4. If source setup is ready, separately read only the inventory until provider setup is `ready` or
     `failed`. Authentication-status, browser-handoff, and provider-account reads are not part of
     this flow. The complete sequence contains only inventory, create, and inventory polls. Call
     create directly after inventory. Do not list Cloudflare accounts first. Create has no
     `accountId` and uses the connected Cloudflare provider.

After you select the route, use live tool descriptions only for the exact tool name and arguments.
Match an inventory `nextAction` to its action contract at
[samebase.com/llms.txt](https://samebase.com/llms.txt). Do not guess a tool name from the action ID
or copy tool schemas into this skill.

## Select the app

1. Read the Samebase app inventory before a Samebase write.
2. Reuse the exact app, repository, and attachment IDs. Treat all returned IDs as opaque.
3. Create a new app only when the user needs one. Use a private repository unless the user asks for
   a public repository.
4. Connect an existing GitHub repository when it is not in Samebase. A connection does not attach
   Convex or Cloudflare.

## Verify state

- Treat source setup and provider setup as separate states. Source work can continue while provider
  setup is incomplete.
- Reread inventory after each attachment, configuration, or repair action.
- A started run, requested build, commit, or push is not proof of a live deployment.

## Work in the repository

Use the app's GitHub repository as the source of truth. Clone it when needed. Read its instructions,
setup commands, lockfile, generated-file policy, and validation commands before editing. Run its
setup and code generation steps. Validate the final source. Commit or push only when the user asks
to publish.

For stack-alignment work, compare the target with the generated app and, when accessible, current
Samebase package scripts, configuration, dependencies, lock file, CI, and provider commands before
edits. If private Samebase source is unavailable, record that gap and use the portable baseline:
Node 24, ESM, TypeScript automation, Vite+ dev, build, and tests, Oxlint and Oxfmt through Vite+,
explicit type checks, and the real provider build path. Cover the runtime and package manager,
command surface, lint and format rules, tests and type checks, framework and deploy adapters, and
shared version pins. Classify every difference as alignment, a proven target constraint, an
investigation, or one exact tested exception before implementation. Samebase is the first baseline,
not an unquestioned authority. Carry target and generated-app findings back when they improve the
shared contract.

Treat authored `.js`, `.mjs`, and `.cjs` files and direct ESLint, Prettier, Vitest, or Vite runners
as review smells. Keep an exception only for one named tool or runtime boundary that cannot use the
normal TypeScript and Vite+ path. Document the boundary. Do not add a repository scanner only to
enforce a source extension or selected tool name.

## Use the correct control surface

Use Samebase for app inventory, provider joins, and explicit repair actions. Use provider-native
tools for live provider state, logs, environment values, migrations, domains, and terminal build
state when no Samebase tool exposes that read or action.

Keep credentials out of Git, logs, screenshots, and responses. Report only states that you verified.
