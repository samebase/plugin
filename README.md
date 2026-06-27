# Samebase Agent Plugins

Local agent integrations for Samebase.

This repository packages the Samebase MCP server and a small workflow skill for coding agents. The goal is to make the local development loop clear:

1. Create or select a Samebase app through MCP.
2. Open or clone the app's GitHub repository locally.
3. Run the app's setup and code generation steps before backend changes.
4. Make changes with the local coding agent.
5. Validate, commit, and push through Git.

The plugin does not try to turn chat into a hosted development environment. Samebase provides the app, repository, deployment target, and MCP tools; the coding agent works in the local repository.

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

Start a new Codex thread after installing so the plugin skill and MCP server are loaded.

## Repository Layout

```text
.claude-plugin/marketplace.json       Claude Code marketplace catalog
plugins/samebase/                     Claude Code plugin
.agents/plugins/marketplace.json      Codex marketplace catalog
codex/plugins/samebase/               Codex plugin
```

The two plugin packages intentionally duplicate a small amount of text. That keeps this first version easy to inspect and avoids a build step until there is enough shared content to justify one.

