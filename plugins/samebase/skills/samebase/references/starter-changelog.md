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
