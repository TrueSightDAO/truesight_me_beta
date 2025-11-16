# WIX to Static Site Redirects

This document explains how redirects from the old WIX site to the new static site are handled.

## Overview

When migrating away from WIX, external links to old URLs will break. This solution provides multiple redirect mechanisms to ensure a smooth transition.

## Files Generated

The redirect system generates several files to support different hosting platforms:

1. **HTML Redirect Pages** (`redirects/` directory)
   - Works on any static hosting (GitHub Pages, Netlify, Vercel, etc.)
   - Uses both meta refresh and JavaScript redirects for maximum compatibility
   - Creates directory structure matching old URLs with `index.html` files

2. **`_redirects`** (Netlify)
   - Server-side redirects for Netlify hosting
   - 301 permanent redirects for SEO

3. **`vercel.json`** (Vercel)
   - Configuration for Vercel hosting
   - Permanent redirects

4. **`.htaccess`** (Apache)
   - Apache server configuration
   - Works with shared hosting and Apache servers

5. **`nginx-redirects.conf`** (Nginx)
   - Nginx server configuration
   - Can be included in your nginx config

## Usage

### 1. Identify Redirects

Automatically identify redirects from CSV data:

```bash
node scripts/identify-redirects.js
```

This script:
- Scans the shipments CSV files
- Identifies old URL patterns (`/shipments/agl13`)
- Maps them to new URLs (`/agroverse-shipments/agl13`, `/sunmint-tree-planting-pledges/agl13`)
- Handles conflicts (when a shipment appears in both Agroverse and Sunmint)
- Generates `wix_redirects.csv`

### 2. Generate Redirect Files

Generate all redirect files:

```bash
node scripts/generate-redirects.js
```

This creates:
- HTML redirect pages in `redirects/` directory
- Platform-specific configuration files

### 3. Manual Redirects

To add manual redirects, edit `wix_redirects.csv`:

```csv
old_url,new_url
/old/path,/new/path
/another/old/path,/another/new/path
```

Then run `node scripts/generate-redirects.js` again.

## Conflict Resolution

Some shipments appear in both Agroverse and Sunmint. The current approach:

- **Prioritizes Agroverse** for conflicting redirects
- Logs conflicts for manual review
- You may need to create separate redirect pages or use query parameters

Example conflict:
```
/shipments/agl13 → /agroverse-shipments/agl13 (prioritized)
/shipments/agl13 → /sunmint-tree-planting-pledges/agl13 (noted but not redirected)
```

## Deployment

### GitHub Pages

1. Commit the `redirects/` directory
2. The HTML redirect pages will work automatically
3. Optionally use Jekyll redirects plugin if using Jekyll

### Netlify

1. Commit `_redirects` file to root
2. Deploy - redirects work automatically

### Vercel

1. Commit `vercel.json` to root
2. Deploy - redirects work automatically

### Apache

1. Upload `.htaccess` to your web root
2. Ensure `mod_rewrite` is enabled

### Nginx

1. Include `nginx-redirects.conf` in your server block:

```nginx
server {
    # ... other config ...
    include /path/to/nginx-redirects.conf;
}
```

## Testing

After deployment, test redirects:

```bash
# Test a redirect
curl -I https://yourdomain.com/shipments/agl13

# Should return:
# HTTP/1.1 301 Moved Permanently
# Location: /agroverse-shipments/agl13
```

Or visit the URLs in a browser to verify they redirect correctly.

## Current Redirects

The following redirects are currently configured:

- `/shipments/agl0` → `/agroverse-shipments/agl0`
- `/shipments/agl1` → `/agroverse-shipments/agl1`
- `/shipments/agl2` → `/agroverse-shipments/agl2`
- `/shipments/agl3` → `/agroverse-shipments/agl3`
- `/shipments/agl4` → `/agroverse-shipments/agl4`
- `/shipments/agl5` → `/agroverse-shipments/agl5`
- `/shipments/agl6` → `/agroverse-shipments/agl6`
- `/shipments/agl7` → `/agroverse-shipments/agl7`
- `/shipments/agl8` → `/agroverse-shipments/agl8`
- `/shipments/agl10` → `/agroverse-shipments/agl10`
- `/shipments/agl13` → `/agroverse-shipments/agl13`
- `/shipments/agl14` → `/agroverse-shipments/agl14`
- `/shipments/pp1` → `/sunmint-tree-planting-pledges/pp1`
- `/shipments/sef1` → `/sunmint-tree-planting-pledges/sef1`

## Notes

- All redirects are **301 (Permanent)** for SEO purposes
- HTML redirect pages provide fallback for platforms without server-side redirect support
- The `redirects/` directory structure mirrors the old URL structure
- Redirects are automatically identified from CSV data, but can be manually added

## Future Improvements

- Support for query parameter-based routing (e.g., `/shipments/agl13?view=sunmint`)
- Automatic redirect testing
- Integration with sitemap generation

