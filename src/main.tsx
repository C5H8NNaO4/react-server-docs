import React from 'react';
import ReactDOM from 'react-dom/client';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { a11yDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
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

/**
 * This is a needed workaround for react-syntax-highlighter to work in a production build with SSH
 * @see https://github.com/react-syntax-highlighter/react-syntax-highlighter/issues/513
 */
ReactDOM.createRoot(document.createElement('div')).render(
  <SyntaxHighlighter language="" children={''} style={a11yDark} />
);

// ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
//   <App />
// );

window.React = React;
ReactDOM.hydrateRoot(document.getElementById('root')!, <App />);

export {};
