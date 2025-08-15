// generateUpdates.js
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const outputFile = path.join(__dirname, "src", "updates.jsx");

// Берём последние 20 коммитов
const log = execSync(
  `git log -n 20 --pretty=format:"%ad||%h||%s" --date=short`,
  { encoding: "utf8" }
);

const releases = log.split("\n").map(line => {
  const [date, hash, message] = line.split("||");
  return {
    date,
    version: hash,
    changes: [message]
  };
});

const fileContent = `// Автогенерируемый файл с обновлениями
export const updates = ${JSON.stringify(releases, null, 2)};
`;

fs.writeFileSync(outputFile, fileContent, "utf8");

console.log(`✅ Файл обновлений создан: ${outputFile}`);
