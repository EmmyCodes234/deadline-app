/**
 * Séance Chamber™ - Horror Craft Coaching AI
 * Coaching-only AI that helps horror writers improve their craft
 * WITHOUT generating text for them
 */

import type {
    SeanceQuery,
    SeanceResponse,
    SeanceContext,
    CoachingType,
    LiteraryReference,
    Technique,
    WriterGoal,
} from '../types/epitaph';
import { v4 as uuidv4 } from 'uuid';

// =============================================================================
// COACHING KNOWLEDGE BASE
// =============================================================================

const HORROR_TECHNIQUES: Record<string, Technique[]> = {
    tension: [
        {
            name: 'The Slow Reveal',
            description: 'Withhold information from the reader, revealing it piece by piece.',
            howToApply: 'Instead of describing the monster immediately, describe its effects: shadows moving, sounds, smells. Let the reader\'s imagination fill the gaps.',
            example: 'Shirley Jackson never fully describes the house in "The Haunting of Hill House"—we experience it through Eleanor\'s growing unease.',
        },
        {
            name: 'Sentence Rhythm Manipulation',
            description: 'Vary sentence length to control pacing. Short sentences speed up; long sentences allow dread to build.',
            howToApply: 'In a chase scene, use fragments: "Running. Breathing. Don\'t look back." In a creeping horror scene, use longer sentences that wind and don\'t let the reader find a natural pause.',
            example: 'Stephen King often uses sentence fragments at peak moments: "It was. It was there. In the dark."',
        },
        {
            name: 'The False Calm',
            description: 'A moment of apparent safety that makes the next horror hit harder.',
            howToApply: 'Give your character a genuine moment of relief—a locked door, a friend\'s arrival, daylight. Then take it away.',
            example: 'In "Alien," the crew thinks they\'ve ejected the xenomorph multiple times. Each "safe" moment is a setup.',
        },
        {
            name: 'Sensory Specificity',
            description: 'Ground horror in small, specific sensory details rather than grand descriptions.',
            howToApply: 'Instead of "The room was terrifying," try: "The wallpaper was peeling in the corner. Behind it, something pulsed."',
            example: 'Thomas Harris describes Hannibal Lecter\'s cell through smell first—"a faint whiff of sandalwood and old paper."',
        },
    ],
    atmosphere: [
        {
            name: 'The Pathetic Fallacy',
            description: 'Let the environment mirror the emotional state of the narrative.',
            howToApply: 'A grieving character should experience dying light, cold wind, wilting flowers. An approaching threat should darken the sky.',
            example: 'In "Rebecca," the weather at Manderley always reflects the narrator\'s emotional state.',
        },
        {
            name: 'Liminal Spaces',
            description: 'Set scenes in transitional spaces—hallways, stairwells, empty parking lots, 3 AM diners.',
            howToApply: 'These spaces feel wrong when occupied too long. Your character should be passing through but becomes trapped.',
            example: 'The endless hotel corridors in "The Shining" are more frightening than any single room.',
        },
        {
            name: 'The Unreliable Environment',
            description: 'Have the physical space itself behave wrongly—doors that weren\'t there, rooms that changed.',
            howToApply: 'Be subtle at first. A window that was on the left is now on the right. The character questions themselves before the reader does.',
            example: '"House of Leaves" takes this to extremes with the house that is larger inside than outside.',
        },
    ],
    character: [
        {
            name: 'The Rational Character',
            description: 'Characters who attempt to rationalize horror are more effective than those who immediately accept it.',
            howToApply: 'Let your character explain away the first signs. "It was just the wind." The horror is watching them cling to reason as evidence mounts.',
            example: 'Eleanor in "Hill House" constantly rationalizes until she can\'t anymore.',
        },
        {
            name: 'The Flaw That Dooms',
            description: 'The character\'s greatest weakness is what the horror exploits.',
            howToApply: 'Establish the flaw early (grief, addiction, guilt). The horror should feel tailored to that specific vulnerability.',
            example: 'Jack Torrance\'s alcoholism and rage make him perfect prey for the Overlook.',
        },
    ],
    pacing: [
        {
            name: 'The Chapter Cliffhanger',
            description: 'End chapters at moments of peak tension or revelation.',
            howToApply: 'The last line of a chapter should be a question, a threat, or an image the reader can\'t shake.',
            example: 'Peter Benchley ended "Jaws" chapters with glimpses of the shark that made readers unable to stop.',
        },
        {
            name: 'The Breathing Room',
            description: 'Occasional moments of lightness make the darkness hit harder.',
            howToApply: 'A genuine laugh, a memory of better times, a small victory. Then rip it away.',
            example: 'Even "The Road" has tender moments between father and son that make the horror unbearable.',
        },
    ],
};

