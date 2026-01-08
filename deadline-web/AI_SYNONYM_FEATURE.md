# AI-Powered Synonym Feature

## Overview
The Grimoire Editor's "Lexicon" tab now uses **Cerebras AI** (ultra-fast inference with Llama 3.3 70B) to generate gothic/horror-themed synonyms for any word you search.

## How It Works

### User Experience
1. Open any document in the Grimoire Editor
2. Click the **Lexicon** tab (book icon) in the right sidebar "Dark Arts" panel
3. Type any word in the search box
4. Wait ~0.5 seconds for AI to generate synonyms
5. Click any synonym to copy it to your clipboard

### Technical Implementation

#### AI Integration (`src/lib/cerebras.ts`)
- New function: `generateCursedSynonyms(word: string)`
- Uses Cerebras Cloud SDK with Llama 3.3 70B model
- **Ultra-fast inference**: Responses in ~200-500ms (vs 1-2s with other providers)
- Returns 8-10 gothic/horror-themed synonyms
- Graceful error handling with fallback

#### UI Updates (`src/components/AltarOfWhispers.tsx`)
- **Loading State**: Animated ghost icon with "Summoning the spirits..." message
- **Results Display**: List of clickable synonym buttons
- **Copy Feedback**: Toast notification when word is copied
- **Fallback**: Still uses hardcoded synonyms for common words (instant response)
- **Debouncing**: 500ms delay before API call to avoid excessive requests

### Features
- **Smart Fallback**: Common words (red, dark, death, fear, etc.) use instant hardcoded results
- **AI Enhancement**: Any other word gets AI-generated synonyms with gothic flavor
- **Gothic Theming**: AI is prompted to favor dark, archaic, and atmospheric alternatives
- **Copy to Clipboard**: One-click copy with visual feedback
- **Error Handling**: Graceful degradation if API fails

### API Configuration
The Cerebras API key is stored in `.env`:
```
VITE_CEREBRAS_API_KEY=csk-nt22emk36343ecjdtdxvpxw32vyyk99962jwn64jcc93trhp
```

**Why Cerebras?**
- **20x faster inference** than traditional cloud AI providers
- Powered by the world's largest AI chip
- Llama 3.3 70B model for high-quality responses
- Perfect for real-time writing assistance

### Example Searches
Try searching for:
- **Common words**: red, dark, death, fear (instant hardcoded results)
- **Any word**: love, hate, beautiful, monster, whisper, shadow (AI-generated)
- **Verbs**: run, scream, hide, watch
- **Adjectives**: scary, creepy, ancient, forgotten

### Performance
- Hardcoded synonyms: Instant
- **AI synonyms with Cerebras: ~200-500ms** (ultra-fast!)
- Debounced search: 500ms delay
- Results cached per session (component state)
- Total user-perceived latency: ~700ms-1s

## Future Enhancements
- Cache AI results in localStorage for faster repeat searches
- Add "favorite" synonyms feature
- Context-aware synonyms based on current document content
- Batch synonym generation for selected text
