const fs = require('fs');
const path = require('path');

const bundleFolderPath = path.join(__dirname, 'project-dist/');
const bundleHtmlPath = path.join(__dirname, 'project-dist/index.html');
const templatePath = path.join(__dirname, 'template.html');
const componentsFolderPath = path.join(__dirname, 'components/');

fs.promises.mkdir(bundleFolderPath, { recursive: true }, (err) => {
  if (err) throw err;
});

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
              html,
            );
            return result;
          })
          .then((template) => writeHtml(bundleHtmlPath, template));
      }
    });
});
