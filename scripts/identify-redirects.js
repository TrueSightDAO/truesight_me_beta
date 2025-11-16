#!/usr/bin/env node

/**
 * Identify potential redirects needed from CSV data
 * Scans the shipments CSV to find old URLs that need redirecting
 */

const fs = require('fs');
const path = require('path');

// Try both CSV files
const oldCsvPath = path.join(__dirname, '../assets/raw/shipments_collection.csv');
const newCsvPath = path.join(__dirname, '../assets/raw/Agroverse+Shipments_new.csv');

const csvPath = fs.existsSync(newCsvPath) ? newCsvPath : oldCsvPath;

if (!fs.existsSync(csvPath)) {
  console.log('⚠️  shipments_collection.csv not found');
  process.exit(1);
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

const csvContent = fs.readFileSync(csvPath, 'utf-8');
const shipments = parseCSV(csvContent);

console.log('🔍 Identifying redirects from CSV data...\n');

const redirects = [];

shipments.forEach(shipment => {
  const shipmentId = (shipment.shipment_contract_number || '').toLowerCase();
  if (!shipmentId) return;
  
  // Check for old /shipments/ URL pattern
  const oldShipmentUrl = shipment.truesight_dao_shipment_url || '';
  if (oldShipmentUrl) {
    // Extract path from URL
    const urlMatch = oldShipmentUrl.match(/truesight\.me(\/[^?#]*)/);
    if (urlMatch) {
      const oldPath = urlMatch[1];
      // Determine new path based on shipment type
      const isCacao = (shipment.is_cacao_shipment || '').toLowerCase() === 'true';
      const isSerialized = (shipment.serialized || '').toLowerCase() === 'true';
      
      if (isCacao) {
        const newPath = `/agroverse-shipments/${shipmentId}`;
        if (oldPath !== newPath) {
          redirects.push({ old: oldPath, new: newPath, type: 'agroverse' });
        }
      }
      
      if (isSerialized) {
        const newPath = `/sunmint-tree-planting-pledges/${shipmentId}`;
        if (oldPath !== newPath) {
          redirects.push({ old: oldPath, new: newPath, type: 'sunmint' });
        }
      }
    }
  }
  
  // Also check for /shipments/ pattern (common old pattern)
  const oldShipmentsPath = `/shipments/${shipmentId}`;
  const isCacao = (shipment.is_cacao_shipment || '').toLowerCase() === 'true';
  const isSerialized = (shipment.serialized || '').toLowerCase() === 'true';
  
  if (isCacao) {
    redirects.push({ 
      old: oldShipmentsPath, 
      new: `/agroverse-shipments/${shipmentId}`, 
      type: 'agroverse' 
    });
  }
  
  if (isSerialized) {
    redirects.push({ 
      old: oldShipmentsPath, 
      new: `/sunmint-tree-planting-pledges/${shipmentId}`, 
      type: 'sunmint' 
    });
  }
});

  // Remove duplicates and handle conflicts (same old URL pointing to different new URLs)
  const uniqueRedirects = [];
  const seen = new Set();
  const conflicts = new Map(); // Track old URLs that map to multiple new URLs

  redirects.forEach(r => {
    const key = `${r.old}->${r.new}`;
    if (!seen.has(key)) {
      seen.add(key);
      
      // Check for conflicts
      if (!conflicts.has(r.old)) {
        conflicts.set(r.old, []);
      }
      conflicts.get(r.old).push(r);
      
      uniqueRedirects.push(r);
    }
  });

  // Report conflicts
  const conflictList = [];
  conflicts.forEach((redirects, oldUrl) => {
    if (redirects.length > 1) {
      conflictList.push({ old: oldUrl, redirects });
    }
  });

console.log(`📊 Found ${uniqueRedirects.length} potential redirects:\n`);

// Handle conflicts - prioritize Agroverse over Sunmint for shipments
const finalRedirects = [];
const processedOldUrls = new Set();

// First pass: add non-conflicting redirects
uniqueRedirects.forEach(r => {
  if (!conflictList.find(c => c.old === r.old)) {
    finalRedirects.push(r);
    processedOldUrls.add(r.old);
  }
});

// Second pass: for conflicts, prioritize Agroverse, then add Sunmint as separate entries
conflictList.forEach(conflict => {
  const agroverseRedirect = conflict.redirects.find(r => r.type === 'agroverse');
  const sunmintRedirect = conflict.redirects.find(r => r.type === 'sunmint');
  
  if (agroverseRedirect) {
    finalRedirects.push(agroverseRedirect);
    console.log(`⚠️  Conflict resolved: ${conflict.old} → ${agroverseRedirect.new} (prioritized Agroverse)`);
  }
  
  if (sunmintRedirect && agroverseRedirect) {
    // Note: We can't redirect the same URL to two places
    // The user will need to decide or we'll need a different approach
    console.log(`   Note: ${conflict.old} also needs to redirect to ${sunmintRedirect.new} (Sunmint)`);
    console.log(`   Consider: Use query params or create separate redirect pages`);
  } else if (sunmintRedirect) {
    finalRedirects.push(sunmintRedirect);
  }
});

// Generate CSV format
const csvLines = ['old_url,new_url'];
finalRedirects.forEach(r => {
  csvLines.push(`"${r.old}","${r.new}"`);
});

const outputCsv = csvLines.join('\n');
const outputPath = path.join(__dirname, '../wix_redirects.csv');
fs.writeFileSync(outputPath, outputCsv);

console.log('✅ Generated wix_redirects.csv with the following redirects:');
uniqueRedirects.forEach(r => {
  console.log(`   ${r.old} → ${r.new} (${r.type})`);
});

console.log(`\n💡 Next step: Run 'node scripts/generate-redirects.js' to generate redirect files`);


/**
 * Identify potential redirects needed from CSV data
 * Scans the shipments CSV to find old URLs that need redirecting
 */

const fs = require('fs');
const path = require('path');

// Try both CSV files
const oldCsvPath = path.join(__dirname, '../assets/raw/shipments_collection.csv');
const newCsvPath = path.join(__dirname, '../assets/raw/Agroverse+Shipments_new.csv');

const csvPath = fs.existsSync(newCsvPath) ? newCsvPath : oldCsvPath;

if (!fs.existsSync(csvPath)) {
  console.log('⚠️  shipments_collection.csv not found');
  process.exit(1);
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

const csvContent = fs.readFileSync(csvPath, 'utf-8');
const shipments = parseCSV(csvContent);

console.log('🔍 Identifying redirects from CSV data...\n');

const redirects = [];

shipments.forEach(shipment => {
  const shipmentId = (shipment.shipment_contract_number || '').toLowerCase();
  if (!shipmentId) return;
  
  // Check for old /shipments/ URL pattern
  const oldShipmentUrl = shipment.truesight_dao_shipment_url || '';
  if (oldShipmentUrl) {
    // Extract path from URL
    const urlMatch = oldShipmentUrl.match(/truesight\.me(\/[^?#]*)/);
    if (urlMatch) {
      const oldPath = urlMatch[1];
      // Determine new path based on shipment type
      const isCacao = (shipment.is_cacao_shipment || '').toLowerCase() === 'true';
      const isSerialized = (shipment.serialized || '').toLowerCase() === 'true';
      
      if (isCacao) {
        const newPath = `/agroverse-shipments/${shipmentId}`;
        if (oldPath !== newPath) {
          redirects.push({ old: oldPath, new: newPath, type: 'agroverse' });
        }
      }
      
      if (isSerialized) {
        const newPath = `/sunmint-tree-planting-pledges/${shipmentId}`;
        if (oldPath !== newPath) {
          redirects.push({ old: oldPath, new: newPath, type: 'sunmint' });
        }
      }
    }
  }
  
  // Also check for /shipments/ pattern (common old pattern)
  const oldShipmentsPath = `/shipments/${shipmentId}`;
  const isCacao = (shipment.is_cacao_shipment || '').toLowerCase() === 'true';
  const isSerialized = (shipment.serialized || '').toLowerCase() === 'true';
  
  if (isCacao) {
    redirects.push({ 
      old: oldShipmentsPath, 
      new: `/agroverse-shipments/${shipmentId}`, 
      type: 'agroverse' 
    });
  }
  
  if (isSerialized) {
    redirects.push({ 
      old: oldShipmentsPath, 
      new: `/sunmint-tree-planting-pledges/${shipmentId}`, 
      type: 'sunmint' 
    });
  }
});

  // Remove duplicates and handle conflicts (same old URL pointing to different new URLs)
  const uniqueRedirects = [];
  const seen = new Set();
  const conflicts = new Map(); // Track old URLs that map to multiple new URLs

  redirects.forEach(r => {
    const key = `${r.old}->${r.new}`;
    if (!seen.has(key)) {
      seen.add(key);
      
      // Check for conflicts
      if (!conflicts.has(r.old)) {
        conflicts.set(r.old, []);
      }
      conflicts.get(r.old).push(r);
      
      uniqueRedirects.push(r);
    }
  });

  // Report conflicts
  const conflictList = [];
  conflicts.forEach((redirects, oldUrl) => {
    if (redirects.length > 1) {
      conflictList.push({ old: oldUrl, redirects });
    }
  });

console.log(`📊 Found ${uniqueRedirects.length} potential redirects:\n`);

// Handle conflicts - prioritize Agroverse over Sunmint for shipments
const finalRedirects = [];
const processedOldUrls = new Set();

// First pass: add non-conflicting redirects
uniqueRedirects.forEach(r => {
  if (!conflictList.find(c => c.old === r.old)) {
    finalRedirects.push(r);
    processedOldUrls.add(r.old);
  }
});

// Second pass: for conflicts, prioritize Agroverse, then add Sunmint as separate entries
conflictList.forEach(conflict => {
  const agroverseRedirect = conflict.redirects.find(r => r.type === 'agroverse');
  const sunmintRedirect = conflict.redirects.find(r => r.type === 'sunmint');
  
  if (agroverseRedirect) {
    finalRedirects.push(agroverseRedirect);
    console.log(`⚠️  Conflict resolved: ${conflict.old} → ${agroverseRedirect.new} (prioritized Agroverse)`);
  }
  
  if (sunmintRedirect && agroverseRedirect) {
    // Note: We can't redirect the same URL to two places
    // The user will need to decide or we'll need a different approach
    console.log(`   Note: ${conflict.old} also needs to redirect to ${sunmintRedirect.new} (Sunmint)`);
    console.log(`   Consider: Use query params or create separate redirect pages`);
  } else if (sunmintRedirect) {
    finalRedirects.push(sunmintRedirect);
  }
});

// Generate CSV format
const csvLines = ['old_url,new_url'];
finalRedirects.forEach(r => {
  csvLines.push(`"${r.old}","${r.new}"`);
});

const outputCsv = csvLines.join('\n');
const outputPath = path.join(__dirname, '../wix_redirects.csv');
fs.writeFileSync(outputPath, outputCsv);

console.log('✅ Generated wix_redirects.csv with the following redirects:');
uniqueRedirects.forEach(r => {
  console.log(`   ${r.old} → ${r.new} (${r.type})`);
});

console.log(`\n💡 Next step: Run 'node scripts/generate-redirects.js' to generate redirect files`);
