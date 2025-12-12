#!/bin/bash

# Test script for SurveillanceWatch Map Page
# This script tests the API and provides instructions for testing the map

echo "🔍 Testing SurveillanceWatch Application"
echo "========================================"
echo ""

# Check if server is running
echo "1. Checking if server is running..."
if curl -s http://localhost:5000/api/entities > /dev/null 2>&1; then
    echo "   ✅ Server is running on http://localhost:5000"
else
    echo "   ❌ Server is not running"
    echo "   📝 Start the server with: npm run dev"
    exit 1
fi

echo ""
echo "2. Testing API endpoints..."

# Test entities API
echo "   Testing GET /api/entities..."
ENTITY_COUNT=$(curl -s http://localhost:5000/api/entities | grep -o '"id"' | wc -l | tr -d ' ')
if [ "$ENTITY_COUNT" -gt 0 ]; then
    echo "   ✅ Found $ENTITY_COUNT entities"
else
    echo "   ❌ No entities found. Run: npm run db:seed"
fi

# Test single entity
echo "   Testing GET /api/entities/:id..."
FIRST_ID=$(curl -s http://localhost:5000/api/entities | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
if [ ! -z "$FIRST_ID" ]; then
    if curl -s "http://localhost:5000/api/entities/$FIRST_ID" > /dev/null 2>&1; then
        echo "   ✅ Single entity endpoint works"
    else
        echo "   ❌ Single entity endpoint failed"
    fi
fi

echo ""
echo "3. Map Page Testing Instructions:"
echo "   📍 Open http://localhost:5000/map in your browser"
echo ""
echo "   ✅ Expected behavior:"
echo "      - Map should load with dark theme"
echo "      - You should see markers for all entities"
echo "      - Clicking a marker shows a popup with entity info"
echo "      - 'View Details' button navigates to entity page"
echo "      - Zoom controls work (bottom right)"
echo "      - Map is interactive (pan, zoom)"
echo ""
echo "   🐛 Common issues:"
echo "      - If map doesn't load: Check browser console for errors"
echo "      - If markers don't appear: Verify entities have coordinates"
echo "      - If 403 error: Restart server and clear browser cache"
echo ""
echo "4. Testing other pages:"
echo "   - Home: http://localhost:5000/"
echo "   - Entities: http://localhost:5000/entities"
echo "   - Technologies: http://localhost:5000/tech"
echo "   - Submit: http://localhost:5000/submit"
echo "   - About: http://localhost:5000/about"
echo ""
echo "✅ Testing complete!"

