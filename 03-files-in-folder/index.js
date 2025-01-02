const path = require('path');
const fsPromises = require('fs/promises');
const fs = require("fs");
const folderName = 'secret-folder';

async function logFolderFileInformation(src) {
  try {
    const files = await fsPromises.readdir(src, {
      withFileTypes: true
    });

    files.forEach(file => {
      if(file.isFile()){
        fs.stat( path.resolve(__dirname, folderName, file.name.toString()), (err, stats) => {
          console.log(`${file.name.split('.')[0]} - ${path.extname(file.name).slice(1)} - ${stats.size / 1000}kb`);
        });
      }
    });
  } catch (err) {
    console.error(err);
  }
}

logFolderFileInformation(path.resolve(__dirname, folderName));