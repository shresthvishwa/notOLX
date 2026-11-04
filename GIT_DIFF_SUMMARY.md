# Project Git Logs & Architectural Summary: `notoLX`

A complete chronological record of all commits and an architectural breakdown of the **notoLX** (@thapar.edu) campus marketplace, categorized into **Pre-MST** (commits up to **September 8, 2026**) and **Post-MST** (commits after **September 8, 2026**).

---

## 1. Executive Summary & Repository Metrics

| Metric | Pre-MST Phase | Post-MST Phase | Total Project |
| :--- | :--- | :--- | :--- |
| **Date Range** | Aug 18, 2026 – Sep 8, 2026 | Oct 28, 2026 – Nov 4, 2026 | Aug 18 – Nov 4, 2026 |
| **Total Commits** | **64 commits** (80.0%) | **16 commits** (20.0%) | **80 commits** |
| **Boundary Cutoff** | Cutoff: `356c9f7` (Sep 8, 2026, 16:06) | Starts: `a6d98f8` (Oct 28, 2026, 00:14) | Head: `427d4cc` |
| **Primary Focus** | User auth, DB schema, chat, search, reviews | Wanted board, Gmail SMTP email pipeline, vintage redesign | Peer-to-Peer Campus Marketplace |

---

## 2. Complete Chronological Commit Logs (80 Commits)

### Section 2A: Pre-MST Commit Logs (Till September 8, 2026) — 64 Commits

