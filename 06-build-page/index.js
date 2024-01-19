const fs = require('fs');
const path = require('path');

const bundleFolderPath = path.join(__dirname, 'project-dist/');
const bundleHtmlPath = path.join(__dirname, 'project-dist/index.html');
const templatePath = path.join(__dirname, 'template.html');
const componentsFolderPath = path.join(__dirname, 'components/');
const assetsFolderPath = path.join(__dirname, 'assets/');
const copyFolderPath = path.join(__dirname, 'project-dist/assets/');

fs.promises
  .mkdir(bundleFolderPath, { recursive: true }, (err) => {
    if (err) throw err;
  })
  .then(() => copyDir(assetsFolderPath, copyFolderPath));

const readHtml = (path) => {
  return new Promise((resolve, reject) => {
    let template = '';
    const readStream = fs.createReadStream(path, 'utf8');
    readStream.on('data', (data) => {
      template += data;
      resolve(template);
    });
    readStream.on('error', (err) => {
      reject(`Error: ${err.message}`);
    });
  });
};

const writeHtml = (path, input) => {
  return new Promise((resolve, reject) => {
    const writeStream = fs.createWriteStream(path);
    writeStream.write(input, (err) => {
      if (err) {
        reject('Error:', err);
      }
      console.log('Written');
      resolve(input);
    });
  });
};

readHtml(templatePath).then((template) => {
  let result = template;
  fs.promises
    .readdir(componentsFolderPath, { withFileTypes: true })
    .then((filenames) => {
      for (let filename of filenames) {
        const filePath = filename.path + filename.name;
        readHtml(filePath)
          .then((html) => {
            result = result.replace(
              `{{${filename.name.substr(0, filename.name.lastIndexOf('.'))}}}`,
              html.trim(),
            );
            return result;
          })
          .then((template) => {
            writeHtml(bundleHtmlPath, template);
          });
      }
    });
});

//styles bundling
const folderPath = path.join(__dirname, 'styles/');
const bundleFilePath = path.join(__dirname, 'project-dist/style.css');
const readData = [];

fs.promises.readdir(folderPath, { withFileTypes: true }).then((filenames) => {
  for (let filename of filenames) {
    const filePath = filename.path + filename.name;
    fs.stat(filePath, (err, stats) => {
      if (err) {
        console.error(err);
        return;
      }
      if (stats.isFile() && path.extname(filePath) === '.css') {
        readSrcFiles(filePath);
      }
    });
  }
});

const readSrcFiles = (filePath) => {
  const readStream = fs.createReadStream(filePath, 'utf8');
  readStream.on('data', (data) => {
    readData.push(data);
    fillBundle();
  });
  readStream.on('error', (err) => {
    console.error(`Error: ${err.message}`);
  });
};

const fillBundle = () => {
  const writeStream = fs.createWriteStream(bundleFilePath);
  writeStream.write(`${readData.join('')}`, (err) => {
    if (err) {
      console.error('Error:', err);
    }
  });
};

//assets copying into dist folder

async function copyDir(src, dest) {
  try {
    await fs.promises.mkdir(dest, { recursive: true });

    const srcFiles = await fs.promises.readdir(src);

    for (const file of srcFiles) {
      const srcPath = path.join(src, file);
      const destPath = path.join(dest, file);

      const fileStats = await fs.promises.stat(srcPath);

      if (fileStats.isDirectory()) {
        await copyDir(srcPath, destPath);
      } else {
        await fs.promises.copyFile(srcPath, destPath);
      }
    }
  } catch (err) {
    console.error('Error:', err);
  }
}
