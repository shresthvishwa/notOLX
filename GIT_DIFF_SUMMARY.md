# Project Git Diff & Commit Summary: `notoLX`

A complete chronological breakdown and technical diff report for the **notoLX** (@thapar.edu) campus marketplace, categorized into **Pre-MST** (commits up to **September 8, 2026**) and **Post-MST** (commits after **September 8, 2026**).

---

## 1. Executive Summary & Repository Metrics

| Metric | Pre-MST Phase | Post-MST Phase | Total Project |
| :--- | :--- | :--- | :--- |
| **Date Range** | Aug 18, 2026 – Sep 8, 2026 | Oct 28, 2026 – Nov 4, 2026 | Aug 18 – Nov 4, 2026 |
| **Total Commits** | **64 commits** (81.0%) | **15 commits** (19.0%) | **79 commits** |
| **Boundary Cutoff** | Cutoff: `356c9f7` (Sep 8, 2026, 16:06) | Starts: `a6d98f8` (Oct 28, 2026, 00:14) | Head: `6aec2ab` |
| **Code Delta (Post-MST vs Pre-MST)** | Foundation & Core MVP | **26 files changed**, `+2,051 / -434` lines | Full Stack Platform |
| **Primary Focus** | User auth, DB schema, chat, search, reviews | Wanted board, Gmail SMTP email pipeline, vintage redesign | Peer-to-Peer Campus Marketplace |

---

## 2. Post-MST Phase (Commits After September 8, 2026)

The Post-MST period introduced the **Campus Wanted Board**, an **automated matching heuristic engine**, **RFC-compliant Gmail SMTP real inbox notifications**, and a complete UI transformation to a **warm vintage paper aesthetic**.

### Complete Post-MST Commit Log (15 Commits)

| # | Commit | Date & Time (IST) | Author | Commit Message |
| :-: | :---: | :---: | :---: | :--- |
| 15 | `6aec2ab` | 2026-11-04 15:54 | Shresth Vishwakarma | `feat`: add instant request confirmation emails and immediate marketplace match scanning |
| 14 | `fc454ad` | 2026-11-04 15:36 | Shresth Vishwakarma | `feat`: configure and verify real Gmail SMTP inbox delivery for campus notifications |
| 13 | `f66bf67` | 2026-11-03 17:40 | Shresth Vishwakarma | `style`: deepen warm parchment tones for navbar and cards |
| 12 | `bab793a` | 2026-11-03 17:36 | Shresth Vishwakarma | `style`: warm and darken navbar and card tones to blend with vintage paper |
| 11 | `c4e0113` | 2026-11-03 17:28 | Shresth Vishwakarma | `style`: update main background to pure vintage torn paper without paint effects |
| 10 | `9503c2c` | 2026-11-03 17:24 | Shresth Vishwakarma | `feat`: add vintage distressed-paper background for main marketplace page |
| 9 | `5a5b26d` | 2026-11-03 17:14 | Shresth Vishwakarma | `docs`: add agent git workflow rules |
| 8 | `4f68ad5` | 2026-11-03 01:35 | Shresth Vishwakarma | Enhance color contrast and readability for trust pillars, footer, and theme variables |
| 7 | `b9f9434` | 2026-11-03 01:29 | Shresth Vishwakarma | Update notoLX landing page logo to distressed dry-brush maroon style |
| 6 | `cbcd60e` | 2026-11-03 01:15 | Shresth Vishwakarma | Remove theme mode toggle and unify application with Vintage Parchment & Maroon theme |
| 5 | `9171a7b` | 2026-11-03 01:03 | Shresth Vishwakarma | Remove bottom feature pillars and restyle notoLX headline badge |
| 4 | `1e08811` | 2026-11-03 00:56 | Shresth Vishwakarma | Redesign Landing Page to vintage paper aesthetic with painted brush hero, custom pill navbar, and verified pillars |
| 3 | `8c983ea` | 2026-11-03 00:29 | Shresth Vishwakarma | Fix instant email notifications: add emailService, Vite dev middleware, Vercel serverless function, and request matching engine |
| 2 | `f9e1608` | 2026-10-28 00:30 | Aditya Salwan | Fix search bar typing visibility, color-scheme, and input state synchronization |
| 1 | `a6d98f8` | 2026-10-28 00:14 | Aditya Salwan | Add campus item requests, wanted board, and automated email notifications on listing match |

### Post-MST File Delta Statistics (`git diff --stat 356c9f7..HEAD`)

