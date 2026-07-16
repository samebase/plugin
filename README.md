# Samebase Agent Plugins

Local agent integrations for Samebase.

This repository packages the Samebase MCP server and two workflow skills for coding agents. The goal
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

The two skills divide the journey by responsibility:

- `samebase-building` creates, connects, or inspects the app, then implements and validates changes
  in the local repository.
- `samebase-hosting` ships the exact validated source through Git, observes deployment state, and
  hands provider-direct operations to the correct provider.

The live MCP action catalog and [samebase.com/llms.txt](https://samebase.com/llms.txt) are the
product source of truth. The plugin carries workflow and routing guidance instead of copying every
action contract.

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
/plugin marketplace update
/plugin install samebase@samebase
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

## Codex

Add the marketplace:

```bash
codex plugin marketplace add samebase/agent-plugins
```

Install the plugin:

```bash
codex plugin add samebase@samebase
```

Update an existing install after a new release:

```bash
codex plugin marketplace upgrade samebase
codex plugin add samebase@samebase
```

Start a new Codex thread after installing so the plugin skill and MCP server are loaded.

## Repository Layout

```text
.claude-plugin/marketplace.json       Claude Code marketplace catalog
.agents/plugins/marketplace.json      Codex marketplace catalog
plugins/samebase/                     Shared Claude Code and Codex plugin
```

Both marketplaces install the same plugin directory. Platform-specific manifests share one MCP
declaration, icon, and skill tree, so the workflow cannot drift between Codex and Claude Code.
Validate the complete package with:

```bash
node scripts/check.mjs
```
