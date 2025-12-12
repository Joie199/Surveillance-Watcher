# Adding Research Network Points to the Map

This guide explains how to add research network locations from the MIT DCI Global network to the map.

## Quick Start

1. **Add research points to the database:**
   ```bash
   npm run db:add-research
   ```

2. **View on the map:**
   - Go to `http://localhost:5000/map`
   - Toggle "Research Network" switch in the map controls
   - Research network locations will appear with cyan-colored markers

## What Gets Added

The script adds 8 research network locations:

1. **MIT Digital Currency Initiative** (Cambridge, MA, USA)
2. **University of Brasilia (UnB)** (Brasilia, Brazil)
3. **Lagos Research Hub** (Lagos, Nigeria)
4. **Manila Research Hub** (Manila, Philippines)
5. **Buenos Aires Research Hub** (Buenos Aires, Argentina)
6. **Vinteum** (São Paulo, Brazil)
7. **Bitcoin Innovation Hub** (Kampala, Uganda)
8. **Makerere University** (Kampala, Uganda)

## Features

- **Distinct Markers**: Research network points use cyan-colored markers to distinguish them from regular surveillance entities
- **Toggle Control**: Use the "Research Network" switch in the map controls to show/hide research points
- **Separate Clustering**: Research points are clustered separately from regular entities
- **Detailed Popups**: Each research point shows information about the organization and links to the MIT DCI blog post

## Map Controls

On the map page, you'll find:
- **Cluster Markers**: Toggle clustering for regular entities
- **Research Network**: Toggle visibility of research network points
- **Filters**: Filter by Risk Level and Type (applies to regular entities only)

## Database

Research network locations are stored in the database with:
- `category: "Research Network"`
- `riskLevel: "Low"`
- `type: "Public"`
- Tags include: "Research", "Education", "DCI Global", etc.
- Source links point to the MIT DCI blog post

## Removing Research Points

If you need to remove research points:

```sql
DELETE FROM entities WHERE category = 'Research Network';
```

Or use the admin panel at `/admin` to delete them individually.

## Customization

To add more research points, edit `script/add-research-points.ts` and add entries to the `researchLocations` array, then run:

```bash
npm run db:add-research
```

Note: The script will skip adding points if research network locations already exist. Delete existing entries first if you want to re-add them.

