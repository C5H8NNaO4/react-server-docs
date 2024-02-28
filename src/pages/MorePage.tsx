import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';

import { Markdown } from '../components/Markdown';
import { getRawPath } from '../components/CollabEditButton';
import { NavigationButton2D } from '../components/NavigationButton';

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
          src={getRawPath('src/pages/MoreInfo.md')}
          optimisticHeight="4614px"
          landing
        >
          Loading...
        </Markdown>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <NavigationButton2D />
        </Box>
      </Paper>
    </Container>
  );
};

export default ButtonPage;