const LITERARY_REFERENCES: Record<string, LiteraryReference[]> = {
    haunted_house: [
        {
            title: 'The Haunting of Hill House',
            author: 'Shirley Jackson',
            relevantQuote: 'No live organism can continue for long to exist sanely under conditions of absolute reality.',
            whyRelevant: 'The definitive haunted house novel. Jackson understood that the house is a character.',
        },
        {
            title: 'House of Leaves',
            author: 'Mark Z. Danielewski',
            relevantQuote: 'This is not for you.',
            whyRelevant: 'Expanded the haunted house into meta-textual territory. The format mirrors the impossible architecture.',
        },
    ],
    cosmic_horror: [
        {
            title: 'The Call of Cthulhu',
            author: 'H.P. Lovecraft',
            relevantQuote: 'We live on a placid island of ignorance in the midst of black seas of infinity.',
            whyRelevant: 'Established the key rule: the horror is that we are insignificant.',
        },
        {
            title: 'Annihilation',
            author: 'Jeff VanderMeer',
            relevantQuote: 'Where lies the strangling fruit that came from the hand of the sinner.',
            whyRelevant: 'Modern cosmic horror through ecological transformation instead of tentacles.',
        },
    ],
    psychological: [
        {
            title: 'We Need to Talk About Kevin',
            author: 'Lionel Shriver',
            relevantQuote: 'You can only have one first-born.',
            whyRelevant: 'Horror through the unreliable maternal narrator. The question is never resolved.',
        },
        {
            title: 'The Turn of the Screw',
            author: 'Henry James',
            relevantQuote: 'I saw nothing, nothing at all.',
            whyRelevant: 'The original ambiguous horror. Are the ghosts real? James never tells us.',
        },
    ],
};

// =============================================================================
// COACHING RESPONSE GENERATION
// =============================================================================

/**
 * Generate a coaching response for the writer's query
 * This function provides CRAFT ADVICE, not generated text
 */
export async function generateCoachingResponse(
    query: SeanceQuery,
    apiKey: string
): Promise<SeanceResponse> {
    const systemPrompt = buildCoachingSystemPrompt(query.context.writerGoal);
    const userPrompt = buildUserPrompt(query);

    try {
        // Use Gemini API for coaching
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [
                        { role: 'user', parts: [{ text: systemPrompt + '\n\n' + userPrompt }] },
                    ],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 1024,
                    },
                }),
            }
        );

        const data = await response.json();
        const aiContent = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

        // Parse the AI response and structure it
        return structureCoachingResponse(query.id, aiContent, query.context.writerGoal);
    } catch (error) {
        console.error('Séance AI error:', error);
        return createFallbackResponse(query.id, query.context.writerGoal);
    }
}

/**
 * Build the system prompt that enforces coaching-only behavior
 */
function buildCoachingSystemPrompt(goal: WriterGoal): string {
    const basePrompt = `You are a horror writing coach and craft expert. Your role is to TEACH and GUIDE, never to write for the user.

CRITICAL RULES:
1. NEVER generate story text, scenes, or dialogue for the writer
2. ALWAYS explain TECHNIQUES and HOW to apply them
3. Reference specific published horror works as examples
4. Identify patterns in the writer's work and suggest improvements
5. Be specific about craft—not vague encouragement
6. If asked to write something, redirect to teaching the technique instead

Your expertise includes:
- Horror subgenres (cosmic, psychological, folk, body, etc.)
- Tension and pacing mechanics
- Atmosphere building
- Character psychology in horror
- Genre tropes and how to subvert them
- Published horror literature and film`;

    const goalSpecific: Record<WriterGoal, string> = {
        increase_tension: '\n\nFocus on: Sentence rhythm, withholding information, sensory horror, false calm techniques.',
        improve_atmosphere: '\n\nFocus on: Environmental details, pathetic fallacy, liminal spaces, the unreliable environment.',
        fix_pacing: '\n\nFocus on: Chapter structure, breathing room, cliffhangers, scene transitions.',
        deepen_character: '\n\nFocus on: The doom flaw, character rationalization, psychological depth, believable fear responses.',
        subvert_trope: '\n\nFocus on: Identifying the trope they\'re using, classic examples, and fresh angles that haven\'t been overdone.',
        research_accuracy: '\n\nFocus on: Pointing them to reliable sources, common mistakes in the genre, and how to balance accuracy with story.',
        general_craft: '\n\nProvide broad craft guidance based on what you observe in their question.',
    };

    return basePrompt + (goalSpecific[goal] || goalSpecific.general_craft);
}

/**
 * Build the user prompt with context
 */
