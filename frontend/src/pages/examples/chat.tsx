import { Paper, Container, Box } from '@mui/material';

import { Markdown } from '../../components/Markdown';
import { getRawPath } from '../../components/CollabEditButton';
import { Navigation } from '../../components/NavigationButton';
import { ChatApp } from '../../server-components/examples/ChatApp';

const EXAMPLE_SRC_1 = 'src/examples/chat.md';

export const ChatPage = () => {
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
        <Box sx={{ mt: 2 }}>
          <ChatApp />
        </Box>
        <Navigation />
      </Paper>
    </Container>
  );
};
