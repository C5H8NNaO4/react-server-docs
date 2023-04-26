import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { Alert, Box, Button, Typography } from '@mui/material';
import { useComponent } from '@state-less/react-client';

export const VotingApp = () => {
  const [component, { loading, error }] = useComponent('votings', {});

  if (loading) return <div>Loading...</div>;

  return (
    <>
      {error && <Alert severity="error">{error.message}</Alert>}
      <Typography variant="h4" align="center" sx={{ my: 2 }} gutterBottom>
        Voting App
      </Typography>
      <Box
        display="flex"
        alignItems="center"
        justifyContent={'center'}
        flexDirection={'row'}
        sx={{ my: 2 }}
      >
        <Button
          variant="contained"
          color="success"
          onClick={() => component?.props.upvote()}
          startIcon={<ThumbUpIcon />}
        >
          ({component?.props?.upvotes || 0})
        </Button>
        <Typography variant="h5" align="center" sx={{ mx: 2 }}>
          {component?.props?.title}
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => component?.props.downvote()}
          endIcon={<ThumbDownIcon />}
        >
          ({component?.props?.downvotes || 0})
        </Button>
      </Box>

      <Box display="block" alignItems="center" columnGap={4}>
        <Typography variant="h6" align="center" sx={{ mx: 2 }}>
          Left Bound: {component?.props?.score?.leftBound.toFixed(2)}
        </Typography>

        <Typography variant="h6" align="center" sx={{ mx: 2 }}>
          Right Bound: {component?.props?.score?.rightBound.toFixed(2)}
        </Typography>
      </Box>
    </>
  );
};
