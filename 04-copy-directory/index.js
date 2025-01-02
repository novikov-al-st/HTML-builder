const path = require('path');
const fsPromises = require('fs/promises');

const srcFolder = 'files';
const destFolder = 'files-copy';


async function copyDir(src, dest) {
  fsPromises.mkdir(dest, { recursive: true });

  try {
    const files = await fsPromises.readdir(src, {
      withFileTypes: true
    });

    const fileNames = files.map(f => f.name);

    const destFiles = await fsPromises.readdir(dest, {
      withFileTypes: true
    });

    destFiles.forEach(async file => {
      if(!fileNames.includes(file.name)) {
        await fsPromises.rm(path.resolve(dest, file.name), { recursive: true, force: true });
      }
    });

    files.forEach(async file => {
      if(file.isFile()){
        await fsPromises.copyFile(path.resolve(src, file.name), path.resolve(dest, file.name));
      } else {
        await copyDir(path.resolve(src, file.name), path.resolve(dest, file.name));
      }
    });

  } catch (err) {
    console.error(err);
  }
}

copyDir(path.resolve(__dirname, srcFolder), path.resolve(__dirname, destFolder));
console.log("Каталог успешно скопирован.");
