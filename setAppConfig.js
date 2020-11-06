const fs = require("fs");
const mode = process.argv[2];

fs.copyFileSync(`./src/config/app-config.${mode}.ts`, "./src/config/app-config.ts");