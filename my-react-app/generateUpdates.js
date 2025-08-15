// generateUpdates.js
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const filePath = path.join(__dirname, "src", "updates.jsx");

// Получаем историю коммитов
const log = execSync(
  `git log --pretty=format:"%h||%s||%ad" --date=short`,
  { encoding: "utf8" }
);

// Парсим коммиты
const commits = log.split("\n").map(line => {
  const [hash, message, date] = line.split("||");
  return { hash, message, date };
});

// Читаем старый файл, чтобы узнать последнюю версию
let lastVersion = "v0.0.0";
if (fs.existsSync(filePath)) {
  const oldFile = fs.readFileSync(filePath, "utf8");
  const match = oldFile.match(/version:\s*"v(\d+)\.(\d+)\.(\d+)"/);
  if (match) {
    lastVersion = `v${match[1]}.${match[2]}.${match[3]}`;
  }
}

// Функция для увеличения патча
function bumpVersion(version) {
  const [major, minor, patch] = version.slice(1).split(".").map(Number);
  return `v${major}.${minor}.${patch + 1}`;
}

// Создаём новый массив обновлений
const releases = commits.map((c, i) => ({
  date: c.date,
  version: i === 0 ? bumpVersion(lastVersion) : lastVersion, // первый коммит увеличивает версию
  changes: [c.message]
}));

// Записываем файл
const content = `// Автогенерируемый файл с обновлениями
export const updates = ${JSON.stringify(releases, null, 2)};
`;

fs.writeFileSync(filePath, content, "utf8");
console.log(`✅ Файл обновлений обновлён: ${filePath}`);
