import { Paper, Container } from '@mui/material';

import { Markdown } from '../components/Markdown';
import { getRawPath } from '../components/CollabEditButton';
import { Navigation } from '../components/NavigationButton';
import { Admin } from '../server-components/examples/Admin';

const PAGE_SRC = 'src/pages/FAQ.md';

export const AdminPage = () => {
  return (
    <Container maxWidth="lg" disableGutters sx={{ minHeight: '100vh' }}>
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
        <Admin />
      </Paper>
    </Container>
  );
};
