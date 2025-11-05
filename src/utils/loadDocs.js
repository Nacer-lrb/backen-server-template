const fs = require("fs");
const path = require("path");

function loadDocs() {
  const base = JSON.parse(fs.readFileSync(path.join(__dirname, "../docs/openapi.json"), "utf8"));

  // Charger tous les fichiers de paths
  const pathsDir = path.join(__dirname, "../docs/paths");
  const paths = {};

  fs.readdirSync(pathsDir).forEach(file => {
    const fileData = JSON.parse(fs.readFileSync(path.join(pathsDir, file), "utf8"));
    Object.assign(paths, fileData);
  });

  // Charger les components (schemas, security, etc.)
  const componentsDir = path.join(__dirname, "../docs/components");
  const components = {};

  fs.readdirSync(componentsDir).forEach(file => {
    const fileData = JSON.parse(fs.readFileSync(path.join(componentsDir, file), "utf8"));
    Object.assign(components, fileData);
  });

  base.paths = paths;
  base.components = components;

  return base;
}

module.exports = loadDocs;
