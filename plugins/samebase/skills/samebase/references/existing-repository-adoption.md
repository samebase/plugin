# Existing Repository Adoption

Connect an existing repository to Samebase before provider setup. The connection creates the
Samebase app record and syncs the repository tree. It does not attach or change Convex or Cloudflare
resources. Samebase can therefore represent the app while source and provider work stay separate.

## Recommended Order

Use this order by default:

1. Read the Samebase app inventory and connect the repository when it is not present.
2. Read the repository instructions and deployment commands from its current default branch.
3. Prepare and validate the required source changes in a pull request.
4. Before provider setup, name the exact provider account, the resources to attach or create, and
   any production build that the action can start.
5. After operator approval, attach or create the provider resources and verify their live state.
6. After the reviewed source reaches the default branch, verify production and a reachable pull
   request preview separately.

This order avoids an automatic provider build against source that is not ready. It is suitable for
an important app or an app that already serves traffic.

## Earlier Provider Setup

The operator can choose earlier provider setup for a small or experimental app. Connect the
repository first, then explain the exact effect and get approval before the provider write.

Creating a Worker through Samebase also configures its production and preview GitHub Builds triggers
and requests the first production build. That build can fail because the unchanged default branch
does not yet contain the required deployment contract. Use the failure and its provider logs as
diagnostic evidence while preparing the source pull request. Do not report it as a deployment.

Keep an existing live route or known-good Worker version available until the new production path is
verified.

## First-Deployment Preview Observation

During one adoption of an assets-only 3D browser game, a new Worker uploaded a preview version
before it had an active deployment. Its version URL and branch alias returned Cloudflare error 1042.
After an approved default-branch build created the first active deployment, the old preview URLs and
a new pull request preview became reachable. The new preview did not replace the production version.

This is one project observation, not a general Cloudflare requirement. When the same state appears:

1. Keep preview verification blocked while its URL is not reachable.
2. Do not start a production deployment only to repair the preview without explicit approval.
3. After the approved first production deployment, check the old preview and create a fresh preview.
4. Verify that the fresh preview is reachable and that the active production version did not change.
