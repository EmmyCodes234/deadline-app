# Profile Avatar Upload Feature

## Overview
Users can now upload custom profile images to personalize their vessel on the Profile Page.

## Features

### Upload Functionality
- **Click to Upload**: When in edit mode, click the hexagon avatar to select an image
- **File Validation**: 
  - Only image files accepted (jpg, png, gif, webp, etc.)
  - Maximum file size: 2MB
  - Automatic validation with user-friendly error messages
- **Visual Feedback**:
  - Camera icon overlay on hover (edit mode)
  - Loading spinner during upload
  - Smooth transitions and animations

### Storage
- Images stored in Supabase Storage bucket: `profiles`
- Organized in `avatars/` folder
- Unique filenames: `{user_id}-{timestamp}.{ext}`
- Public URLs for easy access
- Automatic cache control (1 hour)

### Security
- **Authentication Required**: Only logged-in users can upload
- **User Isolation**: Users can only upload/update/delete their own avatars
- **Public Read**: Anyone can view avatars (for profile sharing)
- **Storage Policies**: Enforced at database level

## Database Changes

### Schema Update
```sql
ALTER TABLE user_profiles 
ADD COLUMN avatar_url TEXT;
```

### Storage Bucket
- Bucket ID: `profiles`
- Public access: Yes (read-only)
- Policies: User-specific write, public read

## Usage

### For Users
1. Navigate to Profile Page (`/profile`)
2. Click "Reform Vessel" button to enter edit mode
3. Click on the hexagon avatar
4. Select an image file (max 2MB)
5. Wait for upload to complete
6. Avatar updates automatically
7. Click "Save" to confirm other changes

### For Developers
```typescript
// Upload avatar
const { profile, uploadAvatar } = useUserProfile();

const handleUpload = async (file: File) => {
  const result = await uploadAvatar(file);
  if (result?.success) {
    console.log('Avatar uploaded:', result.url);
  } else {
    console.error('Upload failed:', result?.error);
  }
};
```

## Migration Steps

1. **Run SQL Migration**:
   ```bash
   # In Supabase SQL Editor, run:
   supabase-avatar-storage.sql
   ```

2. **Verify Storage Bucket**:
   - Go to Supabase Dashboard > Storage
   - Confirm `profiles` bucket exists
   - Check policies are active

3. **Test Upload**:
   - Log in to the app
   - Go to Profile Page
   - Try uploading an image
   - Verify it appears correctly

## Technical Details

### File Upload Flow
1. User selects file via hidden input
2. Client validates file type and size
3. File uploaded to Supabase Storage
4. Public URL generated
5. Profile updated with avatar_url
6. UI refreshes with new image

### Hexagon Clipping
- Avatar images are clipped to hexagon shape using CSS `clip-path`
- Maintains breathing animation
- Preserves red glow effect
- Seamless integration with existing design

### Error Handling
- File type validation
- File size validation
- Upload error handling
- Network error handling
- User-friendly error messages

## Image Cropping & Optimization

### Cropping Features
- **Interactive Canvas**: Drag, zoom, and rotate images before upload
- **Hexagon Preview**: See exactly how the avatar will look in the hexagon frame
- **Controls**:
  - Zoom In/Out: Scale the image (0.5x to 3x)
  - Rotate: 90° increments for orientation
  - Drag: Reposition the image within the frame
- **Real-time Preview**: See changes instantly on the canvas

### Optimization
- **Automatic Resizing**: Images resized to 512x512px for optimal performance
- **JPEG Compression**: 85% quality for balance between size and clarity
- **File Size Reduction**: Typically 70-90% smaller than original
- **Format Conversion**: All images converted to JPEG for consistency

### User Flow
1. Click avatar in edit mode
2. Select image file
3. Cropper modal opens with preview
4. Adjust position, zoom, and rotation
5. Click "Apply" to crop and optimize
6. Optimized image uploads automatically
7. Avatar updates in real-time

## Future Enhancements
- ✅ Image cropping/resizing before upload (COMPLETE)
- ✅ Multiple image format optimization (COMPLETE)
- Avatar removal option
- Default avatar selection
- Image filters/effects (grayscale, sepia, etc.)
- Animated avatar support (GIF/WebP)
