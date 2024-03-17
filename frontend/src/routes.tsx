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
import { Alert, Box } from '@mui/material';

import ViteLogp from './assets/vite.svg?react';
import VercelLogo from './assets/vercel.svg?react';
import Favicon from './assets/favicon.svg?react';

const docsRoutes = [
  <Route path="/" Component={IndexPage} />,
  <Route
    path="/code"
    Component={React.lazy(() => import('./pages/ButtonPage') as any)}
  />,
  <Route
    path="/more"
    Component={React.lazy(() => import('./pages/MorePage') as any)}
  />,
  <Route path="/why" Component={WhyPage} />,
  <Route
    path="/installation"
    Component={() => {
      return <GithubPage src="src/pages/Installation.md" landing />;
    }}
  />,
  <Route
    path="/installation/forum"
    Component={() => {
      return <GithubPage src="src/pages/installation/forum.md" landing />;
    }}
  />,
  <Route path="/faq" Component={React.lazy(() => import('./pages/faq'))} />,
  <Route
    path="/ssr"
    Component={() => {
      return <GithubPage src="src/pages/ssr/index.md" />;
    }}
  />,
  <Route
    path="/ssr/vite"
    Component={() => {
      return <GithubPage src="src/pages/ssr/vite.md" />;
    }}
  />,
  <Route
    path="/ssr/nextjs"
    Component={() => {
      return <GithubPage src="src/pages/ssr/next.js.md" />;
    }}
  />,
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
  <Route
    path="/changes"
    Component={React.lazy(() => import('./pages/changelog'))}
  />,
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
    path="/components"
    Component={lazy(() => import('./pages/components'))}
  />,
  <Route
    path="/react-server"
    Component={lazy(() => import('./pages/react-server'))}
  />,
  <Route
    path="/react-server/states"
    Component={lazy(() => import('./pages/states'))}
  />,
  <Route
    path="/react-server/hooks"
    Component={lazy(() => import('./pages/react-server/hooks'))}
  />,

  <Route path="/stores" Component={lazy(() => import('./pages/stores'))} />,
  <Route path="/server" Component={lazy(() => import('./pages/server'))} />,
  <Route
    path="/authentication"
    Component={lazy(() => import('./pages/authentication'))}
  />,
  <Route path="/examples" Component={lazy(() => import('./pages/examples'))} />,
  <Route
    path="/examples/comments"
    Component={lazy(() => import('./pages/examples/comments'))}
  />,
  <Route path="/examples/chat" Component={ChatPage} />,
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
    Component={lazy(() => import('./pages/examples/voting'))}
  />,
  <Route path="/admin" Component={lazy(() => import('./pages/admin'))} />,
];

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
  '/code',
  '/more',
  '/why',
  '/installation',
  '/installation/forum',
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
  ['/code', 'Code', null, null, SmartButtonIcon],
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
  [
    '/components',
    'Components',
    'src/pages/Components.md',
    null,
    ({ color }) => <AppsIcon color={color} />,
  ],
  ['/ssr', 'SSR', 'src/ssr/index.md', null, FlashOnIcon],
  [
    '/ssr/vite',
    'Vite',
    'src/ssr/vite.md',
    null,
    ({ color }) => (
      <Box
        sx={{
          color: color === 'primary' ? undefined : color + '.main',
        }}
      >
        <ViteLogp
          width={'24px'}
          height={'24px'}
          className={color === 'secondary' ? 'active' : ''}
        />
      </Box>
    ),
  ],
  [
    '/ssr/nextjs',
    'Next.js',
    'src/ssr/next.js.md',
    null,
    ({ color }) => (
      <Box sx={{ color: color + '.main' }}>
        <VercelLogo width={'24px'} height={'24px'} />
      </Box>
    ),
  ],
  [
    '/react-server',
    'React Server',
    'src/pages/react-server/index.md',
    null,
    ({ color }) => (
      <Box sx={{ color: color + '.main' }}>
        <Favicon
          alt="React Server Logo"
          style={{ width: 24, height: 24 }}
          loading="lazy"
        />
      </Box>
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
  <Route path="/" Component={lazy(() => import('./pages/ForumPage'))} />,
  <Route path="/:post" Component={lazy(() => import('./pages/PostPage'))} />,
];

const routes =
  SL_DOMAIN === 'blogs.state-less.cloud' ? blogsRoutes : docsRoutes;
const navigation =
  SL_DOMAIN === 'blogs.state-less.cloud' ? blogsNavigation : docsNavigation;

export { routes, navigation };
