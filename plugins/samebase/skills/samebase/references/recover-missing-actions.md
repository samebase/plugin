# Recover missing Samebase actions

Read this only when a required Samebase action is absent.

- An absent action means that the current client did not register it. It does not prove that
  authorization is missing. Start authorization only after a callable Samebase action or connection
  reports an authorization or scope error.
- Use only the current client's plugin controls. Never use another client's plugin state or the
  public Samebase site.
- In Codex, use Plugins if the CLI is unavailable. Refresh the Samebase marketplace. Read the latest
  available version and the direct entry's installed state and version. If the user says that repair
  for this version already completed and the action is still absent, report that the plugin did not
  register and stop. Otherwise, install or enable `samebase@samebase` if it is absent or disabled,
  update it if it is older, or reinstall only that entry if the versions match. Complete install
  OAuth. Before restart, tell the user to state the repaired version in the new task.
- In Claude Code, update `samebase@samebase` and reload plugins. If the action is still absent,
  report that the plugin did not register and stop.
- In ChatGPT, stop if the user says that update or reconnection already completed in this new chat
  and the action is still absent. Otherwise, update or reconnect Samebase in ChatGPT Plugins. Tell
  the user to state in the new chat that repair completed. Do not use Codex plugin state or
  controls.
