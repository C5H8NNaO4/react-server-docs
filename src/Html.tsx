import { ReactNode, useContext } from 'react';
import refreshScript from './refresh-hack.js?raw';
import { renderCache } from '@state-less/react-client/';
import { ApolloClient } from '@apollo/client';
import client from './lib/client';
import { wrappedCache } from './components/Markdown';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

interface HtmlProps {
  children: ReactNode;
  client: ApolloClient<any>;
}
const __dirname = path.dirname(fileURLToPath(import.meta.url));

function Html({ children, client }: HtmlProps) {
  const index = fs
    .readFileSync(path.join(__dirname, '../client/index.html'), {
      encoding: 'utf-8',
    })
    .split('\n')
    .slice(3, -6)
    .join('\n');

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
      <head dangerouslySetInnerHTML={{ __html: index }}></head>
      <body>
        {viteScripts}
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
