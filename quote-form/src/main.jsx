import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Mount into either #quote-form-root (production WP embed) or #root (Vite dev).
// This lets the same bundle work in both environments.
const mountEl = document.getElementById('quote-form-root') || document.getElementById('root');
if (mountEl) {
  createRoot(mountEl).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
