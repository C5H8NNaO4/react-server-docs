import React, { useEffect } from 'react';
import { Navigate, Route, useParams } from 'react-router';
import { RedirectFunction } from 'react-router-dom';
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
import { Poll } from './server-components/examples/Polls';
import { CommentsPage } from './pages/examples/comments';
import { InstallationPage } from './pages/installation';
import { VotingPage } from './pages/examples/voting';
import { AdminPage } from './pages/admin';
import { ReactServerPage } from './pages/react-server';
import { ReactServerHooksPage } from './pages/react-server/hooks';
import { ChangeLog } from './pages/changelog';
import { ChatPage } from './pages/examples/chat';

import { ListsAboutPage } from './pages/lists/about';
import { WhyPage } from './pages/why';

import HomeIcon from '@mui/icons-material/Home';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import InstallDesktopIcon from '@mui/icons-material/InstallDesktop';
import StorageIcon from '@mui/icons-material/Storage';
import AppsIcon from '@mui/icons-material/Apps';
import ForumIcon from '@mui/icons-material/Forum';
import { CommunityPage } from './pages/community';
import { PostsPage } from './pages/community/post';
import { SL_DOMAIN } from './lib/config';
import { Alert } from '@mui/material';

const docsNavigation: any[] = [
  ['/', 'Home', null, null, ({ color }) => <HomeIcon color={color} />],
  [
    '/why',
    'Why',
    null,
    null,
    ({ color }) => <QuestionMarkIcon color={color} />,
  ],
  [
    '/installation',
    'Installation',
    null,
    null,
    ({ color }) => <InstallDesktopIcon color={color} />,
  ],

  [
    '/states',
    'States',
    'src/pages/States.md',
    null,
    ({ color }) => <StorageIcon color={color} />,
  ],
  [
    '/components',
    'Components',
    'src/pages/Components.md',
    null,
    ({ color }) => <AppsIcon color={color} />,
  ],
  [
    '/react-server',
    'React Server',
    'src/pages/react-server/index.md',
    null,
    ({ color }) => (
      <img
        src="/favicon.svg"
        style={{ width: 24, height: 24 }}
        loading="lazy"
      />
    ),
  ],
  ['/react-server/hooks', 'Hooks', 'src/pages/react-server/hooks.md'],
  ['/stores', 'Stores', 'src/pages/Stores.md'],
  ['/server', 'Server', 'src/playground/Server.md'],
  ['/authentication', 'Authentication', 'src/pages/Authentication.md'],
  ['/SSR', 'SSR', 'src/examples/SSR.md'],
  ['/lists', 'Lists', 'src/pages/lists.md', 'Lists'],
  ['/lists/analytics', 'Analytics', 'src/pages/lists.md', 'Analytics'],
  ['/lists/about', 'About Lists', 'src/lists/about.md', 'Lists'],
  ['/examples', 'Examples', 'src/examples'],
  ['/examples/comments', 'Comments', 'src/examples/comments.md'],
  ['/examples/votings', 'Voting', 'src/examples/voting.md'],
  // ['/examples/chat', 'Chat', 'src/examples/chat.md'],
  // ['/examples/cms', 'CMS (Navigation)', 'src/examples/cms'],
  // ['/examples/cms/pages', 'CMS (Pages)', 'src/examples/cms/pages.md'],
  // [
  //   '/examples/cms/rendering',
  //   'CMS (Rendering)',
  //   'src/examples/cms/rendering.md',
  // ],
  ['/additional-topics', 'Additional Topics', 'src/pages/Additional.md'],
  ['/faq', 'FAQ'],
  ['/changes', 'Changes', 'src/pages/changelog.md'],
  ['/collaborating', 'Collaborate', 'src/pages/Collaborating.md'],
  [
    'https://javascript.forum/',
    'JavaScript Forum',
    null,
    null,
    ({ color }) => <ForumIcon color={color} />,
  ],
  [
    'https://blogs.state-less.cloud/',
    'Community',
    null,
    null,
    ({ color }) => <ForumIcon color={color} />,
  ],
];

const blogsNavigation: any[] = [
  ['/', 'Home', null, null, ({ color }) => <HomeIcon color={color} />],
  [
    'https://state-less.cloud',
    'Docs',
    null,
    null,
    ({ color }) => (
      <img
        src="/favicon.svg"
        style={{ width: 24, height: 24 }}
        loading="lazy"
      />
    ),
    ,
  ],
];

const docsRoutes = [
  <Route path="/" Component={IndexPage} />,
  <Route path="/why" Component={WhyPage} />,
  <Route path="/installation" Component={InstallationPage} />,
  <Route path="/faq" Component={FAQPage} />,
  <Route
    path="/community"
    Component={() => {
      useEffect(() => {
        document.location.href = 'https://blogs.state-less.cloud';
        // window.history.replaceState(null, '', 'https://blogs.state-less.cloud');
      }, []);
      return <Alert severity="success">Redirecting...</Alert>;
    }}
  />,
  <Route
    path="/community/:post"
    Component={() => {
      const params = useParams();
      useEffect(() => {
        if (!params.post) {
          window.location.href = 'https://blogs.state-less.cloud';
          window.history.replaceState(
            null,
            '',
            'https://blogs.state-less.cloud'
          );
        } else {
          window.location.href = `https://blogs.state-less.cloud/${params.post}`;
          window.history.replaceState(
            null,
            '',
            `https://blogs.state-less.cloud/${params.post}`
          );
        }
        // window.history.replaceState(null, '', 'https://blogs.state-less.cloud');
      }, [params.post]);
      return <Alert severity="success">Redirecting...</Alert>;
    }}
  />,
  <Route path="/changes" Component={ChangeLog} />,
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
  <Route path="/react-server" Component={ReactServerPage} />,
  <Route path="/react-server/hooks" Component={ReactServerHooksPage} />,
  <Route path="/stores" Component={StoresPage} />,
  <Route path="/server" Component={ServerPage} />,
  <Route path="/authentication" Component={AuthPage} />,
  <Route path="/lists" Component={React.lazy(() => import('./pages/lists'))} />,
  <Route
    path="/lists/analytics"
    Component={React.lazy(
      () => import('./server-components/examples/Analytics')
    )}
  />,
  <Route path="/lists/about" Component={ListsAboutPage} />,
  <Route path="/examples" Component={FunctionsPage} />,
  <Route path="/examples/comments" Component={CommentsPage} />,
  <Route path="/examples/chat" Component={ChatPage} />,
  <Route path="/examples/cms" Component={CMSPage} />,
  <Route path="/examples/cms/pages" Component={PagesPage} />,
  <Route path="/examples/cms/rendering" Component={NavigationPage} />,
  <Route
    path="/debug"
    Component={() => (
      <div>
        <Poll />
      </div>
    )}
  />,
  <Route path="/examples/votings" Component={VotingPage} />,
  <Route path="/admin" Component={AdminPage} />,
];

const blogsRoutes = [
  <Route path="/" Component={CommunityPage} />,
  <Route path="/:post" Component={PostsPage} />,
];

const routes =
  SL_DOMAIN === 'blogs.state-less.cloud' ? blogsRoutes : docsRoutes;
const navigation =
  SL_DOMAIN === 'blogs.state-less.cloud' ? blogsNavigation : docsNavigation;

export { routes, navigation };
