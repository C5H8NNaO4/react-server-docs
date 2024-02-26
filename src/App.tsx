import './App.css';

import client, { localClient } from './lib/client';

import { StateProvider } from './provider/StateProvider';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';

import './App.css';
import { ApolloProvider } from '@apollo/client';
import { ThemeProvider } from './provider/ThemeProvider';
import { Layout } from './container/Layout';
import ScrollToTop from './components/ScrollToTop';
import { AuthProvider, useLocalStorage } from '@state-less/react-client';
import { Helmet } from 'react-helmet';
import { SL_DOMAIN, USE_PROD_CLIENT } from './lib/config';
import { BlogsMeta, DomainsMeta, Meta } from './components/Meta';

function App() {
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
          import.meta.env.MODE === 'production'
            ? client
            : USE_PROD_CLIENT
            ? client
            : localClient
        }
      >
        <AuthProvider>
          <StateProvider>
            <ThemeProvider>
              <Router>
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