| # | Commit | Date & Time (IST) | Author | Commit Message |
| :-: | :---: | :---: | :---: | :--- |
| 01 | `d7e406d` | 2026-08-18 00:19:27 | Shresth Vishwakarma | Initial commit: notOLX Thapar Campus Marketplace with Gothic Noir & Supabase support |
| 02 | `ead2cd7` | 2026-08-18 14:40:45 | Shresth Vishwakarma | Add Express backend server, Thapar @thapar.edu authentication, Gothic Noir & Light themes |
| 03 | `321e8cc` | 2026-08-18 15:06:22 | Shresth Vishwakarma | Add dist production build and node_modules dependencies to Git tracking |
| 04 | `136a3de` | 2026-08-18 15:24:18 | Shresth Vishwakarma | Fix Vercel build error code 126: Remove tracked node_modules and dist, add vercel.json configuration |
| 05 | `1ae3d12` | 2026-08-18 15:56:39 | Aditya Salwan | Set default website theme to Light Mode |
| 06 | `57c40dc` | 2026-08-18 16:35:24 | Nishchay Goyal | Update currency from USD ($) to INR (₹) across the application |
| 07 | `b9b27c7` | 2026-08-18 16:41:42 | Nishchay Goyal | Add Google OAuth with @thapar.edu domain restriction & real-time chat messaging |
| 08 | `de55c61` | 2026-08-18 16:46:00 | Nishchay Goyal | Remove Recent Campus Listings section from landing page |
| 09 | `e9456b5` | 2026-08-18 16:48:04 | Nishchay Goyal | Revert 'Remove Recent Campus Listings section from landing page' |
| 10 | `a5b07a3` | 2026-08-18 16:53:58 | Aditya Salwan | Remove custom thapar.edu email input from GoogleSignInModal |
| 11 | `1387dfc` | 2026-08-18 16:55:07 | Aditya Salwan | Merge remote-tracking branch 'origin/main' into main (resolved GoogleSignInModal conflicts) |
| 12 | `a1bac51` | 2026-08-18 17:28:56 | Nishchay Goyal | Fix user session and marketplace view persistence across page refreshes |
| 13 | `ad1fdca` | 2026-08-18 17:29:13 | Nishchay Goyal | Merge branch 'main' of https://github.com/shresthvishwa/notOLX |
| 14 | `5d74d1b` | 2026-08-18 17:32:05 | Aditya Salwan | Enable Log Out button across Navbar dropdown, Profile modal, and AppContext |
| 15 | `7144dac` | 2026-08-18 17:32:09 | Aditya Salwan | Merge branch 'main' of https://github.com/shresthvishwa/notOLX |
| 16 | `f16aa48` | 2026-08-18 17:34:26 | Aditya Salwan | Automatically redirect user to Landing Page after logging out |
| 17 | `4aed9b6` | 2026-08-18 22:52:14 | Nishchay Goyal | Implement user-to-user real-time chat & texting between buyers and sellers |
| 18 | `c53f711` | 2026-08-18 22:52:21 | Nishchay Goyal | Merge branch 'main' of https://github.com/shresthvishwa/notOLX |
| 19 | `2868b07` | 2026-08-19 00:09:43 | Shresth Vishwakarma | Add signInWithGoogle OAuth handler with hd: thapar.edu domain restriction |
| 20 | `889eacb` | 2026-08-19 00:10:35 | Shresth Vishwakarma | Merge remote main: Integrate handleLogout and signInWithGoogle |
| 21 | `2539886` | 2026-08-19 00:12:31 | Shresth Vishwakarma | Remove Recent Campus Listings section from Landing Page |
| 22 | `3d35ada` | 2026-08-19 00:21:10 | Shresth Vishwakarma | Update Landing Page: refined hero subtext, badge to THAPAR UNIVERSITY EXCLUSIVE, removed demo switcher block |
| 23 | `5981d4b` | 2026-08-19 00:22:47 | Shresth Vishwakarma | Reduce font sizes, icon dimensions, and padding of Landing Page feature pillar section |
| 24 | `59219a0` | 2026-08-19 00:23:58 | Shresth Vishwakarma | Wrap feature pillar cards into styled box containers on Landing Page |
| 25 | `108dd45` | 2026-08-19 00:26:50 | Shresth Vishwakarma | Fix Google OAuth automatic redirection: Automatically switch viewMode to marketplace on authentication |
| 26 | `0c717ea` | 2026-08-19 00:32:02 | Shresth Vishwakarma | Update Marketplace Hero Banner heading to Your Trusted Peer-to-Peer Campus Exchange |
| 27 | `5d7f20e` | 2026-08-19 00:36:54 | Shresth Vishwakarma | Add subtext description to Marketplace Hero Banner |
| 28 | `30f65bb` | 2026-08-19 00:40:10 | Shresth Vishwakarma | Add Delete Account feature with confirmation prompt and database cleanup |
| 29 | `7633537` | 2026-08-19 02:50:10 | Nishchay Goyal | Fix chat history persistence across page refreshes & enable live user-to-user texting engine |
| 30 | `aacd3f6` | 2026-08-19 02:50:18 | Nishchay Goyal | Merge branch 'main' of https://github.com/shresthvishwa/notOLX |
| 31 | `c2c81f9` | 2026-08-19 02:54:17 | Nishchay Goyal | Fix conversation matching and add interactive Messages dropdown in Navbar |
| 32 | `ce88f50` | 2026-08-19 03:06:10 | Nishchay Goyal | Rebuild real-time messaging architecture with deduplication, status tracking, and rate limiting |
| 33 | `7b5b8a6` | 2026-08-19 03:10:19 | Nishchay Goyal | Fix message status handling to ensure seamless sent state with local fallback |
| 34 | `594a754` | 2026-08-19 03:17:32 | Nishchay Goyal | Fix cross-device real-time chat sync and dynamic API host resolution |
| 35 | `79efb97` | 2026-08-19 10:30:48 | Nishchay Goyal | Enable cross-device marketplace listing synchronization and live polling |
| 36 | `272fba2` | 2026-08-19 10:40:38 | Nishchay Goyal | Fix new listing visibility by expanding price filter cap and auto-resetting marketplace filters |
| 37 | `c9f60f7` | 2026-08-19 10:46:54 | Nishchay Goyal | Add seller attribution, Posted by You badge, user profile listings linking, and item deletion |
| 38 | `75e2c47` | 2026-08-19 10:48:38 | Nishchay Goyal | Revert 'Add seller attribution, Posted by You badge, user profile listings linking, and item deletion' |
| 39 | `aa456f0` | 2026-08-19 14:16:47 | Aditya Salwan | Fix listing visibility and Supabase payload UUID format matching |
| 40 | `cabf413` | 2026-08-19 14:16:51 | Aditya Salwan | Merge branch 'main' of https://github.com/shresthvishwa/notOLX |
| 41 | `d69340c` | 2026-08-19 14:20:13 | Nishchay Goyal | Enforce seller authentication and fix listing seller attribution disconnect |
| 42 | `8eb377e` | 2026-08-19 14:21:40 | Nishchay Goyal | Merge remote-tracking branch 'origin/main' and enforce seller authentication |
| 43 | `ca3ca0e` | 2026-08-19 14:35:38 | Aditya Salwan | Fix cross-device real-time chat and listing sync payloads and RLS schema policies |
| 44 | `2c4910a` | 2026-08-19 14:35:43 | Aditya Salwan | Merge branch 'main' of https://github.com/shresthvishwa/notOLX |
| 45 | `ef84daa` | 2026-08-22 22:14:17 | Aditya Salwan | Add dedicated My Selling Space modal and category filter tab for selling items |
| 46 | `7dd080e` | 2026-08-22 22:19:08 | Aditya Salwan | Remove dummy accounts and enforce verified Google @thapar.edu authentication |
| 47 | `2de3e3e` | 2026-08-22 22:23:10 | Aditya Salwan | Fix null reference exceptions for unauthenticated currentUser state |
| 48 | `33ade4f` | 2026-08-22 22:26:09 | Aditya Salwan | Revert 'Remove dummy accounts and enforce verified Google @thapar.edu authentication' |
| 49 | `ac43332` | 2026-08-22 22:44:11 | Aditya Salwan | Fix cross-device authentication and RLS policy matching with actual Supabase auth.uid() |
| 50 | `319a2e7` | 2026-08-23 22:10:54 | Aditya Salwan | Remove dummy accounts and persona switcher UI, enforcing pure authenticated Supabase accounts |
| 51 | `de59614` | 2026-08-23 22:20:38 | Aditya Salwan | Fix ID mismatch and add continuous background sync for cross-device messaging and listings |
| 52 | `95a528e` | 2026-08-25 22:23:59 | Aditya Salwan | Fix RLS policy blocking listing inserts and add cloud sync error feedback |
| 53 | `d58f345` | 2026-08-26 02:22:18 | AdixxXXxx | Update GoogleSignInModal.jsx |
| 54 | `9eb61b5` | 2026-09-01 14:52:03 | Nishchay Goyal | Update application brand name from notOLX to notoLX across UI, server, and schema |
| 55 | `0b079cc` | 2026-09-01 14:52:20 | Nishchay Goyal | Merge branch 'main' of https://github.com/shresthvishwa/notOLX |
| 56 | `4f56d50` | 2026-09-02 13:29:41 | Aditya Salwan | Replace image URL text input with direct device image file upload |
| 57 | `3c53220` | 2026-09-02 13:30:19 | Aditya Salwan | Merge branch 'main' of https://github.com/shresthvishwa/notOLX |
| 58 | `2d32f5b` | 2026-09-02 13:50:40 | Aditya Salwan | Remove testing photo preset buttons from Sell Item modal |
| 59 | `20fa140` | 2026-09-03 11:01:23 | Nishchay Goyal | Fix Mark as Sold and Mark as Reserved status persistence across backend, Supabase, and live polling |
| 60 | `65081c7` | 2026-09-03 11:01:31 | Nishchay Goyal | Merge branch 'main' of https://github.com/shresthvishwa/notOLX |
| 61 | `10c150a` | 2026-09-03 11:07:17 | Nishchay Goyal | Implement smart search bar with campus synonyms, fuzzy token matching, and relevance ranking |
| 62 | `1790bd8` | 2026-09-08 15:56:26 | Aditya Salwan | Remove all dummy listings and keep only items posted by authenticated users |
| 63 | `a0e7461` | 2026-09-08 15:56:34 | Aditya Salwan | Merge branch 'main' of https://github.com/shresthvishwa/notOLX |
| 64 | `356c9f7` | 2026-09-08 16:06:06 | Aditya Salwan | Sync review table with Supabase, enable mutual seller/buyer trade rating, and display updated ratings on listings |

