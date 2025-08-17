import fs from "fs";
import simpleGit from "simple-git";
import dayjs from "dayjs";

const git = simpleGit();
const updatesFile = "src/updates.jsx";
const versionFile = "version.json";

// Чтение текущей версии
function getCurrentVersion() {
  if (fs.existsSync(versionFile)) {
    const data = fs.readFileSync(versionFile, "utf-8");
    return JSON.parse(data).version;
  }
  return "0.0.0";
}

// Увеличение патч-версии
function incrementVersion(version) {
  const parts = version.split(".").map(Number);
  parts[2] += 1;
  return parts.join(".");
}

// Чтение существующих обновлений
function readExistingUpdates() {
  if (fs.existsSync(updatesFile)) {
    const raw = fs.readFileSync(updatesFile, "utf-8");
    const match = raw.match(/export const updates = (\[.*\]);/s);
    if (match) return JSON.parse(match[1]);
  }
  return [];
}

async function generateUpdates() {
  const logs = await git.log({ n: 20 });

  // Группируем по дате
  const grouped = {};
  logs.all.forEach(log => {
    const date = dayjs(log.date).format("YYYY-MM-DD");
    if (!grouped[date]) grouped[date] = [];
    grouped[date].push(log.message);
  });

  // Существующие обновления
  const existingUpdates = readExistingUpdates();
  let currentVersion = getCurrentVersion();

  // Создаём новые обновления
  const newUpdates = Object.keys(grouped).map(date => {
    currentVersion = incrementVersion(currentVersion);
    return {
      date,
      version: currentVersion,
      changes: grouped[date]
    };
  });

  // Объединяем все версии
  const allUpdates = [...existingUpdates, ...newUpdates];

  // Записываем файл JSX
  const content = `export const updates = ${JSON.stringify(allUpdates, null, 2)};`;
  fs.writeFileSync(updatesFile, content, "utf-8");
  console.log("✅ Файл src/updates.jsx обновлён!");

  // Обновляем version.json
  fs.writeFileSync(versionFile, JSON.stringify({ version: currentVersion }, null, 2), "utf-8");
  console.log(`🔖 Текущая версия: ${currentVersion}`);
}

generateUpdates();
