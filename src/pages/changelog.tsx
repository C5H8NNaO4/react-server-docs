import {
  Paper,
  Container,
  Card,
  CardHeader,
  ListItem,
  ListItemText,
  Grid,
} from '@mui/material';

import { Markdown } from '../components/Markdown';
import { getRawPath } from '../components/CollabEditButton';
import { Navigation } from '../components/NavigationButton';
import { useEffect, useState } from 'react';
import Github from 'github-api';

const PAGE_SRC = 'src/pages/changelog.md';

export const ChangeLog = () => {
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
        <Markdown src={getRawPath(PAGE_SRC)}>*Loading*</Markdown>
        <Markdown># Commits</Markdown>
        <Grid container spacing={1}>
          <Grid item xs={12} sm={4}>
            <Commits repo={'state-less/react-server'} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Commits repo={'state-less/react-client'} />
          </Grid>

          <Grid item xs={12} sm={4}>
            <Commits repo={'C5H8NNaO4/react-server-docs'} />
          </Grid>
        </Grid>
        <Navigation />
      </Paper>
    </Container>
  );
};

const Commits = ({ repo }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const org = repo.split('/')[0].replace('@', '');
  const rep = repo.split('/')[1];
  useEffect(() => {
    (async () => {
      const gh = new Github();
      gh.getRepo(org, rep).listCommits((err, commits) => {
        setData(commits);
        setLoading(false);
      });
    })();
  });

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader title={repo}></CardHeader>
      {data.map((commit) => {
        return (
          <ListItem dense>
            <ListItemText
              primary={commit?.commit?.message}
              secondary={commit?.author?.login}
            ></ListItemText>
          </ListItem>
        );
      })}
    </Card>
  );
};
