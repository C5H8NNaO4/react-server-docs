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
import ChecklistIcon from '@mui/icons-material/Checklist';
import PhishingIcon from '@mui/icons-material/Phishing';
import GitHubIcon from '@mui/icons-material/GitHub';
import StoreIcon from '@mui/icons-material/Store';
import AdjustIcon from '@mui/icons-material/Adjust';
import LockIcon from '@mui/icons-material/Lock';
import CodeIcon from '@mui/icons-material/Code';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import CommentIcon from '@mui/icons-material/Comment';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import LiveHelpIcon from '@mui/icons-material/LiveHelp';
import ChangeHistoryIcon from '@mui/icons-material/ChangeHistory';
import ExtensionIcon from '@mui/icons-material/Extension';
import GroupsIcon from '@mui/icons-material/Groups';
import { ForumPage, PostsPage } from '@state-less/leap-frontend';

import {
  FORUM_BASE_PATH,
  FORUM_KEY,
  FORUM_QA_GH,
  FORUM_RULES_GH,
  SL_DOMAIN,
} from './lib/config';
import { Alert } from '@mui/material';

type Navigation = [
  string,
  string,
  string | null,
  string | null,
  ({ color }: { color: any }) => any
][];

/**
 * TODO: This needs to be used in order to justify leaving it.
 * We need a list of urls for the sitemap generator.
 * */
const urls = [
  '/',
  '/why',
  '/installation',
  '/components',
  '/react-server',
  '/react-server/states',
  '/react-server/hooks',
  'https://github.com/state-less/clean-starter/',
  '/stores',
  '/server',
  '/authentication',
  '/SSR',
  '/examples',
  '/examples/comments',
  '/examples/votings',
  '/additional-topics',
  '/faq',
  '/changes',
  '/collaborating',
  'https://blogs.state-less.cloud/',
  'https://lists.state-less.cloud',
  'https://javascript.forum/',
];

const docsNavigation: Navigation = [
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
  [
    '/react-server/states',
    'States',
    'src/pages/States.md',
    null,
    ({ color }) => <AdjustIcon color={color} />,
  ],
  [
    '/react-server/hooks',
    'Hooks',
    'src/pages/react-server/hooks.md',
    null,
    PhishingIcon,
  ],
  [
    'https://github.com/state-less/clean-starter/',
    'Starter',
    null,
    null,
    GitHubIcon,
  ],
  ['/stores', 'Stores', 'src/pages/Stores.md', null, StoreIcon],
  ['/server', 'Server', 'src/playground/Server.md', null, StorageIcon],
  [
    '/authentication',
    'Authentication',
    'src/pages/Authentication.md',
    null,
    LockIcon,
  ],
  ['/SSR', 'SSR', 'src/examples/SSR.md', null, FlashOnIcon],
  ['/examples', 'Examples', 'src/examples', null, CodeIcon],
  [
    '/examples/comments',
    'Comments',
    'src/examples/comments.md',
    null,
    CommentIcon,
  ],
  [
    '/examples/votings',
    'Voting',
    'src/examples/voting.md',
    null,
    KeyboardArrowUpIcon,
  ],
  // ['/examples/chat', 'Chat', 'src/examples/chat.md'],
  // ['/examples/cms', 'CMS (Navigation)', 'src/examples/cms'],
  // ['/examples/cms/pages', 'CMS (Pages)', 'src/examples/cms/pages.md'],
  // [
  //   '/examples/cms/rendering',
  //   'CMS (Rendering)',
  //   'src/examples/cms/rendering.md',
  // ],
  [
    '/additional-topics',
    'Additional Topics',
    'src/pages/Additional.md',
    null,
    ExtensionIcon,
  ],
  ['/faq', 'FAQ', null, null, LiveHelpIcon],
  ['/changes', 'Changes', 'src/pages/changelog.md', null, ChangeHistoryIcon],
  [
    '/collaborating',
    'Collaborate',
    'src/pages/Collaborating.md',
    null,
    GroupsIcon,
  ],
  [
    'https://blogs.state-less.cloud/',
    'Community',
    null,
    null,
    ({ color }) => <ForumIcon color={color} />,
  ],
  [
    'https://lists.state-less.cloud',
    'Lists',
    null,
    null,
    ({ color }) => <ChecklistIcon color={color} />,
  ],
  [
    'https://javascript.forum/',
    'JavaScript Forum',
    null,
    null,
    ({ color }) => <ForumIcon color={color} />,
  ],
];

const blogsNavigation: Navigation = [
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
  <Route path="/components" Component={ComponentsPage} />,
  <Route path="/react-server" Component={ReactServerPage} />,
  <Route path="/react-server/states" Component={StatesPage} />,
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
  <Route
    path="/"
    Component={() => {
      return (
        <ForumPage
          basePath={FORUM_BASE_PATH}
          forumKey={FORUM_KEY}
          ghSrc={{
            rules: FORUM_RULES_GH,
            qa: FORUM_QA_GH,
          }}
        />
      );
    }}
  />,
  <Route
    path="/:post"
    Component={() => <PostsPage basePath="/" forumKey={FORUM_KEY} />}
  />,
];

const routes =
  SL_DOMAIN === 'blogs.state-less.cloud' ? blogsRoutes : docsRoutes;
const navigation =
  SL_DOMAIN === 'blogs.state-less.cloud' ? blogsNavigation : docsNavigation;

export { routes, navigation };
