const path = require('path');
const express = require('express');
const recursiveDirsFiles = require('./index');

const app = express();

recursiveDirsFiles({
  baseDir: path.resolve(__dirname, './routers'),
  fileReg: /\.js$/,
  handleFile(fileName, fn, dirs) {
    const url = '/' + dirs.join('/');
    app.use(url, fn);
  },
  handleDirectory(dirs, fullPath) {
    const url = '/' + dirs.join('/');
    app.use(url, (req, res) => {
      res.send(`hit ${url}/* default router`);
    });
  }
});

app.listen(9000, () => {
  console.log('listening -> ', 9000);
})
