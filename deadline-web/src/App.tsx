import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { LandingPage } from '@/components/LandingPage';
import { DeadLineHub } from '@/components/DeadLineHub';
import { OnboardingStepper } from '@/components/OnboardingStepper';
import { SummoningLoader } from '@/components/SummoningLoader';
import { CustomCursor } from '@/components/CustomCursor';
import { PageTransition } from '@/components/PageTransition';
import { useOnboardingState } from '@/hooks/useOnboardingState';
import { Howler } from 'howler';

// Lazy load heavy editor components for better initial load time
const HauntingEditor = lazy(() =>
  import('@/components/HauntingEditor').then((m) => ({ default: m.HauntingEditor }))
);
const GrimoireEditor = lazy(() =>
  import('@/components/GrimoireEditor').then((m) => ({ default: m.GrimoireEditor }))
);
const ProfilePage = lazy(() =>
  import('@/pages/ProfilePage').then((m) => ({ default: m.ProfilePage }))
);
const SettingsPage = lazy(() =>
  import('@/pages/SettingsPage').then((m) => ({ default: m.SettingsPage }))
);
const NotFoundPage = lazy(() =>
  import('@/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage }))
);

// Themed loading component
function LoadingScreen() {
  return (
    <div className="h-screen w-screen bg-zinc-950 flex items-center justify-center">
      <SummoningLoader size={100} message="Summoning the spirits..." />
    </div>
  );
}

// Landing page wrapper - Universal entry point for all users
function LandingWrapper() {
  const navigate = useNavigate();
  const { hasCompletedOnboarding } = useOnboardingState();

  const handleEnter = () => {
    // Unlock audio context for all browsers
    if (Howler.ctx) {
      Howler.ctx.resume().catch((err) => {
        console.warn('Audio context resume failed:', err);
      });
    }

    // Route based on onboarding status
    if (hasCompletedOnboarding) {
      // Returning user - go straight to hub
      navigate('/hub');
    } else {
      // New user - go to onboarding
      navigate('/onboarding');
    }
  };

  return <LandingPage onEnter={handleEnter} />;
}

// Onboarding wrapper
function OnboardingWrapper() {
  const navigate = useNavigate();

  const handleOnboardingComplete = () => {
    // Unlock audio context after onboarding
    if (Howler.ctx) {
      Howler.ctx.resume().catch((err) => {
        console.warn('Audio context resume failed:', err);
      });
    }
    // After onboarding (with or without auth), go to hub
    navigate('/hub');
  };

  return <OnboardingStepper onOnboardingComplete={handleOnboardingComplete} />;
}

// Protected route wrapper - requires onboarding completion
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { hasCompletedOnboarding, isLoading } = useOnboardingState();

  // Show loading screen while checking onboarding status
  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!hasCompletedOnboarding) {
    // Redirect to landing page, which will then route to onboarding
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Landing page - Universal entry point for ALL users */}
      <Route path="/" element={<LandingWrapper />} />

      {/* Onboarding route - Only for new users */}
      <Route path="/onboarding" element={<OnboardingWrapper />} />

      {/* Hub - Main navigation (protected) */}
      <Route
        path="/hub"
        element={
          <ProtectedRoute>
            <DeadLineHub />
          </ProtectedRoute>
        }
      />

      {/* Haunting Mode (protected) */}
      <Route
        path="/haunting"
        element={
          <ProtectedRoute>
            <Suspense fallback={<LoadingScreen />}>
              <HauntingEditor />
            </Suspense>
          </ProtectedRoute>
        }
      />

      {/* Grimoire Mode (protected) */}
      <Route
        path="/grimoire"
        element={
          <ProtectedRoute>
            <Suspense fallback={<LoadingScreen />}>
              <GrimoireEditor />
            </Suspense>
          </ProtectedRoute>
        }
      />

      {/* Profile Page (protected) */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Suspense fallback={<LoadingScreen />}>
              <ProfilePage />
            </Suspense>
          </ProtectedRoute>
        }
      />

      {/* Settings Page (protected) */}
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Suspense fallback={<LoadingScreen />}>
              <SettingsPage />
            </Suspense>
          </ProtectedRoute>
        }
      />

      {/* Catch all - 404 page */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default function App() {
  // Console Easter Egg - Scare developers who inspect the code
  useEffect(() => {
    const styles = [
      'color: #ef4444',
      'font-size: 30px',
      'font-family: serif',
      'text-shadow: 2px 2px black',
      'background: #000',
      'padding: 10px',
    ].join(';');

    console.log('%c💀 TURN BACK, VESSEL.', styles);
    console.log(
      '%cThe code you seek is cursed. Do not look too deep.',
      'color: #71717a; font-style: italic;'
    );

    // ASCII Art Skull
    console.log(`
    .ed"""" """$$$$be.
  -"           ^""**$$$e.
."                   '$$$c
/                      "4$$b
d  3                      $$$$
$  *                   .$$$$$$
.$  ^c           $$$$$e$$$$$$$$.
d$L  4.         4$$$$$$$$$$$$$$b
$$$$b ^ceeeee.  4$$ECL.F*$$$$$$$
$$$$P d$$$$F $ $$$$$$$$$- $$$$$$
3$$$F "$$$$b   $"$$$$$$$  $$$$*"
 $$P"  "$$b   .$ $$$$$...e$$
  *c    ..    $$ 3$$$$$$$$$$eF
    %ce""    $$$  $$$$$$$$$$*
     *$e.    *** d$$$$$"L$$
      $$$      4J$$$$$% $$$
     $"'$=e....$*$$**$cz$$"
     $  *=%4.$ L L$ P3$$$F
     $   "%*ebJLzb$e$$$$$b
      %..      4$$$$$$$$$$
       $$$e   z$$$$$$$$$$
        "*$c  "$$$$$$$P"
        ."""*$$$$$$$$$bc
     .-"    .$***$$$"""*e.
  .-"    .e$"     "*$c  ^*b.
.=*""""  $$$          $$    "**e.
        $$$           $$         "*
       $$$           $$
      $$$           $$
     $$$           $$
    $$$           $$
   $$$           $$
  $$$           $$
 $$$           $$
$$$           $$
    `);

    console.log(
      '%c⚠️  WARNING: This application feeds on your keystrokes.',
      'color: #f59e0b; font-weight: bold; font-size: 14px;'
    );
    console.log(
      '%cEvery word you type brings you closer to THE DEADLINE.',
      'color: #dc2626; font-size: 12px;'
    );
    console.log('%c', 'color: #000;'); // Reset
  }, []);

  return (
    <BrowserRouter>
      <CustomCursor />
      <PageTransition />
      <AppRoutes />
    </BrowserRouter>
  );
}