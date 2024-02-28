import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

if ('serviceWorker' in navigator) {
  const register = () => {
    navigator.serviceWorker.register(
      new URL('service-worker.js', import.meta.url),
      {
        type: import.meta.env.DEV ? 'module' : 'classic',
      }
    );
  };
  register();
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <App />
);
