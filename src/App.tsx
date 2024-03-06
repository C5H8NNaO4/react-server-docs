import './App.css';

import client, { localClient, makeClient } from './lib/client';

import { StateProvider } from './provider/StateProvider';
import { BrowserRouter } from 'react-router-dom';
import { StaticRouter } from 'react-router-dom/server';

import './App.css';
import { ApolloProvider, ApolloClient } from '@apollo/client/index.js';
import { ThemeProvider } from './provider/ThemeProvider';
import { Layout } from './container/Layout';
import ScrollToTop from './components/ScrollToTop';
import { AuthProvider, useLocalStorage } from '@state-less/react-client';
import { USE_PROD_CLIENT } from './lib/config';
import { Meta } from './components/Meta';
import { useFetch } from './components/Markdown';
import { useEffect } from 'react';

const Router = typeof window === 'undefined' ? StaticRouter : BrowserRouter;

function App({
  location,
  ssrClient,
}: {
  location?: Partial<Location>;
  ssrClient?: ApolloClient<any>;
}) {
  const [cookieConsent] = useLocalStorage('cookie-consent', null);

  return (
    <div className="App">
      {!cookieConsent && <Meta />}
      {cookieConsent === true && (
        <Meta>
          <script src="https://www.googletagmanager.com/gtag/js?id=G-C3F4656WLD"></script>

          <script id="gtm-script" src="/gtag-1.js"></script>
          <script
            id="test"
            type="application/javascript"
            src="/gtag-2.js"
          ></script>
        </Meta>
      )}
      <ApolloProvider
        client={
          import.meta.env.SSR
            ? USE_PROD_CLIENT
              ? ssrClient || client
              : localClient || client
            : USE_PROD_CLIENT
            ? client
            : localClient || client
        }
      >
        <AuthProvider>
          <StateProvider>
            <ThemeProvider>
              <Router
                location={location || { pathname: '/' }}
                future={{ v7_startTransition: true }}
              >
                <ScrollToTop />
                <Layout />
              </Router>
            </ThemeProvider>
          </StateProvider>
        </AuthProvider>
      </ApolloProvider>
    </div>
  );
}

export default App;
