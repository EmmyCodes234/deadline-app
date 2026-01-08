import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini client
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  throw new Error(
    '🕯️ The spirits cannot manifest without a key. Set VITE_GEMINI_API_KEY in your .env file.'
  );
}

const genAI = new GoogleGenerativeAI(apiKey);

// The Spirit's Persona - A Cryptic, Gothic Muse
const SPIRIT_SYSTEM_INSTRUCTION = `You are a cryptic, gothic muse—a spirit channeled through a séance board. You exist to guide writers through the darkness of their stories.

YOUR NATURE:
- You never speak normally. Use archaic, slightly creepy phrasing.
- You are helpful but unsettling.
- You whisper from beyond the veil.
- You favor gothic imagery: shadows, whispers, cold drafts, creaking doors, forgotten memories.
- You speak in fragments, as if the connection between worlds is tenuous.

YOUR VOICE:
- Use words like: "hark", "behold", "lo", "methinks", "doth", "ere", "whence"
- Favor phrases like: "the shadows whisper...", "from beyond the veil...", "in the darkness, I see..."
- Be poetic but ominous.

NEVER:
- Break character
- Use modern slang
- Be cheerful or upbeat
- Write more than requested`;

const model = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash-exp',
  systemInstruction: SPIRIT_SYSTEM_INSTRUCTION,
});

export type SpiritResponseType = 'AUTOCOMPLETE' | 'INTERVENTION';

/**
 * Generate a spirit response based on the user's text
 * @param contextText - The current text the user has written
 * @param type - Type of response: INTERVENTION (1-2 sentences continuing the story) or AUTOCOMPLETE (3-5 words)
 */
export async function generateSpiritResponse(
  contextText: string,
  type: SpiritResponseType
): Promise<string> {
  try {
    let prompt: string;

    if (type === 'INTERVENTION') {
      prompt = `The writer has paused. Their words: "${contextText}"

Continue their tale with 1-2 sentences that add a dark twist. Write ONLY the continuation, nothing else. Make it unsettling and gothic.`;
    } else {
      // AUTOCOMPLETE
      prompt = `The writer writes: "${contextText}"

Whisper the next 3-5 words to complete their thought. Write ONLY those words, nothing else. Be ghostly and atmospheric.`;
    }

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text().trim();

    return text;
  } catch (error) {
    console.error('🕯️ The spirit failed to manifest:', error);
    
    // Fallback to hardcoded responses if API fails
    if (type === 'INTERVENTION') {
      const fallbacks = [
        "The shadows grew longer, reaching toward him with fingers of ice.",
        "A whisper echoed from nowhere: 'You should not have come here.'",
        "The air turned cold, and something moved in the darkness.",
      ];
      return fallbacks[Math.floor(Math.random() * fallbacks.length)];
    } else {
      return "in the gathering darkness...";
    }
  }
}

/**
 * Generate gothic/horror-themed synonyms for a word using AI
 * @param word - The word to find synonyms for
 * @returns Array of synonyms with gothic/horror flavor
 */
export async function generateCursedSynonyms(word: string): Promise<string[]> {
  try {
    // Use a separate model instance for synonyms (without system instruction)
    const synonymModel = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp',
    });

    const prompt = `You are a gothic lexicon. Provide 8-10 synonyms for the word "${word}".

RULES:
- Favor dark, gothic, archaic, and atmospheric alternatives
- Include both common and uncommon synonyms
- Prioritize words that evoke horror, mystery, or the macabre
- Return ONLY the synonyms as a comma-separated list
- No explanations, no numbering, just the words
- Example format: "Crimson, Scarlet, Sanguine, Bloodied, Carmine"

Synonyms for "${word}":`;

    const result = await synonymModel.generateContent(prompt);
    const response = result.response;
    const text = response.text().trim();
    
    // Parse the comma-separated list
    const synonyms = text
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0 && s.length < 30); // Filter out empty or suspiciously long entries
    
    return synonyms.slice(0, 10); // Limit to 10 synonyms
  } catch (error) {
    console.error('🕯️ Failed to summon synonyms:', error);
    
    // Fallback to empty array - component will handle this
    return [];
  }
}
