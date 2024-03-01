import { Paper, Container } from '@mui/material';

import { Markdown } from '../../components/Markdown';
import { getRawPath } from '../../components/CollabEditButton';
import { Navigation } from '../../components/NavigationButton';
import { Comments } from '../../server-components/examples/Comments';

const EXAMPLE_SRC_1 = 'src/examples/comments.md';

export const CommentsPage = () => {
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
        <Comments />
        <Navigation />
      </Paper>
    </Container>
  );
};

export default CommentsPage;
