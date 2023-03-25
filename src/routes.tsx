import { Route } from 'react-router';
import { StatesPage, IndexPage, ComponentsPage } from './pages';
import { AuthPage } from './pages/authentication';
import { FunctionsPage } from './pages/examples';
import { CMSPage } from './pages/examples/cms';
import { NavigationPage } from './pages/examples/cms/routing';
import { PagesPage } from './pages/examples/pages';
import { FAQPage } from './pages/faq';
import { GithubPage } from './pages/GithubPage';
import { ServerPage } from './pages/server';
import { StoresPage } from './pages/stores';

export const navigation = [
  ['/', 'Home'],
  ['/states', 'States', 'src/pages/States.md'],
  ['/components', 'Components', 'src/pages/Components.md'],
  ['/stores', 'Stores', 'src/pages/Stores.md'],
  ['/server', 'Server', 'src/playground/Server.md'],
  ['/authentication', 'Authentication', 'src/pages/Authentication.md'],
  ['/SSR', 'SSR', 'src/examples/SSR.md'],
  ['/examples', 'Examples', 'src/examples'],
  ['/examples/cms', 'CMS (Navigation)', 'src/examples/cms'],
  ['/examples/cms/pages', 'CMS (Pages)', 'src/examples/cms/pages.md'],
  [
    '/examples/cms/rendering',
    'CMS (Rendering)',
    'src/examples/cms/rendering.md',
  ],
  ['/additional-topics', 'Additional Topics', 'src/pages/Additional.md'],
  ['/faq', 'FAQ'],
  ['/collaborating', 'Collaborate', 'src/pages/Collaborating.md'],
];

export const routes = [
  <Route path="/" Component={IndexPage} />,
  <Route path="/faq" Component={FAQPage} />,
  <Route
    path="/collaborating"
    Component={() => {
      return <GithubPage src="src/pages/Collaborating.md" />;
    }}
  />,
  <Route
    path="/additional-topics"
    Component={() => {
      return <GithubPage src="src/pages/Additional.md" />;
    }}
  />,
  <Route
    path="/SSR"
    Component={() => {
      return <GithubPage src="src/examples/SSR.md" />;
    }}
  />,
  <Route path="/states" Component={StatesPage} />,
  <Route path="/components" Component={ComponentsPage} />,
  <Route path="/stores" Component={StoresPage} />,
  <Route path="/server" Component={ServerPage} />,
  <Route path="/authentication" Component={AuthPage} />,
  <Route path="/examples" Component={FunctionsPage} />,
  <Route path="/examples/cms" Component={CMSPage} />,
  <Route path="/examples/cms/pages" Component={PagesPage} />,
  <Route path="/examples/cms/rendering" Component={NavigationPage} />,
];
