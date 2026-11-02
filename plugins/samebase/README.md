# Samebase

Samebase starts web apps and monitors them: a GitHub repository whose GitHub Actions deploy it with
Alchemy. The plugin bundles the Samebase MCP server and one skill that tells the agent when to use
Samebase. Repair lives in Alchemy and the agent, not in Samebase.

## What the agent can do

- Read: list the account's repositories, read the live status of one repository (stacks, production
  and preview URLs, deployed commit, checks, open pull requests), and check authentication.
- Create and connect: create a repository from the Samebase starter template, and connect an
  existing repository.
- Retry: start a failed setup again. This changes nothing on the first call. The server returns the
  effect and a one-use confirmation token, and the action runs only when the agent calls again with
  the user's approval.

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

The plugin installs one MCP server named `samebase` at `https://samebase.com/mcp`. Authorize it when
the client asks. Sign-in uses the Samebase account at [samebase.com](https://samebase.com). Do not
add the URL as a second manual server.

## Links

- Tool reference: [samebase.com/llms.txt](https://samebase.com/llms.txt)
- Privacy policy: [samebase.com/privacy](https://samebase.com/privacy)
- Terms: [samebase.com/terms](https://samebase.com/terms)
- Support: [GitHub Issues](https://github.com/samebase/plugin/issues)

Apache License 2.0.
