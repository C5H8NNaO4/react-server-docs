import { renderToPipeableStream } from 'react-dom/server';
import App from './App';

export const render = (url, res) => {
  let didError = false;
  const stream = renderToPipeableStream(<App />, {
    bootstrapScripts: ['src/main.tsx'],
    onShellReady: () => {
      res.statusCode = didError ? 500 : 200;
      res.setHeader('Content-type', 'text/html');
      stream.pipe(res);
    },
    onError: (error) => {
      didError = true;
      console.log(error);
    },
  });
};
