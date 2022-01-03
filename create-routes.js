const fs = require("fs");
const path = require("path");

const routes = ["farm", "auctions", "stealing"];
const dist = path.join(__dirname, "dist");
const index = path.join(dist, "index.html");

for (const route of routes) {
  const dest = path.join(dist, route);
  fs.mkdirSync(dest);
  fs.copyFileSync(index, path.join(dest, "index.html"));
}
