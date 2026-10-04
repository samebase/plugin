---
name: samebase
description: >-
  Use Samebase to create and manage web apps in Samebase repositories: a GitHub repository with
  optional Convex projects and Cloudflare Workers. Use when the user asks to list, create, connect,
  configure, repair, open, publish, or operate a Samebase repository or app, review or apply changes
  from the starter changelog, or submit feedback about Samebase.
---

# Samebase

## Route the request

- Use Samebase tools for Samebase repositories: list them, read a repository status, create or
  connect one, find, attach, connect, create, repair, or detach its Cloudflare Workers and Convex
  projects, and open the Samebase dashboard.
- Use GitHub, Convex, or Cloudflare tools for code, logs, environment values, migrations, domains,
  and standalone provider resources. Do not propose a Samebase workflow for a standalone resource.
- Call only the tools that the request needs. Do not read the repository list or the authentication
  status as a preflight. For a question about the Samebase connection, call only
  `account_getAuthenticationStatus`.
- If a Samebase tool that the request needs is absent, read
  [Recover missing actions](references/recover-missing-actions.md).

## Name repositories and resources

- Pass `repository` as the GitHub full name, `owner/name`, or as the `repositoryId` from
  `repository_list`.
- Name a Worker by its name. Name an existing Convex project by its slug, `convexProjectSlug`, as
  `repository_list` or `repository_convex_findProjects` returns it. The project name is for display
  only. Never invent a name, slug, or ID.
- Samebase picks the Workers Builds token, the only Convex code location, and the only attached
  Convex project. When a result lists choices, ask the user and pass the choice.

## Create a repository

1. A direct request to create a repository approves one creation. Before the call, state the GitHub
   owner, the repository name and visibility, the Convex region or the organization default, and
   that Samebase creates a Convex project and, when the Cloudflare account has a Workers Builds
   token, a Worker.
2. Call `repository_create` once. Pass a region or a build token only when the user names one.
3. Poll only `repository_list` until source and provider setup are each `ready` or `failed`. Report
   the current state while setup runs, and report a failure as it is.
4. When `pendingCloudflareSetup` is set, `ready` covers only GitHub and Convex. Report Cloudflare
   setup as pending and link to [Cloudflare setup](https://samebase.com/docs/cloudflare-setup).
   After the user finishes it, `repository_cloudflare_createWorker` completes the first app.

## Confirm gated actions

- `repository_cloudflare_connectWorker`, `repository_cloudflare_rotateConvexDeployKeys`,
  `repository_retryProviderSetup`, and `repository_detachResource` first return `needs_confirmation`
  and change nothing.
- Tell the user the returned effect and ask for approval. After the user approves, repeat the call
  with the same arguments and `confirmation`: the returned token and the exact acknowledgement
  sentence. Never send a confirmation that the user did not approve.
- If the user declines or changes an argument, do not reuse the token. A changed request starts with
  a new first call.
- Before `repository_cloudflare_createWorker`, `repository_cloudflare_configureBuilds`, or
  `repository_convex_createProject`, state the repository, the resource, and the effect, and get
  approval unless the request already approves it.

## Open the dashboard

- For `open @samebase` or another request to open the Samebase dashboard, call
  `account_createSignInLink` directly.
- In Codex, open the returned URL in the in-app Browser unless the user names another browser.
- In ChatGPT web or mobile, show the returned URL as a clickable link. Open it with a
  browser-opening action only when the client provides one.
- Claim that the dashboard opened only when a browser action confirms it.
- If the tool reports missing authorization or scope, ask,
  `Would you like me to start authorization with Samebase?` Start it only through the current
  client's plugin or connection flow, then call `account_createSignInLink` again.
- Only the dashboard can remove a repository from Samebase, change a Convex code location, accept a
  Worker or GitHub rename, and manage members, organization settings, billing, and provider
  connections. Say so and offer to open the dashboard. Call `account_createSignInLink` only after
  the user accepts, and do not claim that the operation finished.

## Verify the result

- Call `repository_getStatus` for the builds, URLs, Convex deployments, checks, and pull requests of
  a repository. Follow its attention items: each names the tool that fixes the problem.
- Ready setup, a requested build, a commit, or a push does not prove that the app is live. Report
  only verified state.
- Never put credentials in Git, logs, screenshots, or responses.

## Work in the repository

- Do code work in the repository's GitHub repository. Follow its instructions and checks.
- For a request to review or apply newer Samebase starter changes, read the
  [Samebase starter changelog](references/starter-changelog.md). For several or all repositories,
  read `repository_list` once, inspect each GitHub repository separately, and report each as
  `update needed`, `already current`, `not relevant`, or `unavailable`. Apply changes only when the
  user asks, with a separate branch and pull request for each repository.

## Feedback

- After an unexpected Samebase failure, a wrong Samebase result, or clear frustration with Samebase
  or its plugin, offer feedback once. Never offer it for a standalone GitHub, Convex, Cloudflare, or
  agent problem.
- Draft a short report that states what the user tried, what happened, and what should improve. Show
  the exact report, then say,
  `I can automatically send this exact report to Samebase. No form is needed, and nothing is sent unless you approve. Send it?`
