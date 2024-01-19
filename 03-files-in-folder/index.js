const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder/');

fs.promises
  .readdir(folderPath, { withFileTypes: true })
  .then((filenames) => {
    for (let filename of filenames) {
      const filePath = filename.path + filename.name;
      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error(err);
          return;
        }
        if (stats.isFile()) {
          const name = filename.name.substr(0, filename.name.lastIndexOf('.'));
          const extension = path.extname(filePath).slice(1);
          const size = stats.size;
          console.log(`${name} - ${extension} - ${size}bytes`);
        }
      });
    }
  })
  .catch((err) => {
    console.log(err);
  });
