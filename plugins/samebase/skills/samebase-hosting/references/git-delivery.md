# Samebase Git delivery

Samebase delivery keeps one source and version chain:

```text
local working tree
  -> Git commit SHA
  -> GitHub branch or pull request
  -> Workers Build and Convex deployment
  -> preview or production URL
```

A branch or pull request commit is a review candidate. A default-branch commit is a production
candidate. Neither is a successful deployment until the relevant provider reports a terminal success
state.

Validate before committing, and rerun validation when the source changes afterward. Push the exact
commit that was validated. Observe the build associated with that commit so an older green build is
not mistaken for the new release.

Samebase inventory can prove provider attachment and expose direct provider coordinates. It does not
automatically prove that every push completed successfully. Use provider-native build and deployment
state when Samebase has no commit-scoped terminal read.
