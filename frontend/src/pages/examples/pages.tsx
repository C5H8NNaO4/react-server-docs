import { Paper, Container, Alert } from '@mui/material';

import { Markdown } from '../../components/Markdown';
import { getRawPath } from '../../components/CollabEditButton';
import { Navigation } from '../../components/NavigationButton';
import {
  ServerPageContainer,
  ServerPages,
} from '../../server-components/ServerPages';
import { useComponent } from '@state-less/react-client';

const PAGES_SRC = 'src/examples/cms/pages.md';

export const PagesPage = () => {
  const [pages] = useComponent('pages', {});
  return (
    <Container maxWidth="lg" disableGutters>
      <Paper sx={{ mt: 1, marginBottom: 1, padding: {
        xs: 1,
        sm: 4,
        md: 8,
      } }}>
        <Markdown src={getRawPath(PAGES_SRC)}>Loading...</Markdown>
        <ServerPages />
        <Markdown>
          You can now consume the pages rendered by the server in your client.
          You only need to implement the routing.
        </Markdown>
        <Navigation />
      </Paper>
    </Container>
  );
};
