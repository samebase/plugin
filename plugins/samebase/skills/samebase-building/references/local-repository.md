# Samebase local repository

The user's GitHub repository is the source of truth. Samebase does not provide a second editable
source tree, archive format, or synthetic version number.

When entering a checkout:

1. Read its agent instructions and README.
2. Identify its package manager from the committed lockfile.
3. Use its setup and development scripts. A generated Samebase app normally documents the complete
   local flow in the repository, and those instructions override plugin examples.
4. Run backend code generation before relying on generated Convex bindings.
5. Preserve user changes and avoid broad rewrites that are unrelated to the request.
6. Validate the final working tree with the repository's own checks.

The standard Samebase stack is documented at
[samebase.com/docs/the-stack.md](https://samebase.com/docs/the-stack.md). For authentication,
persistence, or framework work, use the instructions and current official references already
installed in the app repository rather than copying setup recipes into this plugin.
