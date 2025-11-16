# Link Verification and Migration Strategy

## Overview

This document outlines the strategy for handling external links that may break after migration from Wix to the static site.

## Link Categories

### 1. `/whitepaper` - Main Whitepaper

**Current Status:**
- Used in **75 locations** across the site
- All point to: `https://truesight.me/whitepaper`
- Found one Google Doc reference: `https://docs.google.com/document/d/1P-IJq71N0lXszUOdqdjrGwonZAfEuG1q_tJFDdKKIic/edit`

**Recommendation:**
1. **Verify** what `/whitepaper` actually resolves to on the current Wix site
2. **If it's a Google Doc/PDF:**
   - Keep as external link pointing to the actual document URL
   - Update all references to use the direct Google Doc URL or PDF URL
   - Consider hosting a PDF version locally at `/whitepaper.pdf` and add redirect
3. **If it's a Wix page:**
   - Create a static page at `/whitepaper/index.html` OR
   - Add redirect to the actual document location

**Action Items:**
- [x] Verify current `/whitepaper` URL resolves to what ✅ Resolves to Google Doc
- [x] Determine if it should be a static page or remain external ✅ External (Google Doc)
- [x] Add redirect ✅ Added to all redirect configs
- [x] External links preserved ✅ 301 redirects set up

---

### 2. `/ledger` - Contributions Record

**Current Status:**
- Used in **127 locations** across the site
- All point to: `https://truesight.me/ledger`
- Documented as an external Google Sheet

**Recommendation:**
- **Keep as external link** - This is a Google Sheet that should remain external
- **Verify** the link still works after migration
- **No redirect needed** if it's hosted on Google Sheets with a stable URL

**Action Items:**
- [x] Verify `/ledger` resolves to the correct Google Sheet ✅ Resolves to Google Sheet
- [ ] Confirm the Google Sheet is publicly accessible (verify after migration)
- [x] Add redirect ✅ Added to all redirect configs (external links preserved)
- [x] External links preserved ✅ 301 redirects set up

---

### 3. `/agl` - AGL Ledger

**Current Status:**
- Found **1 instance** in `index.html`: `https://truesight.me/agl`
- Referenced as "AGL Ledger"
- Documented as an external Google Sheet

**Recommendation:**
- **Keep as external link** - Similar to `/ledger`, this is a Google Sheet
- **Verify** the link still works after migration
- **No redirect needed** if it's hosted on Google Sheets

**Action Items:**
- [ ] Verify `/agl` resolves to the correct Google Sheet
- [ ] Confirm the Google Sheet is publicly accessible
- [ ] Test link after migration

---

### 4. `/dao/*` - DAO Resources

**Current Status:**
- Found **3 unique paths**:
  - `/dao/agroverse/whitepaper` - Used in `index.html`
  - `/dao/sunmit/project` - Used in `index.html` (note: typo "sunmit" vs "sunmint")
  - `/dao/sunmint/whitepaper` - Used in `index.html`

**Issues Identified:**
1. **Typo**: `/dao/sunmit/project` should likely be `/dao/sunmint/project`
2. All are external resources (whitepapers/project boards)

**Recommendation:**
1. **Verify** each `/dao/*` path resolves to what
2. **Fix typo** if `/dao/sunmit/project` should be `/dao/sunmint/project`
3. **Determine** if these should be:
   - Static pages (create `/dao/agroverse/whitepaper.html`)
   - External links (keep absolute URLs pointing to actual resources)
   - Redirects (if resources are elsewhere)

**Action Items:**
- [ ] Verify `/dao/agroverse/whitepaper` resolves to what
- [ ] Verify `/dao/sunmint/whitepaper` resolves to what
- [ ] Fix typo `/dao/sunmit/project` → `/dao/sunmint/project` if needed
- [ ] Verify `/dao/sunmint/project` resolves to what
- [ ] Decide: static pages, external links, or redirects
- [ ] Update links accordingly

---

## Verification Checklist

### Pre-Migration Verification

1. **Test all external links manually:**
   ```bash
   # Test these URLs to see what they resolve to:
   - https://truesight.me/whitepaper
   - https://truesight.me/ledger
   - https://truesight.me/agl
   - https://truesight.me/dao/agroverse/whitepaper
   - https://truesight.me/dao/sunmint/whitepaper
   - https://truesight.me/dao/sunmit/project (check for typo)
   - https://truesight.me/dao/sunmint/project
   ```

