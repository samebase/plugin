import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import codexMarketplace from "../.agents/plugins/marketplace.json" with { type: "json" };
import claudeMarketplace from "../.claude-plugin/marketplace.json" with { type: "json" };
import packageMetadata from "../package.json" with { type: "json" };
import claudeManifest from "../plugins/samebase/.claude-plugin/plugin.json" with {
  type: "json",
};
import codexManifest from "../plugins/samebase/.codex-plugin/plugin.json" with {
  type: "json",
};
import mcp from "../plugins/samebase/.mcp.json" with { type: "json" };

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const pluginRoot = resolve(root, "plugins/samebase");

function check(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function checkRelativePath(
  baseRoot: string,
  relativePath: unknown,
  label: string,
): asserts relativePath is string {
  check(typeof relativePath === "string", `${label} must be a relative path.`);
  check(
    existsSync(resolve(baseRoot, relativePath)),
    `${label} does not resolve: ${relativePath}`,
  );
}

check(
  packageMetadata.version === codexManifest.version,
  "The package version must match the Codex manifest.",
);
check(
  packageMetadata.version === claudeManifest.version,
  "The package version must match the Claude manifest.",
);
check(
  packageMetadata.version === claudeMarketplace.plugins[0]?.version,
  "The package version must match the Claude marketplace.",
);
check(
  codexManifest.version === claudeManifest.version,
  "Codex and Claude versions must match.",
);
check(
  claudeMarketplace.plugins[0]?.version === claudeManifest.version,
  "The Claude marketplace version must match the plugin manifests.",
);
check(
  mcp.mcpServers?.samebase?.url === "https://api.samebase.com/mcp",
  "Unexpected MCP endpoint.",
);

const codexMarketplaceSource = codexMarketplace.plugins[0]?.source;
check(
  codexMarketplaceSource?.source === "local",
  "The Codex marketplace source must be local.",
);
checkRelativePath(root, codexMarketplaceSource.path, "Codex marketplace source");
checkRelativePath(
  root,
  claudeMarketplace.plugins[0]?.source,
  "Claude marketplace source",
);
check(
  resolve(root, codexMarketplaceSource.path) === pluginRoot,
  "The Codex marketplace must install the shared plugin directory.",
);
check(
  resolve(root, claudeMarketplace.plugins[0].source) === pluginRoot,
  "The Claude marketplace must install the shared plugin directory.",
);
checkRelativePath(pluginRoot, codexManifest.skills, "Codex skills path");
checkRelativePath(pluginRoot, codexManifest.mcpServers, "Codex MCP path");
checkRelativePath(pluginRoot, claudeManifest.skills, "Claude skills path");
checkRelativePath(pluginRoot, claudeManifest.mcpServers, "Claude MCP path");

const sharedSkillFiles = [
  "samebase-building/SKILL.md",
  "samebase-building/references/control-plane.md",
  "samebase-building/references/local-repository.md",
  "samebase-hosting/SKILL.md",
  "samebase-hosting/references/git-delivery.md",
  "samebase-hosting/references/provider-boundaries.md",
];

for (const relativePath of sharedSkillFiles) {
  check(
    existsSync(resolve(pluginRoot, "skills", relativePath)),
    `Missing skill file: ${relativePath}`,
  );
}

console.log("Agent plugin checks passed.");
