import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

if ('serviceWorker' in navigator) {
  const register = () => {
    navigator.serviceWorker.register(
      import.meta.env.DEV
        ? new URL('service-worker.js', import.meta.url)
        : '/service-worker.js',
      {
        type: import.meta.env.DEV ? 'module' : 'classic',
      }
    );
  };
  register();
}

// ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
//   <App />
// );

window.React = React;
ReactDOM.hydrateRoot(document.getElementById('root')!, <App />);

export {};