2. **Document what each link resolves to:**
   - Is it a Wix page?
   - Is it a Google Doc/Sheet?
   - Is it a PDF?
   - Is it a 404?

3. **Decide on migration strategy for each:**
   - Keep as external (if resource is elsewhere)
   - Create static page (if content should be on site)
   - Add redirect (if resource moved)

### Post-Migration Testing

1. **Test all links after deployment**
2. **Monitor 404 errors** for these paths
3. **Update redirects** if needed

---

## Redirect Strategy

### Option 1: Keep External (Recommended for Google Docs/Sheets)

**For:** `/ledger`, `/agl`
- These are Google Sheets that should remain external
- Just verify URLs are correct and publicly accessible

### Option 2: Create Static Pages

**For:** `/whitepaper`, `/dao/*/whitepaper`
- If these are meant to be on your site, create static HTML pages
- Host PDF versions if they're documents

### Option 3: Add Redirects

**For:** Any paths that need to redirect to new locations

Add to redirect configuration files:
- `_redirects` (Netlify)
- `vercel.json` (Vercel)
- `.htaccess` (Apache)
- `nginx-redirects.conf` (Nginx)

Example redirect format:
```
/whitepaper /whitepaper/index.html 200
# OR if external:
/whitepaper https://docs.google.com/document/d/1P-IJq71N0lXszUOdqdjrGwonZAfEuG1q_tJFDdKKIic/edit 301
```

---

## Implementation Priority

### High Priority (Critical Links)
1. ✅ `/whitepaper` - Used in 75 locations, main CTA
2. ✅ `/ledger` - Used in 127 locations, key resource

### Medium Priority (Important Links)
3. ⚠️ `/agl` - Used in 1 location but important
4. ⚠️ `/dao/*/whitepaper` - Project-specific resources

### Low Priority (Verify & Fix)
5. ⚠️ `/dao/sunmit/project` - Fix typo, verify URL

---

## Script to Verify Links

You can create a simple script to test all these links:

```javascript
// scripts/verify-external-links.js
const links = [
  'https://truesight.me/whitepaper',
  'https://truesight.me/ledger',
  'https://truesight.me/agl',
  'https://truesight.me/dao/agroverse/whitepaper',
  'https://truesight.me/dao/sunmint/whitepaper',
  'https://truesight.me/dao/sunmit/project',
  'https://truesight.me/dao/sunmint/project'
];

// Test each link and log results
```

---

## Recommendations Summary

1. **Immediate Actions:**
   - Verify all 6-7 URLs manually before migration
   - Fix typo in `/dao/sunmit/project` if confirmed
   - Document what each URL resolves to

2. **Migration Strategy:**
   - Keep `/ledger` and `/agl` as external (Google Sheets)
   - Decide on `/whitepaper` - likely create static page or redirect
   - Decide on `/dao/*` paths - likely keep external or create pages

3. **Post-Migration:**
   - Test all links after deployment
   - Monitor for 404s
   - Add redirects as needed

---

## Implementation Status

### ✅ Completed

1. **HTML Redirect Pages for GitHub Pages** (Primary hosting platform)
   - Created `/whitepaper/index.html` → Redirects to Google Doc
   - Created `/ledger/index.html` → Redirects to Google Sheet
   - Uses meta refresh + JavaScript redirects for maximum compatibility

2. **Server-Side Redirects** (For other platforms)
   - Added to `_redirects` (Netlify)
   - Added to `vercel.json` (Vercel)
   - Added to `.htaccess` (Apache)
   - Added to `nginx-redirects.conf` (Nginx)

### Note: GitHub Pages

Since the site is hosted on **GitHub Pages**, the HTML redirect pages in `/whitepaper/index.html` and `/ledger/index.html` are the primary redirect mechanism. These will work automatically when users access:
- `https://truesight.me/whitepaper`
- `https://truesight.me/ledger`

The server-side redirect configurations (vercel.json, .htaccess, etc.) are available for alternative hosting platforms but are not used by GitHub Pages.

## Next Steps

1. ✅ **Manual Verification** - Confirmed both URLs resolve correctly
2. ✅ **Implementation** - HTML redirect pages created for GitHub Pages
3. **Testing** - Verify all links work after deployment to GitHub Pages
4. **Monitor** - Check for any 404 errors after migration

