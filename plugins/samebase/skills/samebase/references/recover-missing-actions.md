# Recover missing Samebase actions

Read this only when a required Samebase action is absent.

- An absent action means that the current client did not register it. Use only the controls of the
  current client. Do not send the user to another client or to the public Samebase site.
- If the user says that the repair below already completed and the action is still absent, report
  that the client did not register the action and stop.
- Otherwise, tell the user to refresh or reconnect the Samebase connection in the current client,
  then start a new task or chat so that the client loads the actions again.
- If the action is still absent after the refresh, tell the user to re-authorize Samebase in the
  current client, so that the connection grants the scopes of the missing action. Tell the user to
  say in the new task or chat that the repair completed.
