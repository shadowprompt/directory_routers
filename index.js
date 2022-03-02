const { promisify } = require("util");
const path = require('path');
const fs = require('fs');
const readDir = promisify(fs.readdir);
const readStat = promisify(fs.stat);

async function registerRouter(app, config = {}) {

  async function scan(parentPath, isTop) {
    const parentStat = await readStat(parentPath);

    if (parentStat.isDirectory()) {
      const nameArr = parentPath.replace(/\/$/, '').split(path.sep);
      const parentName = nameArr.pop();

      const routerFiles = await readDir(parentPath);
      for (const fileName of routerFiles) {
        const filePath = path.resolve(parentPath, fileName);
        const fileStat = await readStat(filePath);
        if (fileStat.isDirectory()) {
          await scan(filePath);
        } else if (/\.[j|t]s$/.test(fileName)) {
          const router = require(path.resolve(filePath));
          app.use('/' + (isTop ? '' : parentName), router);
        }
      }
      !isTop && register(parentName, parentPath);
    }
  }

  function register(fileName, filePath) {
    const url = typeof config.dirDefaultRouter === 'function' && config.dirDefaultRouter(fileName, filePath);
    if (url && config.middleware) {
      app.use(url, config.middleware(fileName, filePath));
    }
  }

  scan(config.baseDir, true);
}

module.exports = registerRouter;
