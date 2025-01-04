const path = require('path');
const fs = require('fs');
const fsPromises = require('fs/promises');

const srcFolder = 'styles';
const destFolder = 'project-dist';
const bundleCssName = 'bundle.css';

async function createCssBundle(src, dest) {
  try {
    const files = await fsPromises.readdir(src, {
      withFileTypes: true
    });

    const cssFiles = files.filter(f => f.name.endsWith('.css'));

    await fsPromises.open(dest, 'w+');

    for (let i = 0; i < cssFiles.length; i++) {
      fs.readFile(path.resolve(src, cssFiles[i].name), 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          return;
        }

        fs.writeFile(dest, data, { flag: 'a' }, err => {});
      });
    }

  } catch (err) {
    console.error(err);
  }
}

createCssBundle(path.resolve(__dirname, srcFolder), path.resolve(__dirname, destFolder, bundleCssName));
console.log("bundle.css успешно сформирован.");