import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { Alert, Box, Button, Typography } from '@mui/material';
import { useComponent } from '@state-less/react-client';
import { useEffect } from 'react';

export const VotingApp = () => {
  const [component, { loading, error }] = useComponent('votings', {});

  // we need to call wilsonScoreInterval() every time the upvotes or downvotes change
  useEffect(() => {
    if ((component?.props?.upvotes || component?.props?.downvotes) > 0) {
      component?.props.wilsonScoreInterval();
    }
  }, [component?.props?.upvotes, component?.props?.downvotes]);

  if (loading) return <div>Loading...</div>;

  return (
    <>
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
        {error && <Alert severity="error">{error.message}</Alert>}
        <Button
          variant="contained"
          color="primary"
          onClick={() => component?.props.upvote()}
          startIcon={<ThumbUpIcon />}
        >
          Upvotes ({component?.props?.upvotes})
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
          Downvotes ({component?.props?.downvotes})
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
