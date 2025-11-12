# Gift Guides Link Audit Report

**Date:** November 12, 2025  
**Total Links Checked:** 277  
**Guides Audited:** 8

## Summary

Found **10 broken/questionable links** primarily in the Book Lovers guide. These appear to be:
- Outdated Amazon ASINs (B-codes)
- Unreliable vendor domains
- Products that may have been discontinued

## Issues by Guide

### ❌ Book Lovers Guide (10 issues)

This guide has the most link problems, likely because it was created with outdated product information.

| Product | Link Issue | Recommendation |
|---------|-----------|-----------------|
| Kindle Paperwhite | ASIN B08N41Y4Q2 doesn't resolve | Update with current ASIN or remove Amazon link |
| Glocusent Light | Domain unreliable + wrong ASIN | Replace with retailers like Amazon that stock it |
| Book Nook Diorama | robotime.com may be unreliable | Use direct Amazon search or Etsy instead |
| Levoit Humidifier | Official store 404 + wrong ASIN | Verify current product code on Amazon |
| Bellagio Bookmark | ASIN B08RJXVTCD doesn't resolve | Verify or link to general leather bookmark search |
| Capri Blue Candle | ASIN B01N7ZNZL5 doesn't resolve | Update to current ASIN |
| Yamazaki Bookshelf | Domain SSL issues + wrong ASIN | Use West Elm (currently 200 status) as primary |

### ✅ All Other Guides (0 issues)

Coffee, Tech, Gamers, Runners, Food, Toddlers, and Fitness guides have valid links.

## Issues with Current Approach

Some links return 403 errors due to:
- **Etsy** - Bot detection/auth
- **Anthropologie** - Bot detection
- **BookoftheMonth.com** - Bot detection  
- **TheStoryGraph** - Bot detection

These are **NOT actually broken** - they work in browsers but reject automated checks. These are safe to keep.

## How Links Are Structured

Guides follow a consistent pattern:
```markdown
## Product Name

**Where to buy:**
- [**Official Store →**](link1)
- [**Retailer A →**](link2)
- [**Retailer B →**](link3)
- [**Amazon →**](link4)
```

This redundancy is good - if one link breaks, others still work.

## Recommendations

### High Priority
1. **Fix Book Lovers guide immediately** - It has all 10 bad links
   - Replace invalid Amazon ASINs with current codes
   - Test each link manually in a browser
   - Consider using retailer sites (Target, Best Buy) as primaries instead of official small-brand stores

2. **Add link validation to CI/CD** - Set up automated checks before deployment
   - Use `check-links-fast.js` locally before publishing
   - Consider a weekly link health check

### Medium Priority
3. **Standardize link selection** - Prefer retailers over unknown official stores
   - Big retailers: Amazon, Target, Best Buy, REI, Williams Sonoma, etc.
   - Avoid tiny brand official stores that may go down

4. **Track updates** - Note when products are discontinued
   - Add dates to guides
   - Quarterly review of affiliate links

### Nice to Have
5. **Add link checker to build process**
   - Run `npm run check-links` before `npm run build`
   - Flag warnings in CI logs

## Tool Created

Two scripts in `/scripts`:

1. **`check-links-fast.js`** - Quick static analysis (recommended)
   - Fast, no network requests
   - Identifies known problem patterns
   - Run locally: `node scripts/check-links-fast.js`

2. **`check-guide-links.js`** - Full HTTP validation (slow)
   - Makes actual HTTP requests
   - Very slow (277 requests)
   - Useful for thorough audits but overkill for regular checks

## Action Items

- [ ] Fix 10 broken links in Book Lovers guide
- [ ] Verify Amazon ASINs are current and working
- [ ] Test links manually in browser
- [ ] Run `check-links-fast.js` before publishing new guides
- [ ] Add link checking to deployment process

