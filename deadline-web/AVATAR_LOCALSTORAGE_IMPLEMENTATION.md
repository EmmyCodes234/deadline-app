# Avatar LocalStorage Implementation

## Overview
Implemented localStorage-based avatar persistence using Base64 encoding for immediate, client-side image storage that persists across reloads.

## Key Features

### 1. LocalStorage Persistence
- **Storage Key**: `scribe_avatar`
- **Format**: Base64-encoded data URL (e.g., `data:image/jpeg;base64,...`)
- **Size Limit**: 2MB max (localStorage-friendly)
- **Persistence**: Survives page reloads and browser sessions

### 2. Image Upload Flow

```
User clicks avatar
  ↓
File input opens
  ↓
User selects image
  ↓
FileReader converts to Base64
  ↓
Save to localStorage immediately
  ↓
Update UI instantly
  ↓
(Optional) Background upload to Supabase
```

### 3. Avatar Priority System

The component displays avatars in this priority order:
1. **LocalStorage** (`localAvatar`) - Highest priority, instant load
2. **Supabase** (`profile?.avatar_url`) - Fallback if no local avatar
3. **Default** (User icon) - Shown if no avatar exists

### 4. Implementation Details

#### State Management
```typescript
const [localAvatar, setLocalAvatar] = useState<string>('');
```

#### Load on Mount
```typescript
useEffect(() => {
  const savedAvatar = localStorage.getItem(AVATAR_STORAGE_KEY);
  if (savedAvatar) {
    setLocalAvatar(savedAvatar);
  }
}, []);
```

#### File Upload Handler
```typescript
const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  
  // Validate file type and size
  if (!file.type.startsWith('image/')) return;
  if (file.size > 2 * 1024 * 1024) return; // 2MB max
  
  // Convert to Base64
  const reader = new FileReader();
  reader.onload = (event) => {
    const base64String = event.target?.result as string;
    
    // Save immediately
    localStorage.setItem(AVATAR_STORAGE_KEY, base64String);
    setLocalAvatar(base64String);
    
    // Optional: Upload to Supabase in background
    uploadToSupabase(file);
  };
  
  reader.readAsDataURL(file);
};
```

#### Display Logic
```typescript
const avatarSrc = localAvatar || profile?.avatar_url;

{avatarSrc ? (
  <img src={avatarSrc} alt="Identity" />
) : (
  <User icon />
)}
```

### 5. User Experience

#### Hover State
- Black overlay (`bg-black/80`)
- Camera icon
- "Reform Visage" text
- Pointer cursor

#### Upload State
- Spinning Upload icon
- "Reforming..." text
- Immediate preview (no waiting for backend)

#### Error Handling
- File type validation (images only)
- Size validation (2MB max)
- Error messages displayed below avatar
- Graceful fallback on failure

### 6. Advantages

**Instant Feedback**
- Image appears immediately after selection
- No waiting for server upload
- Works offline

**Persistence**
- Survives page reloads
- Survives browser restarts
- No authentication required

**Hybrid Approach**
- LocalStorage for immediate UX
- Supabase for cloud backup (optional)
- Best of both worlds

### 7. Technical Considerations

**Storage Limits**
- LocalStorage typically has 5-10MB limit per domain
- 2MB image limit ensures plenty of headroom
- Base64 encoding adds ~33% overhead

**Performance**
- Base64 strings are larger than binary
- But localStorage is synchronous and fast
- No network latency

**Browser Compatibility**
- FileReader API: All modern browsers
- LocalStorage: Universal support
- Base64: Native browser support

### 8. Future Enhancements

**Possible Improvements**
- Image compression before Base64 conversion
- Multiple avatar slots
- Avatar history/undo
- Sync between localStorage and Supabase
- Clear avatar option

**Optimization**
- Use IndexedDB for larger images
- Implement image resizing/cropping
- Add WebP conversion for smaller size

## Usage

The avatar system works automatically:

1. **First Visit**: Shows default User icon
2. **Upload Image**: Click avatar, select file, see it immediately
3. **Reload Page**: Avatar persists from localStorage
4. **Different Device**: Falls back to Supabase avatar (if uploaded)

No configuration needed - it just works!
