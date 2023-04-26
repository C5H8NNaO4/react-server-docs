import { Container, Paper } from '@mui/material';

import { getRawPath } from '../../components/CollabEditButton';
import { Markdown } from '../../components/Markdown';
import { Navigation } from '../../components/NavigationButton';
import { VotingApp } from '../../server-components/examples/VotingApp';

const EXAMPLE_SRC_1 = 'src/examples/voting.md';

export const VotingPage = () => {
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
        <Markdown src={getRawPath(EXAMPLE_SRC_1)}>*Loading*</Markdown>
        <VotingApp />
        <Navigation />
      </Paper>
    </Container>
  );
};
