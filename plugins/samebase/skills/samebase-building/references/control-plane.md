# Samebase control plane

Samebase MCP owns app inventory and the operations that join GitHub, Convex, and Cloudflare. The
live tool list is the source of truth for exact names, arguments, safety annotations, and results.
The generated catalog at [samebase.com/llms.txt](https://samebase.com/llms.txt) links every action
contract.

Use the catalog in this order:

1. Read authentication state when access is uncertain.
2. Read the app inventory to select an existing app and inspect provider state.
3. Create a new repository-backed app, or connect an existing GitHub repository.
4. For a connected repository, list and attach existing Convex and Cloudflare resources only when
   the user wants them attached.
5. Wire Workers Builds and Convex build access when the app state requests those joins.
6. Verify recorded infrastructure when provider state may have drifted.
7. Retry managed provisioning only for a failed managed provisioning run.

An inventory `nextAction` is an action ID, while the callable MCP tool can have a namespaced tool
name. Match the action ID to its linked action contract and live tool description. Do not transform
the string mechanically or call the first tool with a similar name.

Reuse opaque IDs returned by tools. Names and URLs are for humans; exact IDs preserve continuity
across asynchronous runs and similarly named resources.
