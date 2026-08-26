# Samebase plugin

Samebase connects ChatGPT, Codex, and Claude Code to repository-backed apps managed by Samebase. The
plugin includes the Samebase MCP server and one skill that tells the client when to use Samebase and
when to ask before a provider change.

This repository is generated. Do not edit it directly. Use
[GitHub Issues](https://github.com/samebase/plugin/issues) to request a change or report a problem.

## Authorize Samebase

The plugin installs one MCP server named `samebase`. Authorize it when the client asks for access.
Do not add `https://api.samebase.com/mcp` as a second manual server.

`open @samebase` works only after Samebase is authorized. The agent opens the dashboard only with a
one-time URL returned by the Samebase browser-handoff action. The public Samebase site is not an
authorization or dashboard fallback.

If a requested Samebase action is absent, including when no Samebase actions appear, use the
recovery controls for the current client. A missing action does not prove that authorization failed.
Start authorization only when a callable connection or action reports an authorization or scope
error. Do not open the public Samebase site as a fallback.

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

If a requested action is absent, use Codex Plugins if the CLI is unavailable. Refresh the
marketplace. Read the latest available version and the direct entry's installed state and version.
If the user states in a new task that this version was already repaired, report that the plugin did
not register and stop. Otherwise, install or enable `samebase@samebase` if it is absent or disabled,
update it if it is older, or reinstall only that entry if the versions match. Complete the OAuth
flow started by installation. Before restart, tell the user to state the repaired version in the new
task.

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

If a requested action is absent, inspect the local entry with `/plugin`, then run the marketplace
update, plugin update, and reload commands above. Use `/mcp` only when the connection reports an
authorization error. If actions remain absent after reload, report that the MCP connection did not
register and stop. Do not use Codex plugin state or controls.

## Support and security

Use [GitHub Issues](https://github.com/samebase/plugin/issues) for support and non-sensitive bugs.
Follow [SECURITY.md](SECURITY.md) for private vulnerability reports.

This repository uses the [Apache License 2.0](LICENSE).
