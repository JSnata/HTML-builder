const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, 'styles/');
const bundleFilePath = path.join(__dirname, 'project-dist/bundle.css');
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
        const readStream = fs.createReadStream(filePath, 'utf8');
        readStream.on('data', (data) => {
          readData.push(data);
          const writeStream = fs.createWriteStream(bundleFilePath);
          writeStream.write(`${readData.join('')}`, (err) => {
            if (err) {
              console.error('Error:', err);
            }
            console.log('Completed');
          });
        });
        readStream.on('error', (err) => {
          console.error(`Error: ${err.message}`);
        });
      }
    });
  }
});
