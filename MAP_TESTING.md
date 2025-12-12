# Map Page Testing Guide

## 🗺️ How to Test the Map Page

### Step 1: Ensure Server is Running
```bash
npm run dev
```
Server should start on `http://localhost:5000`

### Step 2: Verify Database Has Data
```bash
# Check if entities exist
curl http://localhost:5000/api/entities

# If empty, seed the database
npm run db:seed
```

### Step 3: Open Map Page
Navigate to: **http://localhost:5000/map**

## ✅ What to Test

### Visual Checks
- [ ] Map loads with dark theme (dark tiles)
- [ ] Map is centered at world view (zoom level 2.5)
- [ ] Zoom controls appear in bottom right
- [ ] Overlay card appears in top left showing "GLOBAL_VIEW: ACTIVE"
- [ ] Critical entities count is displayed in overlay

### Marker Tests
- [ ] **10 markers** should appear on the map (one for each entity)
- [ ] Markers are visible and properly positioned
- [ ] Markers use default Leaflet icon (blue pin)

### Interaction Tests
- [ ] **Click a marker** → Popup appears with entity card
- [ ] Popup shows:
  - Entity name
  - Risk level badge
  - Headquarters location
  - Description (truncated)
  - Tags (first 3)
  - "View Details" button
- [ ] **Click "View Details"** → Navigates to entity detail page
- [ ] **Pan the map** → Map moves smoothly
- [ ] **Zoom in/out** → Map zooms (mouse wheel, trackpad, or controls)
- [ ] **Close popup** → Click outside or X button

### Entity Locations to Verify
The seeded entities should appear at these locations:
1. **Palantir Technologies** - Denver, Colorado (39.7392, -104.9903)
2. **NSO Group** - Herzliya, Israel (32.1624, 34.8447)
3. **Clearview AI** - New York, USA (40.7128, -74.0060)
4. **Hikvision** - Hangzhou, China (30.2741, 120.1551)
5. **Cellebrite** - Petah Tikva, Israel (32.0840, 34.8878)
6. **Axon Enterprise** - Scottsdale, Arizona (33.4942, -111.9261)
7. **SenseTime** - Hong Kong (22.3193, 114.1694)
8. **Ring (Amazon)** - Santa Monica, California (34.0195, -118.4912)
9. **Gaza Systems** - Unknown location (34.50, 69.20)
10. **Dataminr** - New York, USA (40.7528, -73.9860)

## 🐛 Common Issues & Fixes

### Issue: Map doesn't load / Blank screen
**Fix:**
- Check browser console (F12) for errors
- Verify Leaflet CSS is loading
- Ensure `isClient` state is working (should show "Loading map..." briefly)
- Try hard refresh: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)

### Issue: No markers appear
**Fix:**
- Check API: `curl http://localhost:5000/api/entities`
- Verify entities have coordinates
- Check browser console for JavaScript errors
- Ensure `isClient` is true before rendering map

### Issue: 403 Forbidden error
**Fix:**
- Restart server: Stop (Ctrl+C) and run `npm run dev` again
- Clear browser cache
- Check Vite middleware configuration

### Issue: Markers appear but popups don't work
**Fix:**
- Check browser console for React errors
- Verify entity data structure matches interface
- Ensure Link component from wouter is working

### Issue: Map tiles don't load
**Fix:**
- Check internet connection (tiles load from Carto CDN)
- Verify tile URL is correct: `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png`
- Try different browser

## 🧪 Browser Console Checks

Open browser console (F12) and check for:
- ✅ No red errors
- ✅ Leaflet CSS loaded
- ✅ React components mounted
- ✅ API calls successful (check Network tab)

## 📊 Expected Map Behavior

1. **Initial Load:**
   - Shows "Loading map..." briefly
   - Then renders full map with dark theme
   - All 10 markers appear

2. **Marker Click:**
   - Popup appears with entity card
   - Card has backdrop blur effect
   - Shows entity information

3. **Navigation:**
   - "View Details" button works
   - URL changes to `/entities/:id`
   - Entity detail page loads

4. **Map Controls:**
   - Zoom controls functional
   - Pan works smoothly
   - Scroll wheel zoom works

## 🎯 Quick Test Checklist

Run through this checklist:

```
□ Server running (npm run dev)
□ Database seeded (npm run db:seed)
□ Map page loads (http://localhost:5000/map)
□ Map displays with dark tiles
□ 10 markers visible
□ Can click markers
□ Popups show entity info
□ "View Details" button works
□ Zoom controls work
□ Map is interactive (pan/zoom)
□ Overlay UI shows correct count
```

## 🚀 Performance Notes

- Map should load within 2-3 seconds
- Markers should appear immediately after map loads
- Popups should open instantly on marker click
- No lag when panning/zooming

If performance is slow:
- Check number of entities (should be ~10)
- Verify database queries are fast
- Check browser performance tab

