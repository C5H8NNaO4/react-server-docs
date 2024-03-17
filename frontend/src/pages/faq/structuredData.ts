const data = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is it a framework ? Something like NextJs ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'It\'s a framework but it has a different purpose than Next.js. See this <a href="https://reactserver.dev/SSR">page</a>',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I do SSR with React Server?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '<p>Yes, <a href="https://reactserver.dev/SSR">SSR</a> is fully supported using a bundler like <a href="https://vitejs.dev/guide/">Vite</a> or <a href="https://webpack.js.org/">Webpack</a> or a framework like <a href="https://nextjs.org/">Next.js</a>.<br>Please note that, React Server is more than a <a href="/SSR#bff-vs-backend">BFF</a> used for SSR.\nYou can write your whole backend business logic using components, states, hooks and effects.</p>  \n',
      },
    },
    {
      '@type': 'Question',
      name: 'How does it compare to Next.js?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '<p>Next.js is essentially a <a href="https://reactserver.dev/SSR#bff-vs-backend">BFF</a> which allows you to do Server Side Rendering. React Server on the other hand allows you to build a <strong>backend</strong> using components that have their own lifecycle on the server side.<br>React Server allows you to use familiar paradigms and a reactive pattern known from the frontend. React Server can - but not neccessarily has to - be used as BFF in order to facilitate <a href="https://reactserver.dev/SSR">SSR</a>.</p>  \n',
      },
    },
    {
      '@type': 'Question',
      name: 'Is there a recommended way to handle authentication and authorization in React Server?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '<p>Authentication and Authorization is currently seamless with Google Oauth. Read more about <a href="https://reactserver.dev/authentication">authentication</a>.</p>  ',
      },
    },
  ],
};

export default data;