```text
 .env.example                                       |  12 +
 AGENTS.md                                          |   5 +
 api/item-requests.js                               |  17 +
 api/notify-request-created.js                      |  44 ++
 api/notify-request-match.js                        |  43 ++
 index.html                                         |   2 +-
 package-lock.json                                  |  64 +--
 package.json                                       |   1 +
 public/landing-bg-clean.jpg                        | Bin 0 -> 134345 bytes
 public/landing-reference.jpg                       | Bin 0 -> 296706 bytes
 public/marketplace-bg.jpg                          | Bin 0 -> 845076 bytes
 public/notolx-brush-hero.png                       | Bin 0 -> 92245 bytes
 public/notolx-distressed-logo.png                  | Bin 0 -> 91314 bytes
 server/emailService.js                             | 295 +++++++++++++
 server/index.js                                    | 135 +++++-
 src/App.jsx                                        | 151 +++++--
 src/components/Common/Navbar.jsx                   |  79 +++-
 src/components/Landing/GoogleSignInModal.jsx       |  18 +-
 src/components/Landing/LandingPage.jsx             | 469 ++++++++++++---------
 src/components/Requests/CampusRequestsModal.jsx    | 321 ++++++++++++++
 src/components/Requests/CreateItemRequestModal.jsx | 202 +++++++++
 src/context/AppContext.jsx                         | 324 +++++++++++++-
 src/index.css                                      | 152 ++++---
 supabase_schema.sql                                |  43 ++
 vercel.json                                        |   2 +-
 vite.config.js                                     | 106 ++++-
 26 files changed, 2051 insertions(+), 434 deletions(-)
```

---

## 3. Pre-MST Phase (Commits Up to September 8, 2026)

The Pre-MST period laid out the foundational architecture of the application, establishing verified student authentication, Supabase cloud sync, live chat, search ranking, and mutual reviews.

### Complete Pre-MST Commit Log (64 Commits)

