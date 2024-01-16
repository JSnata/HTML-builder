const path = require('path');
const fs = require('fs');
const { stdin } = process;

const filePath = path.join(__dirname, 'text.txt');
const writeStream = fs.createWriteStream(filePath);

console.log('Hi! Enter text (Ctrl+C or type "exit" to exit):');

stdin.on('data', (input) => {
  const userInput = input.toString();
  if (userInput.toLowerCase() === 'exit') {
    console.log('Bye!...');
    process.exit(0);
  } else {
    writeStream.write(`${userInput}`, (err) => {
      if (err) {
        console.error('Error:', err);
        process.exit(1);
      }
      console.log('You can enter more text (Ctrl+C or type "exit" to exit):');
    });
  }
});

process.on('SIGINT', () => {
  console.log('\nBye!...');
  process.exit(0);
});
