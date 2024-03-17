import urls from "../frontend/src/urls.js";

const domain = "reactserver.dev";
//   '/',
//   '/button',
//   '/why',
//   '/installation',
//   '/components',
//   '/react-server',
//   '/react-server/states',
//   '/react-server/hooks',
//   'https://github.com/state-less/clean-starter/',
//   '/stores',
//   '/server',
//   '/authentication',
//   '/SSR',
//   '/examples',
//   '/examples/comments',
//   '/examples/votings',
//   '/additional-topics',
//   '/faq',
//   '/changes',
//   '/collaborating',
//   'https://blogs.state-less.cloud/',
//   'https://lists.state-less.cloud',
//   'https://javascript.forum/',
// ];
const header = `<?xml version="1.0" encoding="UTF-8"?>
		<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

export const genSiteMap = () => {
  const content = urls
    .map((url) => {
      if (!url.startsWith("/")) return;

      const sme = `    <url>
	    <loc>https://${domain}${url}</loc>
    </url>`;

      return sme;
    })
    .filter(Boolean)
    .join("\n");

  const footer = `</urlset>`;

  const output = `${header}
${content}
${footer}`;
  return output;
};
