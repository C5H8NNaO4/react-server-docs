import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';

import { Markdown } from '../components/Markdown';
import { HelloWorldExample2 } from '../server-components/examples';
import { getRawPath } from '../components/CollabEditButton';
import { Navigation, NavigationButton2D } from '../components/NavigationButton';

export const ButtonPage = () => {
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
          src={getRawPath('src/pages/ButtonPage.md')}
          optimisticHeight="906px"
          landing
        >
          Loading...
        </Markdown>
        <Alert severity="info">
          Increase the count by clicking the button below. The count is stored
          on our server.
        </Alert>
        <Box sx={{ display: 'flex', justifyContent: 'center', paddingTop: 1 }}>
          <HelloWorldExample2 />
        </Box>
        <Markdown src={getRawPath('src/pages/index/footer.md')}>
          Loading...
        </Markdown>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Navigation />
        </Box>
      </Paper>
    </Container>
  );
};

export default ButtonPage;
