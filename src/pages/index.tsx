import { Paper, Container, CardActions, Link, Grid } from '@mui/material';
import Typography from '@mui/material/Typography';

import { Alert, Button, Box } from '@mui/material';

import { useServerState } from '@state-less/react-client';
import client, { localClient } from '../lib/client';
import { useContext } from 'react';
import { stateContext } from '../provider/StateProvider';
import { Link as RouterLink } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Markdown } from '../components/Markdown';
import styles from './index.module.css';
import { NavigationButton2D } from '../components/NavigationButton';
import { navigation } from '../global';
import { getGHPath, getRawPath } from '../components/CollabEditButton';
import { Poll } from '../server-components/examples/Polls';
import { Comments } from '../server-components/examples/Comments';
import { HelloWorldExample2 } from '../server-components/examples';
import { ChatApp } from '../server-components/examples/ChatApp';
import { createPortal } from 'react-dom';
import { DefaultMeta, Meta } from '../components/Meta';

export const IndexPage = () => {
  return (
    <Grid container spacing={1}>
      <Meta Component={DefaultMeta} />

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
          <Box
            className={styles.imageContainer}
            sx={{ display: 'flex', justifyContent: 'space-between', gap: 4 }}
          >
            <img
              src="/favicon.svg"
              alt="React Server"
              style={{ width: 256, height: 256 }}
            />
            <div>
              <Markdown src={getRawPath('src/pages/index/introduction.md')}>
                Loading...
              </Markdown>
            </div>
          </Box>
          <Markdown src={getRawPath('src/pages/index.md')}>Loading...</Markdown>
          <Alert severity="info">
            Increase the count by clicking the button below. The count is stored
            on our server.
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
                      Please consider leaving some feedback on what to improve.
                    </Alert>
                  );
                }
                if (voted === 2) {
                  return (
                    <Alert severity="info">
                      Please consider opening an issue on Github. This will help
                      us a lot.
                    </Alert>
                  );
                }
              }}
            />
          </Grid>
          <Grid item xs={12} lg={6}>
            <Comments title="Comments"/>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export * from './states';
export { ComponentsPage } from './components';
