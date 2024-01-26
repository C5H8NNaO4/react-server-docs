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
import { getRawPath } from '../../components/CollabEditButton';
import { Navigation } from '../../components/NavigationButton';
import { FlexBox } from '../../components/FlexBox';
import { useComponent } from '@state-less/react-client';
import {
  UpDownButtons,
  VotingApp,
  calc,
} from '../../server-components/examples/VotingApp';
import { Link as RouterLink } from 'react-router-dom';
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

const Post = (props) => {
  const [votes, { error, loading }] = useComponent(
    props.children[0]?.component
  );
  const { score, upvotes, downvotes } = votes?.props || {};
  const wilson = true,
    random = true;
  const sum =
    calc(upvotes, {
      lb: score?.upvote[0],
      ub: score?.upvote[1],
      wilson,
      random,
    }) -
    calc(downvotes, {
      lb: score?.downvote[0],
      ub: score?.downvote[1],
      wilson,
      random,
    });

  const nAnswers = props.children.length - 1;
  return (
    <Card>
      <FlexBox>
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
              <Link to={`/community/${props.component}`} component={RouterLink}>
                {props.props.title}
              </Link>
            }
            sx={{ pb: 0 }}
          />
          <CardContent sx={{ py: 0 }}>
            <Markdown>{props.props.body}</Markdown>
            {props.props.tags?.map((tag) => (
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
