import { Paper, Container } from '@mui/material';

import { Markdown } from '../components/Markdown';
import { Server } from '../server-components/Server';
import { getRawPath } from '../components/CollabEditButton';
import { Navigation } from '../components/NavigationButton';

const PAGE_SRC = 'src/playground/Server.md';

export const ServerPage = () => {
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
        <Server />
        <Markdown src={getRawPath(PAGE_SRC)}>*Loading*</Markdown>
        <Navigation />
      </Paper>
    </Container>
  );
};

export default ServerPage;
