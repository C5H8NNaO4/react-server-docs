import { Helmet } from 'react-helmet';
import { SL_DOMAIN } from '../lib/config';

export const DefaultMeta = (props) => {
  return (
    <Helmet>
      <title>React Server | Lightning-Fast Server Rendering</title>
      <link rel="canonical" href="https://reactserver.dev/" />
      <meta
        name="description"
        content="Unlock the power of React Server! Effortlessly create server-side components with JSX/TSX and embrace a reactive coding style inspired by React. Dive into components, hooks, effects, and more."
      />
      <meta
        name="keywords"
        content="Moritz Roessler, CV, TypeScript, JavaScript Development, GraphQL Development, React, TSX, Vue, Components, Component Driven, Server-side Components, React Server, MUI, Vite, Modern Web Development, React Server-Side Rendering, Performance Optimization"
      />

      <meta
        property="og:title"
        content="React Server | Lightning-Fast Server Rendering"
      />
      <meta
        property="og:description"
        content="Unlock the power of React Server! Effortlessly create server-side components with JSX/TSX and embrace a reactive coding style inspired by React. Dive into components, hooks, effects, and more."
      />
      <meta
        property="og:image"
        content="https://state-less.cloud/preview.png"
      />
      <meta property="og:url" content="https://state-less.cloud" />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta
        name="twitter:title"
        content="React Server - Components, Hooks, Effects, and State"
      />
      <meta
        name="twitter:description"
        content="Unlock the power of React Server! Effortlessly create server-side components with JSX/TSX and embrace a reactive coding style inspired by React. Dive into components, hooks, effects, and more."
      />
      <meta
        name="twitter:image"
        content="https://state-less.cloud/preview.png"
      />
      {props.children}
    </Helmet>
  );
};

export const ListsMeta = () => {
  return (
    <>
      <title>Lists App - Organize Your Life with Productivity in Mind</title>
      <link rel="canonical" href="https://lists.state-less.cloud" />

      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta
        name="description"
        content="Boost your productivity with Lists, the ultimate web app to organize your tasks, track your daily water intake, manage expenses, and achieve your goals efficiently. Stay motivated with our unique gamification feature and earn points as you conquer your to-do list. Sign up now and embark on a journey to a more organized and fulfilling life."
      />
      <meta
        name="keywords"
        content="Lists app, productivity app, task management, water intake tracker, expense tracker, productivity tool, gamification, organization, to-do list"
      />
      <meta
        property="og:title"
        content="Lists App - Organize Your Life with Productivity in Mind"
      />
      <meta
        property="og:description"
        content="Boost your productivity with Lists, the ultimate web app to organize your tasks, track your daily water intake, manage expenses, and achieve your goals efficiently. Stay motivated with our unique gamification feature and earn points as you conquer your to-do list. Sign up now and embark on a journey to a more organized and fulfilling life."
      />
      <meta
        property="og:image"
        content="https://state-less.cloud/react-server.webp"
      />
      <meta property="og:url" content="https://state-less.cloud/lists" />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta
        name="twitter:title"
        content="Lists App - Organize Your Life with Productivity in Mind"
      />
      <meta
        name="twitter:description"
        content="Boost your productivity with Lists, the ultimate web app to organize your tasks, track your daily water intake, manage expenses, and achieve your goals efficiently. Stay motivated with our unique gamification feature and earn points as you conquer your to-do list. Sign up now and embark on a journey to a more organized and fulfilling life."
      />
      <meta
        name="twitter:image"
        content="https://state-less.cloud/react-server.webp"
      />
    </>
  );
};

export const BlogsMeta = (props) => {
  return (
    <Helmet>
      <title>React Server Community | Lightning-Fast Server Rendering</title>
      <link rel="canonical" href="https://blogs.state-less.cloud" />
      <meta
        name="description"
        content="Talk about React Server! Effortlessly create server-side components with JSX/TSX and embrace a reactive coding style inspired by React. Dive into components, hooks, effects, and more."
      />
      <meta
        name="keywords"
        content="Moritz Roessler, CV, TypeScript, JavaScript Development, GraphQL Development, React, TSX, Vue, Components, Component Driven, Server-side Components, React Server, MUI, Vite, Modern Web Development, React Server-Side Rendering, Performance Optimization"
      />

      <meta
        property="og:title"
        content="React Server Community | Lightning-Fast Server Rendering"
      />
      <meta
        property="og:description"
        content="Talk about React Server! Effortlessly create server-side components with JSX/TSX and embrace a reactive coding style inspired by React. Dive into components, hooks, effects, and more."
      />
      <meta
        property="og:image"
        content="https://state-less.cloud/preview.png"
      />
      <meta property="og:url" content="https://state-less.cloud" />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta
        name="twitter:title"
        content="React Server - Components, Hooks, Effects, and State"
      />
      <meta
        name="twitter:description"
        content="Unlock the power of React Server! Effortlessly create server-side components with JSX/TSX and embrace a reactive coding style inspired by React. Dive into components, hooks, effects, and more."
      />
      <meta
        name="twitter:image"
        content="https://state-less.cloud/preview.png"
      />
      {props.children}
    </Helmet>
  );
};

export const DomainsMeta = {
  'blogs.state-less.cloud': BlogsMeta,
  'state-less.cloud': DefaultMeta,
};

export const Meta = DomainsMeta[SL_DOMAIN];
