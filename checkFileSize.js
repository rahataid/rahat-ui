// checkFileSize.js
const fs = require('fs');
const path = require('path');

// Get a list of all changed files and untracked files.
const changedFiles = require('child_process')
  .execSync('git diff --cached --name-only')
  .toString()
  .trim()
  .split('\n');

const untrackedFiles = require('child_process')
  .execSync('git ls-files --exclude-standard --others')
  .toString()
  .trim()
  .split('\n');

const files = [...changedFiles, ...untrackedFiles];


// Loop through all files.
for (const file of files) {
  console.log('Checking size for file:', file);
  const filePath = path.join(__dirname, file);
  try {
    // Get the size of the file.
    const stats = fs.statSync(filePath);
    const fileSizeInBytes = stats.size;

    // If the size is greater than 1MB, print an error message and exit.
    if (fileSizeInBytes > 1024 * 1024) {
      console.error(
        `Error: File ${file} is larger than 1MB. You should not commit file more that 1MB.`,
      );
      process.exit(1);
    }
  } catch (err) {
    console.error(`Error reading file ${file}: ${err}`);
  }
}
