# Navigation Menu Analysis

## Legacy Wix Menu Structure

### Main Menu Items:
1. **Home** - `https://www.truesight.me` → Maps to `index.html` ✓
2. **About Us** - `https://www.truesight.me/about` → Maps to `about-us.html` ✓
3. **Ongoing Projects** (dropdown)
   - Agroverse Community - `https://www.truesight.me/agroverse` → Maps to `agroverse.html` ✓
   - Sunmint Program - `https://www.truesight.me/sunmint` → Maps to `sunmint.html` ✓
   - Edgar Platform - `https://www.truesight.me/edgar` → Maps to `edgar.html` ✓
4. **Community Hub** (dropdown)
   - Community Challenges - `https://truesight.me/quests` → External (separate app)
   - Community Proposals - `https://truesight.me/proposals` → External (separate app)
   - Community Leaders - `https://truesight.me/governors` → External (separate app)
   - Upcoming Community Awards - `https://truesight.me/submissions/scored-and-to-be-tokenized` → External (separate app)
   - Ongoing Community Awards - `https://truesight.me/recurring-tdg-awards` → External (separate app)
5. **Resources** (dropdown)
   - Frequently Asked Questions - `https://www.truesight.me/faq` → Could map to `faq.html` (needs to be created)
   - Community Economics - `https://truesight.me/tokenomics` → External (separate site)
   - Web App - `https://truesight.me/dapp` → External (separate app)
   - Contributions Record - `https://truesight.me/ledger` → External (separate app)
   - Community Engagement Logs - `https://truesight.me/submissions/raw-telegram-chatlogs` → External (separate app)
   - Warehouse Manager Agreement - `https://agroverse.shop/community-warehouse-manager/sla` → External (agroverse.shop)
   - Distributor Agreement - `https://agroverse.shop/community-distributor/agreement` → External (agroverse.shop)
6. **Assets** (dropdown)
   - Asset Locations - `https://truesight.me/physical-asset-locations` → External (separate app)
   - Asset Movements - `https://truesight.me/physical-asset-movements` → External (separate app)
   - Transactions - `https://truesight.me/physical-transactions` → External (separate app)
   - Asset Consignments - `https://agroverse.shop/consignments` → External (agroverse.shop)
   - QR Code Registry - `https://truesight.me/physical-assets/serialized` → External (separate app)
   - Digital Assets - `https://truesight.me/digital-assets` → External (separate app)
7. **Blog** - `https://www.truesight.me/blog` → Maps to `blog/index.html` ✓

## Migration Impact Analysis

### Links that WILL continue working after domain migration:
All links using `truesight.me` (without `www.`) point to separate apps/sites and will continue working:
- ✅ `https://truesight.me/quests` - Separate app (Community Challenges)
- ✅ `https://truesight.me/proposals` - Separate app (Community Proposals)
- ✅ `https://truesight.me/governors` - Separate app (Community Leaders)
- ✅ `https://truesight.me/submissions/scored-and-to-be-tokenized` - Separate app (Upcoming Community Awards)
- ✅ `https://truesight.me/recurring-tdg-awards` - Separate app (Ongoing Community Awards)
- ✅ `https://truesight.me/tokenomics` - Separate site (Community Economics)
- ✅ `https://truesight.me/dapp` - Separate app (Web App)
- ✅ `https://truesight.me/ledger` - Separate app (Contributions Record)
- ✅ `https://truesight.me/submissions/raw-telegram-chatlogs` - Separate app (Community Engagement Logs)
- ✅ `https://truesight.me/physical-asset-locations` - Separate app (Asset Locations)
- ✅ `https://truesight.me/physical-asset-movements` - Separate app (Asset Movements)
- ✅ `https://truesight.me/physical-transactions` - Separate app (Transactions)
- ✅ `https://truesight.me/physical-assets/serialized` - Separate app (QR Code Registry)
- ✅ `https://truesight.me/digital-assets` - Separate app (Digital Assets)

All `agroverse.shop` links will continue working (separate domain):
- ✅ `https://agroverse.shop/community-warehouse-manager/sla` - Warehouse Manager Agreement
- ✅ `https://agroverse.shop/community-distributor/agreement` - Distributor Agreement
- ✅ `https://agroverse.shop/consignments` - Asset Consignments

### Links that NEED ATTENTION:
- ⚠️ `https://www.truesight.me/faq` - Currently doesn't exist on static site
  - **Action Required**: Create `faq.html` page or update link to remove from menu until page is created
  - **Current Status**: Left as external link pointing to Wix site (will break after full migration)

### Internal links (will work with relative paths):
All internal pages use relative paths and will work correctly:
- ✅ `index.html` - Home
- ✅ `about-us.html` - About Us
- ✅ `agroverse.html` - Agroverse Community
- ✅ `sunmint.html` - Sunmint Program
- ✅ `edgar.html` - Edgar Platform
- ✅ `blog/index.html` - Blog

## Implementation Plan

1. **Add dropdown menu CSS** - Support nested navigation menus
2. **Update navigation HTML** - Add dropdown structure with all menu items
3. **Use relative paths** - For internal pages (index.html, agroverse.html, etc.)
4. **Keep external links** - All `truesight.me` and `agroverse.shop` links remain as external with `target="_blank"`
5. **Mobile support** - Ensure dropdowns work in mobile menu

