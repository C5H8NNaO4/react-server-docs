import { renderToPipeableStream } from 'react-dom/server';
import App from './App';
import Html from './Html';
import { SSRProvider } from '@state-less/react-client/dist/provider/SSRProvider';
import { resetCache } from '@state-less/react-client';

import { makeClient } from './lib/client';

export const render = async (location, { req, res }) => {
  let didError = false;
  const client = makeClient();
  resetCache();
  //   await getDataFromTree(
  //     <Suspense>
  //       <SSRProvider req={req}>
  //         <App location={location} ssrClient={client} />
  //       </SSRProvider>
  //     </Suspense>
  //   );
  //   await client.resetStore();

  const stream = renderToPipeableStream(
    <Html client={client}>
      <SSRProvider req={req}>
        {<App location={location} ssrClient={client} />}
      </SSRProvider>
    </Html>,
    {
      // bootstrapModules: ['src/main.tsx'],
      onShellReady: () => {
        res.statusCode = didError ? 500 : 200;
        res.setHeader('Content-type', 'text/html');
        //   res.write('<html><body><div></div></body></html>');
        //   res.end();
        stream.pipe(res);
        //   res.flush();
      },
      onAllReady() {
        //   res.end(`</div></body></html>`);
        // setTimeout(async () => {
        //     client.clearStore();
        // }, 100);
      },
      onError: (error) => {
        didError = true;
        console.log(error);
      },
    }
  );
};
