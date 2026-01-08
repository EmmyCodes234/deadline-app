import { createRoot } from 'react-dom/client'
import './index-backup.css'
import App from './App.tsx'

// CRITICAL FIX: Force cursor to be visible immediately
document.documentElement.style.cursor = 'default';
document.body.style.cursor = 'default';

// Also set it on the root element when it's available
const rootEl = document.getElementById('root');
if (rootEl) {
  rootEl.style.cursor = 'default';
}

createRoot(document.getElementById('root')!).render(
  <App />
)
