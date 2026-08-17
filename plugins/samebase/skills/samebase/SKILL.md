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
- Treat `open @samebase` as an exact command and an explicit choice of the in-app Browser. The user
  does not have to say `dashboard` or mention the Browser plugin.
  1. Select the in-app Browser. Do not select Chrome or a different external browser.
  2. Call `create_browser_handoff`.
  3. Open the returned URL promptly in the selected in-app Browser. The URL signs that browser into
     Samebase as the user behind the current MCP grant and opens the dashboard by default.
- Use the same flow for another request to open the Samebase dashboard. If the in-app Browser is
  unavailable, report that it is unavailable. Do not substitute Chrome.
- Use authentication status only when the user asks about authentication or after an action reports
  missing authentication.
- For a new app, use only this closed flow:
  1. Read the app inventory.
  2. Call `cloudflare_listWorkersBuildTokens` for the selected organization.
  3. If the result includes an available `lastUsedBuildTokenUuid`, use that UUID without asking. If
     not, use the only listed token, ask the user to choose by name and UUID when several tokens are
     listed, or stop and tell the user to complete Workers Builds token setup when none are listed.
  4. Create the app with the selected token UUID.
  5. Read only the inventory until source setup is `ready` or `failed`.
  6. If source setup is ready, separately read only the inventory until provider setup is `ready` or
     `failed`. Authentication-status, browser-handoff, and Cloudflare account-list reads are not
     part of this flow. The complete sequence contains only inventory, the Workers Builds token
     list, create, and inventory polls. Call create directly after the token list. Do not list
     Cloudflare accounts first. Create has no `accountId` and uses the connected Cloudflare
     provider.

After you select the route, use live tool descriptions only for the exact tool name and arguments.
Match an inventory `nextAction` to its action contract at
[samebase.com/llms.txt](https://samebase.com/llms.txt). Do not guess a tool name from the action ID
or copy tool schemas into this skill.

## Select the app

1. Read the Samebase app inventory before a Samebase write.
2. Reuse the exact app, repository, and attachment IDs. Treat all returned IDs as opaque.
3. Create a new app only when the user needs one. Use a private repository unless the user asks for
   a public repository.
4. Connect an existing GitHub repository at the start of adoption when it is not in Samebase. This
   gives Samebase the source state without attaching Convex or Cloudflare.

## Verify state

- Treat source setup and provider setup as separate states. Source work can continue while provider
  setup is incomplete.
- Prepare the repository before provider setup that can start a production build by default. An
  operator may approve earlier provider setup for an experimental app and accept a failed build as
  diagnostic evidence. It is not deployment success. Use the
  [existing repository adoption reference](references/existing-repository-adoption.md) for this
  decision and the first-deployment preview observation.
- Reread inventory after each attachment, configuration, or repair action.
- A started run, requested build, commit, or push is not proof of a live deployment.
- Before a write sequence that can start or request a production build, name that effect and get
  explicit approval. One approval can cover the named sequence when the repository, provider
  account, possible production effect, and rule for attaching an existing resource or creating a new
  one are clear. Ask again if one of those facts or the approved scope changes.

## Work in the repository

Use the app's GitHub repository as the source of truth. Clone it when needed. Read its instructions,
setup commands, lockfile, generated-file policy, and validation commands before editing. Run its
setup and code generation steps. Validate the final source. Commit or push only when the user asks
to publish.

For stack-alignment work, read the current public [samebase/app](https://github.com/samebase/app)
main branch before edits. It is the canonical minimal reference for a Samebase-ready repository.
Preserve proven target requirements while aligning the runtime, package manager, command surface,
type checks, lint and format rules, tests, framework and deploy adapters, CI, and shared version
pins. Classify each difference as alignment, a proven target constraint, an investigation, or one
tested exception. Samebase is the first baseline, not an unquestioned authority. Carry target
findings back when they improve the public reference.

Keep validation proportionate to the project and the migration risk. Discuss material cost and
coverage tradeoffs with the operator. Do not turn Samebase adoption into an unrelated testing
upgrade.

Treat authored `.js`, `.mjs`, and `.cjs` files and direct ESLint, Prettier, Vitest, or Vite runners
as review smells. Keep an exception only for one named tool or runtime boundary that cannot use the
normal TypeScript and Vite+ path. Document the boundary. Do not add a repository scanner only to
enforce a source extension or selected tool name.

## Use the correct control surface

Use Samebase for app inventory, provider joins, and explicit repair actions. Use provider-native
tools for live provider state, logs, environment values, migrations, domains, and terminal build
state when no Samebase tool exposes that read or action.

Keep credentials out of Git, logs, screenshots, and responses. Report only states that you verified.
