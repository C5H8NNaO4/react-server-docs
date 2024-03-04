import { ReactNode, useContext } from 'react';
import refreshScript from './refresh-hack.js?raw';
import { renderCache } from '@state-less/react-client/';
import { ApolloClient } from '@apollo/client';
import client from './lib/client';
import { wrappedCache } from './components/Markdown';

interface HtmlProps {
  children: ReactNode;
  client: ApolloClient<any>;
}

function Html({ children, client }: HtmlProps) {
  // inject vite refresh script to avoid "React refresh preamble was not loaded"
  let viteScripts = <></>;

  if (import.meta.env.DEV) {
    viteScripts = (
      <>
        <script type="module" src="/@vite/client" />
        <script
          type="module"
          dangerouslySetInnerHTML={{ __html: refreshScript }}
        />
      </>
    );
  }

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {viteScripts}
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="stylesheet" href="index.css" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
        <title>React Server | Lightning-Fast Server Rendering</title>
        <link
          rel="canonical"
          href="https://reactserver.dev/"
          data-react-helmet="true"
        />
        <meta
          name="description"
          content="Unlock the power of React Server! Effortlessly create server-side components with JSX/TSX and embrace a reactive coding style inspired by React. Dive into components, hooks, effects, and more."
          data-react-helmet="true"
        />
        <meta
          name="keywords"
          content="Moritz Roessler, CV, TypeScript, JavaScript Development, GraphQL Development, React, TSX, Vue, Components, Component Driven, Server-side Components, React Server, MUI, Vite, Modern Web Development, React Server-Side Rendering, Performance Optimization"
          data-react-helmet="true"
        />

        <meta
          property="og:title"
          content="React Server | Lightning-Fast Server Rendering"
          data-react-helmet="true"
        />
        <meta
          property="og:description"
          content="Unlock the power of React Server! Effortlessly create server-side components with JSX/TSX and embrace a reactive coding style inspired by React. Dive into components, hooks, effects, and more."
          data-react-helmet="true"
        />
        <meta
          property="og:image"
          content="https://state-less.cloud/preview.png"
          data-react-helmet="true"
        />
        <meta
          property="og:url"
          content="https://state-less.cloud"
          data-react-helmet="true"
        />
        <meta property="og:type" content="website" data-react-helmet="true" />
        <meta
          name="twitter:card"
          content="summary_large_image"
          data-react-helmet="true"
        />
        <meta
          name="twitter:title"
          content="React Server - Components, Hooks, Effects, and State"
          data-react-helmet="true"
        />
        <meta
          name="twitter:description"
          content="Unlock the power of React Server! Effortlessly create server-side components with JSX/TSX and embrace a reactive coding style inspired by React. Dive into components, hooks, effects, and more."
          data-react-helmet="true"
        />
        <meta
          name="twitter:image"
          content="https://state-less.cloud/preview.png"
        />
      </head>
      <body>
        <div id="root">{children}</div>
        <MarkdownSSRCache />
        <ApolloSSRCache ssrClient={client} />
      </body>
    </html>
  );
}

export const ApolloSSRCache = ({ ssrClient }) => {
  Object.values(renderCache).forEach((wrapped) => wrapped());
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `window.__APOLLO_STATE__=${JSON.stringify(
            ssrClient.extract()
          ).replace(/</g, '\\u003c')};`,
        }}
      />
    </>
  );
};

export const MarkdownSSRCache = () => {
  const result = Object.entries(wrappedCache).map(([key, wrapped]) => [
    key,
    (wrapped as any)(),
  ]);

  if (Object.keys(wrappedCache).length === 0)
    throw new Promise((resolve) => {
      setTimeout(resolve, 0);
    });
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `window.__MD_STATE__=${JSON.stringify(
            Object.fromEntries(result)
          ).replace(/<script/g, '\\u003cscript')};`,
        }}
      />
    </>
  );
};
export default Html;
