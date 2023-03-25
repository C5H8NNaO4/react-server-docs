import { Paper, Container } from '@mui/material';

import { Markdown } from '../components/Markdown';
import { getRawPath } from '../components/CollabEditButton';
import { Navigation } from '../components/NavigationButton';

const PAGE_SRC = 'src/pages/FAQ.md';

export const FAQPage = () => {
  return (
    <Container maxWidth="lg">
      <Paper sx={{ mt: 1, marginBottom: 1, padding: 8 }}>
        <Markdown src={getRawPath(PAGE_SRC)}>*Loading*</Markdown>
        <Navigation />
      </Paper>
    </Container>
  );
};
