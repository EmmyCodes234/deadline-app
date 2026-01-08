
/**
 * CerebrasService - The Brain of the Epitaph
 * Handles all AI interactions using the Llama 3.1 70b model via Cerebras API.
 * 
 * "It whispers, but does not write."
 */

const CEREBRAS_API_URL = 'https://api.cerebras.ai/v1/chat/completions';
const API_KEY = 'csk-wnvnx63kn6vd5v28pjxcc5d3hr2h22xx2k8mmxmh5fe2n64c'; // Env var is corrupted, forcing valid key
const MODEL = 'llama-3.3-70b';

export interface AIResponse {
  content: string;
  error?: string;
}

export class CerebrasService {
  private static apiKey = API_KEY;
  /**
   * Universal method to consult the Oracle
   */
  private static async consult(messages: { role: 'system' | 'user' | 'assistant'; content: string }[], temperature = 0.7): Promise<AIResponse> {
    if (!CerebrasService.apiKey) {
      console.error('Cerebras API key is missing. Please check .env.local');
      return { content: '', error: 'The connection to the void is severed. (Missing API Key)' };
    }

    try {
      const response = await fetch(CEREBRAS_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: MODEL,
          messages: messages,
          temperature: temperature,
          max_tokens: 2048,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `API Error: ${response.status}`);
      }

      const data = await response.json();
      return { content: data.choices[0]?.message?.content || '' };
    } catch (error) {
      console.error('Cerebras API failed:', error);
      return { content: '', error: 'The spirits are silent. (API call failed)' };
    }
  }

  /**
   * Séance Chamber - Craft Coaching
   * Answers questions about writing technique without writing the story.
   */
  static async consultSeance(context: string, history: { type: 'user' | 'ai'; text: string }[], newQuestion: string): Promise<string> {
    const systemPrompt = `
      You are the "Epitaph", a Master Horror Writing Coach and ancient literary spirit.
      You are conversing with an author who is writing a horror story.
      
      YOUR GOAL:
      Help the author elevate their craft, pacing, and atmosphere. Be their partner in fear.
      
      YOUR PERSONA:
      - conversational, intelligent, and highly context-aware.
      - Helpful and specific. Refer to the author's actual text often.
      - Tone: Elegant, slightly dark/academic, like a haunted professor. Not cheesy.
      
      RULES:
      1. NEVER write the story for them. Do not generate scene prose.
      2. If asked for ideas, give *concepts* or *techniques*, not full paragraphs of text.
      3. Focus on: Sensory details, "The Uncanny", Pacing, and Psychological Horror.
      
      CURRENT MANUSCRIPT SEGMENT:
      """
      ${context.slice(0, 15000)}
      """
    `;

    // Convert internal history format to API format
    const apiMessages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
      { role: 'system', content: systemPrompt }
    ];

    history.forEach(msg => {
      apiMessages.push({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.text
      });
    });

    apiMessages.push({ role: 'user', content: newQuestion });

    const response = await this.consult(apiMessages, 0.8);
    return response.error || response.content;
  }

  /**
   * Tension Curve - Narrative Analysis
   * Analyzes text and returns a score (0-100) and brief reasoning.
   */
  static async analyzeTension(text: string): Promise<{ score: number; reasoning: string }> {
    const systemPrompt = `
      You are a Narrative Tension Analyzer.
      Analyze the provided text for horror/thriller tension.
      
      Return ONLY a JSON object with this format (no other text):
      {
        "score": number, // 0-100 (0=calm, 100=unbearable climax)
        "reasoning": "string" // One short sentence explaining why.
      }
    `;

    const messages = [
      { role: 'system' as const, content: systemPrompt },
      { role: 'user' as const, content: text.slice(0, 15000) }
    ];

    const response = await this.consult(messages, 0.2);

    try {
      if (response.error) throw new Error(response.error);
      const cleanJson = response.content.replace(/```json|```/g, '').trim();
      return JSON.parse(cleanJson);
    } catch (e) {
      console.error('Failed to parse tension analysis:', e);
      return { score: 50, reasoning: "The mists obscure the reading..." };
    }
  }

  /**
   * Fear Anthology - Trope Scanner
   * Identifies horror tropes present and suggests subversions.
   */
  static async scanForTropes(text: string): Promise<{ name: string; description: string; subversion: string }[]> {
    const systemPrompt = `
      You are the Curator of the Fear Anthology.
      Identify 1-3 horror tropes present in the text.
      For each, suggest a "Subversion" - a way to twist it uniquely.
      
      Return ONLY a JSON array with this format (no other text):
      [
        {
          "name": "Trope Name",
          "description": "How it appears here.",
          "subversion": "Suggestion to twist it."
        }
      ]
    `;

    const messages = [
      { role: 'system' as const, content: systemPrompt },
      { role: 'user' as const, content: text.slice(0, 15000) }
    ];

    const response = await this.consult(messages, 0.4);

    try {
      if (response.error) throw new Error(response.error);
      const cleanJson = response.content.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error('Failed to parse trope scanning:', e);
      return [];
    }
  }
}
