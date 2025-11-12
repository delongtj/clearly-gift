#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const GUIDES_DIR = path.join(__dirname, '../content/guides');

// Links that should exist (product pages should be findable)
const INVALID_PATTERNS = [
  // Dead domains
  /robotime\.com/,
  /glocusent\.com/,
  
  // Product pages that commonly return 404 (wrong URL format)
  /amazon\.com\/.*\/dp\/B08N41Y4Q2/, // Kindle, needs verification
  /amazon\.com\/dp\/B08RJXVTCD/,     // Leather bookmark - generic ASIN check
  /amazon\.com\/.*\/B08943J3QF/,     // Yamazaki bookshelf
  /amazon\.com\/.*\/B01N7ZNZL5/,     // Capri Blue candle
  /amazon\.com\/LEVOIT.*\/B086W8DW72/, // Levoit humidifier
  /amazon\.com\/Glocusent.*\/B07L5B5P5D/, // Glocusent light
  
  // Commerce sites with auth/403
  /etsy\.com.*403/,
  /app\.thestorygraph\.com.*403/,
  /bookofthemonth\.com.*403/,
  /anthropologie\.com.*403/,
];

const SUSPICIOUS_PATTERNS = {
  // Official stores that redirect weirdly or might be down
  levoit: /levoit\.com/,
  glocusent: /glocusent\.com/,
  robotime: /robotime\.com/,
  yamazakihome: /yamazakihome\.com/,
  
  // These are common - validate separately
  amazon: /amazon\.com/,
  target: /target\.com/,
  bestbuy: /bestbuy\.com/,
};

function parseGuideFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const links = [];
  let match;
  let lineNum = 1;

  const lines = content.split('\n');
  let currentLine = 0;

  while ((match = linkRegex.exec(content)) !== null) {
    const text = match[1];
    const url = match[2];
    
    // Only check http/https links
    if (url.startsWith('http://') || url.startsWith('https://')) {
      // Count line numbers for better reporting
      const beforeMatch = content.substring(0, match.index);
      lineNum = beforeMatch.split('\n').length;
      
      links.push({
        text,
        url,
        file: path.basename(filePath),
        lineNum,
      });
    }
  }

  return links;
}

function analyzeLink(link) {
  const { url, text } = link;
  const issues = [];

  // Check for known bad patterns
  if (url.includes('robotime.com')) {
    issues.push('Domain robotime.com may be unreliable');
  }
  if (url.includes('glocusent.com')) {
    issues.push('Domain glocusent.com may be unreliable');
  }
  if (url.includes('yamazakihome.com')) {
    issues.push('Domain yamazakihome.com has SSL/connection issues');
  }
  if (url.includes('levoit.com')) {
    issues.push('Domain levoit.com returns 404 for this product');
  }

  // Check for generic Amazon ASIN issues
  if (url.includes('amazon.com')) {
    // Look for suspicious ASIN patterns
    const asinMatch = url.match(/\/dp\/(B[A-Z0-9]{9})/);
    if (asinMatch) {
      const asin = asinMatch[1];
      // These ASINs appear to be wrong/404
      const badAsins = [
        'B08N41Y4Q2', // Kindle
        'B08RJXVTCD', // Leather bookmark
        'B08943J3QF', // Yamazaki
        'B01N7ZNZL5', // Capri Blue candle
        'B086W8DW72', // Levoit
        'B07L5B5P5D', // Glocusent
      ];
      if (badAsins.includes(asin)) {
        issues.push(`Amazon ASIN ${asin} appears to be incorrect or product discontinued`);
      }
    }
  }

  // Check for target.com with malformed URLs
  if (url.includes('target.com') && url.includes('/-/A-')) {
    // Target URLs are often fragile, but this format is correct
  }

  // Check for completely missing domains
  try {
    new URL(url);
  } catch (e) {
    issues.push('Invalid URL format: ' + e.message);
  }

  return issues;
}

function main() {
  console.log('\n📋 Analyzing links in gift guides...\n');

  const files = fs.readdirSync(GUIDES_DIR).filter((f) => f.endsWith('.mdx'));
  
  let totalLinks = 0;
  let issueCount = 0;
  const issues = [];

  // Parse all files and collect links
  for (const file of files) {
    const filePath = path.join(GUIDES_DIR, file);
    const links = parseGuideFile(filePath);
    totalLinks += links.length;
    
    // Analyze each link
    for (const link of links) {
      const linkIssues = analyzeLink(link);
      if (linkIssues.length > 0) {
        issueCount++;
        issues.push({ ...link, issues: linkIssues });
      }
    }
  }

  console.log(`Analyzed ${totalLinks} links across ${files.length} guides.\n`);

  if (issues.length === 0) {
    console.log('✅ No obvious issues found!\n');
    console.log('Note: This is a static analysis. Some issues may still exist:');
    console.log('  - 403 errors from auth/bot-detection (Etsy, Anthropologie, etc.)');
    console.log('  - Redirects that work but point to generic pages');
    console.log('  - Products that have moved or been discontinued\n');
    return;
  }

  console.log(`⚠️  Found ${issueCount} potential issues:\n`);

  // Group by guide file
  const issuesByFile = {};
  issues.forEach((issue) => {
    if (!issuesByFile[issue.file]) {
      issuesByFile[issue.file] = [];
    }
    issuesByFile[issue.file].push(issue);
  });

  // Print grouped by file
  Object.entries(issuesByFile).forEach(([file, fileIssues]) => {
    console.log(`📄 ${file}`);
    fileIssues.forEach((issue) => {
      console.log(`   Line ${issue.lineNum}: "${issue.text}"`);
      console.log(`   URL: ${issue.url}`);
      issue.issues.forEach((problem) => {
        console.log(`   ⚠️  ${problem}`);
      });
      console.log();
    });
  });

  console.log('\n💡 Action items:');
  console.log('  1. Check the guides for outdated product links');
  console.log('  2. Verify Amazon ASINs are correct (B-codes)');
  console.log('  3. Test suspicious domains manually\n');
}

main();
