# Earth Texture Guide - eChalk Interactive Earth Style

This guide explains how to add a custom educational globe texture that matches the eChalk Interactive Earth style.

## Texture Requirements

To match the eChalk Interactive Earth aesthetic, your texture should have:

### Visual Style
- **Hand-painted aesthetic** - Soft, clean colors (not photorealistic)
- **Flat shaded continents** - Subtle gradients, no terrain detail
- **Crisp borders** - Bold coastlines, clear continent shapes
- **Simplified geography** - Clean, friendly, classroom-globe style
- **Bright deep blue oceans** - Smooth color variation, no satellite detail
- **Warm land colors** - Greens, tans, and browns
- **No labels** - Remove all text/country names
- **No shadows** - Evenly lit, no terrain height visible
- **Slightly glossy** - Classroom globe finish

### Technical Requirements
- **Format**: PNG or JPG
- **Aspect Ratio**: 2:1 (equirectangular projection)
- **Resolution**: High-resolution recommended (e.g., 4096x2048 or 8192x4096)
- **Seamless**: Must tile perfectly at the edges (left-right seamless)

## How to Add Your Texture

### Step 1: Prepare Your Texture
1. Create or source an educational globe texture matching the eChalk style
2. Ensure it's in 2:1 aspect ratio (width = 2 × height)
3. Make sure it's seamless (left and right edges match)
4. Save as PNG or JPG

### Step 2: Add to Project
1. Create a `textures` folder in `client/public/`:
   ```
   client/public/textures/
   ```

2. Place your texture file there, e.g.:
   ```
   client/public/textures/earth-educational.jpg
   ```

### Step 3: Update the Component
Open `client/src/components/Globe3D.tsx` and update the texture URL:

```typescript
// Change from:
const earthTextureUrl = "https://raw.githubusercontent.com/...";

// To:
const earthTextureUrl = "/textures/earth-educational.jpg";
```

## Texture Sources

If you need to create or find a texture:

1. **Create your own**: Use image editing software (Photoshop, GIMP) to create a hand-painted educational globe texture
2. **Modify existing**: Take a satellite texture and apply filters to make it look hand-painted
3. **Use texture generators**: Some tools can generate educational-style globe textures

## Current Implementation

The globe is currently configured with:
- ✅ No atmosphere (as per eChalk style)
- ✅ No bump/normal maps (flat shading)
- ✅ Glossy material properties (shininess: 100, roughness: 0.1)
- ✅ No shadows
- ✅ Even lighting

## Testing

After adding your texture:
1. Restart the dev server
2. Check that the texture loads correctly
3. Verify the texture wraps seamlessly around the globe
4. Ensure colors match the educational/classroom aesthetic

## Notes

- The texture URL can be a local file (`/textures/...`) or a remote URL
- For best performance, use optimized JPG for large textures
- The texture will be automatically wrapped onto the 3D sphere by react-globe.gl







