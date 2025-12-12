✅ Project Task List – SurveillanceWatch Replica Website
1. Project Setup

Initialize Next.js app (App Router recommended)

Install Tailwind CSS + dark mode config

Install required libraries:

leaflet + react-leaflet

framer-motion (animations)

axios (API calls)

mongodb or sqlite depending on backend choice

Configure global layout and dark theme

2. Core Pages & Routing

/ — Home page

/entities — List of surveillance entities

/entities/[id] — Single entity details page

/map — Interactive world map

/about — Info page

/api/entities — API route for listing/searching entities

/api/entities/[id] — API route for single entity

3. Database Design
Entities table should include:

id

name

category (State | Vendor | Activist target | etc.)

country

coordinates (latitude, longitude)

description

logo or image URL

tags

source_links

Tasks:

Create schema

Seed sample data

Create DB query functions

4. Entity Listing Page (/entities)

Grid/list view of cards

Search bar (by name)

Filters:

Category

Country

Tags

Pagination or infinite scroll

Hover animation using Framer Motion

Card linking to entity detail page

5. Entity Detail Page (/entities/[id])

Header with name, logo, country

Tags

Description

Timeline or history section

Gallery (optional)

All external sources

“View on Map” button → highlights on /map

6. Interactive Map Page (/map)
Leaflet Implementation

Install & configure Leaflet in Next.js (no SSR)

Use "Dark Matter" or "Carto Dark" tiles

Render markers from DB coordinates

Cluster markers if many (optional)

When clicking a marker:

Show popup with entity name

View details button → redirect to /entities/[id]

Small preview card inside popup

Bonuses:

Heatmap view toggle

Filter entities directly on map

7. UI / Branding / Styling

Dark futuristic theme

Neon accent color (blue/purple)

Consistent card style

Global navigation bar

Footer with links & GitHub

Responsive mobile layout

8. Backend / API Layer

Entity list API

Entity detail API

Map data API (entities with coordinates)

Backend caching (optional)

Error handling

9. Admin Panel (optional)

If you want to manage entries easily:

/admin login

Add entity form

Edit entity form

Upload logos/images

Delete entries

10. Deployment

Prepare production build

Deploy Next.js app:

Vercel (best)

Netlify

Hostinger

Set up environment variables

Connect database (MongoDB Atlas, Supabase, or local SQLite if small)

11. QA & Testing

Test map interactions

Test entity filtering

Test mobile responsiveness

Test API routes

Fix performance issues

Lighthouse performance test

12. Future Enhancements

Embed timeline visualization (D3.js)

Add global statistics dashboard

Entity relationship graph visualization

Add API documentation

Add user submissions (crowdsourced entities)