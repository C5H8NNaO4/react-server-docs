import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { Alert, Box, Button, IconButton, Typography } from '@mui/material';
import { useComponent } from '@state-less/react-client';

const calc = (votes = 0, { lb = 0, ub = 0, random = false, wilson = true }) => {
  const diff = ub - lb;
  const lbv = Math.round(lb * votes);
  const rand = Math.round(Math.random() * diff * votes);
  return (wilson ? lbv : votes) + (random ? rand : 0);
};
export const VotingApp = ({
  random,
  wilson,
  id = 'votings',
  hideVotes = false,
}: {
  random?: boolean;
  wilson?: boolean;
  hideVotes?: boolean;
  id?: string;
}) => {
  const [component, { loading, error }] = useComponent(id, {});
  const { score, upvotes, downvotes, voted, policies } = component?.props || {};

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
  if (loading) return <div>Loading...</div>;

  return (
    <>
      {error && <Alert severity="error">{error.message}</Alert>}
      <Box
        display="flex"
        alignItems="center"
        justifyContent={'center'}
        flexDirection={'row'}
        sx={{ my: 2 }}
      >
        {hideVotes ? (
          <IconButton
            color="success"
            onClick={() => component?.props.upvote()}
            disabled={voted === -1 && policies.includes('single-vote')}
          >
            <ThumbUpIcon />
          </IconButton>
        ) : (
          <Button
            variant="contained"
            color="success"
            onClick={() => component?.props.upvote()}
            disabled={voted === -1 && policies.includes('single-vote')}
            startIcon={<ThumbUpIcon />}
          >
            {upvotes || 0}
          </Button>
        )}
        <Typography variant="h5" align="center" sx={{ mx: 2 }}>
          {sum}
        </Typography>
        {hideVotes ? (
          <IconButton
            color="error"
            onClick={() => component?.props.downvote()}
            disabled={voted === 1 && policies.includes('single-vote')}
          >
            <ThumbDownIcon />
          </IconButton>
        ) : (
          <Button
            variant="contained"
            color="error"
            onClick={() => component?.props.downvote()}
            disabled={voted === 1 && policies.includes('single-vote')}
            endIcon={<ThumbDownIcon />}
          >
            {downvotes || 0}
          </Button>
        )}
      </Box>
    </>
  );
};
