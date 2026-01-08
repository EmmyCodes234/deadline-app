# 🕯️ The Séance - AI-Powered Spirit Writing

The Séance mode now features **Google Gemini AI** to power the ghostly interventions and whispers.

## Setup

### 1. Get Your Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

### 2. Configure Your Environment

Add your API key to `deadline-web/.env`:

```env
VITE_GEMINI_API_KEY=your_actual_api_key_here
```

### 3. Start Writing

Run the dev server and navigate to The Séance mode:

```bash
npm run dev
```

## How It Works

### The Spirit Persona

The AI is configured as a **Cryptic, Gothic Muse** that:
- Uses archaic, slightly creepy phrasing
- Speaks in fragments, as if channeling from beyond the veil
- Favors gothic imagery: shadows, whispers, cold drafts, forgotten memories
- Is helpful but unsettling

### Two Types of Spirit Communication

#### 1. **INTERVENTION** (Writer's Block Detection)
- Triggers after **5 seconds of inactivity**
- AI generates 1-2 sentences that continue your story with a dark twist
- Text is typed character-by-character (50ms per character)
- Appears in **purple italic text** with ethereal glow
- Input is disabled during manifestation

#### 2. **AUTOCOMPLETE** (The Whisper)
- Triggers **1 second after you stop typing**
- AI suggests the next 3-5 words in a ghostly tone
- Appears as a faint suggestion you can accept
- Helps maintain flow without interrupting

### Visual Indicators

- **Purple glowing text** = AI-generated spirit writing
- **Spirit Presence Meter** increases as the ghost types
- **"The spirits are manifesting..."** appears during interventions
- **Accept button** lets you channel the spirit's whisper

### Fallback Behavior

If the API fails or the key is missing:
- Falls back to hardcoded plot twists
- Shows clear error message in console
- App continues to function normally

## Example Spirit Responses

**Intervention:**
> "The shadows grew longer, reaching toward him with fingers of ice. Hark, the door doth creak open, though no hand touched it."

**Autocomplete:**
> "in the gathering darkness..."
> "from beyond the veil..."
> "the shadows whisper secrets..."

## Technical Details

- **Model**: `gemini-1.5-flash` (fast, cost-effective)
- **System Instruction**: Configured for gothic, archaic tone
- **Error Handling**: Graceful fallback to hardcoded responses
- **Rate Limiting**: Debounced autocomplete (1 second)
- **Intervention Cooldown**: 5 seconds of inactivity

## Files Modified

- `src/lib/gemini.ts` - Gemini AI client and spirit persona
- `src/hooks/useSeance.ts` - Integration with AI interventions
- `src/components/SeanceEditor.tsx` - Visual display of AI suggestions
- `.env` - API key configuration

---

*"The spirits await your words... Let them guide your pen through the darkness."*
