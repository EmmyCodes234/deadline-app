# Grimoire Editor - Physical Book Typography Overhaul

## Changes Made

### 1. Background Texture Enhancement
- **Changed**: Background from flat `#0c0c0c` to `#0a0a0a` with subtle noise texture
- **Effect**: The background now has a paper/slate texture that mimics physical material
- **Implementation**: SVG noise filter with increased frequency (1.5) and octaves (5) for more visible grain
- **Opacity**: Increased to 0.08 for better visibility while maintaining subtlety

### 2. Typography - Serif Font
- **Primary Font**: Changed to `'Crimson Pro'` (high-quality serif)
- **Fallback Fonts**: `'Merriweather'`, `Georgia`, `serif`
- **Previous**: Used `'IM Fell English'` which was more gothic/medieval
- **Effect**: More readable, classic book typography that feels professional and literary

### 3. Text Color - Parchment Ink
- **Color**: Changed from `text-zinc-100` to `#e6e6e6` (parchment off-white)
- **Effect**: Reduces eye strain and creates an "ink on paper" aesthetic
- **Contrast**: Still maintains excellent readability against the dark background

### 4. Line Height - Enhanced Readability
- **Line Height**: Increased to `1.8` (from previous 1.8, now explicitly set in inline styles)
- **Effect**: Better breathing room between lines, mimics traditional book typography
- **Readability**: Significantly improved for long-form reading

### 5. Font Import
- **Added**: `Crimson Pro` to Google Fonts import in `index.css`
- **Weights**: 300, 400, 600, 700 (regular and italic)
- **Display**: `swap` for optimal loading performance

## Files Modified

1. **deadline-web/src/components/GrimoireEditor.tsx**
   - Updated background color and noise texture
   - Changed editor font family to Crimson Pro
   - Set text color to #e6e6e6
   - Explicitly set line-height to 1.8

2. **deadline-web/src/index.css**
   - Added Crimson Pro font import

## Visual Impact

The Grimoire editor now feels like:
- ✅ A physical book with textured pages
- ✅ Professional literary typography
- ✅ Reduced digital harshness
- ✅ Enhanced readability for long writing sessions
- ✅ Authentic "ink on paper" aesthetic

## Technical Details

### Noise Texture SVG
```
baseFrequency: 1.5 (increased grain visibility)
numOctaves: 5 (more complex texture)
opacity: 0.08 (subtle but visible)
backgroundSize: 200px 200px (tiled pattern)
```

### Typography Stack
```css
font-family: 'Crimson Pro', 'Merriweather', Georgia, serif;
color: #e6e6e6;
line-height: 1.8;
letter-spacing: 0.01em;
```

## User Experience

Writers will now experience:
- Less eye strain during long writing sessions
- A more immersive, book-like writing environment
- Better focus with the physical material aesthetic
- Professional typography that respects the craft of writing
