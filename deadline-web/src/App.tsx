import { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';

import { DeadLineHub } from '@/components/DeadLineHub';
import { InvocationSplash } from '@/components/InvocationSplash';
import { SummoningLoader } from '@/components/SummoningLoader';
import { PageTransition } from '@/components/PageTransition';
import { ColdOpenSplash } from '@/components/ColdOpenSplash';
import { SmoothScroll } from '@/components/SmoothScroll';
import { ProjectProvider } from '@/contexts/ProjectContext';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { EpitaphProvider } from '@/contexts/EpitaphContext';
import { useOnboardingState } from '@/hooks/useOnboardingState';
import { useAnimatedFavicon } from '@/hooks/useAnimatedFavicon';
import { useTypewriterAudio } from '@/hooks/useTypewriterAudio';
import { useAmbientAudio } from '@/hooks/useAmbientAudio';
import { Howler } from 'howler';

// Lazy load heavy editor components for better initial load time
const VeilTyper = lazy(() =>
  import('@/components/VeilTyper').then((m) => ({ default: m.VeilTyper }))
);
const HauntingEditor = lazy(() =>
  import('@/components/HauntingEditor').then((m) => ({ default: m.HauntingEditor }))
);

const TheSilentVigil = lazy(() =>
  import('@/components/TheSilentVigil').then((m) => ({ default: m.TheSilentVigil }))
);
const ProfilePage = lazy(() =>
  import('@/pages/ProfilePage').then((m) => ({ default: m.ProfilePage }))
);
const SettingsPage = lazy(() =>
  import('@/pages/SettingsPage').then((m) => ({ default: m.SettingsPage }))
);
const AbjurationsPage = lazy(() =>
  import('@/pages/AbjurationsPage').then((m) => ({ default: m.AbjurationsPage }))
);
const AboutPage = lazy(() =>
  import('@/pages/AboutPage').then((m) => ({ default: m.AboutPage }))
);
const NotFoundPage = lazy(() =>
  import('@/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage }))
);
const DocumentEditorDemo = lazy(() =>
  import('@/pages/DocumentEditorDemo').then((m) => ({ default: m.DocumentEditorDemo }))
);
const ProjectsDashboardPage = lazy(() =>
  import('@/pages/ProjectsDashboardPage').then((m) => ({ default: m.ProjectsDashboardPage }))
);
const ProjectEditorPage = lazy(() =>
  import('@/pages/ProjectEditorPage').then((m) => ({ default: m.ProjectEditorPage }))
);
const EpitaphEditor = lazy(() =>
  import('@/components/epitaph-editor').then((m) => ({ default: m.EpitaphEditor }))
);
const TiptapTest = lazy(() =>
  import('@/components/TiptapTest').then((m) => ({ default: m.TiptapTest }))
);
const EditorDebugger = lazy(() =>
  import('@/components/EditorDebugger').then((m) => ({ default: m.EditorDebugger }))
);
const AICompanionTest = lazy(() =>
  import('@/components/AICompanionTest').then((m) => ({ default: m.AICompanionTest }))
);

// Themed loading component
function LoadingScreen() {
  return (
    <div className="h-screen w-screen bg-zinc-950 flex items-center justify-center">
      <SummoningLoader size={100} message="Summoning the spirits..." />
    </div>
  );
}

// Hub wrapper - Direct entry point
function HubWrapper() {
  const { completeOnboarding } = useOnboardingState();

  useEffect(() => {
    // Unlock audio context for all browsers
    if (Howler.ctx) {
      Howler.ctx.resume().catch((err) => {
        console.warn('Audio context resume failed:', err);
      });
    }

    // Auto-complete onboarding for direct access
    completeOnboarding();
  }, [completeOnboarding]);

  return <DeadLineHub />;
}

// Onboarding wrapper - One-Step Invocation
function OnboardingWrapper() {
  const { completeOnboarding } = useOnboardingState();

  const handleComplete = () => {
    // Unlock audio context
    if (Howler.ctx) {
      Howler.ctx.resume().catch((err) => {
        console.warn('Audio context resume failed:', err);
      });
    }

    // Mark onboarding as complete
    completeOnboarding();
  };

  return <InvocationSplash onComplete={handleComplete} />;
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
      {/* Hub - Direct entry point */}
      <Route path="/" element={<HubWrapper />} />
      <Route path="/hub" element={<HubWrapper />} />

      {/* Onboarding route - Only for new users (optional) */}
      <Route path="/onboarding" element={<OnboardingWrapper />} />



      {/* DISABLED FOR DEMO - Too complex, not polished enough */}
      {/* The Veil Typer - 3D Typing Horror Game (protected) */}
      {/* <Route
        path="/veil-typer"
        element={
          <ProtectedRoute>
            <Suspense fallback={<LoadingScreen />}>
              <VeilTyper />
            </Suspense>
          </ProtectedRoute>
        }
      /> */}



      {/* DISABLED FOR DEMO - Too complex, not polished enough */}
      {/* The Silent Vigil - Psychological Horror Endurance (protected) */}
      {/* <Route
        path="/silent-vigil"
        element={
          <ProtectedRoute>
            <Suspense fallback={<LoadingScreen />}>
              <TheSilentVigil />
            </Suspense>
          </ProtectedRoute>
        }
      /> */}

      {/* Profile Page */}
      <Route
        path="/profile"
        element={
          <Suspense fallback={<LoadingScreen />}>
            <ProfilePage />
          </Suspense>
        }
      />

      {/* Settings Page */}
      <Route
        path="/settings"
        element={
          <Suspense fallback={<LoadingScreen />}>
            <AbjurationsPage />
          </Suspense>
        }
      />

      {/* About Page */}
      <Route
        path="/about"
        element={
          <Suspense fallback={<LoadingScreen />}>
            <AboutPage />
          </Suspense>
        }
      />

      {/* Projects Dashboard */}
      <Route
        path="/projects"
        element={
          <Suspense fallback={<LoadingScreen />}>
            <ProjectsDashboardPage />
          </Suspense>
        }
      />

      {/* Document Editor Demo */}
      <Route
        path="/document-editor"
        element={
          <Suspense fallback={<LoadingScreen />}>
            <DocumentEditorDemo />
          </Suspense>
        }
      />

      {/* Individual Project Route (Old Editor) */}
      <Route
        path="/project/:id"
        element={
          <Suspense fallback={<LoadingScreen />}>
            <EpitaphEditor />
          </Suspense>
        }
      />

      {/* Epitaph Editor - New Horror Writing Experience */}
      <Route
        path="/write/:id"
        element={
          <Suspense fallback={<LoadingScreen />}>
            <EpitaphEditor />
          </Suspense>
        }
      />

      {/* Tiptap Test */}
      <Route
        path="/tiptap-test"
        element={
          <Suspense fallback={<LoadingScreen />}>
            <TiptapTest />
          </Suspense>
        }
      />

      {/* Editor Debugger */}
      <Route
        path="/editor-debug"
        element={
          <Suspense fallback={<LoadingScreen />}>
            <EditorDebugger />
          </Suspense>
        }
      />

      {/* AI Companion Test */}
      <Route
        path="/ai-companion-test"
        element={
          <Suspense fallback={<LoadingScreen />}>
            <AICompanionTest />
          </Suspense>
        }
      />

      {/* Catch all - 404 page */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

function AppContent() {
  const [showColdOpen, setShowColdOpen] = useState(true);

  // Enable audio features globally
  useTypewriterAudio();
  useAmbientAudio();

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

    console.log('%c⚱️ TURN BACK, VESSEL.', styles);
    console.log(
      '%cThe words you seek are carved in stone. Do not look too deep.',
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
      '%c⚠️  WARNING: This application carves your words in stone.',
      'color: #f59e0b; font-weight: bold; font-size: 14px;'
    );
    console.log(
      '%cEvery word you type becomes part of your EPITAPH.',
      'color: #dc2626; font-size: 12px;'
    );
    console.log('%c', 'color: #000;'); // Reset
  }, []);

  // DISABLED FOR DEMO - Tab hijack is annoying for multitaskers
  // useTabHijack();

  // Enable animated favicon - skull comes alive when inactive or tabbed out
  useAnimatedFavicon();

  // Prevent caret browsing mode from making everything editable
  useEffect(() => {
    // Don't block keyboard events during cold open splash
    if (showColdOpen) return;

    const preventCaretBrowsing = (e: Event) => {
      const target = e.target as HTMLElement;
      // Only allow editing in actual input fields and contenteditable elements
      // Also allow Tiptap/ProseMirror editors
      if (
        target.tagName !== 'INPUT' &&
        target.tagName !== 'TEXTAREA' &&
        target.getAttribute('contenteditable') !== 'true' &&
        !target.classList.contains('ProseMirror') &&
        !target.closest('.tiptap') &&
        !target.closest('.tiptap-editor') &&
        !target.closest('.tiptap-editor-content')
      ) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    // Prevent beforeinput on non-editable elements
    document.addEventListener('beforeinput', preventCaretBrowsing, true);

    // Also prevent keydown on non-editable elements
    const preventKeydown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName !== 'INPUT' &&
        target.tagName !== 'TEXTAREA' &&
        target.getAttribute('contenteditable') !== 'true' &&
        !target.classList.contains('ProseMirror') &&
        !target.closest('.tiptap') &&
        !target.closest('.tiptap-editor') &&
        !target.closest('.tiptap-editor-content') &&
        e.key.length === 1 // Only prevent character keys, not navigation keys
      ) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    document.addEventListener('keydown', preventKeydown, true);

    return () => {
      document.removeEventListener('beforeinput', preventCaretBrowsing, true);
      document.removeEventListener('keydown', preventKeydown, true);
    };
  }, [showColdOpen]);

  return (
    <div className="fixed inset-0 m-0 p-0" style={{ top: 0, left: 0, right: 0, bottom: 0 }}>
      <SmoothScroll>
        {/* Cold Open Splash - First 5 seconds */}
        {showColdOpen && (
          <ColdOpenSplash onComplete={() => setShowColdOpen(false)} />
        )}

        <PageTransition />
        <AppRoutes />
      </SmoothScroll>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <SettingsProvider>
        <ProjectProvider>
          <EpitaphProvider>
            <AppContent />
          </EpitaphProvider>
        </ProjectProvider>
      </SettingsProvider>
    </BrowserRouter>
  );
}