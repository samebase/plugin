# Samebase plugin

Samebase connects ChatGPT, Codex, and Claude Code to repository-backed apps managed by Samebase. The
plugin includes the Samebase MCP server and one skill that tells the client when to use Samebase and
when to ask before a provider change.

This repository is generated. Do not edit it directly. Use
[GitHub Issues](https://github.com/samebase/plugin/issues) to request a change or report a problem.

## Authorize Samebase

The plugin installs one MCP server named `samebase`. Authorize it when the client asks for access.
Do not add `https://api.samebase.com/mcp` as a second manual server.

`open @samebase` works only after Samebase is authorized. If authorization is missing, the agent
should explain the requirement and ask, "Would you like me to start authorization with Samebase?"
After authorization finishes, the agent creates a secure browser handoff and opens the Samebase
dashboard in the in-app Browser.

Start a new chat or task after installation or an update. To confirm the connection, ask:

```text
Use Samebase to list my apps.
```

## Install with ChatGPT or Codex

Install Samebase from **Plugins** when it appears in your ChatGPT Work or Codex catalog.

For direct Codex installation, add this repository as a marketplace:

```bash
codex plugin marketplace add samebase/plugin
codex plugin add samebase@samebase
```

Update a direct installation with:

```bash
codex plugin marketplace upgrade samebase
codex plugin add samebase@samebase
```

## Install with Claude Code

Add the marketplace and install the plugin:

```text
/plugin marketplace add samebase/plugin
/plugin install samebase@samebase
/reload-plugins
```

Update it with:

```text
/plugin marketplace update samebase
/plugin update samebase@samebase
/reload-plugins
```

Use `/mcp` to authorize Samebase when Claude Code asks for access.

## Support and security

Use [GitHub Issues](https://github.com/samebase/plugin/issues) for support and non-sensitive bugs.
Follow [SECURITY.md](SECURITY.md) for private vulnerability reports.

This repository uses the [Apache License 2.0](LICENSE).
