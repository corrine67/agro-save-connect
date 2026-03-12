

# Implementation Plan

This is a large set of changes spanning 9 major features across ~10 files. Here's the plan organized by file.

---

## 1. Data Model Updates (`src/context/AppContext.tsx`)

- Add `cancelledBy?: "buyer" | "seller"` and `refundStatus?: "none" | "requested" | "processed"` to the `Order` interface
- Add `buyerPhone?: string` and `buyerName?: string` to `Order` for buyer contact info display
- Add `ScanRecord` interface: `{ id, plantName, result, timestamp }` and `scanHistory: ScanRecord[]` + `setScanHistory` to AppState
- Add `"order_preparing"` to Notification type union
- Generate tracking number helper function: `generateTrackingNumber()` returning `TRK` + 9 random digits

---

## 2. System-Generated Tracking Numbers (`NewOrderPage.tsx`)

- Remove the manual tracking number input step entirely
- When seller clicks "Preparing Order":
  - Auto-generate tracking number via `generateTrackingNumber()`
  - Update order status to `"preparing"` with the generated tracking number
  - Add notification to Seller Updates only (type `"order_preparing"`)
  - Skip straight to the pickup status display
- Show pickup details: seller name, phone, address alongside tracking number with Copy and Print Label buttons
- Display buyer contact number and buyer address in the order card
- Cancel order: only add notification to Seller Updates (`order_cancelled_seller`), not My Notifications

---

## 3. Cancellation & Refund Logic (`RefundPage.tsx`, `NewOrderPage.tsx`, `OrderPage.tsx`)

- Refund page checks `order.cancelledBy` and `order.refundStatus`:
  - If `cancelledBy === "buyer"` and viewing as seller: show "Order Cancelled - Refund Requested by User", disable refund button
  - If `cancelledBy === "seller"` and viewing as buyer: show "Order Cancelled by Seller - Refund in Process", disable refund button
  - Once refund is processed, set `refundStatus: "processed"` on the order
- In `NewOrderPage` (seller cancels): set `cancelledBy: "seller"`, auto-process refund
- Add a cancel button for buyers in `OrderDetailsPage`: set `cancelledBy: "buyer"`, trigger refund request

---

## 4. Notification Logic Refinement

- Seller cancel → notification ONLY in Seller Updates (`order_cancelled_seller`), NOT in My Notifications
- Preparing Order → notification ONLY in Seller Updates with message "Courier will come pick up within 2 days"
- Order Confirmed / Order Shipped notifications in My Notifications: enrich with seller name, phone, address, and tracking number in the message

---

## 5. Order Details Enrichment (`OrderDetailsPage.tsx`)

- Show delivery info: name, phone, address alongside tracking number
- Tracking number displayed with Copy, Track Package, Print Label buttons (for seller updates)
- My Notifications view: show tracking number without action buttons (just display)

---

## 6. Donation Flow Enhancement (`DonateSurplusPage.tsx`)

- After confirming donation, show a new "Donation Confirmed" screen:
  - Display donated amount (kg)
  - Method selection: "Delivery Pick Up" or "Drop Off at Location"
- Drop Off: show donation address + "Open Map" and "View Directions" buttons
- Delivery Pick Up: auto-generate tracking number, show it with Copy and Print Label buttons, display "Courier will pick up within 2 days"
- Food Matching AI section: show "Best Matching Organizations" with needs and distance, replacing static recipients list with context-aware suggestions based on the crop type

---

## 7. Pest Detection Updates (`PestDetectPage.tsx`)

- Simplify infected result: show "Pest Detected" header without the verbose intro paragraph
- Keep treatment recommendations with specific measurements (already exist)
- Add detection history section at bottom:
  - Summary: Total Scans, Healthy Plants, Diseased Plants
  - List of past scans with plant name, result, timestamp
  - Store scan history in AppContext (`scanHistory` state)
- Each scan adds a record to history (randomly pick a plant name for the simulated scan)

---

## 8. Community Food Map Page (New: `CommunityMapPage.tsx`)

- New page at route `/community-map`
- Static visual map representation (no external map library) showing:
  - Green markers: sellers/restaurants with extra food
  - Blue markers: NGOs/organizations requesting food  
  - Yellow markers: active deliveries
- Sidebar/overlay listing nearby food donations and organizations
- Add navigation link from Explore page and Me page

---

## 9. Messaging Unification (Verify existing)

- Chat with Seller in OrderPage already creates/reuses threads — confirmed working
- MessagesPage already shows all threads with text input in ChatPage — confirmed working
- Both entry points share the same `chatThreads` state — already unified
- No changes needed here beyond verification

---

## Files to Create
- `src/pages/CommunityMapPage.tsx`

## Files to Modify
- `src/context/AppContext.tsx` — Order interface, scan history, tracking helper
- `src/pages/NewOrderPage.tsx` — Auto tracking, buyer info, simplified flow
- `src/pages/DonateSurplusPage.tsx` — Post-donation flow with method selection
- `src/pages/RefundPage.tsx` — Refund lock logic
- `src/pages/OrderDetailsPage.tsx` — Enriched delivery info, tracking buttons
- `src/pages/PestDetectPage.tsx` — Simplified result + detection history
- `src/pages/NotificationsPage.tsx` — Handle new notification type
- `src/pages/ExplorePage.tsx` — Community Map link
- `src/App.tsx` — Add community map route