| # | Commit | Date & Time (IST) | Author | Commit Message |
| :-: | :---: | :---: | :---: | :--- |
| 64 | `356c9f7` | 2026-09-08 16:06 | Aditya Salwan | Sync review table with Supabase, enable mutual seller/buyer trade rating, and display updated ratings on listings |
| 63 | `a0e7461` | 2026-09-08 15:56 | Aditya Salwan | Merge branch 'main' of https://github.com/shresthvishwa/notOLX |
| 62 | `1790bd8` | 2026-09-08 15:56 | Aditya Salwan | Remove all dummy listings and keep only items posted by authenticated users |
| 61 | `10c150a` | 2026-09-03 11:07 | Nishchay Goyal | Implement smart search bar with campus synonyms, fuzzy token matching, and relevance ranking |
| 60 | `65081c7` | 2026-09-03 11:01 | Nishchay Goyal | Merge branch 'main' of https://github.com/shresthvishwa/notOLX |
| 59 | `20fa140` | 2026-09-03 11:01 | Nishchay Goyal | Fix Mark as Sold and Mark as Reserved status persistence across backend, Supabase, and live polling |
| 58 | `2d32f5b` | 2026-09-02 13:50 | Aditya Salwan | Remove testing photo preset buttons from Sell Item modal |
| 57 | `3c53220` | 2026-09-02 13:30 | Aditya Salwan | Merge branch 'main' of https://github.com/shresthvishwa/notOLX |
| 56 | `4f56d50` | 2026-09-02 13:29 | Aditya Salwan | Replace image URL text input with direct device image file upload |
| 55 | `0b079cc` | 2026-09-01 14:52 | Nishchay Goyal | Merge branch 'main' of https://github.com/shresthvishwa/notOLX |
| 54 | `9eb61b5` | 2026-09-01 14:52 | Nishchay Goyal | Update application brand name from notOLX to notoLX across UI, server, and schema |
| 53 | `d58f345` | 2026-08-26 02:22 | AdixxXXxx | Update GoogleSignInModal.jsx |
| 52 | `95a528e` | 2026-08-25 22:23 | Aditya Salwan | Fix RLS policy blocking listing inserts and add cloud sync error feedback |
| 51 | `de59614` | 2026-08-23 22:20 | Aditya Salwan | Fix ID mismatch and add continuous background sync for cross-device messaging and listings |
| 50 | `319a2e7` | 2026-08-23 22:10 | Aditya Salwan | Remove dummy accounts and persona switcher UI, enforcing pure authenticated Supabase accounts |
| 49 | `ac43332` | 2026-08-22 22:44 | Aditya Salwan | Fix cross-device authentication and RLS policy matching with actual Supabase auth.uid() |
| 48 | `33ade4f` | 2026-08-22 22:26 | Aditya Salwan | Revert 'Remove dummy accounts and enforce verified Google @thapar.edu authentication' |
| 47 | `2de3e3e` | 2026-08-22 22:23 | Aditya Salwan | Fix null reference exceptions for unauthenticated currentUser state |
| 46 | `7dd080e` | 2026-08-22 22:19 | Aditya Salwan | Remove dummy accounts and enforce verified Google @thapar.edu authentication |
| 45 | `ef84daa` | 2026-08-22 22:14 | Aditya Salwan | Add dedicated My Selling Space modal and category filter tab for selling items |
| 44 | `2c4910a` | 2026-08-19 14:35 | Aditya Salwan | Merge branch 'main' of https://github.com/shresthvishwa/notOLX |
| 43 | `ca3ca0e` | 2026-08-19 14:35 | Aditya Salwan | Fix cross-device real-time chat and listing sync payloads and RLS schema policies |
| 42 | `8eb377e` | 2026-08-19 14:21 | Nishchay Goyal | Merge remote-tracking branch 'origin/main' and enforce seller authentication |
| 41 | `d69340c` | 2026-08-19 14:20 | Nishchay Goyal | Enforce seller authentication and fix listing seller attribution disconnect |
| 40 | `cabf413` | 2026-08-19 14:16 | Aditya Salwan | Merge branch 'main' of https://github.com/shresthvishwa/notOLX |
| 39 | `aa456f0` | 2026-08-19 14:16 | Aditya Salwan | Fix listing visibility and Supabase payload UUID format matching |
| 38 | `75e2c47` | 2026-08-19 10:48 | Nishchay Goyal | Revert 'Add seller attribution, Posted by You badge, user profile listings linking, and item deletion' |
| 37 | `c9f60f7` | 2026-08-19 10:46 | Nishchay Goyal | Add seller attribution, Posted by You badge, user profile listings linking, and item deletion |
| 36 | `272fba2` | 2026-08-19 10:40 | Nishchay Goyal | Fix new listing visibility by expanding price filter cap and auto-resetting marketplace filters |
| 35 | `79efb97` | 2026-08-19 10:30 | Nishchay Goyal | Enable cross-device marketplace listing synchronization and live polling |
| 34 | `594a754` | 2026-08-19 03:17 | Nishchay Goyal | Fix cross-device real-time chat sync and dynamic API host resolution |
| 33 | `7b5b8a6` | 2026-08-19 03:10 | Nishchay Goyal | Fix message status handling to ensure seamless sent state with local fallback |
| 32 | `ce88f50` | 2026-08-19 03:06 | Nishchay Goyal | Rebuild real-time messaging architecture with deduplication, status tracking, and rate limiting |
| 31 | `c2c81f9` | 2026-08-19 02:54 | Nishchay Goyal | Fix conversation matching and add interactive Messages dropdown in Navbar |
| 30 | `aacd3f6` | 2026-08-19 02:50 | Nishchay Goyal | Merge branch 'main' of https://github.com/shresthvishwa/notOLX |
| 29 | `7633537` | 2026-08-19 02:50 | Nishchay Goyal | Fix chat history persistence across page refreshes & enable live user-to-user texting engine |
| 28 | `30f65bb` | 2026-08-19 00:40 | Shresth Vishwakarma | Add Delete Account feature with confirmation prompt and database cleanup |
| 27 | `5d7f20e` | 2026-08-19 00:36 | Shresth Vishwakarma | Add subtext description to Marketplace Hero Banner |
| 26 | `0c717ea` | 2026-08-19 00:32 | Shresth Vishwakarma | Update Marketplace Hero Banner heading to Your Trusted Peer-to-Peer Campus Exchange |
| 25 | `108dd45` | 2026-08-19 00:26 | Shresth Vishwakarma | Fix Google OAuth automatic redirection: Automatically switch viewMode to marketplace on authentication |
| 24 | `59219a0` | 2026-08-19 00:23 | Shresth Vishwakarma | Wrap feature pillar cards into styled box containers on Landing Page |
| 23 | `5981d4b` | 2026-08-19 00:22 | Shresth Vishwakarma | Reduce font sizes, icon dimensions, and padding of Landing Page feature pillar section |
| 22 | `3d35ada` | 2026-08-19 00:21 | Shresth Vishwakarma | Update Landing Page: refined hero subtext, badge to THAPAR UNIVERSITY EXCLUSIVE, removed demo switcher block |
| 21 | `2539886` | 2026-08-19 00:12 | Shresth Vishwakarma | Remove Recent Campus Listings section from Landing Page |
| 20 | `889eacb` | 2026-08-19 00:10 | Shresth Vishwakarma | Merge remote main: Integrate handleLogout and signInWithGoogle |
| 19 | `2868b07` | 2026-08-19 00:09 | Shresth Vishwakarma | Add signInWithGoogle OAuth handler with hd: thapar.edu domain restriction |
| 18 | `c53f711` | 2026-08-18 22:52 | Nishchay Goyal | Merge branch 'main' of https://github.com/shresthvishwa/notOLX |
| 17 | `4aed9b6` | 2026-08-18 22:52 | Nishchay Goyal | Implement user-to-user real-time chat & texting between buyers and sellers |
| 16 | `f16aa48` | 2026-08-18 17:34 | Aditya Salwan | Automatically redirect user to Landing Page after logging out |
| 15 | `7144dac` | 2026-08-18 17:32 | Aditya Salwan | Merge branch 'main' of https://github.com/shresthvishwa/notOLX |
| 14 | `5d74d1b` | 2026-08-18 17:32 | Aditya Salwan | Enable Log Out button across Navbar dropdown, Profile modal, and AppContext |
| 13 | `ad1fdca` | 2026-08-18 17:29 | Nishchay Goyal | Merge branch 'main' of https://github.com/shresthvishwa/notOLX |
| 12 | `a1bac51` | 2026-08-18 17:28 | Nishchay Goyal | Fix user session and marketplace view persistence across page refreshes |
| 11 | `1387dfc` | 2026-08-18 16:55 | Aditya Salwan | Merge remote-tracking branch 'origin/main' into main (resolved GoogleSignInModal conflicts) |
| 10 | `a5b07a3` | 2026-08-18 16:53 | Aditya Salwan | Remove custom thapar.edu email input from GoogleSignInModal |
| 9 | `e9456b5` | 2026-08-18 16:48 | Nishchay Goyal | Revert 'Remove Recent Campus Listings section from landing page' |
| 8 | `de55c61` | 2026-08-18 16:46 | Nishchay Goyal | Remove Recent Campus Listings section from landing page |
| 7 | `b9b27c7` | 2026-08-18 16:41 | Nishchay Goyal | Add Google OAuth with @thapar.edu domain restriction & real-time chat messaging |
| 6 | `57c40dc` | 2026-08-18 16:35 | Nishchay Goyal | Update currency from USD ($) to INR (₹) across the application |
| 5 | `1ae3d12` | 2026-08-18 15:56 | Aditya Salwan | Set default website theme to Light Mode |
| 4 | `136a3de` | 2026-08-18 15:24 | Shresth Vishwakarma | Fix Vercel build error code 126: Remove tracked node_modules and dist, add vercel.json configuration |
| 3 | `321e8cc` | 2026-08-18 15:06 | Shresth Vishwakarma | Add dist production build and node_modules dependencies to Git tracking |
| 2 | `ead2cd7` | 2026-08-18 14:40 | Shresth Vishwakarma | Add Express backend server, Thapar @thapar.edu authentication, Gothic Noir & Light themes |
| 1 | `d7e406d` | 2026-08-18 00:19 | Shresth Vishwakarma | Initial commit: notOLX Thapar Campus Marketplace with Gothic Noir & Supabase support |

