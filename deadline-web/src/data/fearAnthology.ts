/**
 * Fear Anthology™ Initial Data
 * Curated database of horror tropes, creatures, and techniques
 */

import type { FearAnthologyEntry } from '../types/epitaph';

export const FEAR_ANTHOLOGY_DATA: FearAnthologyEntry[] = [
    // ==========================================================================
    // MONSTERS
    // ==========================================================================
    {
        id: 'monster-001',
        category: 'monster',
        name: 'The Doppelgänger',
        description: 'A supernatural double of a living person, often seen as an omen of death or misfortune. The uncanny nature of seeing oneself creates deep psychological horror.',
        origins: 'Germanic folklore. The word literally means "double-walker." Seeing one\'s doppelgänger was considered a harbinger of death.',
        examples: [
            {
                title: 'The Double',
                author: 'Fyodor Dostoevsky',
                year: 1846,
                quote: 'This was another Mr. Golyadkin, but yet the same Mr. Golyadkin.',
                analysis: 'Dostoevsky uses the doppelgänger to externalize his protagonist\'s self-loathing and paranoia.'
            },
            {
                title: 'Us',
                author: 'Jordan Peele (film)',
                year: 2019,
                analysis: 'Modern reinterpretation where doppelgängers represent the marginalized aspects of society we ignore.'
            }
        ],
        subversions: [
            {
                concept: 'The doppelgänger is the "real" version',
                example: 'The protagonist discovers they are the copy, and their life has been a lie.',
                difficultyLevel: 'intermediate'
            },
            {
                concept: 'Cooperative doppelgängers',
                example: 'The doubles want to merge with their originals, not replace them.',
                difficultyLevel: 'advanced'
            },
            {
                concept: 'Empathetic role reversal',
                example: 'The narrative follows the doppelgänger who believes they are the original.',
                difficultyLevel: 'intermediate'
            }
        ],
        combinations: ['psychological-001', 'gothic-003'],
        tensionPattern: 'slow_burn',
        tags: ['identity', 'paranoia', 'uncanny', 'psychological', 'classic'],
        communityContributed: false,
        upvotes: 0
    },
    {
        id: 'monster-002',
        category: 'monster',
        name: 'The Wendigo',
        description: 'A malevolent supernatural creature from Algonquian folklore, associated with cannibalism, greed, and the wilderness. Often depicted as gaunt, skeletal, with an insatiable hunger.',
        origins: 'Algonquian peoples of North America. The wendigo represents the taboo of cannibalism and the dangers of isolation in harsh winters.',
        examples: [
            {
                title: 'Pet Sematary',
                author: 'Stephen King',
                year: 1983,
                analysis: 'King incorporates wendigo mythology into Maine\'s landscape, representing the corruption of grief.'
            },
            {
                title: 'The Rituals',
                author: 'Adam Nevill',
                year: 2011,
                analysis: 'Nordic variation exploring ancient forest gods with wendigo-like characteristics.'
            }
        ],
        subversions: [
            {
                concept: 'Wendigo as protector',
                example: 'The creature guards the forest from greater evils, with violence as necessary sacrifice.',
                difficultyLevel: 'advanced'
            },
            {
                concept: 'Urban wendigo',
                example: 'The hunger manifests in the metaphorical consumption of capitalism or addiction.',
                difficultyLevel: 'intermediate'
            }
        ],
        combinations: ['folk_horror-001', 'survival-001'],
        tensionPattern: 'crescendo',
        tags: ['wilderness', 'cannibalism', 'hunger', 'isolation', 'indigenous mythology'],
        communityContributed: false,
        upvotes: 0
    },
    {
        id: 'monster-003',
        category: 'monster',
        name: 'The Mimic',
        description: 'A creature that perfectly imitates the voice, appearance, or behavior of loved ones to lure victims. Exploits trust and familiarity.',
        origins: 'Various folklore traditions. Related to skinwalkers (Navajo), selkies (Celtic), and shapeshifters across cultures.',
        examples: [
            {
                title: 'The Thing',
                author: 'John W. Campbell Jr. / John Carpenter',
                year: 1982,
                quote: 'I know I\'m human. And if you were all these things, then you\'d just attack me right now.',
                analysis: 'The horror comes from the impossibility of trust when anything could be the monster.'
            },
            {
                title: 'Bird Box',
                author: 'Josh Malerman',
                year: 2014,
                analysis: 'The creatures exploit the human need to see and understand, mimicking familiar voices.'
            }
        ],
        subversions: [
            {
                concept: 'The mimic develops genuine feelings',
                example: 'After copying someone for years, the creature begins to prefer being them over hunting.',
                difficultyLevel: 'advanced'
            },
            {
                concept: 'Imperfect mimicry as communication',
                example: 'The creature is trying to make contact but lacks the ability to communicate normally.',
                difficultyLevel: 'intermediate'
            }
        ],
        combinations: ['psychological-002', 'body_horror-001'],
        tensionPattern: 'dread_plateau',
        tags: ['paranoia', 'trust', 'identity', 'isolation', 'survival'],
        communityContributed: false,
        upvotes: 0
    },

    // ==========================================================================
    // GHOSTS
    // ==========================================================================
    {
        id: 'ghost-001',
        category: 'ghost',
        name: 'The Residual Haunting',
        description: 'A ghost that repeats the same actions endlessly, like a recording. It doesn\'t interact with the living—it simply replays trauma.',
        origins: 'Stone tape theory (1970s paranormal research). The idea that environments can record emotional events.',
        examples: [
            {
                title: 'The Shining',
                author: 'Stephen King',
                year: 1977,
                quote: 'Some places are like people: some shine and some don\'t.',
                analysis: 'The Overlook Hotel contains residual hauntings that bleed into the present.'
            },
            {
                title: 'The Others',
                author: 'Alejandro Amenábar (film)',
                year: 2001,
                analysis: 'Brilliant inversion where the "ghosts" are the ones experiencing residual haunting.'
            }
        ],
        subversions: [
            {
                concept: 'Breaking the loop',
                example: 'The protagonist finds a way to interact with and free the residual ghost.',
                difficultyLevel: 'beginner'
            },
            {
                concept: 'The living as residual',
                example: 'The protagonist realizes they are the residual echo, trapped in their own loop.',
                difficultyLevel: 'advanced'
            }
        ],
        combinations: ['atmospheric-002', 'gothic-001'],
        tensionPattern: 'slow_burn',
        tags: ['haunted house', 'trauma', 'time', 'trapped', 'environmental'],
        communityContributed: false,
        upvotes: 0
    },
    {
        id: 'ghost-002',
        category: 'ghost',
        name: 'The Vengeful Spirit',
        description: 'A ghost driven by rage, seeking justice or revenge for wrongs done in life. Often bound until their murderer is punished.',
        origins: 'Universal across cultures. The yūrei (Japan), the revenant (Europe), La Llorona (Mexico).',
        examples: [
            {
                title: 'Ring/Ringu',
                author: 'Koji Suzuki',
                year: 1991,
                analysis: 'Sadako\'s curse spreads like a virus, making vengeance contagious and impersonal.'
            },
            {
                title: 'Beloved',
                author: 'Toni Morrison',
                year: 1987,
                quote: '124 was spiteful. Full of a baby\'s venom.',
                analysis: 'The ghost embodies the vengeance of slavery\'s victims, making historical horror personal.'
            }
        ],
        subversions: [
            {
                concept: 'Misdirected vengeance',
                example: 'The ghost is punishing the wrong person—the real villain is still alive and watching.',
                difficultyLevel: 'intermediate'
            },
            {
                concept: 'The vengeance is just',
                example: 'The protagonist slowly realizes the ghost\'s victims deserved their fate.',
                difficultyLevel: 'advanced'
            }
        ],
        combinations: ['psychological-003', 'gothic-002'],
        tensionPattern: 'crescendo',
        tags: ['revenge', 'justice', 'curse', 'tragic', 'violent'],
        communityContributed: false,
        upvotes: 0
    },

    // ==========================================================================
    // PSYCHOLOGICAL HORROR
    // ==========================================================================
    {
        id: 'psychological-001',
        category: 'psychological',
        name: 'The Unreliable Narrator',
        description: 'A narrator whose credibility is compromised, leaving readers uncertain about what is real. Mental illness, trauma, or deception obscure truth.',
        origins: 'Literary technique dating to Edgar Allan Poe. The term was coined by Wayne C. Booth in 1961.',
        examples: [
            {
                title: 'The Tell-Tale Heart',
                author: 'Edgar Allan Poe',
                year: 1843,
                quote: 'TRUE!—nervous—very, very dreadfully nervous I had been and am; but why will you say that I am mad?',
                analysis: 'The narrator\'s insistence on sanity undercuts their reliability from the first line.'
            },
            {
                title: 'House of Leaves',
                author: 'Mark Z. Danielewski',
                year: 2000,
                analysis: 'Multiple unreliable narrators create layers of uncertainty that mirror the impossible house.'
            }
        ],
        subversions: [
            {
                concept: 'The unreliable narrator is right',
                example: 'Everyone dismisses the narrator as crazy, but the horror is real—they\'re the only one who sees it.',
                difficultyLevel: 'intermediate'
            },
            {
                concept: 'Reader as unreliable',
                example: 'The narrative makes the reader complicit in misinterpreting events.',
                difficultyLevel: 'advanced'
            }
        ],
        combinations: ['monster-001', 'ghost-001'],
        tensionPattern: 'slow_burn',
        tags: ['madness', 'perception', 'trust', 'ambiguity', 'literary'],
        communityContributed: false,
        upvotes: 0
    },
    {
        id: 'psychological-002',
        category: 'psychological',
        name: 'Gaslighting',
        description: 'Psychological manipulation that makes victims question their own perception, memory, and sanity. Named after the 1944 film.',
        origins: 'Term from the play/film "Gas Light" (1938/1944). Psychological abuse tactic recognized clinically.',
        examples: [
            {
                title: 'Gerald\'s Game',
                author: 'Stephen King',
                year: 1992,
                analysis: 'The protagonist must untangle internalized gaslighting from childhood abuse while facing physical horror.'
            },
            {
                title: 'Gone Girl',
                author: 'Gillian Flynn',
                year: 2012,
                analysis: 'Both protagonists gaslight each other and the reader, creating moral vertigo.'
            }
        ],
        subversions: [
            {
                concept: 'Self-gaslighting',
                example: 'The protagonist has been lying to themselves so long they\'ve created a false reality.',
                difficultyLevel: 'intermediate'
            },
            {
                concept: 'The supernatural gaslight',
                example: 'A ghost or entity is gaslighting multiple people, but with a protective intention.',
                difficultyLevel: 'advanced'
            }
        ],
        combinations: ['monster-003', 'atmospheric-001'],
        tensionPattern: 'slow_burn',
        tags: ['abuse', 'manipulation', 'sanity', 'domestic', 'trauma'],
        communityContributed: false,
        upvotes: 0
    },

    // ==========================================================================
    // COSMIC HORROR
    // ==========================================================================
    {
        id: 'cosmic-001',
        category: 'cosmic',
        name: 'The Incomprehensible Entity',
        description: 'A being so vast or alien that human minds cannot process its existence. Understanding leads to madness.',
        origins: 'H.P. Lovecraft\'s Cthulhu Mythos (1920s-1930s). Influenced by cosmicism—the philosophy of human insignificance.',
        examples: [
            {
                title: 'The Call of Cthulhu',
                author: 'H.P. Lovecraft',
                year: 1928,
                quote: 'The most merciful thing in the world is the inability of the human mind to correlate all its contents.',
                analysis: 'Lovecraft establishes that knowledge itself is the horror—understanding destroys sanity.'
            },
            {
                title: 'Annihilation',
                author: 'Jeff VanderMeer',
                year: 2014,
                analysis: 'The Shimmer represents cosmic horror through biological transformation rather than tentacles.'
            }
        ],
        subversions: [
            {
                concept: 'The entity is learning',
                example: 'The incomprehensible being is studying humanity with innocent curiosity, but its methods kill.',
                difficultyLevel: 'advanced'
            },
            {
                concept: 'Comprehension through art',
                example: 'An artist or musician finds a way to process the entity through their medium.',
                difficultyLevel: 'advanced'
            }
        ],
        combinations: ['psychological-001', 'sci_fi_horror-001'],
        tensionPattern: 'crescendo',
        tags: ['lovecraftian', 'madness', 'insignificance', 'knowledge', 'scale'],
        communityContributed: false,
        upvotes: 0
    },

    // ==========================================================================
    // ATMOSPHERIC TECHNIQUES
    // ==========================================================================
    {
        id: 'atmospheric-001',
        category: 'atmospheric',
        name: 'The Uncanny Valley',
        description: 'Something almost-but-not-quite human creates profound discomfort. The near-familiar becomes disturbing.',
        origins: 'Concept from robotics (Masahiro Mori, 1970). Applied to horror through mannequins, dolls, and digital humans.',
        examples: [
            {
                title: 'The Polar Express (film)',
                author: 'Robert Zemeckis',
                year: 2004,
                analysis: 'Unintentionally demonstrated uncanny valley—the animation unsettled audiences.'
            },
            {
                title: 'Coraline',
                author: 'Neil Gaiman',
                year: 2002,
                quote: 'The other mother\'s smile was too wide.',
                analysis: 'Button eyes make a nurturing figure deeply wrong.'
            }
        ],
        subversions: [
            {
                concept: 'The uncanny becomes normal',
                example: 'The protagonist realizes they\'ve been uncanny all along—others see them as "off."',
                difficultyLevel: 'advanced'
            },
            {
                concept: 'Embracing the uncanny',
                example: 'A character finds the almost-human more comfortable than actual humans.',
                difficultyLevel: 'intermediate'
            }
        ],
        combinations: ['monster-001', 'body_horror-002'],
        tensionPattern: 'dread_plateau',
        tags: ['artificial', 'imitation', 'wrongness', 'subtle', 'perception'],
        communityContributed: false,
        upvotes: 0
    },
    {
        id: 'atmospheric-002',
        category: 'atmospheric',
        name: 'The Liminal Space',
        description: 'Transitional spaces (hallways, empty malls, parking garages at 3am) that feel wrong when lingered in. Places meant to pass through, not stay.',
        origins: 'Internet aesthetic (2019+). Builds on concepts of "non-places" (Marc Augé) and psychological liminality.',
        examples: [
            {
                title: 'The Backrooms',
                author: 'Anonymous (creepypasta)',
                year: 2019,
                quote: 'If you\'re not careful and noclip out of reality, you\'ll end up in the Backrooms.',
                analysis: 'Endless fluorescent office spaces become existential horror.'
            },
            {
                title: 'House of Leaves',
                author: 'Mark Z. Danielewski',
                year: 2000,
                analysis: 'The hallways in the house are ultimate liminal spaces—transitional areas that never end.'
            }
        ],
        subversions: [
            {
                concept: 'Liminality as refuge',
                example: 'The protagonist chooses to stay in the between-space because what waits at either end is worse.',
                difficultyLevel: 'intermediate'
            },
            {
                concept: 'The space is aware',
                example: 'The liminal space itself is a living entity that consumes those who linger.',
                difficultyLevel: 'intermediate'
            }
        ],
        combinations: ['cosmic-001', 'ghost-001'],
        tensionPattern: 'dread_plateau',
        tags: ['architecture', 'isolation', 'wrongness', 'modern', 'environmental'],
        communityContributed: false,
        upvotes: 0
    },

    // ==========================================================================
    // BODY HORROR
    // ==========================================================================
    {
        id: 'body_horror-001',
        category: 'body_horror',
        name: 'The Transformation',
        description: 'The body changes against the character\'s will, becoming something inhuman. Loss of bodily autonomy is the core fear.',
        origins: 'Ancient (Ovid\'s Metamorphoses). Modern body horror from Cronenberg films (1970s-1980s).',
        examples: [
            {
                title: 'The Fly',
                author: 'David Cronenberg (film)',
                year: 1986,
                quote: 'I\'m an insect who dreamed he was a man and loved it.',
                analysis: 'Transformation as metaphor for disease, aging, and loss of self.'
            },
            {
                title: 'Metamorphosis',
                author: 'Franz Kafka',
                year: 1915,
                analysis: 'Gregor\'s transformation into vermin is never explained—the horror is in the family\'s response.'
            }
        ],
        subversions: [
            {
                concept: 'Transformation as liberation',
                example: 'The character discovers their new form offers freedoms their human body never did.',
                difficultyLevel: 'intermediate'
            },
            {
                concept: 'Incomplete transformation',
                example: 'The change stops partway, leaving the character in permanent between-state.',
                difficultyLevel: 'beginner'
            }
        ],
        combinations: ['monster-002', 'cosmic-001'],
        tensionPattern: 'crescendo',
        tags: ['mutation', 'disease', 'identity', 'loss of control', 'disgust'],
        communityContributed: false,
        upvotes: 0
    },

    // ==========================================================================
    // FOLK HORROR
    // ==========================================================================
    {
        id: 'folk_horror-001',
        category: 'folk_horror',
        name: 'The Pagan Survival',
        description: 'Ancient beliefs persist in isolated communities, with rituals and practices that predate Christianity. The old ways demand sacrifice.',
        origins: 'British folk horror tradition (The Wicker Man, The Blood on Satan\'s Claw). Rooted in real historical folk practices.',
        examples: [
            {
                title: 'The Wicker Man',
                author: 'Robin Hardy (film)',
                year: 1973,
                quote: 'Your death will be a great gift to Summerisle, and our crops will prosper.',
                analysis: 'The horror is that the community believes they\'re doing the right thing.'
            },
            {
                title: 'Midsommar',
                author: 'Ari Aster (film)',
                year: 2019,
                analysis: 'Updates folk horror with emotional manipulation—the protagonist joins willingly.'
            }
        ],
        subversions: [
            {
                concept: 'The outsider was right to be suspicious, but wrong about why',
                example: 'The rituals are real and necessary—they prevent something worse.',
                difficultyLevel: 'advanced'
            },
            {
                concept: 'The community is victimized too',
                example: 'The locals are just as trapped in the tradition as outsiders.',
                difficultyLevel: 'intermediate'
            }
        ],
        combinations: ['monster-002', 'ghost-002'],
        tensionPattern: 'slow_burn',
        tags: ['rural', 'community', 'tradition', 'sacrifice', 'isolation'],
        communityContributed: false,
        upvotes: 0
    },

    // ==========================================================================
    // SURVIVAL HORROR
    // ==========================================================================
    {
        id: 'survival-001',
        category: 'survival',
        name: 'Resource Scarcity',
        description: 'Limited supplies (food, light, ammunition, medicine) create tension. Every decision costs something.',
        origins: 'Survival horror video games (Resident Evil, 1996). Roots in disaster and wilderness survival narratives.',
        examples: [
            {
                title: 'The Road',
                author: 'Cormac McCarthy',
                year: 2006,
                quote: 'He pulled the boy closer. Just remember that the things you put into your head are there forever.',
                analysis: 'Every can of food is precious. The scarcity makes small moments monumental.'
            },
            {
                title: 'A Quiet Place',
                author: 'John Krasinski (film)',
                year: 2018,
                analysis: 'Sound becomes the scarce resource—silence is safety, but humans need to communicate.'
            }
        ],
        subversions: [
            {
                concept: 'Abundance is the horror',
                example: 'There\'s plenty of everything, but taking any of it has terrible consequences.',
                difficultyLevel: 'intermediate'
            },
            {
                concept: 'The scarcity is manufactured',
                example: 'Someone is deliberately limiting resources to control survivors.',
                difficultyLevel: 'beginner'
            }
        ],
        combinations: ['monster-002', 'folk_horror-001'],
        tensionPattern: 'rollercoaster',
        tags: ['desperation', 'choices', 'sacrifice', 'apocalypse', 'tension'],
        communityContributed: false,
        upvotes: 0
    },

    // ==========================================================================
    // GOTHIC HORROR
    // ==========================================================================
    {
        id: 'gothic-001',
        category: 'gothic',
        name: 'The Decaying Estate',
        description: 'A once-grand house or castle crumbles, reflecting the moral decay of its inhabitants. Architecture as character.',
        origins: 'Horace Walpole\'s The Castle of Otranto (1764). The original Gothic novel.',
        examples: [
            {
                title: 'The Fall of the House of Usher',
                author: 'Edgar Allan Poe',
                year: 1839,
                quote: 'There was an iciness, a sinking, a sickening of the heart.',
                analysis: 'The house and the Usher bloodline are one—when the family dies, so does the building.'
            },
            {
                title: 'Rebecca',
                author: 'Daphne du Maurier',
                year: 1938,
                quote: 'Last night I dreamt I went to Manderley again.',
                analysis: 'Manderley is a character—it embodies the memory of Rebecca that haunts the protagonist.'
            }
        ],
        subversions: [
            {
                concept: 'The house heals',
                example: 'As the protagonist confronts their trauma, the decay reverses.',
                difficultyLevel: 'intermediate'
            },
            {
                concept: 'The house is the victim',
                example: 'The building itself is trapped with its monstrous inhabitants.',
                difficultyLevel: 'advanced'
            }
        ],
        combinations: ['ghost-001', 'psychological-002'],
        tensionPattern: 'slow_burn',
        tags: ['architecture', 'family', 'decay', 'history', 'atmosphere'],
        communityContributed: false,
        upvotes: 0
    }
];

