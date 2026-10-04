# Samebase

Samebase gives a coding agent one MCP server for repository-backed web apps: a GitHub repository, a
Cloudflare Worker, and a Convex project, set up and kept in sync by Samebase. The plugin bundles
that server and one skill that tells the agent when to use Samebase and when to ask before it
changes a provider account.

## What the agent can do

- Read: list the account's repositories, read the live status of one repository (production URL,
  latest build, Convex deployment, checks, open pull requests), find Convex projects and Cloudflare
  Workers that can be attached, and check authentication.
- Create and connect: create a repository from the Samebase starter template, connect an existing
  repository, create or attach a Convex project, create or attach a Worker, and configure Workers
  Builds.
- Repair: retry provider setup, rotate Convex deploy keys, and detach a resource. Each of these, and
  connecting a Worker, changes nothing on the first call. The server returns the effect and a
  one-use confirmation token, and the action runs only when the agent calls again with the user's
  approval.

All reads and writes stay inside the GitHub, Cloudflare, and Convex accounts that the user connected
to Samebase.

## Install

Claude Code:

```text
/plugin marketplace add samebase/plugin
/plugin install samebase@samebase
```

Codex:

```bash
codex plugin marketplace add samebase/plugin
codex plugin add samebase@samebase
```

The plugin installs one MCP server named `samebase` at `https://api.samebase.com/mcp`. Authorize it
when the client asks. Sign-in uses the Samebase account at [samebase.com](https://samebase.com). Do
not add the URL as a second manual server.

## Links

- Tool reference: [samebase.com/llms.txt](https://samebase.com/llms.txt)
- Privacy policy: [samebase.com/privacy](https://samebase.com/privacy)
- Terms: [samebase.com/terms](https://samebase.com/terms)
- Support: [GitHub Issues](https://github.com/samebase/plugin/issues)

Apache License 2.0.
