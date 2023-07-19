import './App.css';

import client, { localClient } from './lib/client';

import { StateProvider } from './provider/StateProvider';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';

import './App.css';
import { ApolloProvider } from '@apollo/client';
import { ThemeProvider } from './provider/ThemeProvider';
import { Layout } from './container/Layout';
import ScrollToTop from './components/ScrollToTop';
import { AuthProvider } from '@state-less/react-client';
import { useEffect } from 'react';

function App() {
  return (
    <div className="App">
      <ApolloProvider
        client={process.env.NODE_ENV === 'production' ? client : localClient}
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
