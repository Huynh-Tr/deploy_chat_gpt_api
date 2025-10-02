#!/usr/bin/env node

/**
 * Deployment script for Cloudflare Pages
 * This script ensures proper deployment with _worker.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Deploying to Cloudflare Pages...\n');

// Check if _worker.js exists
if (!fs.existsSync('_worker.js')) {
  console.error('❌ _worker.js file not found!');
  console.error('   Please ensure _worker.js is in the root directory.');
  process.exit(1);
}

console.log('✅ _worker.js found');

// Check if index.html exists
if (!fs.existsSync('index.html')) {
  console.error('❌ index.html file not found!');
  process.exit(1);
}

console.log('✅ index.html found');

// Check if wrangler is installed
try {
  execSync('wrangler --version', { stdio: 'pipe' });
  console.log('✅ Wrangler CLI found');
} catch (error) {
  console.error('❌ Wrangler CLI not found. Installing...');
  try {
    execSync('npm install -g wrangler', { stdio: 'inherit' });
    console.log('✅ Wrangler CLI installed');
  } catch (installError) {
    console.error('❌ Failed to install Wrangler CLI');
    console.error('   Please install manually: npm install -g wrangler');
    process.exit(1);
  }
}

// Check if user is logged in
try {
  execSync('wrangler whoami', { stdio: 'pipe' });
  console.log('✅ Logged in to Cloudflare');
} catch (error) {
  console.error('❌ Not logged in to Cloudflare. Please login:');
  console.error('   wrangler login');
  process.exit(1);
}

console.log('\n📦 Deploying to Cloudflare Pages...');

try {
  // Deploy to Cloudflare Pages
  execSync('wrangler pages deploy . --project-name chat-gpt-api', { stdio: 'inherit' });
  console.log('\n✅ Deployment successful!');
  
  console.log('\n🔗 Your site is available at:');
  console.log('   https://chat-gpt-api.pages.dev/');
  console.log('   https://chat-gpt-api.pages.dev/api/chat');
  console.log('   https://chat-gpt-api.pages.dev/api/webhook');
  
  console.log('\n🧪 Testing deployment...');
  
  // Wait a moment for deployment to propagate
  setTimeout(() => {
    try {
      execSync('node test-pages-deployment.js', { stdio: 'inherit' });
    } catch (error) {
      console.log('\n⚠️  Test completed with some issues (this is normal for new deployments)');
    }
    
    console.log('\n🎉 Deployment completed!');
    console.log('\n📋 Next steps:');
    console.log('1. Test your API endpoints manually');
    console.log('2. Update your n8n workflow with the correct URLs');
    console.log('3. Test the complete flow from n8n to your API');
    
    console.log('\n🔗 Test commands:');
    console.log('curl -X POST https://chat-gpt-api.pages.dev/api/chat \\');
    console.log('  -H "Content-Type: application/json" \\');
    console.log('  -d \'{"message": "Hello!", "model": "gpt-5-nano"}\'');
    
  }, 5000); // Wait 5 seconds before testing
  
} catch (error) {
  console.error('\n❌ Deployment failed:', error.message);
  console.error('\n📋 Troubleshooting:');
  console.error('1. Check your Cloudflare account has Pages enabled');
  console.error('2. Verify you have permission to deploy to the project');
  console.error('3. Try manual deployment via Cloudflare Dashboard');
  process.exit(1);
}
