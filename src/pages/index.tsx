import { Paper, Grid, Container } from '@mui/material';

import { Alert, Box } from '@mui/material';

import { Markdown } from '../components/Markdown';
import styles from './index.module.css';
import { NavigationButton2D } from '../components/NavigationButton';
import { getRawPath } from '../components/CollabEditButton';
import { Poll } from '../server-components/examples/Polls';
import { Comments } from '../server-components/examples/Comments';
import { HelloWorldExample2 } from '../server-components/examples';
import Favicon from '../assets/favicon.svg?react';

export const IndexPage = () => {
  return (
    <Container maxWidth="lg">
      <Grid container spacing={1}>
        <Grid item xs={12} md={12} xl={12}>
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
            <Grid
              container
              className={styles.imageContainer}
              spacing={4}
              sx={{ alignItems: 'center' }}
            >
              <Grid
                item
                sx={{ marginLeft: 'auto', marginRight: 'auto', flex: 1 }}
              >
                <Favicon
                  style={{
                    width: 256,
                    height: 256,
                    color: '#333333',
                  }}
                />
              </Grid>
              <Grid item sx={{ marginLeft: 'auto', marginRight: 'auto' }}>
                <Markdown
                  // src={getRawPath('src/pages/index/introduction.md')}
                  optimisticHeight="151px"
                  landing
                >{`# React Server`}</Markdown>
              </Grid>
            </Grid>
            <Markdown
              src={getRawPath('src/pages/index.md')}
              optimisticHeight="6576px"
              landing
            >
              Loading...
            </Markdown>
            <Alert severity="info">
              Increase the count by clicking the button below. The count is
              stored on our server.
            </Alert>
            <Box
              sx={{ display: 'flex', justifyContent: 'center', paddingTop: 1 }}
            >
              <HelloWorldExample2 />
            </Box>
            ´
            <Markdown src={getRawPath('src/pages/index/footer.md')}>
              Loading...
            </Markdown>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <NavigationButton2D next />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={12} xl={12} sx={{ mt: 1, p: 1 }}>
          <Grid container spacing={1}>
            <Grid item xs={12} lg={6}>
              <Poll
                id="poll-open"
                message={({ voted }) => {
                  if (voted === 0) {
                    return (
                      <Alert severity="success">
                        Thank you for your feedback!
                      </Alert>
                    );
                  }
                  if (voted === 1) {
                    return (
                      <Alert severity="info">
                        Please consider leaving some feedback on what to
                        improve.
                      </Alert>
                    );
                  }
                  if (voted === 2) {
                    return (
                      <Alert severity="info">
                        Please consider opening an issue on Github. This will
                        help us a lot.
                      </Alert>
                    );
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <Comments title="Comments" />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export * from './states';
export { ComponentsPage } from './components';