### Section 2B: Post-MST Commit Logs (After September 8, 2026) — 16 Commits

| # | Commit | Date & Time (IST) | Author | Commit Message |
| :-: | :---: | :---: | :---: | :--- |
| 65 | `a6d98f8` | 2026-10-28 00:14:59 | Aditya Salwan | Add campus item requests, wanted board, and automated email notifications on listing match |
| 66 | `f9e1608` | 2026-10-28 00:30:50 | Aditya Salwan | Fix search bar typing visibility, color-scheme, and input state synchronization |
| 67 | `8c983ea` | 2026-11-03 00:29:20 | Shresth Vishwakarma | Fix instant email notifications: add emailService, Vite dev middleware, Vercel serverless function, and request matching engine |
| 68 | `1e08811` | 2026-11-03 00:56:29 | Shresth Vishwakarma | Redesign Landing Page to vintage paper aesthetic with painted brush hero, custom pill navbar, and verified pillars |
| 69 | `9171a7b` | 2026-11-03 01:03:33 | Shresth Vishwakarma | Remove bottom feature pillars and restyle notoLX headline badge |
| 70 | `cbcd60e` | 2026-11-03 01:15:07 | Shresth Vishwakarma | Remove theme mode toggle and unify application with Vintage Parchment & Maroon theme |
| 71 | `b9f9434` | 2026-11-03 01:29:39 | Shresth Vishwakarma | Update notoLX landing page logo to distressed dry-brush maroon style |
| 72 | `4f68ad5` | 2026-11-03 01:35:44 | Shresth Vishwakarma | Enhance color contrast and readability for trust pillars, footer, and theme variables |
| 73 | `5a5b26d` | 2026-11-03 17:14:09 | Shresth Vishwakarma | docs: add agent git workflow rules |
| 74 | `9503c2c` | 2026-11-03 17:24:19 | Shresth Vishwakarma | feat: add vintage distressed-paper background for main marketplace page |
| 75 | `c4e0113` | 2026-11-03 17:28:39 | Shresth Vishwakarma | style: update main background to pure vintage torn paper without paint effects |
| 76 | `bab793a` | 2026-11-03 17:36:01 | Shresth Vishwakarma | style: warm and darken navbar and card tones to blend with vintage paper |
| 77 | `f66bf67` | 2026-11-03 17:40:21 | Shresth Vishwakarma | style: deepen warm parchment tones for navbar and cards |
| 78 | `fc454ad` | 2026-11-04 15:36:07 | Shresth Vishwakarma | feat: configure and verify real Gmail SMTP inbox delivery for campus notifications |
| 79 | `6aec2ab` | 2026-11-04 15:54:45 | Shresth Vishwakarma | feat: add instant request confirmation emails and immediate marketplace match scanning |
| 80 | `427d4cc` | 2026-11-04 16:35:26 | Shresth Vishwakarma | docs: embed post-mst architectural summary and commit diffs into project.diff |

