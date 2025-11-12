#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const GUIDES_DIR = path.join(__dirname, '../content/guides');
const MAX_CONCURRENT = 5;
let activeRequests = 0;
const queue = [];

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function parseGuideFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const links = [];
  let match;

  while ((match = linkRegex.exec(content)) !== null) {
    const text = match[1];
    const url = match[2];
    
    // Only check http/https links
    if (url.startsWith('http://') || url.startsWith('https://')) {
      links.push({
        text,
        url,
        file: path.basename(filePath),
      });
    }
  }

  return links;
}

function checkUrl(linkData) {
  return new Promise((resolve) => {
    const url = new URL(linkData.url);
    const protocol = url.protocol === 'https:' ? https : http;
    const timeout = 10000;
    let statusCode = null;
    let error = null;

    const options = { 
      timeout,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ClearlyGiftLinkChecker/1.0)',
      },
    };

    const request = protocol.request(linkData.url, options, (res) => {
      statusCode = res.statusCode;
      
      // Follow redirects manually if needed
      if (statusCode >= 300 && statusCode < 400 && res.headers.location) {
        let redirectUrl = res.headers.location;
        // Handle relative URLs
        if (!redirectUrl.startsWith('http')) {
          const baseUrl = new URL(linkData.url);
          redirectUrl = baseUrl.origin + redirectUrl;
        }
        checkUrl({ ...linkData, url: redirectUrl }).then(resolve);
        return;
      }

      resolve({
        ...linkData,
        statusCode,
        error: statusCode >= 400 ? `HTTP ${statusCode}` : null,
      });
    });

    request.on('error', (err) => {
      resolve({
        ...linkData,
        statusCode: null,
        error: err.message,
      });
    });

    request.on('timeout', () => {
      request.destroy();
      resolve({
        ...linkData,
        statusCode: null,
        error: 'Timeout',
      });
    });

    request.setHeader('User-Agent', 'Mozilla/5.0 (compatible; ClearlyGiftLinkChecker/1.0)');
    request.end();
  });
}

function processQueue() {
  while (activeRequests < MAX_CONCURRENT && queue.length > 0) {
    activeRequests++;
    const linkData = queue.shift();
    
    checkUrl(linkData).then((result) => {
      activeRequests--;
      logResult(result);
      processQueue();
    });
  }
}

function logResult(result) {
  const { url, text, file, statusCode, error } = result;

  if (error) {
    log(`❌ ${file} - "${text}"`, 'red');
    log(`   URL: ${url}`, 'red');
    log(`   Error: ${error}`, 'red');
  } else if (statusCode >= 400) {
    log(`⚠️  ${file} - "${text}"`, 'yellow');
    log(`   URL: ${url}`, 'yellow');
    log(`   Status: ${statusCode}`, 'yellow');
  } else if (statusCode >= 200 && statusCode < 300) {
    log(`✓ ${file} - "${text}" (${statusCode})`, 'green');
  } else {
    log(`? ${file} - "${text}"`, 'cyan');
    log(`   URL: ${url}`, 'cyan');
    log(`   Status: ${statusCode}`, 'cyan');
  }
}

async function main() {
  log('\n🔗 Checking all links in gift guides...\n', 'cyan');

  const files = fs.readdirSync(GUIDES_DIR).filter((f) => f.endsWith('.mdx'));
  
  if (files.length === 0) {
    log('No guide files found.', 'yellow');
    return;
  }

  let totalLinks = 0;
  let processedLinks = 0;
  const results = { success: 0, warning: 0, error: 0 };

  // Parse all files and collect links
  for (const file of files) {
    const filePath = path.join(GUIDES_DIR, file);
    const links = parseGuideFile(filePath);
    totalLinks += links.length;
    
    // Add to queue
    links.forEach((link) => {
      queue.push(link);
    });
  }

  log(`Found ${totalLinks} links across ${files.length} guides.\n`);

  // Create a promise to track completion
  return new Promise((resolve) => {
    const checkProgress = setInterval(() => {
      if (queue.length === 0 && activeRequests === 0) {
        clearInterval(checkProgress);
        log('\n✅ Link checking complete!\n', 'green');
        resolve();
      }
    }, 100);

    // Start processing
    processQueue();
  });
}

main().catch((err) => {
  log(`Error: ${err.message}`, 'red');
  process.exit(1);
});
