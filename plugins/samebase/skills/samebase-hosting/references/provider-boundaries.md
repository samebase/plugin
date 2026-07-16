# Samebase provider boundaries

Samebase MCP handles operations that join providers, keep the app registry truthful, or encode a
known repair workflow. Routine operations inside one user-owned provider remain provider-direct.

Start with the app inventory to obtain coordinates, then use the provider's current tool or CLI:

- Production logs:
  [samebase.com/docs/operate/production-logs.md](https://samebase.com/docs/operate/production-logs.md)
- Custom domains:
  [samebase.com/docs/operate/custom-domain.md](https://samebase.com/docs/operate/custom-domain.md)
- Environment values: use Convex or Cloudflare directly for the selected deployment or Worker.
- Data migrations and backups: use Convex directly from the app repository and selected deployment.
- Git branches, commits, pull requests, and checks: use Git and GitHub directly.

Do not imply that Samebase performed a provider-direct operation. Samebase's job in these flows is
to identify the correct app and hand over exact provider coordinates.
