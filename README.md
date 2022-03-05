# recursive_dirs_files

recursive read files in the entry directory and its subfolders, then handle...

#### Example

```javascript
const path = require('path');
const express = require('express');
const recursiveDirsFiles = require('recursive_dirs_files');

const app = express();

recursiveDirsFiles(app, {
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
}).then(() => {
  app.listen(9000, () => {
    console.log('listening -> ', 9000);
  });
});
```

scan from the entry directory './routers' and its subfolders, register each file as a express router middleware and each directory as a default express router middleware;
