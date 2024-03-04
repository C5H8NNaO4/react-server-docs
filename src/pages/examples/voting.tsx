import { Container, Paper } from '@mui/material';

import { getRawPath } from '../../components/CollabEditButton';
import { Markdown } from '../../components/Markdown';
import { Navigation } from '../../components/NavigationButton';
import { VotingApp } from '../../server-components/examples/VotingApp';

const EXAMPLE_SRC_1 = 'src/examples/voting.md';

export const VotingPage = () => {
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
        <Markdown src={getRawPath(EXAMPLE_SRC_1)}>*Loading*</Markdown>
        <Markdown>
          {`
## Options
The Voting component has two options to augment the actual vote
count. 

1. wilson - Uses the lowerbound of the wilson score to
calculate the vote count.  
2. random - Adds a random amount up to the
upper amount of the wilson score.
        `}
        </Markdown>
        Raw values
        <VotingApp wilson={false} />
        Wilson score
        <VotingApp wilson={true} />
        Random
        <VotingApp random={true} wilson={true} />
        Multiple Votes (Raw)
        <VotingApp id="votings-multiple" wilson={false} />
        Hide Votes
        <VotingApp id="votings-multiple" wilson={false} hideVotes />
        <Navigation />
      </Paper>
    </Container>
  );
};

export default VotingPage;
