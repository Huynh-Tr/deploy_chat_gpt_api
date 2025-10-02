#!/usr/bin/env node

/**
 * Test script to verify the setup
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Testing repository setup...\n');

const requiredFiles = [
  'index.html',
  'src/worker.js',
  'package.json',
  'wrangler.toml',
  'README.md',
  '.gitignore'
];

let allFilesExist = true;

// Check if all required files exist
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.log(`❌ ${file} missing`);
    allFilesExist = false;
  }
});

// Check package.json structure
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  if (packageJson.name && packageJson.scripts) {
    console.log('✅ package.json structure is valid');
  } else {
    console.log('❌ package.json structure is invalid');
    allFilesExist = false;
  }
} catch (error) {
  console.log('❌ package.json is not valid JSON');
  allFilesExist = false;
}

// Check wrangler.toml
try {
  const wranglerConfig = fs.readFileSync('wrangler.toml', 'utf8');
  if (wranglerConfig.includes('name =') && wranglerConfig.includes('main =')) {
    console.log('✅ wrangler.toml structure is valid');
  } else {
    console.log('❌ wrangler.toml structure is invalid');
    allFilesExist = false;
  }
} catch (error) {
  console.log('❌ wrangler.toml is not readable');
  allFilesExist = false;
}

// Check worker.js
try {
  const workerCode = fs.readFileSync('src/worker.js', 'utf8');
  if (workerCode.includes('addEventListener') && workerCode.includes('handleRequest')) {
    console.log('✅ worker.js structure is valid');
  } else {
    console.log('❌ worker.js structure is invalid');
    allFilesExist = false;
  }
} catch (error) {
  console.log('❌ worker.js is not readable');
  allFilesExist = false;
}

// Check index.html
try {
  const htmlContent = fs.readFileSync('index.html', 'utf8');
  if (htmlContent.includes('js.puter.com') && htmlContent.includes('puter.ai.chat')) {
    console.log('✅ index.html includes Puter API integration');
  } else {
    console.log('❌ index.html missing Puter API integration');
    allFilesExist = false;
  }
} catch (error) {
  console.log('❌ index.html is not readable');
  allFilesExist = false;
}

console.log('\n' + '='.repeat(50));

if (allFilesExist) {
  console.log('🎉 All tests passed! Your repository is ready for deployment.');
  console.log('\n📋 Next steps:');
  console.log('1. Run: npm install');
  console.log('2. Run: wrangler login');
  console.log('3. Run: npm run deploy');
} else {
  console.log('❌ Some tests failed. Please check the missing files.');
  process.exit(1);
}

console.log('\n🔗 Useful commands:');
console.log('- npm run dev (local development)');
console.log('- npm run deploy (deploy to Cloudflare)');
console.log('- npm run tail (view logs)');
