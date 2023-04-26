import {
  Paper,
  Container,
  CardActions,
  Link,
  Grid,
  Hidden,
} from '@mui/material';
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
import { TwitterTimelineEmbed } from 'react-twitter-embed';

export const IndexPage = () => {
  const [value, setValue, localInfo] = useServerState('Hello World', {
    key: 'hello-world',
    scope: 'global',
    client: localClient,
  });
  console.log('Localinfo', localInfo);
  const { loading, error } = localInfo || {
    error: new Error('Wrong react-client version.'),
  };

  const [count, setCount] = useServerState(0, {
    key: 'count',
    scope: 'global',
  });

  const { state } = useContext(stateContext);
  return (
    <Grid container spacing={1}>
      <Grid item xs={12} md={4} xl={3} sx={{ mt: 1, p: 1 }}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
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
          <Grid item xs={12}>
            <Comments />
          </Grid>
          <Grid
            item
            xs={12}
            sx={{ display: { xl: 'none', xs: 'block' }, mt: 1 }}
          >
            <TwitterTimelineEmbed
              sourceType="profile"
              screenName="statelesscloud"
              options={{ height: 600 }}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} md={8} xl={6}>
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
              src="/react-server.png"
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
            <Button
              color="primary"
              variant="contained"
              onClick={() => setCount(count + 1)}
            >
              Count is {count}
            </Button>
          </Box>
          ´
          <Markdown>
            This is just the beginning. You can now start to build your own
            [components](/components) and share them with the community. Please
            read the docs for more information.
          </Markdown>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <NavigationButton2D next />
          </Box>
        </Paper>
      </Grid>

      <Grid
        item
        xs={12}
        md={4}
        xl={3}
        sx={{ display: { xl: 'block', xs: 'none' }, mt: 1 }}
      >
        <TwitterTimelineEmbed
          sourceType="profile"
          screenName="statelesscloud"
          options={{ height: 600 }}
        />
      </Grid>
    </Grid>
  );
};

export * from './states';
export { ComponentsPage } from './components';
