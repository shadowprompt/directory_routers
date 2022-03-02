const path = require('path');
const express = require('express');
const directoryRouters = require('./index');

const app = express();

directoryRouters(app, {
  baseDir: path.resolve(__dirname, './routers'),
  dirDefaultRouter(fileName, filePath) {
    return '/' + fileName + '/*';
  },
  middleware(fileName, filePath) {
    return (req, res) => {
      res.send(`hit /${fileName}/* default router`);
    }
  }
});

app.listen(9000, () => {
  console.log('listening -> ', 9000);
})
