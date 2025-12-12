# Testing Guide - SurveillanceWatch

## How to Run the Application

### Prerequisites
- Node.js installed
- npm installed

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Setup Database
```bash
# Push schema to database
npm run db:push

# Seed with sample data
npm run db:seed
```

### Step 3: Start Development Server
```bash
npm run dev
```

The server will start on `http://localhost:5000`

## Testing Core Pages

### 1. Home Page (`/`)
- ✅ Should display hero section
- ✅ Should show quick action cards
- ✅ Should display entity count
- ✅ Navigation should work

### 2. Entities Page (`/entities`)
- ✅ Should display all entities in grid
- ✅ Search should filter entities
- ✅ Filters (Type, Risk, Country, Category) should work
- ✅ Clicking entity card should navigate to detail page

### 3. Entity Detail Page (`/entities/:id`)
- ✅ Should display full entity information
- ✅ Should show tags, description, location
- ✅ "View on Map" button should work
- ✅ Source links should be clickable

### 4. Map Page (`/map`) - **PRIMARY TEST**
- ✅ Map should load with dark theme tiles
- ✅ All entity markers should appear
- ✅ Clicking marker should show popup
- ✅ Popup should display entity info
- ✅ "View Details" button should navigate to entity page
- ✅ Zoom controls should work
- ✅ Map should be interactive (pan, zoom)

### 5. Technologies Page (`/tech`)
- ✅ Should display technology categories
- ✅ Should show technologies with entity counts
- ✅ Clicking technology should filter entities

### 6. Submit Page (`/submit`)
- ✅ Form should be accessible
- ✅ All fields should be validatable
- ✅ Submit should create new entity

### 7. About Page (`/about`)
- ✅ Should display project information
- ✅ Should show methodology and features

## API Testing

### Test API Endpoints
```bash
# Get all entities
curl http://localhost:5000/api/entities

# Get single entity
curl http://localhost:5000/api/entities/{id}

# Search entities
curl "http://localhost:5000/api/entities?search=Palantir"

# Filter by type
curl "http://localhost:5000/api/entities?type=Private"

# Filter by risk level
curl "http://localhost:5000/api/entities?riskLevel=Critical"
```

## Common Issues & Fixes

### Map not loading
- Check browser console for errors
- Ensure Leaflet CSS is loaded
- Verify entities have valid coordinates

### 403 Forbidden errors
- Restart the server
- Clear browser cache
- Check Vite middleware configuration

### Database errors
- Ensure SQLite file exists: `database.sqlite`
- Run `npm run db:push` to create tables
- Run `npm run db:seed` to add sample data

## Browser Testing

Test in multiple browsers:
- Chrome/Edge
- Firefox
- Safari

Test responsive design:
- Mobile (375px)
- Tablet (768px)
- Desktop (1920px)

