const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, 'files/');
const copyFolderPath = path.join(__dirname, 'files-copy/');

async function copyDir(src, dest) {
  try {
    await fs.mkdir(dest, { recursive: true }, (err) => {
      if (err) throw err;
    });

    await fs.readdir(src, (err, files) => {
      if (err) throw err;
      for (const file of files) {
        const srcPath = path.join(src, file);
        const destPath = path.join(dest, file);

        fs.copyFile(srcPath, destPath, (err) => {
          if (err) throw err;
        });
      }
    });
  } catch (err) {
    console.error('Error:', err);
  }
}

copyDir(folderPath, copyFolderPath);
