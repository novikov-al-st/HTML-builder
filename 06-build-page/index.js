const path = require('path');
const fs = require('fs');
const fsPromises = require('fs/promises');

const stylesFolderName = 'styles';
const bundleFolderName = 'project-dist';
const bundleCssName = 'style.css';
const assetsFolderName = 'assets';
const componentsFolderName = 'components';
const bundleHtmlName = 'index.html';
const htmlTemplateName  = 'template.html';

async function createDir(path) {
  try {
    await fsPromises.rm(path, { recursive: true, force: true });
    await fsPromises.mkdir(path, {recursive:true});
  } catch(err) {
    console.error(err);
  }
}

async function copyDir(src, dest) {
  try {
    await fsPromises.mkdir(dest, { recursive: true });
  } catch(err) {
    console.error(err);
  }

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

async function createHtml() {
  try {
    const componentFiles = await fsPromises.readdir(path.resolve(__dirname, componentsFolderName), {
      withFileTypes: true
    });

    const htmlTemplateContent = await fsPromises.readFile(path.resolve(__dirname, htmlTemplateName), { encoding: 'utf8' });

    const htmlTemplateSplits = htmlTemplateContent.split(/{{|}}/gm);
    let htmlResult = '';
    for (let i = 0; i < htmlTemplateSplits.length; i++) {
      if(i%2) {
        const componentName = htmlTemplateSplits[i];
        htmlResult += await fsPromises.readFile(path.resolve(__dirname, componentsFolderName, componentName + '.html'), { encoding: 'utf8' });
      } else {
        htmlResult += htmlTemplateSplits[i];
      }
    }

    await fsPromises.writeFile(path.resolve(__dirname, bundleFolderName, bundleHtmlName), htmlResult, { flag: 'w+' }, err => {});

  } catch (err) {
    console.error(err);
  }
}

async function createBundle() {
  await createDir(path.resolve(__dirname, bundleFolderName));
  await createCssBundle(path.resolve(__dirname, stylesFolderName), path.resolve(__dirname, bundleFolderName, bundleCssName));
  console.log('bundle.css успешно сформирован.');
  await copyDir(path.resolve(__dirname, assetsFolderName), path.resolve(__dirname, bundleFolderName, assetsFolderName));
  console.log(`Каталог ${assetsFolderName} успешно скопирован.`);
  await createHtml();
  console.log(`Файлы успешно созданы.`);
}

createBundle();
