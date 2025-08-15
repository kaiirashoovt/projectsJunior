import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const commitMessage = process.argv[2] || "Изменения";

const filePath = path.join(process.cwd(), "src", "updates.jsx");

let releases = [];
if (fs.existsSync(filePath)) {
  const oldFile = fs.readFileSync(filePath, "utf8");
  const match = oldFile.match(/export const updates = (.+);/s);
  if (match) releases = JSON.parse(match[1]);
}

const lastVersion = releases[0]?.version || "v1.0.0";
const [major, minor, patch] = lastVersion.slice(1).split(".").map(Number);
const newVersion = `v${major}.${minor}.${patch + 1}`;

const today = new Date().toISOString().split("T")[0];
releases.unshift({
  date: today,
  version: newVersion,
  changes: [commitMessage],
});

fs.writeFileSync(
  filePath,
  `export const updates = ${JSON.stringify(releases, null, 2)};`,
  "utf8"
);

console.log("✅ updates.jsx обновлён");
