import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Prevent generic cross-origin script errors (often from ad blockers or third party ad scripts)
// from bubbling up and crashing the preview environment.
window.onerror = function(message, source, lineno, colno, error) {
  if (message === 'Script error.' || !error) {
    return true;
  }
};

window.addEventListener('error', (e) => {
  if (e.message === 'Script error.' || !e.error) {
    e.stopImmediatePropagation();
    e.preventDefault();
  }
}, true);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
