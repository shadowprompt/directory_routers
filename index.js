const { promisify } = require("util");
const path = require('path');
const fs = require('fs');
const readDir = promisify(fs.readdir);
const readStat = promisify(fs.stat);

async function main(config = {}) {
  const fileReg = config.fileReg || /\.[j|t]s$/;

  async function scanDir(entryPath, parents = []) {
    const parentStat = await readStat(entryPath);

    if (parentStat.isDirectory()) {
      const routerFiles = await readDir(entryPath);
      for (const fileName of routerFiles) {
        const filePath = path.resolve(entryPath, fileName);
        const fileStat = await readStat(filePath);
        if (fileStat.isDirectory()) {
          const nameArr = filePath.replace(/\/$/, '').split(path.sep);
          const entryName = nameArr.pop();
          const dirPaths = [...parents, entryName];
          await scanDir(filePath, dirPaths);
        } else if (fileReg.test(fileName)) {
          const fn = require(path.resolve(filePath));
          typeof config.handleFile === 'function' && config.handleFile(fileName, fn, parents);
        }
      }
      typeof config.handleDirectory === 'function' && config.handleDirectory(parents, entryPath);
    }
  }

  return scanDir(config.baseDir, []);
}

module.exports = main;
