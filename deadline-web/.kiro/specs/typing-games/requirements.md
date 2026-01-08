# Requirements Document - Boss Features for Typing Games

## Introduction

This document specifies the requirements for implementing enhanced boss encounter mechanics across the three typing games: Verbum Dei (Haunting Editor), The Veil Typer, and The Silent Vigil. Boss encounters provide climactic challenges that test player skill and add dramatic tension to gameplay.

## Glossary

- **Boss**: A special enemy encounter that appears at specific intervals (every 15 kills) with enhanced difficulty, visual distinction, and unique mechanics
- **Verbum Dei**: The 2D typing defense game where players type words to banish approaching ghosts
- **Veil Typer**: The 3D typing survival horror game with Three.js rendering
- **Silent Vigil**: The psychological horror endurance test with microphone input
- **Combo Streak**: A counter that tracks consecutive successful word completions without errors
- **Mana**: A resource that accumulates through successful kills and powers ultimate abilities
- **Game Engine**: The custom React hook that manages game state, logic, and mechanics

## Requirements

### Requirement 1

**User Story:** As a player of Verbum Dei, I want to encounter boss ghosts at regular intervals, so that I experience escalating challenge and dramatic moments.

#### Acceptance Criteria

1. WHEN a player reaches 15 kills THEN the system SHALL spawn a boss ghost with distinct visual appearance
2. WHEN a boss ghost spawns THEN the system SHALL require the player to type a full sentence instead of a single word
3. WHEN a boss ghost is active THEN the system SHALL prevent other regular ghosts from spawning
4. WHEN a player defeats a boss ghost THEN the system SHALL award bonus points and mana
5. WHEN a boss ghost reaches the player THEN the system SHALL apply increased sanity damage compared to regular ghosts

### Requirement 2

**User Story:** As a player of Veil Typer, I want boss encounters to feel visually and mechanically distinct, so that I recognize the heightened challenge.

#### Acceptance Criteria

1. WHEN a boss ghost spawns in Veil Typer THEN the system SHALL render it with a larger scale and distinct visual effects
2. WHEN a boss ghost is present THEN the system SHALL apply special lighting or glow effects to distinguish it
3. WHEN a player types the boss sentence THEN the system SHALL provide progressive visual feedback showing completion progress
4. WHEN a boss is defeated THEN the system SHALL trigger a dramatic visual effect and sound
5. WHEN multiple ghosts are present THEN the system SHALL prioritize the boss for targeting

### Requirement 3

**User Story:** As a player, I want boss encounters to have appropriate difficulty scaling, so that they remain challenging but fair throughout the game.

#### Acceptance Criteria

1. WHEN a boss spawns THEN the system SHALL select a sentence with length appropriate to the current game difficulty
2. WHEN a player makes a typing error on a boss THEN the system SHALL reset their progress on that boss without resetting combo
3. WHEN a boss is active THEN the system SHALL move at a slower speed than regular ghosts to compensate for longer typing requirement
4. WHEN calculating boss points THEN the system SHALL apply the current combo multiplier to the base boss score
5. WHEN a boss is defeated THEN the system SHALL grant mana proportional to the sentence length

### Requirement 4

**User Story:** As a player of Silent Vigil, I want boss-like scripted horror events, so that the endurance challenge has memorable climactic moments.

#### Acceptance Criteria

1. WHEN the game timer reaches specific thresholds THEN the system SHALL trigger major scripted horror events
2. WHEN a major horror event occurs THEN the system SHALL combine multiple sensory elements (audio, visual, sanity drain)
3. WHEN a player survives a major event THEN the system SHALL provide a brief respite period before the next escalation
4. WHEN multiple events overlap THEN the system SHALL coordinate them to avoid overwhelming the player unfairly
5. WHEN the final event triggers THEN the system SHALL create the most intense challenge before victory

### Requirement 5

**User Story:** As a developer, I want consistent boss mechanics across games, so that the codebase is maintainable and players have coherent expectations.

#### Acceptance Criteria

1. WHEN implementing boss logic THEN the system SHALL use a consistent kill count threshold (15) across typing games
2. WHEN a boss is active THEN the system SHALL expose a boolean flag in the game state
3. WHEN boss data is needed THEN the system SHALL retrieve it from centralized data files
4. WHEN boss mechanics are updated THEN the system SHALL maintain backward compatibility with existing save data
5. WHEN testing boss features THEN the system SHALL provide debug modes to trigger bosses on demand

### Requirement 6

**User Story:** As a player, I want audio and visual feedback for boss encounters, so that I feel the weight and importance of these moments.

#### Acceptance Criteria

1. WHEN a boss spawns THEN the system SHALL play a distinct audio cue or music change
2. WHEN a boss is present THEN the system SHALL apply screen effects (shake, color shift, particles)
3. WHEN typing a boss sentence THEN the system SHALL provide per-character audio feedback
4. WHEN a boss is defeated THEN the system SHALL play a victory sound and show celebration effects
5. WHEN a boss defeats the player THEN the system SHALL play an appropriate defeat sound

### Requirement 7

**User Story:** As a player, I want boss encounters to contribute to progression and rewards, so that defeating them feels meaningful.

#### Acceptance Criteria

1. WHEN a player defeats a boss THEN the system SHALL record the achievement in their game progress
2. WHEN calculating level ratings THEN the system SHALL consider boss defeats in the skull criteria
3. WHEN a player completes multiple boss encounters THEN the system SHALL unlock special rewards or titles
4. WHEN viewing statistics THEN the system SHALL display boss defeat count and success rate
5. WHEN a boss is defeated THEN the system SHALL persist the achievement to the database immediately
