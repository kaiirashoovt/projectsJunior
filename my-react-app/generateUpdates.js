import fs from "fs";
import simpleGit from "simple-git";
import dayjs from "dayjs";

const git = simpleGit();

async function generateUpdates() {
  const logs = await git.log({ n: 20 });

  const grouped = {};
  logs.all.forEach(log => {
    const date = dayjs(log.date).format("YYYY-MM-DD");
    if (!grouped[date]) grouped[date] = [];
    grouped[date].push(log.message);
  });

  const updatesArray = Object.keys(grouped).map(date => ({
    date,
    version: "v" + dayjs(date).format("YY.MM.DD"),
    changes: grouped[date]
  }));

  const content = `export const updates = ${JSON.stringify(updatesArray, null, 2)};`;

  fs.writeFileSync("src/updates.jsx", content, "utf-8");
  console.log("✅ src/updates.jsx обновлён!");
}

generateUpdates();
