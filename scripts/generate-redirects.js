#!/usr/bin/env node

/**
 * Generate redirect pages for WIX URLs
 * Creates HTML redirect pages and generates redirect configuration files
 * for various hosting platforms (Netlify, Vercel, Apache, etc.)
 */

const fs = require('fs');
const path = require('path');

// Read the redirects CSV file
const csvPath = path.join(__dirname, '../wix_redirects.csv');

if (!fs.existsSync(csvPath)) {
  console.log('⚠️  wix_redirects.csv not found. Creating template...');
  console.log('   Please add your WIX redirect mappings to wix_redirects.csv');
  console.log('   Format: old_url,new_url');
  
  // Create a template CSV
  const template = `old_url,new_url
/shipments/agl13,/agroverse-shipments/agl13
/sunmint-tree-planting-pledges/agl13,/sunmint-tree-planting-pledges/agl13`;
  
  fs.writeFileSync(csvPath, template);
  console.log('✅ Created template file at:', csvPath);
  process.exit(0);
}

// Parse CSV
function parseCSV(content) {
  const rows = [];
  let currentRow = [];
  let currentField = '';
  let inQuotes = false;
  let i = 0;

  while (i < content.length) {
    const char = content[i];
    const nextChar = content[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentField += '"';
        i += 2;
        continue;
      } else {
        inQuotes = !inQuotes;
        i++;
        continue;
      }
    }

    if (char === ',' && !inQuotes) {
      currentRow.push(currentField);
      currentField = '';
      i++;
      continue;
    }

    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i += 2;
      } else {
        i++;
      }
      currentRow.push(currentField);
      if (currentRow.length > 0 && currentRow.some(f => f.trim())) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentField = '';
      continue;
    }

    currentField += char;
    i++;
  }

  if (currentField || currentRow.length > 0) {
    currentRow.push(currentField);
    if (currentRow.some(f => f.trim())) {
      rows.push(currentRow);
    }
  }

  if (rows.length < 2) return [];

  const headers = rows[0].map(h => h.replace(/^"|"$/g, '').trim());
  const dataRows = [];

  for (let i = 1; i < rows.length; i++) {
    const row = {};
    headers.forEach((header, idx) => {
      row[header] = (rows[i][idx] || '').replace(/^"|"$/g, '').trim();
    });
    dataRows.push(row);
  }

  return dataRows;
}

// Generate HTML redirect page
function generateRedirectHTML(oldUrl, newUrl) {
  // Clean URLs - remove leading/trailing slashes for consistency
  const cleanOld = oldUrl.replace(/^\/+|\/+$/g, '');
  const cleanNew = newUrl.replace(/^\/+|\/+$/g, '');
  const redirectUrl = '/' + cleanNew;
  
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="refresh" content="0; url=${redirectUrl}" />
    <link rel="canonical" href="${redirectUrl}" />
    <script>
      window.location.replace("${redirectUrl}");
    </script>
    <title>Redirecting...</title>
  </head>
  <body>
    <p>If you are not redirected automatically, <a href="${redirectUrl}">click here</a>.</p>
  </body>
</html>`;
}

// Normalize URL path
function normalizePath(url) {
  // Remove domain if present
  url = url.replace(/^https?:\/\/[^\/]+/, '');
  // Remove leading/trailing slashes
  url = url.replace(/^\/+|\/+$/g, '');
  // Remove .html extension if present
  url = url.replace(/\.html$/, '');
  return url;
}

async function generateRedirects() {
  console.log('🔄 Generating redirects from WIX URLs...\n');
  
  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const redirects = parseCSV(csvContent);
  
  console.log(`📊 Found ${redirects.length} redirect mappings\n`);
  
  const redirectsDir = path.join(__dirname, '../redirects');
  if (!fs.existsSync(redirectsDir)) {
    fs.mkdirSync(redirectsDir, { recursive: true });
  }
  
  // Generate HTML redirect pages
  let htmlRedirects = 0;
  const redirectPages = [];
  
  for (const redirect of redirects) {
    const oldUrl = redirect.old_url || redirect.oldUrl || '';
    const newUrl = redirect.new_url || redirect.newUrl || '';
    
    if (!oldUrl || !newUrl) {
      console.log(`⚠️  Skipping invalid redirect: ${JSON.stringify(redirect)}`);
      continue;
    }
    
    const normalizedOld = normalizePath(oldUrl);
    const normalizedNew = normalizePath(newUrl);
    
    // Create directory structure for old URL
    const oldPathParts = normalizedOld.split('/');
    const fileName = oldPathParts.pop() || 'index';
    const dirPath = path.join(redirectsDir, ...oldPathParts);
    
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    
    // Create index.html in the directory
    const redirectFilePath = path.join(dirPath, 'index.html');
    const redirectHtml = generateRedirectHTML(normalizedOld, normalizedNew);
    fs.writeFileSync(redirectFilePath, redirectHtml);
    
    redirectPages.push({
      old: normalizedOld,
      new: normalizedNew,
      file: redirectFilePath.replace(path.join(__dirname, '../'), '')
    });
    
    htmlRedirects++;
  }
  
  console.log(`✅ Generated ${htmlRedirects} HTML redirect pages\n`);
  
  // Generate Netlify _redirects file
  const netlifyRedirects = redirectPages.map(r => {
    const oldPath = '/' + r.old;
    const newPath = '/' + r.new;
    return `${oldPath} ${newPath} 301`;
  }).join('\n');
  
  fs.writeFileSync(
    path.join(__dirname, '../_redirects'),
    netlifyRedirects + '\n'
  );
  console.log('✅ Generated _redirects file for Netlify');
  
  // Generate Vercel vercel.json
  const vercelConfig = {
    redirects: redirectPages.map(r => ({
      source: '/' + r.old,
      destination: '/' + r.new,
      permanent: true
    }))
  };
  
  fs.writeFileSync(
    path.join(__dirname, '../vercel.json'),
    JSON.stringify(vercelConfig, null, 2) + '\n'
  );
  console.log('✅ Generated vercel.json for Vercel');
  
  // Generate Apache .htaccess
  const htaccessRules = redirectPages.map(r => {
    const oldPath = '/' + r.old;
    const newPath = '/' + r.new;
    return `Redirect 301 ${oldPath} ${newPath}`;
  }).join('\n');
  
  fs.writeFileSync(
    path.join(__dirname, '../.htaccess'),
    `# WIX Redirects\n${htaccessRules}\n`
  );
  console.log('✅ Generated .htaccess for Apache');
  
  // Generate nginx redirects
  const nginxRedirects = redirectPages.map(r => {
    const oldPath = '/' + r.old;
    const newPath = '/' + r.new;
    return `    rewrite ^${oldPath.replace(/\//g, '\\/')}$ ${newPath} permanent;`;
  }).join('\n');
  
  const nginxConfig = `# WIX Redirects
# Add these rules to your nginx server block:

${nginxRedirects}
`;
  
  fs.writeFileSync(
    path.join(__dirname, '../nginx-redirects.conf'),
    nginxConfig
  );
  console.log('✅ Generated nginx-redirects.conf for Nginx');
  
  console.log('\n📋 Summary:');
  console.log(`   HTML redirect pages: ${htmlRedirects}`);
  console.log(`   Redirect files generated: _redirects, vercel.json, .htaccess, nginx-redirects.conf`);
  console.log(`\n💡 Next steps:`);
  console.log(`   1. Review the redirect mappings in wix_redirects.csv`);
  console.log(`   2. Deploy the redirect pages and configuration files`);
  console.log(`   3. Test the redirects to ensure they work correctly`);
}

generateRedirects().catch(console.error);

