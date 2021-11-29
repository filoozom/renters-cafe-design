const fs = require("fs");
const path = require("path");

// Usage
if (!process.argv[2]) {
  console.error("Usage: node create-index.js mainFile");
}

// Configuration
const source = path.join(__dirname, "template.html");
const destination = path.join(__dirname, "index.html");

const template = fs.readFileSync(source, "utf8");
fs.writeFileSync(destination, template.replace("{{index}}", process.argv[2]));