---

## 3. Summary of Changes: Pre-MST (Till September 8, 2026)

1. **System & Security Foundation**:
   - Initialized Vite + React 19 architecture with Supabase PostgreSQL cloud database.
   - Built Express.js backend server (`server/index.js`) on port 5000 with REST API endpoints for listings, conversations, and user authentication.
   - Enforced institutional verification: restricted access strictly to Google `@thapar.edu` accounts with OAuth token validation.
2. **Marketplace Supply Operations**:
   - Full product listing lifecycle: title, category, price in INR (₹), condition (New, Like New, Good, Fair), and meetup locations across Thapar campus.
   - Integrated direct device image upload replacing external URL inputs.
   - Built dedicated **My Selling Space** (`MySellingItemsModal.jsx`) allowing student sellers to view, edit, mark as sold, mark as reserved, or delete listings.
3. **Real-Time Messaging & Chat**:
   - Implemented real-time messaging between buyers and sellers (`ChatModal.jsx`) with deduplication, message status tracking (`sending`, `sent`, `delivered`), and optimistic UI updates.
   - Built an interactive Messages dropdown in the top navigation bar with a live 3-second background polling engine.
4. **Discovery & Reputation**:
   - Developed **Smart Search** (`smartSearch.js`) with tokenized fuzzy matching, relevance ranking, and campus synonym resolution.
   - Mutual trade review & 5-star rating system (`ReviewModal.jsx`) synchronized to Supabase student profiles.

