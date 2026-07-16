import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const pluginRoot = resolve(root, "plugins/samebase");

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function check(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function checkRelativePath(pluginRoot, relativePath, label) {
  check(typeof relativePath === "string", `${label} must be a relative path.`);
  check(
    existsSync(resolve(pluginRoot, relativePath)),
    `${label} does not resolve: ${relativePath}`,
  );
}

const codexManifest = readJson(resolve(pluginRoot, ".codex-plugin/plugin.json"));
const claudeManifest = readJson(resolve(pluginRoot, ".claude-plugin/plugin.json"));
const codexMarketplace = readJson(resolve(root, ".agents/plugins/marketplace.json"));
const claudeMarketplace = readJson(resolve(root, ".claude-plugin/marketplace.json"));
const mcp = readJson(resolve(pluginRoot, ".mcp.json"));

check(codexManifest.version === claudeManifest.version, "Codex and Claude versions must match.");
check(
  claudeMarketplace.plugins[0]?.version === claudeManifest.version,
  "The Claude marketplace version must match the plugin manifests.",
);
check(mcp.mcpServers?.samebase?.url === "https://api.samebase.com/mcp", "Unexpected MCP endpoint.");

const codexMarketplaceSource = codexMarketplace.plugins[0]?.source;
check(codexMarketplaceSource?.source === "local", "The Codex marketplace source must be local.");
checkRelativePath(root, codexMarketplaceSource.path, "Codex marketplace source");
checkRelativePath(root, claudeMarketplace.plugins[0]?.source, "Claude marketplace source");
check(
  resolve(root, codexMarketplaceSource.path) === pluginRoot,
  "The Codex marketplace must install the shared plugin directory.",
);
check(
  resolve(root, claudeMarketplace.plugins[0]?.source) === pluginRoot,
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
