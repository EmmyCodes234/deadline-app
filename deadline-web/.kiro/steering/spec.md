# Spec Conventions

## What Are Specs?

Specs are structured documents that define features before implementation. They live in `.kiro/specs/[feature-name]/` and provide a formal design and implementation process.

## Spec Structure

Each spec feature has its own folder with these files:

- **requirements.md**: User stories and acceptance criteria
- **design.md**: Technical design and architecture decisions
- **tasks.md**: Implementation checklist
- Additional docs as needed (migration guides, analysis, etc.)

## Root Spec File

The root `.kiro/spec.md` contains core system specifications that apply across the entire application. It documents fundamental mechanics like:

- Core hooks (e.g., `useReaper`, `useCrypt`)
- Data structures and interfaces
- Key algorithms and game mechanics
- Cross-cutting concerns

## Requirements Document Format

### Structure

1. **Introduction**: High-level overview of the feature
2. **Glossary**: Define domain-specific terms
3. **Requirements**: Numbered requirement sections

### Requirement Format

Each requirement follows this pattern:

```markdown
### Requirement N

**User Story:** As a [role], I want [goal], so that [benefit].

#### Acceptance Criteria

1. WHEN [condition] THEN the system SHALL [behavior]
2. WHEN [condition] THEN the system SHALL [behavior]
...
```

### Writing Style

- Use "SHALL" for mandatory requirements
- Use "WHEN...THEN" format for acceptance criteria
- Be specific and testable
- Focus on observable behavior, not implementation
- Include edge cases and error conditions

## Design Document

Contains technical decisions:

- Component architecture
- State management approach
- Data flow diagrams
- API contracts
- Performance considerations
- Accessibility requirements

## Tasks Document

Implementation checklist with:

- Concrete, actionable tasks
- Dependencies between tasks
- Completion status tracking
- Links to related files

## Gothic Theme in Specs

Specs use gothic/horror terminology consistently:

- "Crypt" for document storage
- "Tombstone" for documents
- "Mausoleum" for folders
- "Reaper" for timer/deadline mechanics
- "Resurrection" for export/compilation
- "Poltergeist" for chaos/interference

This maintains thematic consistency between code and documentation.

## File References

Specs can reference external files using:

```markdown
#[[file:relative/path/to/file.ext]]
```

This allows specs to incorporate API schemas, type definitions, or other documentation.

## Migration Tracking

For large refactors, include:

- Migration guides explaining the transition
- Analysis documents showing current state
- Progress tracking (e.g., icon migration dashboard)
- Visual regression checklists
