import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';

import { Markdown } from '../components/Markdown';
import { getRawPath } from '../components/CollabEditButton';
import { Navigation } from '../components/NavigationButton';

export const MorePage = () => {
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
          src={getRawPath('src/pages/MoreInfo.md')}
          optimisticHeight="4614px"
          landing
        >
          Loading...
        </Markdown>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Navigation />
        </Box>
      </Paper>
    </Container>
  );
};

export default MorePage;
