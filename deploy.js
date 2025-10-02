#!/usr/bin/env node

/**
 * Deployment script for Cloudflare Workers
 * This script helps deploy the web app to Cloudflare Workers
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting deployment to Cloudflare Workers...\n');

// Check if wrangler is installed
try {
  execSync('wrangler --version', { stdio: 'pipe' });
  console.log('✅ Wrangler CLI found');
} catch (error) {
  console.error('❌ Wrangler CLI not found. Please install it first:');
  console.error('npm install -g wrangler');
  process.exit(1);
}

// Check if user is logged in
try {
  execSync('wrangler whoami', { stdio: 'pipe' });
  console.log('✅ Logged in to Cloudflare');
} catch (error) {
  console.error('❌ Not logged in to Cloudflare. Please login first:');
  console.error('wrangler login');
  process.exit(1);
}

// Check if wrangler.toml exists
if (!fs.existsSync('wrangler.toml')) {
  console.error('❌ wrangler.toml not found');
  process.exit(1);
}

// Check if worker.js exists
if (!fs.existsSync('src/worker.js')) {
  console.error('❌ src/worker.js not found');
  process.exit(1);
}

console.log('✅ All files present');

// Deploy to staging first
console.log('\n📦 Deploying to staging environment...');
try {
  execSync('wrangler deploy --env staging', { stdio: 'inherit' });
  console.log('✅ Staging deployment successful');
} catch (error) {
  console.error('❌ Staging deployment failed');
  process.exit(1);
}

// Ask user if they want to deploy to production
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('\n🤔 Deploy to production? (y/N): ', (answer) => {
  if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
    console.log('\n📦 Deploying to production...');
    try {
      execSync('wrangler deploy', { stdio: 'inherit' });
      console.log('✅ Production deployment successful');
      console.log('\n🎉 Deployment completed successfully!');
      console.log('📝 Your web app is now live on Cloudflare Workers');
    } catch (error) {
      console.error('❌ Production deployment failed');
      process.exit(1);
    }
  } else {
    console.log('\n✅ Deployment completed (staging only)');
    console.log('📝 Your staging environment is ready for testing');
  }
  
  rl.close();
});

// Display helpful information after deployment
console.log('\n📋 Next steps:');
console.log('1. Test your staging deployment');
console.log('2. Configure your custom domain (optional)');
console.log('3. Set up n8n webhook integration');
console.log('4. Monitor your worker in Cloudflare dashboard');

console.log('\n🔗 Useful commands:');
console.log('- View logs: wrangler tail');
console.log('- Local development: wrangler dev');
console.log('- Update secrets: wrangler secret put SECRET_NAME');

