# Local development setup

# Install typescript
npm install --save-dev typescript

# Initialize a TypeScript Configuration
npx tsc --init

# Add this configuration to tsconfig.json file
{
  "compilerOptions": {
    "target": "ES5", // Choose the target JavaScript version (e.g., ES5, ES6)
    "module": "ESNext", // Module system to use (ESNext is good for modern bundlers)
    "outDir": "./dist", // Directory to place compiled JavaScript files
    "allowJs": true, // Allow JavaScript files to be compiled by TypeScript
    "checkJs": true, // Enable type checking for JavaScript files (optional)
    "strict": true // Enable strict type-checking options
  },
  "include": [
    "src/**/*"
  ], // Specify which files to include (use the 'src' folder)
  "exclude": [
    "node_modules"
  ] // Exclude node_modules folder
}

# Compile TypeScript
npx tsc --watch
This will compile the src/index.ts file and output the corresponding index.js file into the dist folder.

# Open index.html in a Browser
Now that everything is set up, you can open the index.html file in a web browser.

# Use a Local Development Server (for automatic refresh)
npm install -g http-server
http-server .

# google-forms
Manage forms like to collect information from the end users.
