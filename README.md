# SurveillanceWatch

A comprehensive open-source database tracking surveillance technology vendors, government contracts, and monitoring capabilities worldwide.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm installed

### Installation & Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Setup database:**
   ```bash
   # Create database tables
   npm run db:push
   
   # Seed with sample data
   npm run db:seed
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   - Main app: http://localhost:5000
   - Map page: http://localhost:5000/map
   - Entities: http://localhost:5000/entities

## 📋 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run check` - Type check TypeScript
- `npm run db:push` - Push database schema
- `npm run db:seed` - Seed database with sample data

## 🗺️ Testing the Map Page

The map page is a key feature. Here's how to test it:

### 1. Start the Server
```bash
npm run dev
```

### 2. Open Map Page
Navigate to: http://localhost:5000/map

### 3. Expected Behavior
- ✅ Map loads with dark theme (Carto Dark tiles)
- ✅ All entity markers appear on map
- ✅ Clicking a marker shows popup with entity info
- ✅ "View Details" button in popup navigates to entity page
- ✅ Zoom controls work (bottom right corner)
- ✅ Map is interactive (pan, zoom with mouse/trackpad)
- ✅ Overlay UI shows critical entity count

### 4. Test Map Interactions
- **Pan**: Click and drag the map
- **Zoom**: Use mouse wheel, trackpad pinch, or zoom controls
- **Marker Click**: Click any marker to see entity popup
- **View Details**: Click "View Details" in popup to go to entity page

## 🧪 Testing All Pages

### Core Pages Checklist

- [ ] **Home** (`/`) - Hero section, quick actions, entity count
- [ ] **Entities** (`/entities`) - Grid view, search, filters, entity cards
- [ ] **Entity Detail** (`/entities/:id`) - Full entity info, tags, sources
- [ ] **Map** (`/map`) - Interactive map, markers, popups ⭐
- [ ] **Technologies** (`/tech`) - Technology categories, entity counts
- [ ] **Submit** (`/submit`) - Entity submission form
- [ ] **About** (`/about`) - Project information

### API Testing

Test API endpoints:
```bash
# Get all entities
curl http://localhost:5000/api/entities

# Get single entity (replace {id} with actual ID)
curl http://localhost:5000/api/entities/{id}

# Search entities
curl "http://localhost:5000/api/entities?search=Palantir"

# Filter by type
curl "http://localhost:5000/api/entities?type=Private&riskLevel=Critical"
```

## 🐛 Troubleshooting

### Map Not Loading
- Check browser console (F12) for errors
- Ensure Leaflet CSS is loaded
- Verify entities have valid coordinates in database
- Try hard refresh (Ctrl+Shift+R / Cmd+Shift+R)

### 403 Forbidden Errors
- Restart the server: `npm run dev`
- Clear browser cache
- Check that Vite middleware is configured correctly

### Database Issues
- Ensure `database.sqlite` exists in project root
- Run `npm run db:push` to create tables
- Run `npm run db:seed` to add sample data

### No Entities Showing
- Check database: `ls -la database.sqlite`
- Re-seed database: `npm run db:seed`
- Check API: `curl http://localhost:5000/api/entities`

## 📁 Project Structure

```
Surveillance-Watcher/
├── client/          # Frontend React app
│   └── src/
│       ├── pages/   # Page components
│       ├── components/  # Reusable components
│       └── lib/     # Utilities
├── server/          # Backend Express server
│   ├── routes.ts    # API routes
│   ├── storage.ts   # Database operations
│   └── db.ts        # Database connection
├── shared/          # Shared types/schemas
│   └── schema.ts    # Database schema
└── script/          # Build/seed scripts
```

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Backend**: Express, Node.js
- **Database**: SQLite (better-sqlite3)
- **ORM**: Drizzle ORM
- **Maps**: Leaflet, React-Leaflet
- **UI**: Radix UI, shadcn/ui components

## 📝 Features

- ✅ Entity listing with advanced filtering
- ✅ Interactive world map with entity markers
- ✅ Entity detail pages
- ✅ Technology categorization
- ✅ Entity submission form
- ✅ Full CRUD API
- ✅ Dark futuristic theme
- ✅ Responsive design

## 🔒 Security Notes

- This is a development setup
- For production, add authentication
- Implement rate limiting
- Validate all user inputs
- Use environment variables for secrets

## 📄 License

MIT