---

## 4. Key Functional Evolution (Pre-MST vs. Post-MST)

```
        PRE-MST (Aug - Sep 2026)                    POST-MST (Oct - Nov 2026)
┌──────────────────────────────────────┐     ┌──────────────────────────────────────┐
│  • Supply-Only Marketplace           │     │  • Dual-Sided Matching Platform      │
│  • Google @thapar.edu Auth (Supabase)│ ──► │  • Wanted Requests Board             │
│  • Real-Time Buyer/Seller Chat       │     │  • Automated Relevance Match Engine  │
│  • Peer Reviews & Star Ratings       │     │  • Real Gmail SMTP Inbox Delivery    │
│  • Gothic Noir / Light Modes         │     │  • Vintage Handmade Paper Aesthetic  │
└──────────────────────────────────────┘     └──────────────────────────────────────┘
```

1. **Transaction Discovery**:
   - **Pre-MST**: Students could only browse or post listings. If an item was unavailable, buyers had no recourse.
   - **Post-MST**: Students post **Campus Requests** specifying budget and preferred pickup spot (`CampusRequestsModal.jsx`). The system scans existing and future listings, immediately matching them.

2. **Communication & Alerts**:
   - **Pre-MST**: Only in-app chat with active WebSocket/polling was supported. Users had to be actively on the page to know of updates.
   - **Post-MST**: **Real Gmail SMTP pipeline** (`noreply.notolx@gmail.com` via TLS port 465) automatically delivers branded HTML emails directly to verified `@thapar.edu` inboxes for both request confirmations and instant match alerts.

3. **Visual Identity**:
   - **Pre-MST**: Generic dark/light toggle with modern flat cards and high contrast.
   - **Post-MST**: High-tactile **Vintage Editorial Aesthetic** featuring aged parchment (`#F2E8DC`), Thapar maroon (`#5E2424`), deckle-edge torn-paper borders, and distressed typography.
