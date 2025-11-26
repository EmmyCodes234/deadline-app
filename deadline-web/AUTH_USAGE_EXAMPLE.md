# useAuth Hook Usage Guide

## Overview

The `useAuth` hook provides authentication functionality using Supabase Auth. It supports email/password authentication and Google OAuth.

## Basic Usage

```tsx
import { useAuth } from '@/hooks/useAuth';

function MyComponent() {
  const { user, session, loading, signInWithEmail, signUpWithEmail, signOut, signInWithGoogle } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (user) {
    return (
      <div>
        <p>Welcome, {user.email}!</p>
        <button onClick={signOut}>Sign Out</button>
      </div>
    );
  }

  return <div>Please sign in</div>;
}
```

## Available Properties

### State
- `user: User | null` - Current authenticated user
- `session: Session | null` - Current session object
- `loading: boolean` - True during auth operations

### Functions

#### signInWithEmail(email, password)
```tsx
const handleSignIn = async () => {
  const { data, error } = await signInWithEmail('user@example.com', 'password123');
  
  if (error) {
    console.error('Sign in failed:', error);
  } else {
    console.log('Signed in:', data.user);
  }
};
```

#### signUpWithEmail(email, password)
```tsx
const handleSignUp = async () => {
  const { data, error } = await signUpWithEmail('user@example.com', 'password123');
  
  if (error) {
    console.error('Sign up failed:', error);
  } else {
    console.log('Account created:', data.user);
    // Note: User may need to verify email depending on Supabase settings
  }
};
```

#### signOut()
```tsx
const handleSignOut = async () => {
  const { error } = await signOut();
  
  if (error) {
    console.error('Sign out failed:', error);
  } else {
    console.log('Signed out successfully');
  }
};
```

#### signInWithGoogle()
```tsx
const handleGoogleSignIn = async () => {
  const { data, error } = await signInWithGoogle();
  
  if (error) {
    console.error('Google sign in failed:', error);
  } else {
    // User will be redirected to Google OAuth
    console.log('Redirecting to Google...');
  }
};
```

## Complete Login Component Example

```tsx
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

export function LoginForm() {
  const { user, loading, signInWithEmail, signUpWithEmail, signOut, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const authFunction = isSignUp ? signUpWithEmail : signInWithEmail;
    const { error: authError } = await authFunction(email, password);

    if (authError) {
      setError(authError.message);
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (user) {
    return (
      <div className="p-4">
        <p className="mb-4">Signed in as: {user.email}</p>
        <button 
          onClick={signOut}
          className="px-4 py-2 bg-red-600 text-white rounded"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">
        {isSignUp ? 'Create Account' : 'Sign In'}
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-600 text-white rounded"
        >
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </button>
      </form>

      <div className="mt-4">
        <button
          onClick={signInWithGoogle}
          className="w-full px-4 py-2 bg-white border border-gray-300 rounded flex items-center justify-center gap-2"
        >
          <img src="/google-icon.svg" alt="Google" className="w-5 h-5" />
          Sign in with Google
        </button>
      </div>

      <div className="mt-4 text-center">
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-blue-600 hover:underline"
        >
          {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
        </button>
      </div>
    </div>
  );
}
```

## Supabase Setup for Authentication

### 1. Enable Email Authentication

In your Supabase dashboard:
1. Go to **Authentication** → **Providers**
2. Enable **Email** provider
3. Configure email templates if needed

### 2. Enable Google OAuth (Optional)

1. Go to **Authentication** → **Providers**
2. Enable **Google** provider
3. Add your Google OAuth credentials:
   - Client ID
   - Client Secret
4. Add authorized redirect URLs:
   - `http://localhost:5173/auth/callback` (development)
   - `https://yourdomain.com/auth/callback` (production)

### 3. Configure Redirect URLs

In **Authentication** → **URL Configuration**:
- Site URL: `http://localhost:5173` (or your production URL)
- Redirect URLs: Add your callback URLs

## Integration with Existing Anonymous Users

If you want to link anonymous user data with authenticated users:

```tsx
import { useAuth } from '@/hooks/useAuth';
import { getUserId } from '@/lib/supabase';

function MyComponent() {
  const { user } = useAuth();
  
  useEffect(() => {
    if (user) {
      // User is authenticated
      const authUserId = user.id;
      
      // Optionally migrate anonymous data
      const anonUserId = getUserId(); // Gets the anonymous ID
      
      // You could create a migration function to transfer data
      // from anonUserId to authUserId in your database
    }
  }, [user]);
}
```

## Notes

- The hook automatically handles session persistence
- Auth state changes are listened to in real-time
- Loading state is managed automatically
- All functions return `{ data, error }` for easy error handling
- Google OAuth requires proper configuration in Supabase dashboard
