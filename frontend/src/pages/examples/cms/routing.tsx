import { Paper, Container, Alert } from '@mui/material';
import { useRef } from 'react';
import { getRawPath } from '../../../components/CollabEditButton';
import { Markdown } from '../../../components/Markdown';
import { Navigation } from '../../../components/NavigationButton';
import { DynamicPageExample } from '../../../server-components/examples/Routing';

const EXAMPLE_SRC_1 = 'src/examples/cms/rendering.md';
const EXAMPLE_SRC_2 = 'src/examples/cms/rendering-2.md';

export const NavigationPage = () => {
  return (
    <Container maxWidth="lg" disableGutters>
      <Paper sx={{ mt: 1, marginBottom: 1, padding: {
        xs: 1,
        sm: 4,
        md: 8,
      } }}>
        <Markdown src={getRawPath(EXAMPLE_SRC_1)}>*Loading*</Markdown>
        <Alert severity="info">
          If you added a navigation entry and a page with the same path in the
          previous example, you should be able to navigate to it here.
        </Alert>
        <DynamicPageExample />
        <Markdown src={getRawPath(EXAMPLE_SRC_2)}>*Loading*</Markdown>
        <Navigation />
      </Paper>
    </Container>
  );
};