---

## 4. Summary of Changes: Post-MST (After September 8, 2026)

1. **Campus Item Requests & Wanted Board (Demand-Side Matching)**:
   - Solved the supply-only marketplace limitation by enabling students to post "Wanted" requests for unavailable campus items.
   - Developed [`CampusRequestsModal.jsx`](file:///d:/College/notOLX/src/components/Requests/CampusRequestsModal.jsx) and [`CreateItemRequestModal.jsx`](file:///d:/College/notOLX/src/components/Requests/CreateItemRequestModal.jsx).
   - Added REST endpoints (`/api/item-requests`) and Supabase `item_requests` table with RLS security policies.
2. **Automated Heuristic Match Detection Engine**:
   - Created multi-criteria matching algorithm (`AppContext.jsx` & `smartSearch.js`) evaluating:
     - Bidirectional substring inclusion across title and description.
     - Tokenized relevance scoring (`calculateListingRelevanceScore >= 20`).
     - Significant keyword set intersection ($\ge 3$ characters, filtering common stop words).
     - Domain category matching.
   - Scans existing listings upon request creation, and scans active requests upon new listing creation.
3. **Production Gmail SMTP Real Inbox Delivery Pipeline**:
   - Integrated Nodemailer service in [`server/emailService.js`](file:///d:/College/notOLX/server/emailService.js).
   - Live SMTP over port 465 SSL/TLS using authenticated Gmail account (`noreply.notolx@gmail.com`) and Google App Passwords with space-stripping sanitization.
   - Branded RFC 2822-compliant responsive HTML email templates with Thapar Maroon (`#5E2424`).
   - Dispatches instant request confirmations and instant match alerts with direct listing chat links.
   - Cross-environment dispatch parity: Vite Dev Server Connect middleware, Express backend, and Vercel Serverless Functions.
4. **Bespoke Vintage Editorial Print Redesign**:
   - Redesigned landing page with custom pill navigation, verified domain badges, and distressed brush hero typography.
   - Generated custom high-res handmade cotton paper background with realistic torn deckle borders ([`public/marketplace-bg.jpg`](file:///d:/College/notOLX/public/marketplace-bg.jpg)) on warm ivory base (`#F2E8DC`).
   - Harmonized palette: `--bg-app` (`#F3E6DD`), `--bg-card` (`#E8DCCF`), `--primary` (`#5E2424` Thapar Maroon).
   - Frosted semi-transparent sticky navbar with `backdrop-filter: blur(12px)`.
5. **Engineering Governance**:
   - Added [`AGENTS.md`](file:///d:/College/notOLX/AGENTS.md) specifying strict Git collaboration protocols (fetch/pull before work, explicit user confirmation before commit/push).

---

## 5. Comparative Architectural Matrix

| Dimension | Pre-MST State (till Sep 8, 2026) | Post-MST State (after Sep 8, 2026) |
| :--- | :--- | :--- |
| **Market Model** | Supply-Only (Sellers post, buyers browse passively) | **Dual-Sided Matching** (Wanted Board + Instant Match Discovery) |
| **Notification Engine** | In-app badge counts only (requires active browser tab) | **Real Gmail SMTP Inbox Delivery** (Instant emails via port 465 SSL) |
| **Discovery Engine** | Keyword search with campus synonyms | Keyword search + **automated multi-criteria heuristic match scoring** |
| **User Interface** | Gothic Noir Dark / Light Toggle | **Bespoke Vintage Editorial Print** (Parchment `#F2E8DC`, Maroon `#5E2424`) |
| **Backend Integration** | Express server on port 5000 & Supabase DB | Parity across **Vite Dev Middleware**, Express backend & Vercel Functions |
