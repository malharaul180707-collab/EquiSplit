// Ensure window.fetch is writable and cannot throw getter-only errors
try {
  let _activeFetch = window.fetch;
  Object.defineProperty(window, 'fetch', {
    get() {
      return _activeFetch;
    },
    set(newFetch) {
      _activeFetch = newFetch;
    },
    configurable: true,
    enumerable: true,
  });
} catch (_) {}

import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(<App />);
