import { Paper, Container } from '@mui/material';

import { Markdown } from '../../components/Markdown';
import { getRawPath } from '../../components/CollabEditButton';
import { Navigation } from '../../components/NavigationButton';

import sd from './structuredData';
import { Suspense } from 'react';

const getMDFromSD = (data) => {
  return data.mainEntity.reduce((acc, cur) => {
    return (
      acc + '> ' + cur.name + '\n  \n  ' + cur.acceptedAnswer.text + '  \n'
    );
  }, '');
};
const PAGE_SRC = 'src/pages/FAQ.md';

const md = `# Vite + React + React Server FAQ
## Answers to frequently asked questions.`;
console.log('MD', md);
export const FAQPage = () => {
  return (
    <Container maxWidth="lg" disableGutters>
      <Paper
        sx={{
          mt: 1,
          marginBottom: 1,
          padding: {
            xs: 1,
            sm: 4,
            md: 8,
          },
        }}
      >
        <script type="application/ld+json">{JSON.stringify(sd)}</script>
        {/* <Markdown src={getRawPath(PAGE_SRC)}>*Loading*</Markdown> */}

        <Markdown>{md}</Markdown>
        <Markdown suspend center={false}>
          {getMDFromSD(sd)}
        </Markdown>
        <Navigation />
      </Paper>
    </Container>
  );
};

export default FAQPage;
