# Supabase Coverage Summary

## ✅ Fully Migrated to Supabase

### 1. Game Progress (`useGameProgress`)
- **Table**: `game_progress`
- **Data**: Level progress, skulls earned, unlocked levels, earned rewards
- **Components**: HauntingEditor, LevelSelect, VictoryModal
- **Status**: ✅ Complete with dual storage (Supabase + localStorage backup)

### 2. Writing Drafts (`useReaper`)
- **Table**: `writing_drafts`
- **Data**: Current draft text, word count
- **Components**: Editor (Reaper mode)
- **Status**: ✅ Complete with auto-save on every keystroke

### 3. Saved Documents (`useCrypt`)
- **Table**: `crypt_documents`
- **Data**: Saved documents/snapshots, titles, content, word counts
- **Components**: GrimoireEditor, Sidebar, CryptItemCard, SnapshotsModal
- **Status**: ✅ Complete with auto-save on every change

## 📝 Intentionally NOT Persisted

### UI State (Session-only)
- Sidebar open/closed state
- Active tab selection
- View mode (list/corkboard)
- Modal visibility
- Editor focus state
- Audio volume levels (dynamic)

**Reason**: These are temporary UI preferences that should reset each session for a fresh experience.

### Game State (Session-only)
- Current typing session in Reaper mode
- Active game state in Haunting Editor (PLAYING, DEAD, etc.)
- Patience meter
- Flow streak
- Ghost typing state

**Reason**: These are ephemeral game mechanics that should reset between sessions.

### User ID (localStorage only)
- Anonymous user identifier
- **Location**: `localStorage.getItem('deadline_user_id')`
- **Reason**: Needs to persist locally to identify the user across sessions, but doesn't need cloud storage

## 🔄 Data Flow

```
User Action
    ↓
Component State Update
    ↓
Hook (useGameProgress/useReaper/useCrypt)
    ↓
├─→ localStorage (immediate, synchronous)
└─→ Supabase (async, cloud backup)
```

## 🛡️ Fallback Strategy

1. **Primary**: Load from Supabase
2. **Fallback**: Load from localStorage if Supabase fails
3. **Offline**: Works entirely with localStorage
4. **Sync**: Automatically syncs to Supabase when connection restored

## 📊 Database Tables

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `game_progress` | Game levels & progress | `user_id`, `level_progress`, `unlocked_level_ids` |
| `writing_drafts` | Current draft | `user_id`, `draft_text`, `word_count` |
| `crypt_documents` | Saved documents | `user_id`, `doc_id`, `title`, `content` |

## ✨ Benefits

- ✅ **Cross-device sync**: Access your progress from any device
- ✅ **Data safety**: Cloud backup prevents data loss
- ✅ **Offline support**: Works without internet via localStorage
- ✅ **Anonymous**: No login required, uses generated user ID
- ✅ **Fast**: localStorage provides instant access, Supabase syncs in background

## 🚀 Future Enhancements

Potential features that could use Supabase:

1. **User Preferences** (if added):
   - Audio volume settings
   - Theme preferences
   - UI customization

2. **Social Features** (if added):
   - Leaderboards
   - Shared documents
   - Community challenges

3. **Analytics** (if added):
   - Writing statistics
   - Progress tracking over time
   - Achievement system