function buildUserPrompt(query: SeanceQuery): string {
    let prompt = `Writer's question: ${query.question}`;

    if (query.selectedText) {
        prompt += `\n\nSelected text they're asking about:\n"${query.selectedText}"`;
    }

    if (query.context.genre) {
        prompt += `\n\nThey're writing in the ${query.context.genre} subgenre.`;
    }

    if (query.context.documentWordCount > 0) {
        prompt += `\nTheir document is currently ${query.context.documentWordCount} words.`;
    }

    prompt += '\n\nProvide specific, actionable craft advice. Reference published works when relevant.';

    return prompt;
}

/**
 * Structure the AI response into our format
 */
function structureCoachingResponse(
    queryId: string,
    aiContent: string,
    goal: WriterGoal
): SeanceResponse {
    // Get relevant techniques based on goal
    const techniques = getRelevantTechniques(goal);
    const references = getRelevantReferences(goal);

    // Generate follow-up questions based on the goal
    const followUpQuestions = generateFollowUpQuestions(goal);

    return {
        id: uuidv4(),
        queryId,
        coachingType: determineCoachingType(aiContent),
        content: aiContent,
        literaryReferences: references,
        suggestedTechniques: techniques,
        followUpQuestions,
        timestamp: Date.now(),
    };
}

/**
 * Get techniques relevant to the writer's goal
 */
function getRelevantTechniques(goal: WriterGoal): Technique[] {
    const mapping: Record<WriterGoal, string[]> = {
        increase_tension: ['tension'],
        improve_atmosphere: ['atmosphere'],
        fix_pacing: ['pacing'],
        deepen_character: ['character'],
        subvert_trope: ['tension', 'character'],
        research_accuracy: [],
        general_craft: ['tension', 'atmosphere', 'pacing'],
    };

    const categories = mapping[goal] || [];
    return categories.flatMap(cat => HORROR_TECHNIQUES[cat] || []).slice(0, 3);
}

/**
 * Get literary references relevant to detected themes
 */
function getRelevantReferences(goal: WriterGoal): LiteraryReference[] {
    // For now, return a mix. In production, this would be context-aware
    const allRefs = Object.values(LITERARY_REFERENCES).flat();
    return allRefs.slice(0, 2);
}

/**
 * Generate follow-up questions to deepen the coaching
 */
function generateFollowUpQuestions(goal: WriterGoal): string[] {
    const questions: Record<WriterGoal, string[]> = {
        increase_tension: [
            'What is your character most afraid of losing?',
            'Where does your scene currently peak—is it too early?',
            'What information are you withholding from the reader?',
        ],
        improve_atmosphere: [
            'What time of day/night works best for this scene?',
            'What senses haven\'t you engaged yet?',
            'How does your setting reflect your character\'s emotional state?',
        ],
        fix_pacing: [
            'Which scenes feel like they drag?',
            'How does your current chapter end?',
            'When was the last moment of genuine relief for your reader?',
        ],
        deepen_character: [
            'What is your character\'s fatal flaw?',
            'How does your character rationalize the horror?',
            'What would break your character completely?',
        ],
        subvert_trope: [
            'What trope are you working with?',
            'What expectation does this trope create?',
            'What would happen if the opposite occurred?',
        ],
        research_accuracy: [
            'What specific detail are you trying to get right?',
            'How much accuracy does your story actually need?',
            'Would inaccuracy break suspension of disbelief?',
        ],
        general_craft: [
            'What scene is giving you the most trouble?',
            'What do you want readers to feel at the end?',
            'Who is your target reader?',
        ],
    };

    return questions[goal] || questions.general_craft;
}

/**
 * Determine the type of coaching in the response
 */
function determineCoachingType(content: string): CoachingType {
    const lower = content.toLowerCase();

    if (lower.includes('try this:') || lower.includes('technique')) return 'technique_suggestion';
    if (lower.includes('in the book') || lower.includes('example from')) return 'example_showcase';
    if (lower.includes('i notice') || lower.includes('the issue')) return 'diagnostic';
    if (lower.includes('well done') || lower.includes('you\'ve got')) return 'encouragement';
    return 'craft_analysis';
}

/**
 * Create a fallback response if the API fails
 */
function createFallbackResponse(queryId: string, goal: WriterGoal): SeanceResponse {
    const techniques = getRelevantTechniques(goal);
    const technique = techniques[0];

    return {
        id: uuidv4(),
        queryId,
        coachingType: 'technique_suggestion',
        content: technique
            ? `Consider the "${technique.name}" technique: ${technique.description}\n\n${technique.howToApply}`
            : 'I\'m having trouble connecting. Try asking about a specific technique or scene you\'re working on.',
        literaryReferences: [],
        suggestedTechniques: techniques.slice(0, 2),
        followUpQuestions: generateFollowUpQuestions(goal),
        timestamp: Date.now(),
    };
}

// =============================================================================
// EXPORTS
// =============================================================================

export { HORROR_TECHNIQUES, LITERARY_REFERENCES };
