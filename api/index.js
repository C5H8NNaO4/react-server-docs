import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import { render } from '../dist/server/entry-server.js';
// import { createServer as createViteServer } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PORT = process.env.PORT || 3000;
const IS_PROD = process.env === 'production';
let vite;

async function createServer() {
  const app = express();

  // Create Vite server in middleware mode and configure the app type as
  // 'custom', disabling Vite's own HTML serving logic so parent server
  // can take control
  app.use(express.static('public'));
  // if (!IS_PROD) {
  //   vite = await createViteServer({
  //     mode: 'production',
  //     server: { middlewareMode: true },
  //     appType: 'custom',
  //   });

  //   // Use vite's connect instance as middleware. If you use your own
  //   // express router (express.Router()), you should use router.use
  //   // When the server restarts (for example after the user modifies
  //   // vite.config.js), `vite.middlewares` is still going to be the same
  //   // reference (with a new internal stack of Vite and plugin-injected
  //   // middlewares). The following is valid even after restarts.
  //   app.use(vite.middlewares);
  // }
  app.use('*', async (req, res, next) => {
    const url = req.originalUrl;
    console.log('Route called', url);
    try {
      // 1. Read index.html
      // let template = fs.readFileSync(
      //   path.resolve(__dirname, 'index.html'),
      //   'utf-8'
      // );
      // 2. Apply Vite H TML transforms. This injects the Vite HMR client,
      //    and also applies HTML transforms from Vite plugins, e.g. global
      //    preambles from @vitejs/plugin-react
      // template = await vite.transformIndexHtml(url, template);

      // // 3a. Load the server entry. ssrLoadModule automatically transforms
      // //    ESM source code to be usable in Node.js! There is no bundling
      // //    required, and provides efficient invalidation similar to HMR.
      // const imp =
      //   process.env.NODE_ENV === 'production'
      //     ? await import('../dist/server/entry-server.js')
      //     : await vite.ssrLoadModule('/src/entry-server.tsx');
      // const imp = await import();

      // 4. render the app HTML. This assumes entry-server.js's exported
      //     `render` function calls appropriate framework SSR APIs,
      //    e.g. ReactDOMServer.renderToString()
      // const { render } = imp;
      console.log('Calling render');
      await render({ pathname: req.originalUrl }, { req, res });
      console.log('After calling render');

      // 5. Inject the app-rendered HTML into the template.
      // const html = template.replace(`<!--ssr-outlet-->`, appHtml);

      // 6. Send the rendered HTML back.
      // res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
      // res.end();
    } catch (e) {
      // If an error is caught, let Vite fix the stack trace so it maps back
      // to your actual source code.
      console.log('Error ', e);

      // if (!IS_PROD) {
      //   vite.ssrFixStacktrace(e);
      // }
      next(e);
    }
  });

  // app.listen(PORT);
  console.log('Listening on ', PORT);

  return app;
}
const app = createServer();

export default app;
