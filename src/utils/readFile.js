const fs = require("node:fs/promises");
const path = require("path");

const readDb = async (filename) => {
  let data = await fs.readFile(
    path.join(process.cwd(), "db", filename),
    "utf-8"
  );
  return JSON.parse(data);
};

module.exports = readDb;
