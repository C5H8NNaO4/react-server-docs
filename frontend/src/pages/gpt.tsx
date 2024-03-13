import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';

import { Markdown } from '../components/Markdown';
import { HelloWorldExample2 } from '../server-components/examples';
import { getRawPath } from '../components/CollabEditButton';
import { Navigation, NavigationButton2D } from '../components/NavigationButton';

export const GPTPage = () => {
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
        <Markdown
          src={getRawPath('src/gpt.md')}
          //   optimisticHeight="906px"
          landing
        >
          Loading...
        </Markdown>
        <Navigation />
      </Paper>
    </Container>
  );
};

export default GPTPage;
