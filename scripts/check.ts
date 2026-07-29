import { existsSync, readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import codexMarketplace from "../.agents/plugins/marketplace.json" with { type: "json" };
import claudeMarketplace from "../.claude-plugin/marketplace.json" with { type: "json" };
import packageMetadata from "../package.json" with { type: "json" };
import claudeManifest from "../plugins/samebase/.claude-plugin/plugin.json" with { type: "json" };
import codexManifest from "../plugins/samebase/.codex-plugin/plugin.json" with { type: "json" };
import mcp from "../plugins/samebase/.mcp.json" with { type: "json" };

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const pluginRoot = resolve(root, "plugins/samebase");

function check(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

function checkRelativePath(baseRoot: string, relativePath: string, label: string): void {
  check(existsSync(resolve(baseRoot, relativePath)), `${label} does not resolve: ${relativePath}`);
}

const codexMarketplacePlugin = codexMarketplace.plugins[0];
const claudeMarketplacePlugin = claudeMarketplace.plugins[0];

check(
  packageMetadata.version === codexManifest.version,
  "The package version must match the Codex manifest.",
);
check(
  packageMetadata.version === claudeManifest.version,
  "The package version must match the Claude manifest.",
);
check(codexManifest.version === claudeManifest.version, "Codex and Claude versions must match.");
check(packageMetadata.license === "Apache-2.0", "The package must declare the Apache-2.0 license.");
check(
  codexManifest.license === packageMetadata.license,
  "The Codex manifest license must match the package.",
);
check(mcp.mcpServers.samebase.url === "https://api.samebase.com/mcp", "Unexpected MCP endpoint.");
checkRelativePath(root, "LICENSE", "License");
checkRelativePath(root, "NOTICE", "License notice");
checkRelativePath(root, "SECURITY.md", "Security policy");

const codexMarketplaceSource = codexMarketplacePlugin.source;
check(codexMarketplaceSource.source === "local", "The Codex marketplace source must be local.");
checkRelativePath(root, codexMarketplaceSource.path, "Codex marketplace source");
checkRelativePath(root, claudeMarketplacePlugin.source, "Claude marketplace source");
check(
  resolve(root, codexMarketplaceSource.path) === pluginRoot,
  "The Codex marketplace must install the shared plugin directory.",
);
check(
  resolve(root, claudeMarketplacePlugin.source) === pluginRoot,
  "The Claude marketplace must install the shared plugin directory.",
);
checkRelativePath(pluginRoot, codexManifest.skills, "Codex skills path");
checkRelativePath(pluginRoot, codexManifest.mcpServers, "Codex MCP path");
checkRelativePath(pluginRoot, claudeManifest.skills, "Claude skills path");
checkRelativePath(pluginRoot, claudeManifest.mcpServers, "Claude MCP path");

const skillsRoot = resolve(pluginRoot, "skills");
const skillDirectories = readdirSync(skillsRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);

check(
  skillDirectories.length === 1 && skillDirectories[0] === "samebase",
  "The plugin must contain only the samebase skill.",
);
checkRelativePath(skillsRoot, "samebase/SKILL.md", "Samebase skill");

console.log("Agent plugin checks passed.");
