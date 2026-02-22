

# Ticket Access Desk – Progressive Web App

## Overview
A mobile-first, enterprise-grade ticket reservation PWA that connects to a live Replit API for real-time inventory and seat reservations. Designed with a high-trust fintech aesthetic using a Slate-900/White palette.

---

## 1. Design System Setup
- **Color palette**: Slate-900 primary, white backgrounds, green accent for live indicators
- **Typography**: Inter font – Bold for headlines, Medium for body text
- **Layout**: Fixed 480px max-width container, centered on screen
- **Interactions**: 150ms transitions on all interactive elements, scale-down press effect on buttons for a "haptic" feel
- **All input font sizes set to 16px minimum** to prevent iOS auto-zoom

## 2. Sticky Header
- Left side: "Live Access" text with a green pulsing dot animation indicating live connection
- Right side: "Last Sync: [timestamp]" showing when data was last fetched from the API
- Fixed to top of the viewport, always visible while scrolling

## 3. Dynamic Hero Section
- Reads `?city=` from the URL query parameters
- Displays city-specific headline:
  - `toronto` → "Toronto Verified Access"
  - `losangeles` → "Los Angeles Verified Access"
  - `tampa` → "Tampa Verified Access"
  - Default → "BTS Arirang Tour – Verified Access"
- Clean, bold typography with a Shield icon for trust signaling

## 4. Live Inventory Cards
- Fetches from `GET /api/inventory` on page load with **automatic 30-second refetch** using TanStack Query
- Each card displays: **Section**, **Row**, and **Price**
- Full-width "Reserve Seats" button (Slate-800) on each card
- Tapping the button opens the reservation drawer for that specific inventory item
- **Empty state**: If no inventory is returned, shows "Inventory Refreshing... Check back in 5 mins." with a Clock icon

## 5. Reservation Drawer (Vaul Bottom Sheet)
- Slides up from the bottom of the screen
- **Form fields**: Full Name, Email, Phone, Quantity (1–4 selector)
- **Validation via Zod**: Enforces proper email format, phone format, and required fields
- Submits to `POST /api/reserve` with the selected inventory item and form data
- Loading state on the submit button while the request is in flight

## 6. Success / Secure Hold State
- After successful reservation, the drawer transitions to a confirmation view
- Displays the **Order ID** returned from the API
- Shows a **live countdown timer** based on the `expiresAt` timestamp from the API response (30-minute hold)
- Confirmation text: "Your seats are held. Check your email for verification and payment instructions to finalize your Ticketmaster transfer."
- MapPin, Shield, and Clock icons used throughout for visual trust cues

## 7. Technical Implementation
- **axios** for all HTTP calls to the Replit API base URL
- **TanStack Query** for data fetching, caching, and automatic refetching
- No fake/mock data – all IDs, timestamps, and inventory come from the live API
- PWA-ready structure with proper mobile viewport configuration

