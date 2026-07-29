# Samebase Agent Plugins

Samebase integrations for ChatGPT, Codex, and Claude Code.

This repository is generated from the private Samebase monorepo and published only after its CI
checks pass. Do not edit this generated repository directly. Use
[GitHub Issues](https://github.com/samebase/agent-plugins/issues) to request a change or report a
problem.

This repository packages the Samebase MCP server and one workflow skill for coding agents. The goal
is to make the complete GitHub-backed app loop clear:

1. Create or select a Samebase app through MCP.
2. Open or clone the app's GitHub repository locally.
3. Run the app's setup and code generation steps before backend changes.
4. Make changes with the local coding agent.
5. Validate the exact source that will ship.
6. Commit and push through the repository's Git workflow when the user wants to publish.
7. Observe the resulting provider state before reporting a live deployment.

The plugin does not turn chat into a hosted development environment. Samebase provides the app
inventory, repository and provider wiring, and MCP tools. The coding agent works in the user's local
GitHub repository, and Git commits remain the version identity.

The `samebase` skill covers the complete journey. It selects or creates the app, preserves its
provider identity, guides work in the GitHub repository, and verifies deployment state after an
authorized publish.

The live MCP action catalog and [samebase.com/llms.txt](https://samebase.com/llms.txt) are the
product source of truth. The plugin carries workflow and routing guidance instead of copying every
action contract.

## First Use

The plugin installs one MCP server named `samebase`. Do not add `https://api.samebase.com/mcp` as a
second manual MCP server.

After installation or an update, start a new chat or CLI session and ask:

```text
Use Samebase to list my apps.
```

Authenticate when the client prompts for access. If authentication appears under more than one
Samebase server, remove the manual connection and keep the server supplied by this plugin.

## ChatGPT and Codex

Samebase is being prepared for the public Plugins Directory shared by ChatGPT and Codex. When the
listing is available, install Samebase from **Plugins** in ChatGPT Work or Codex, then start a new
chat.

For direct Codex installation from this repository, add the marketplace:

```bash
codex plugin marketplace add samebase/agent-plugins
```

Install the plugin:

```bash
codex plugin add samebase@samebase
```

Update an existing direct install after a new release:

```bash
codex plugin marketplace upgrade samebase
codex plugin add samebase@samebase
```

Start a new Codex task after installing so the plugin skills and MCP server are loaded.

## Claude Code

Add the marketplace:

```text
/plugin marketplace add samebase/agent-plugins
```

Install the plugin:

```text
/plugin install samebase@samebase
/reload-plugins
```

Update an existing install after a new release:

```text
/plugin marketplace update samebase
/plugin update samebase@samebase
/reload-plugins
```

Authenticate the Samebase MCP server from Claude Code's MCP UI if prompted:

```text
/mcp
```

During plugin development, test the local plugin directly:

```bash
claude --plugin-dir ./plugins/samebase
```

## Repository Layout

```text
.claude-plugin/marketplace.json       Claude Code marketplace catalog
.agents/plugins/marketplace.json      Codex marketplace catalog
package.json                          Package metadata and check command
plugins/samebase/                     Shared Claude Code and Codex plugin
```

Both marketplaces install the same plugin directory. Platform-specific manifests share one MCP
declaration, icon, and skill tree, so the workflow cannot drift between Codex and Claude Code.
Validate the complete package with:

```bash
node ./scripts/check.ts
```

## Support and Security

Use [GitHub Issues](https://github.com/samebase/agent-plugins/issues) for support and non-sensitive
bug reports. Follow [SECURITY.md](SECURITY.md) for private vulnerability reports.

This repository is licensed under the [Apache License 2.0](LICENSE).
