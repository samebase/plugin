# Samebase starter changelog

Read this only when the user asks to review or apply improvements from a newer Samebase starter to
one or more apps.

This changelog lists starter changes that can be useful to existing apps. It is not a complete
history and does not define update state.

A Samebase starter build identifies the Samebase change that produced a starter snapshot. It is an
origin hint, not the version of the user's app. New apps record this build in the first Git commit
message. Inspect only entries with a higher build number. If that message has no starter build,
inspect all entries.

For a marked file, use its `Samebase source build: v<N>` value as the source for comparison. When
you apply a change from a newer starter build to a marked file, replace that file's line with the
newer build number.

The user owns all app code. Inspect the current app before you use this list. The app code is the
source of truth. Skip an entry when the app already has its result. Apply only changes that are
relevant, and preserve unrelated user changes.

For a review of several apps, compare each repository independently. Do not reuse one app's starter
build or relevance result for another app.

## v2336: Hub clients register with RFC 7591, one function call per request, and cached build files

This build has three changes. Apply each one that is relevant.

### Hub clients register with RFC 7591

On 2026-11-11 both identity hubs moved to identity-broker 0.33.0. A hub now registers clients only
with the standard request `POST /register` (OAuth 2.0 Dynamic Client Registration, RFC 7591).
`@samebase/alchemy-convex` 0.40.0 sends this request. An older version sends `POST /hub-clients`,
which the hubs no longer serve. An app keeps the clients it has, so sign-in keeps working on
production and on existing previews. A new preview or a new development machine cannot register
until the app is on 0.40.0.

