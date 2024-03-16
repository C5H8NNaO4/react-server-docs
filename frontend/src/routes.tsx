import React, { useEffect, lazy } from 'react';
import { Route, useParams } from 'react-router';
import { GithubPage } from './pages/GithubPage';

import { ChatPage } from './pages/examples/chat';
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
import InfoIcon from '@mui/icons-material/Info';
import SmartButtonIcon from '@mui/icons-material/SmartButton';
import IndexPage from './pages/index';
import { SL_DOMAIN } from './lib/config';
import { Alert } from '@mui/material';

const docsRoutes = [
  <Route path="/" key="/" Component={IndexPage} />,
  <Route
    path="/button"
    key="/button"
    Component={React.lazy(() => import('./pages/ButtonPage') as any)}
  />,
  <Route
    path="/more"
    key="/more"
    Component={React.lazy(() => import('./pages/MorePage') as any)}
  />,
  <Route path="/why" key="/why" Component={WhyPage} />,
  <Route
    path="/installation"
    key="/installation"
    Component={() => {
      return <GithubPage src="src/pages/Installation.md" landing />;
    }}
  />,
  <Route
    path="/installation/forum"
    key="/installation/forum"
    Component={() => {
      return <GithubPage src="src/pages/installation/forum.md" landing />;
    }}
  />,
  <Route
    path="/faq"
    key="/faq"
    Component={React.lazy(() => import('./pages/faq'))}
  />,
  <Route
    path="/community"
    key="/community"
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
    key="/community/:post"
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
  <Route
    path="/changes"
    key="/changes"
    Component={React.lazy(() => import('./pages/changelog'))}
  />,
  <Route
    path="/collaborating"
    key="/collaborating"
    Component={() => {
      return <GithubPage src="src/pages/Collaborating.md" />;
    }}
  />,
  <Route
    path="/additional-topics"
    key="/additional-topics"
    Component={() => {
      return <GithubPage src="src/pages/Additional.md" />;
    }}
  />,
  <Route
    path="/SSR"
    key="/SSR"
    Component={() => {
      return <GithubPage src="src/pages/ssr/index.md" />;
    }}
  />,
  <Route
    path="/components"
    key="/components"
    Component={lazy(() => import('./pages/components'))}
  />,
  <Route
    path="/react-server"
    key="/react-server"
    Component={lazy(() => import('./pages/react-server'))}
  />,
  <Route
    path="/react-server/states"
    key="/react-server/states"
    Component={lazy(() => import('./pages/states'))}
  />,
  <Route
    path="/react-server/hooks"
    key="/react-server/hooks"
    Component={lazy(() => import('./pages/react-server/hooks'))}
  />,

  <Route
    path="/stores"
    key="/stores"
    Component={lazy(() => import('./pages/stores'))}
  />,
  <Route
    path="/server"
    key="/server"
    Component={lazy(() => import('./pages/server'))}
  />,
  <Route
    path="/authentication"
    key="/authentication"
    Component={lazy(() => import('./pages/authentication'))}
  />,
  <Route
    path="/examples"
    key="/examples"
    Component={lazy(() => import('./pages/examples'))}
  />,
  <Route
    path="/examples/comments"
    key="/examples/comments"
    Component={lazy(() => import('./pages/examples/comments'))}
  />,
  <Route path="/examples/chat" key="/examples/chat" Component={ChatPage} />,
  // <Route path="/examples/cms" Component={CMSPage} />,
  // <Route path="/examples/cms/pages" Component={PagesPage} />,
  // <Route path="/examples/cms/rendering" Component={NavigationPage} />,
  // <Route
  //   path="/debug"
  //   Component={() => (
  //     <div>
  //       <Poll />
  //     </div>
  //   )}
  // />,
  <Route
    path="/examples/votings"
    key="/examples/votings"
    Component={lazy(() => import('./pages/examples/voting'))}
  />,
  <Route
    path="/admin"
    key="/admin"
    Component={lazy(() => import('./pages/admin'))}
  />,
];

type Navigation = [
  string,
  string,
  string | null,
  string | null,
  ({ color }: { color: any }) => any
][];

const docsNavigation: Navigation = [
  ['/', 'Home', null, null, ({ color }) => <HomeIcon color={color} />],
  ['/button', 'Demo Button', null, null, SmartButtonIcon],
  ['/more', 'More Info', null, null, InfoIcon],
  ['/why', 'Why', null, null, QuestionMarkIcon],
  [
    '/installation',
    'Installation',
    null,
    null,
    ({ color }) => <InstallDesktopIcon color={color} />,
  ],
  [
    '/installation/forum',
    'Forum',
    null,
    null,
    ({ color }) => <InstallDesktopIcon color={color} />,
  ],
  ['/SSR', 'SSR', 'src/examples/SSR.md', null, FlashOnIcon],
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
        alt="React Server Logo"
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

const blogsRoutes = [
  <Route
    path="/"
    key="/"
    Component={lazy(() => import('./pages/ForumPage'))}
  />,
  <Route
    path="/:post"
    key="/:post"
    Component={lazy(() => import('./pages/PostPage'))}
  />,
];

const routes =
  SL_DOMAIN === 'blogs.state-less.cloud' ? blogsRoutes : docsRoutes;
const navigation =
  SL_DOMAIN === 'blogs.state-less.cloud' ? blogsNavigation : docsNavigation;

export { routes, navigation };
