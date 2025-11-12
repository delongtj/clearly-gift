# clearly.gift - Requirements Document

## Project Overview
An intentionally simple gift wish list sharing app with content marketing through gift guides. The USP is extreme simplicity and un-cluttered design compared to competitors.

**Brand Colors:** #069668, #1F2937

## Core Features

### 1. Authentication
- Dead-simple sign-up: email address → verification code → logged in
- No complex registration flow

### 2. Lists Management
- Users can create unlimited Lists
- Each List has:
  - Required: name field (user-set)
  - Auto-generated: 64-character random token
- Share button generates public URL: `https://clearly.gift/list/<token>`

### 3. Items Management
- Lists contain unlimited Items
- Each Item has:
  - Required: name field
  - Optional: url field
  - Auto-generated: formatted_url field (system processes urls)
  - Optional: description text field
  - Nullable: claimed_at timestamp
  - Nullable: claimed_by string field

### 4. Public List Viewing
- **No authentication required** for viewing/claiming
- Must support OpenGraph tags for link previews
- Claimed items are visually diminished (faded, moved to bottom)
- Owner viewing their own public link sees cheeky message instead

### 5. Item Claiming
- Visitors can claim items without signing up
- Optional claimed_by text field during claiming
- Need to consider un-claim functionality

## Content Strategy

### Gift Guides
- 30-50 generated content pieces
- Format: "Top Gifts for [Demographic] 2025"
- Each guide contains:
  - 10 curated items
  - Nice images
  - Explanatory text for each item
  - Product links (affiliate-enabled)
- Need directory/navigation for SEO

### Home Page
- Showcase core features
- Promote gift guides
- Clean, uncluttered design

## Monetization
- Affiliate links (primary: Amazon)
- Secondary partners: Target, Walmart, Etsy
- Links in both content and user wish lists get affiliate IDs when possible

## Technical Constraints
- Host as cheaply as possible (ideally free)
- Supabase consideration for backend
- Must support OpenGraph metadata
- Clean, sparse UI design

## URL Processing & Affiliate Links
- Strip tracking/marketing parameters from URLs
- Auto-append affiliate IDs when possible
- Replace existing affiliate IDs (we are ultimate traffic source)
- Target partners: Amazon (primary), Target, Walmart, Etsy

## User Limits & Guardrails
- Basic limits on lists/items per user as guardrails
- No strict business restrictions

## Analytics Requirements
- Track list view counts (visible to visitors)
- Track link click counts per item (visible to visitors)
- General user behavior analytics

## Content Management
- Users can fully edit/modify Lists and Items after creation
- Handle edge case: deleting claimed items (TBD approach)

## Un-claim Flow
- Requires confirmation but no authentication
- Must remain frictionless (no signup/signin required)
- Implementation approach TBD

## Content Strategy Notes
- Gift guides primarily for Amazon affiliate requirement
- Secondary benefit: drive some traffic
- **No CMS**: Static content generation (likely via Claude Code)
- Content stored as markdown/MDX files in repository
- Categorization structure TBD

## Proposed Tech Stack
- **Frontend**: Next.js 14+ (App Router for SEO, OpenGraph, static generation)
- **Backend**: Supabase (free tier, auth, real-time analytics)
- **Hosting**: Vercel (free tier, perfect Next.js integration)
- **Content**: Static markdown/MDX files (no CMS needed)
- **Analytics**: Supabase built-in + optional Plausible
- **Cost**: $0 for initial deployment