// Quick lookup helpers
export const getEntriesByCategory = (category: string) =>
    FEAR_ANTHOLOGY_DATA.filter(e => e.category === category);

export const getEntryById = (id: string) =>
    FEAR_ANTHOLOGY_DATA.find(e => e.id === id);

export const searchEntries = (query: string) => {
    const lower = query.toLowerCase();
    return FEAR_ANTHOLOGY_DATA.filter(e =>
        e.name.toLowerCase().includes(lower) ||
        e.description.toLowerCase().includes(lower) ||
        e.tags.some(t => t.toLowerCase().includes(lower))
    );
};

export const FEAR_CATEGORIES = [
    { id: 'monster', name: 'Monsters & Creatures', icon: '👹', count: FEAR_ANTHOLOGY_DATA.filter(e => e.category === 'monster').length },
    { id: 'ghost', name: 'Ghosts & Hauntings', icon: '👻', count: FEAR_ANTHOLOGY_DATA.filter(e => e.category === 'ghost').length },
    { id: 'psychological', name: 'Psychological Horror', icon: '🧠', count: FEAR_ANTHOLOGY_DATA.filter(e => e.category === 'psychological').length },
    { id: 'cosmic', name: 'Cosmic Horror', icon: '🌌', count: FEAR_ANTHOLOGY_DATA.filter(e => e.category === 'cosmic').length },
    { id: 'body_horror', name: 'Body Horror', icon: '🦴', count: FEAR_ANTHOLOGY_DATA.filter(e => e.category === 'body_horror').length },
    { id: 'folk_horror', name: 'Folk Horror', icon: '🌾', count: FEAR_ANTHOLOGY_DATA.filter(e => e.category === 'folk_horror').length },
    { id: 'atmospheric', name: 'Atmospheric Techniques', icon: '🌫️', count: FEAR_ANTHOLOGY_DATA.filter(e => e.category === 'atmospheric').length },
    { id: 'survival', name: 'Survival Horror', icon: '🔦', count: FEAR_ANTHOLOGY_DATA.filter(e => e.category === 'survival').length },
    { id: 'gothic', name: 'Gothic Horror', icon: '🏚️', count: FEAR_ANTHOLOGY_DATA.filter(e => e.category === 'gothic').length },
    { id: 'slasher', name: 'Slasher', icon: '🔪', count: FEAR_ANTHOLOGY_DATA.filter(e => e.category === 'slasher').length },
    { id: 'supernatural', name: 'Supernatural', icon: '✨', count: FEAR_ANTHOLOGY_DATA.filter(e => e.category === 'supernatural').length },
    { id: 'sci_fi_horror', name: 'Sci-Fi Horror', icon: '🛸', count: FEAR_ANTHOLOGY_DATA.filter(e => e.category === 'sci_fi_horror').length },
];
