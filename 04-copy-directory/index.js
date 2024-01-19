const fs = require('fs').promises;
const path = require('path');

const folderPath = path.join(__dirname, 'files/');
const copyFolderPath = path.join(__dirname, 'files-copy/');

async function copyDir(src, dest) {
  try {
    await fs.mkdir(dest, { recursive: true }, (err) => {
      if (err) throw err;
    });
    const srcFiles = await fs.readdir(src);
    const destFiles = await fs.readdir(dest);

    for (const destFile of destFiles) {
      const destFilePath = path.join(dest, destFile);

      if (!srcFiles.includes(destFile)) {
        await fs.unlink(destFilePath);
      }
    }
    for (const file of srcFiles) {
      const srcPath = path.join(src, file);
      const destPath = path.join(dest, file);

      await fs.copyFile(srcPath, destPath);
    }
    console.log('Files copied');
  } catch (err) {
    console.error('Error:', err);
  }
}

copyDir(folderPath, copyFolderPath);
