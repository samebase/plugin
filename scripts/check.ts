import { existsSync, readFileSync, readdirSync } from "node:fs";
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
const repositoryUrl = "https://github.com/samebase/plugin";

check(packageMetadata.name === "samebase-plugin", "Unexpected package name.");
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
check(codexManifest.repository === repositoryUrl, "Unexpected Codex repository URL.");
check(claudeManifest.repository === repositoryUrl, "Unexpected Claude repository URL.");
check(
  claudeMarketplacePlugin.repository === repositoryUrl,
  "Unexpected Claude marketplace repository URL.",
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
checkRelativePath(
  skillsRoot,
  "samebase/references/existing-repository-adoption.md",
  "Existing repository adoption reference",
);

const samebaseSkill = readFileSync(resolve(skillsRoot, "samebase/SKILL.md"), "utf8").replace(
  /\s+/g,
  " ",
);
check(
  samebaseSkill.includes("[samebase/app](https://github.com/samebase/app)") &&
    samebaseSkill.includes("canonical minimal reference for a Samebase-ready repository"),
  "The Samebase skill must use the public app as its canonical stack-alignment reference.",
);
for (const requiredToolchainGroup of [
  "runtime",
  "package manager",
  "command surface",
  "lint and format rules",
  "tests",
  "type checks",
  "framework and deploy adapters",
  "shared version pins",
]) {
  check(
    samebaseSkill.includes(requiredToolchainGroup),
    `The Samebase skill stack-alignment contract must include ${requiredToolchainGroup}.`,
  );
}
check(
  samebaseSkill.includes(
    "Classify each difference as alignment, a proven target constraint, an investigation, or one tested exception.",
  ),
  "The Samebase skill must classify every toolchain difference before implementation.",
);
check(
  samebaseSkill.includes(
    "Keep validation proportionate to the project and the migration risk. Discuss material cost and coverage tradeoffs with the operator.",
  ) && samebaseSkill.includes("Do not turn Samebase adoption into an unrelated testing upgrade."),
  "The Samebase skill must keep validation proportionate and operator-informed.",
);
check(
  samebaseSkill.includes(
    "Before a write sequence that can start or request a production build, name that effect and get explicit approval.",
  ) &&
    samebaseSkill.includes(
      "One approval can cover the named sequence when the repository, provider account, possible production effect, and rule for attaching an existing resource or creating a new one are clear.",
    ) &&
    samebaseSkill.includes("Ask again if one of those facts or the approved scope changes."),
  "The Samebase skill must require informed approval for a production-build sequence.",
);
check(
  samebaseSkill.includes(
    "Connect an existing GitHub repository at the start of adoption when it is not in Samebase.",
  ) &&
    samebaseSkill.includes(
      "Prepare the repository before provider setup that can start a production build by default.",
    ) &&
    samebaseSkill.includes(
      "An operator may approve earlier provider setup for an experimental app and accept a failed build as diagnostic evidence.",
    ),
  "The Samebase skill must connect an existing repository early and keep provider timing operator-owned.",
);
const scopeGateIndex = samebaseSkill.indexOf(
  "Do not use Samebase for unrelated Git work or standalone provider resources. A standalone Cloudflare Worker means no Samebase.",
);
const positiveRouteIndex = samebaseSkill.indexOf(
  "For an app-inventory request, call only the Samebase app inventory.",
);
check(scopeGateIndex >= 0, "The Samebase skill must exclude unrelated and standalone work.");
check(
  positiveRouteIndex >= 0 && scopeGateIndex < positiveRouteIndex,
  "The Samebase skill exclusions must precede its positive action routes.",
);
check(
  samebaseSkill.includes(
    "The complete sequence contains only inventory, create, and inventory polls. Call create directly after inventory. Do not list Cloudflare accounts first. Create has no `accountId` and uses the connected Cloudflare provider.",
  ),
  "The Samebase skill must keep managed app creation on its closed tool sequence.",
);
const openSamebaseIndex = samebaseSkill.indexOf(
  "Treat `open @samebase` as an exact command and an explicit choice of the in-app Browser.",
);
const selectInAppBrowserIndex = samebaseSkill.indexOf(
  "Select the in-app Browser. Do not select Chrome or a different external browser.",
);
const createBrowserHandoffIndex = samebaseSkill.indexOf("Call `create_browser_handoff`.");
const openHandoffUrlIndex = samebaseSkill.indexOf(
  "Open the returned URL promptly in the selected in-app Browser.",
);
check(
  openSamebaseIndex >= 0 &&
    samebaseSkill.includes(
      "The user does not have to say `dashboard` or mention the Browser plugin.",
    ) &&
    selectInAppBrowserIndex > openSamebaseIndex &&
    createBrowserHandoffIndex > selectInAppBrowserIndex &&
    openHandoffUrlIndex > createBrowserHandoffIndex,
  "The Samebase skill must make `open @samebase` select the in-app Browser before it creates and " +
    "opens an authenticated handoff.",
);

console.log("Agent plugin checks passed.");
