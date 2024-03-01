import { Paper, Container } from '@mui/material';

import { Markdown } from '../../../components/Markdown';
import { getRawPath } from '../../../components/CollabEditButton';
import { Navigation } from '../../../components/NavigationButton';
import { ServerNavigation } from '../../../server-components/ServerNavigation';

const CMS_SRC = 'src/examples/cms/index.md';
const FOOTER_SRC = 'src/examples/cms/footer.md';

export const CMSPage = () => {
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
        <Markdown src={getRawPath(CMS_SRC)}>*Loading*</Markdown>
        <ServerNavigation />
        <Markdown src={getRawPath(FOOTER_SRC)}>*Loading*</Markdown>
        <Navigation />
      </Paper>
    </Container>
  );
};