Relevant when `package.json` sets `@samebase/alchemy-convex` below `0.40.0`. From commit
[`6647ae8`](https://github.com/samebase/base/commit/6647ae8922bceb6d4e3ab2c73b778f8c8cecc3c5) of
[samebase/base](https://github.com/samebase/base):

- Set `@samebase/alchemy-convex` to `0.40.0` in `package.json` and update the lockfile.

No prop of `IdentityHub.Client` changed. Verify that the pull request comment says
`Sign-in with github, google: on`.

### Serve the site with one function call per request

`@samebase/convex-hosting` 0.15.0 sends the site's assets with the pushed code. A request to the
site runs one function, the HTTP action. With 0.14.0 it also ran a component query. `routeAll` now
takes one object, and `.convex-hosting/version.js` exports `assets` in place of `versionId`.
`pnpm run deploy` writes that file.

Relevant when `package.json` sets `@samebase/convex-hosting` below `0.15.0`. From commit
[`921636e`](https://github.com/samebase/base/commit/921636e79e9e4c100ac2b8d162988f4b971df310) of
[samebase/base](https://github.com/samebase/base):

- Set `@samebase/convex-hosting` to `^0.15.0` in `package.json` and update the lockfile.
- In `convex/http.ts`, replace `import { versionId } from "../.convex-hosting/version.js";` with
  `import { assets } from "../.convex-hosting/version.js";`.
- In `convex/http.ts`, replace `routeAll(http, components.hosting, versionId, server)` with
  `routeAll({ http, component: components.hosting, assets, worker: server })`.

Verify that the pull request preview serves the site.

### Cache the build's hashed files for a year

Vite names every file in `assets/` after its content. Without a `_headers` rule, convex-hosting
answers these files with Cloudflare's default header, `public, max-age=0, must-revalidate`, so every
request for one runs the site's HTTP action. Convex's front caches a response that carries a long
`Cache-Control`, and answers a cached file without running a function.

Relevant when `public/_headers` is missing or has no `/assets/*` rule. From commit
[`d609663`](https://github.com/samebase/base/commit/d609663da10d4b338bcb98a7bed0fe90579784ab) of
[samebase/base](https://github.com/samebase/base):

- Add this rule to `public/_headers`, and create the file if it does not exist:

  ```
  # Vite names every file in assets/ after its content, so a browser and Convex's front may keep one
  # for a year. Without this rule, every request for one runs the site's HTTP action.
  /assets/*
    Cache-Control: public, max-age=31536000, immutable
  ```

Keep this rule only when the build writes only content-named files into `assets/`. Files from
`public/`, such as `favicon.svg`, land at the root and keep the default.

Verify on the pull request preview: request one file of `assets/` twice with
`curl -sI -H "Accept-Encoding: gzip" <preview site>/assets/<file>.js`. Each response has
`Cache-Control: public, max-age=31536000, immutable`, and the second has `cf-cache-status: HIT`.

## v2326: A hub client lists its return addresses

On 2026-11-09 both identity hubs moved to identity-broker 0.31.0: a client lists the return
addresses it may name, and the hubs' clients were cleared, so an app has no sign-in until it
registers again. `@samebase/alchemy-convex` 0.39.1 registers with the new body and cannot read a
client that 0.38.0 saved in the state.

Relevant when `alchemy.run.ts` passes `redirectUri` to `IdentityHub.Client`. From commit
[`5e3cbea`](https://github.com/samebase/base/commit/5e3cbea64f4a4ed79111f9c24e1a05a4800b28a8) of
[samebase/base](https://github.com/samebase/base):

- Set `@samebase/alchemy-convex` to `0.39.1` in `package.json` and update the lockfile.
- In each `IdentityHub.Client`, replace `redirectUri: x` with `redirectUris: [x]`.
- Rename each `IdentityHub.Client` resource, such as `"HubClient"` to `"IdentityHubClient"`, and the
  id in `IdentityHub.Client.read(...)` with it. The new name registers a fresh client and removes
  the saved row of the old one, which this version cannot read.
- `app` is optional: its default is the stack's path in the repository, `app` for a stack named
  after it. Remove `app: "app"`. Keep any other value: it groups the app's clients at the hub.

Verify that the pull request comment says `Sign-in with github, google: on`. Then merge, so that
production gets its client. On the laptop, run the development client command again after that: a
development run reads the production client.

## v2318: Sign in at the public hub

On 2026-11-09 apps moved to Samebase's public identity hub, `https://id.samebase.com`, deployed from
[samebase/identity-hub](https://github.com/samebase/identity-hub). `auth.samebase.com` is now
samebase.com's own hub: its `google-apps` and `github-apps` are gone, and it refuses a new app.

Relevant when `alchemy.run.ts` names `https://auth.samebase.com` or the connectors `google-apps` and
`github-apps`. From commit
[`be2c557`](https://github.com/samebase/base/commit/be2c557759af93f57ea1e7382265c57eb19389ae) of
[samebase/base](https://github.com/samebase/base):

- Set the hub of each hub client to
  `{ issuer: "https://id.samebase.com", terms: "https://samebase.com/terms" }`.
- Replace `google-apps` with `google` and `github-apps` with `github` in each `connectors` list. If
  `convex/auth.ts` names a connector, such as `/authorize?connector=google-apps`, use the new name
  there too.
- The account key does not change: the id_token's `sub` is `google:<id>` or `github:<id>` at both
  hubs, so existing users keep their accounts.

Verify that the pull request comment says `Sign-in with github, google: on`. Then merge, so that
production gets its client at the new hub. On the laptop, run the development client command again
after that: a development run reads the production client.

## v2310: Name the hub, and keep the run record in the state

On 2026-11-08 the identity hub at `auth.samebase.com` started to take a deploy's GitHub token only
when the token's audience is the hub's issuer, `https://auth.samebase.com`.
`@samebase/alchemy-convex` 0.34.0 asks for that audience and requires the hub in each
`Convex.SharedHubClient`. Version 0.35.0 also moves the team's Convex state store to version 7, and
keeps the run record only through `Convex.withRunRecord`.

Relevant when `alchemy.run.ts` uses `Convex.SharedHubClient` or `Convex.state()`. From commit
[`a3ad3a8`](https://github.com/samebase/base/commit/a3ad3a843067dbb09e4507d763ac4485b191b8dc) of
[samebase/base](https://github.com/samebase/base):

- Set `@samebase/alchemy-convex` to `0.35.0` in `package.json` and update the lockfile.
- Give each `Convex.SharedHubClient` the hub:
  `hub: { issuer: "https://auth.samebase.com", terms: "https://samebase.com/terms" }`. A hub of the
  user's own goes here, with its issuer and the terms of its sign-in service.
- Replace `state: Convex.state()` with `state: Convex.withRunRecord(Convex.state())`, so that
  Samebase shows the app's deploys.
- The first deploy on 0.35.0 moves the team's state store to version 7. From then on, a deploy of
  the same Convex team on an older version fails, so update every app of the team on the same day.

Saved hub clients already hold the hub's issuer, so the first deploy renews them and registers no
new client. Verify that the pull request comment still says
`Sign-in with github-apps, google-apps: on`, or with the names that the app uses, and that Samebase
shows the preview after the deploy.

## v2301: Sign in through the hub's public clients

On 2026-11-07 the identity hub at `auth.samebase.com` got two clients per provider. `google` and
`github` are samebase.com's own, and an app signs in through them only when the hub's administrator
grants them. Every app signs in through `google-apps` and `github-apps`, the public clients that
Google and GitHub show as "Samebase". A client enrolled in `google` or `github` without a grant has
no sign-in, and the hub refuses a new registration that names them.

Relevant when `alchemy.run.ts` passes `connectors` to `Convex.SharedHubClient`. From commit
[`24fab33`](https://github.com/samebase/base/commit/24fab332d0559fa2aa6b9c0e28be4aafcc2441ad) of
[samebase/base](https://github.com/samebase/base):

- In each `Convex.SharedHubClient` of `alchemy.run.ts`, replace `google` with `google-apps` and
  `github` with `github-apps`, such as `["google-apps", "github-apps"]`. If `convex/auth.ts` names a
  connector in its `authorizationEndpoint`, such as `/authorize?connector=google`, use the new name
  there too.
- The account key does not change. The id_token's `sub` is `google:<id>` or `github:<id>` through
  either client of a provider, so existing users keep their accounts. Only an app whose profile
  mapping compares the id_token's `connector` claim with `google` or `github` must compare it with
  the new name.

Verify that the pull request comment says `Sign-in with github-apps, google-apps: on`, or with the
names that the app uses. Then merge, so that production gets a new client. On the laptop, run
`pnpm run hub --stage dev-<name>` again after that: a development run reads the production client.

## v2297: Name the connectors of each hub client

The identity hub at `auth.samebase.com` enrolls every client in the connectors that it signs in
through, and on 2026-11-07 it removed every client registered without them. An app on
`@samebase/alchemy-convex` 0.32.0 or older has no working hub client: its Google sign-in fails, and
its deploys stop at the hub client until the app has this change. The hub also shows its own page,
which names the app, before Google or GitHub.

Relevant when `alchemy.run.ts` uses `Convex.SharedHubClient`. From commit
[`31113c0`](https://github.com/samebase/base/commit/31113c0a66147efdbcd6473e8145d4450c92e57b) of
[samebase/base](https://github.com/samebase/base):

- Update `@samebase/alchemy-convex` to 0.33.0. Run `pnpm install` and commit `pnpm-lock.yaml`. From
  0.32.0, the team's Alchemy state store has version 6, and a repository of the same Convex team on
  0.31.0 or older fails its deploys after one repository runs 0.32.0 or later: update them together.
- Add `connectors` to each `Convex.SharedHubClient` in `alchemy.run.ts`. Use `["google", "github"]`
  when the `authorizationEndpoint` in `convex/auth.ts` names no connector, as in the starter, where
  the hub's page offers both. Otherwise use the names that it sends, such as `["google"]` for
  `/authorize?connector=google`.

Verify that the pull request comment says `Sign-in with github, google: on`, or with the names that
the app uses. Then merge, so that production gets a new client. On the laptop, run
`pnpm run hub --stage dev-<name>` again after that: a development run reads the production client.

## v2275: Google sign-in on a laptop, and no CONVEX_TEAM_ID

`@samebase/alchemy-convex` 0.29.0 finds the Convex team from the credential, and a `dev-` stage of
the stack gives the development deployment that `.env.local` selects a client of the identity hub.
The site serves `/samebase-verification.json` from a Convex route, not from a file of the build.

Relevant when `alchemy.run.ts` uses `Convex.SharedHubClient`. From commit
[`6cde236`](https://github.com/samebase/base/commit/6cde2366d6817132cd2302065a39d74f7c5890fc) of
[samebase/base](https://github.com/samebase/base):

- Update `@samebase/alchemy-convex` to 0.29.0, and add the script `"hub": "alchemy deploy"`. Run
  `pnpm install` after the steps below and commit `pnpm-lock.yaml`: the workflows install with
  `--frozen-lockfile`.
- Take `alchemy.run.ts`: the `dev-` stage, `Convex.state()` and `Convex.Project` with no `team`, and
  `SAMEBASE_REPOSITORY_ID` in the `env` of the `Deployment` row. Keep the row names: Alchemy
  destroys a row that leaves the stack.
- Add `convex/samebaseVerification.ts` and its test, the `/samebase-verification.json` route in
  `convex/http.ts`, and `SAMEBASE_REPOSITORY_ID: v.optional(v.string())` in the `env` of
  `convex/convex.config.ts`. Remove `scripts/write-samebase-verification.ts`, its test, and its step
  in the `deploy` script.
- Take `patches/@convex-dev__auth@2.0.0-beta.0.patch` and its comment in `pnpm-workspace.yaml`, and
  add `"http://localhost"` and `"http://127.0.0.1"` to `allowedRedirectOrigins` in `convex/auth.ts`.
- Remove `CONVEX_TEAM_ID` from `.github/workflows/alchemy.yml` and `destroy.yml`, then delete the
  repository variable.

Verify that a pull request preview shows Sign in with Google. Then merge, so that production has the
new code. On the laptop, push the new code to the development deployment with `pnpm run deploy:dev`:
the `dev-` stage pushes no code, and the hub registers a client only on a site that serves the
verification route. Then run `pnpm run hub --stage dev-<name>` and sign in with Google on
`pnpm run dev`.

## v2261: Get Google sign-in from the identity hub

`Convex.SharedHubClient` of `@samebase/alchemy-convex` 0.24.0 asks the identity hub at
`auth.samebase.com` for a new client, so the repository needs no Samebase account. samebase.com no
longer gives clients. On an older version, saved clients keep working, but a new deployment, such as
a new pull request preview, gets guest sign-in.

Relevant when `alchemy.run.ts` uses `Convex.SharedHubClient` and `package.json` has an older
`@samebase/alchemy-convex`:

- Update `@samebase/alchemy-convex` to 0.24.0. From 0.23.0, nothing else in the app changes. An
  older version also needs the `alchemy` and Effect versions of
  [samebase/base](https://github.com/samebase/base), which 0.23.0 requires.

Verify that a new pull request preview shows Sign in with Google.

## v2253: Prove the site for Google sign-in

samebase.com gives a hub client only to a site that serves `/samebase-verification.json` with the
repository's numeric GitHub ID, and `Convex.SharedHubClient` of `@samebase/alchemy-convex` 0.22.0
takes `redirectUri` in place of `deployment`. An app on an older starter keeps its saved clients, so
production keeps Google sign-in. A new deployment, such as a new pull request preview, gets guest
sign-in until the app is updated.

Relevant when `alchemy.run.ts` uses `Convex.SharedHubClient`. From one commit of
[samebase/base](https://github.com/samebase/base):

- Update `@samebase/alchemy-convex` to 0.22.0.
- Add `scripts/write-samebase-verification.ts` and its test. Append
  `&& node ./scripts/write-samebase-verification.ts dist/client` to the `--build` command of the
  `deploy` script.
- In `alchemy.run.ts`, give the `Deployment` row the `source`, pass
  `redirectUri: Output.interpolate\`${deployment.siteUrl}/auth/hub/callback\``to the client, and remove`source`from the`Site`row, which keeps`env`.
  Keep the row names: Alchemy destroys a row that leaves the stack.

Verify that a pull request preview serves `/samebase-verification.json` and shows Sign in with
Google.

## v2064: Use native Worker Previews

The starter uses Cloudflare's separate production and Previews Base build settings. Both use
`CONVEX_DEPLOY_KEY`, with a production key in production and a project Preview key in Previews Base.
`build`, `deploy`, and `deploy:preview` remain the package-script interface.

Relevant when an app reads `PREVIEW_CONVEX_DEPLOY_KEY` or uploads preview versions through a custom
deploy script. Use the starter's Wrangler version, and set `deploy` to `wrangler deploy` and
`deploy:preview` to `wrangler preview`. Add `previews: {}` to `wrangler.jsonc` and preserve
`preview_urls: true`. No fixed Worker name is needed in Workers Builds.

Use `scripts/build-cloudflare.ts`, `scripts/ensure-convex-auth.ts`, and
`scripts/verify-current-branch-head.ts`, with their matching tests, from one commit of
[samebase/base](https://github.com/samebase/base). Keep standard scripts unchanged, including their
source build comments. Preserve the app's own `build:app` steps. These scripts use Vite+ and `main`
as the production branch. Preserve different toolchains, branch names, or extra deployment steps and
explain each script difference in the PR. Set `build` to `node ./scripts/build-cloudflare.ts`.

Enable native preview builds in Cloudflare. In **Settings > Builds > Variables and secrets**, set
Previews Base's `CONVEX_DEPLOY_KEY` to the project's Preview deploy key. Remove the old
`PREVIEW_CONVEX_DEPLOY_KEY` variables. Keep `SAMEBASE_CONVEX_PROJECT` in production only. Existing
previews keep their saved build variables. Samebase key rotation updates existing preview keys.
After a manual Base-only key correction, use a new branch name; retrying or deleting the Worker
preview does not reset those variables. Prepare the code before the switch, then push after key
setup. Branch pushes start previews without a PR. Verify one preview build and sign-in, then
production after merge. Repeat the same preview build to check data and session persistence only if
the migration changes the starter's preview selection or auth logic.

Delete the obsolete deploy wrapper and its tests after updating callers. Remove
`deploy:preview:dry-run`, which native previews do not support. Local `build` must not deploy
Convex.

Update `ensure-convex-auth.ts` so preview auth reads and writes use the same
`--preview-name <branch>` as the build. Keep existing auth keys on repeated builds. Stop auth setup
if an environment read fails, so a read error cannot replace existing keys.

Source: [Worker Previews migration](https://samebase.com/docs/cloudflare-previews-migration).

## v1996: Upgrade Convex to 1.45.0

The starter now uses Convex 1.45.0. This release upgrades local deployments in place and adds
service-token generation for the upcoming Convex AI gateway.

Relevant when an app uses an older Convex client. Upgrade `convex` to `^1.45.0`. When the app uses
`convex-test`, upgrade it to 0.0.56 in the same change. Keep unrelated runtime, package manager,
test runner, and lint updates separate.

Run the app's normal checks and verify its preview deployment.

Source:
[samebase/base v1996](https://github.com/samebase/base/commit/166e1c9dd2357ceefd74e6311a48f1b30c4c0327)

## v1983: Use one public-page configuration

The root `prerender.config.ts` file defines the public pages for both TanStack Start and the
Cloudflare redirect generator. This prevents the two page lists from becoming different.

Relevant when the app defines prerendered pages separately in Vite and in a Cloudflare script.

Adapt the existing page definitions into one root configuration. Import it from `vite.config.ts` and
`scripts/generate-cloudflare-redirects.ts`. Preserve the app's routes and output paths. Keep
`/index.html` as the route-neutral SPA shell, and give the prerendered `/` page a different output
file.

Verify the generated redirects, build the app, and directly load each public route and one unknown
route.

Source:
[samebase/base v1983](https://github.com/samebase/base/commit/d22ed3dc279d05ffd91434ed7a5aad01b340df43)

## v1982: Make direct SPA routes hydrate correctly

An explicit TanStack Router catch-all route and canonical prerender redirects make the first client
render match the static SPA shell. This prevents React hydration error 418 on direct unknown URLs.

Relevant when Cloudflare SPA mode serves `/index.html` for unknown routes, or when generated HTML
file URLs can load as separate public URLs.

Add an explicit `src/routes/$.tsx` catch-all route. Redirect each generated HTML file URL to its
canonical route before the exact route-to-file aliases. Keep `/index.html` as the route-neutral SPA
shell. Regenerate the route tree and redirects instead of editing generated files.

Verify that the router matches an unknown path with `/$`. Directly load the canonical public routes
and one unknown route, and confirm that the browser console has no hydration error.

Source:
[samebase/base v1982](https://github.com/samebase/base/commit/7969b12686b42a009cfd70ca0e5af9e1a7ff122f)
