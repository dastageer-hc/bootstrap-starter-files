// bootstrap.js
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { exec } = require('child_process');

// Setup readline interface for interactive input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Function to prompt for the project name
function askProjectName() {
  rl.question('Enter the project name (use "." for current directory): ', (input) => {
    const projectName = input.trim();
    const projectPath = projectName === '.' ? process.cwd() : path.join(process.cwd(), projectName);

    initializeProject(projectName, projectPath);
  });
}

// Directory structure
const directories = [
  'src',
  'src/css',
  'src/js',
  'assets',
];

// Files to create
const files = [
  { name: 'index.html', content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Project</title>
  <link rel="stylesheet" href="src/css/style.css">
</head>
<body>
  <h1>Welcome to the project</h1>
  <script src="src/js/app.js"></script>
</body>
</html>` },

  { name: 'src/css/style.css', content: `/* Basic styling */
body {
  font-family: Arial, sans-serif;
}` },

  { name: 'src/js/app.js', content: `// JavaScript entry point
console.log('Hello, project!');` },
];

// Initialize project
function initializeProject(projectName, projectPath) {
  console.log(`Bootstrapping ${projectName} at ${projectPath}...`);

  // Create project directory if not using "."
  if (projectName !== '.' && !fs.existsSync(projectPath)) {
    fs.mkdirSync(projectPath);
  }

  // Create directories
  directories.forEach(dir => {
    const dirPath = path.join(projectPath, dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  });

  // Create files
  files.forEach(file => {
    const filePath = path.join(projectPath, file.name);
    fs.writeFileSync(filePath, file.content);
  });

  // Initialize package.json
  exec(`npm init -y`, { cwd: projectPath }, (err, stdout, stderr) => {
    if (err) {
      console.error(`Error initializing npm: ${err.message}`);
      return;
    }
    console.log(stdout);
    console.log(`Project ${projectName} is successfully bootstrapped.`);
    rl.close();
  });
}

// Start the process
askProjectName();
