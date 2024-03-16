import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import { Suspense } from 'react';
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
        <Suspense fallback="Loading">
          <Markdown
            src={getRawPath('src/pages/ButtonPage.md')}
            optimisticHeight="906px"
            landing
            suspend
          >
            Loading...
          </Markdown>
        </Suspense>
        <Alert severity="info">
          Increase the count by clicking the button below. The count is stored
          on our server.
        </Alert>
        <Box sx={{ display: 'flex', justifyContent: 'center', paddingTop: 1 }}>
          <Suspense fallback="Button Loading">
            <HelloWorldExample2 />
          </Suspense>
        </Box>
        <Suspense fallback="Mardown 2 Loading">
          <Markdown suspend src={getRawPath('src/pages/index/footer.md')}>
            Loading...
          </Markdown>
        </Suspense>
        <Navigation />
      </Paper>
    </Container>
  );
};

export default ButtonPage;