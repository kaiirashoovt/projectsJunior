// generateUpdates.cjs
const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "src/updates.jsx");

const updates = [
  {
    date: new Date().toISOString().slice(0, 10),
    version: "v1.0.0",
    changes: [process.argv[2] || "Изменения"]
  }
];

const content = `export const updates = ${JSON.stringify(updates, null, 2)};`;

fs.writeFileSync(filePath, content);
console.log("✅ src/updates.jsx обновлён");
