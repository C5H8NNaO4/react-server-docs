import {
  Paper,
  Container,
  Button,
  Typography,
  Box,
  Card,
  CardHeader,
  CardContent,
  Chip,
  Link,
} from '@mui/material';

import { Markdown } from '../../components/Markdown';
import { Navigation } from '../../components/NavigationButton';
import { FlexBox } from '../../components/FlexBox';
import { useComponent } from '@state-less/react-client';
import { calc } from '../../server-components/examples/VotingApp';
import { Link as RouterLink } from 'react-router-dom';
import { useMemo } from 'react';
const PAGE_SRC = 'src/pages/States.md';

export const CommunityPage = () => {
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
        {/* <Markdown src={getRawPath(PAGE_SRC)}>*Loading*</Markdown> */}
        <Header />
        <Posts />
        <Navigation />
      </Paper>
    </Container>
  );
};

const Post = (post) => {
  const [votes, { error, loading }] = useComponent(
    post.children[0]?.component,
    {
      data: post.children[0],
    }
  );
  const { score, upvotes, downvotes } = votes?.props || {};
  const wilson = true,
    random = true;

  const randomUp = useMemo(() => Math.random(), []);
  const randomDown = useMemo(() => Math.random(), []);
  const sum = useMemo(
    () =>
      calc(upvotes, {
        lb: score?.upvote[0],
        ub: score?.upvote[1],
        wilson,
        random,
        r: randomUp,
      }) -
      calc(downvotes, {
        lb: score?.downvote[0],
        ub: score?.downvote[1],
        wilson,
        random,
        r: randomDown,
      }),
    [upvotes, downvotes, score, wilson, random]
  );

  const nAnswers = post.children.length - 1;
  return (
    <Card
      sx={{
        opacity: post.props.deleted ? 0.9 : 1,
      }}
    >
      <FlexBox>
        <Box
          sx={{
            width: '2px',
            backgroundColor: post.props.deleted
              ? 'error.main'
              : post.props.approved
              ? 'success.main'
              : 'warning.main',
          }}
        ></Box>
        <FlexBox sx={{ flexDirection: 'column', gap: 1 }}>
          <CardContent
            sx={{ ml: 8, display: 'flex', flexDirection: 'column', gap: 1 }}
          >
            <Chip
              color={sum > 0 ? 'success' : sum < 0 ? 'error' : undefined}
              label={`${sum} votes`}
            />
            <Chip
              color={nAnswers === 0 ? undefined : 'success'}
              label={`${nAnswers} answers`}
            ></Chip>
          </CardContent>
        </FlexBox>
        <Box>
          <CardHeader
            title={
              <Link to={`/community/${post.component}`} component={RouterLink}>
                {post.props.title}
              </Link>
            }
            sx={{ pb: 0 }}
          />
          <CardContent sx={{ py: 0 }}>
            <Markdown>{post.props.body}</Markdown>
            {post.props.tags?.map((tag) => (
              <Chip label={tag} />
            ))}
          </CardContent>
        </Box>
      </FlexBox>
    </Card>
  );
};

const Posts = () => {
  const [component, { error, loading }] = useComponent('community-forum');

  return (
    <FlexBox sx={{ flexDirection: 'column', gap: 1 }}>
      {component?.children?.map((post) => {
        return <Post {...post} />;
      })}
    </FlexBox>
  );
};
const Header = () => {
  return (
    <FlexBox sx={{ alignItems: 'center' }}>
      <Typography variant="h2">Top Questions</Typography>
      <NewPostButton />
    </FlexBox>
  );
};

export const NewPostButton = () => {
  return (
    <Button variant="contained" color="secondary" sx={{ ml: 'auto' }}>
      <Link to="/community/new" component={RouterLink}>
        Ask Question
      </Link>
    </Button>
  );
};
