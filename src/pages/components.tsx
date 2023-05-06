import { Paper, Container, Link } from '@mui/material';

import { Button, Box } from '@mui/material';

import { useServerState, useComponent } from '@state-less/react-client';
import client, { localClient } from '../lib/client';
import { useContext } from 'react';
import { stateContext } from '../provider/StateProvider';
import { Link as RouterLink } from 'react-router-dom';

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { Markdown } from '../components/Markdown';
import {
  CollabEditButton,
  getGHPath,
  getRawPath,
} from '../components/CollabEditButton';
import { Navigation, NavigationButton2D } from '../components/NavigationButton';

const PAGE_SRC = 'src/pages/Components.md';

export const ComponentsPage = () => {
  const [value, setValue, localInfo] = useServerState('Hello World', {
    key: 'hello-world',
    scope: 'global',
    client: localClient,
  });
  const { loading, error } = localInfo || {};
  console.log('info', localInfo);
  const [count, setCount] = useServerState(0, {
    key: 'count',
    scope: 'global',
    client,
  });

  const { state } = useContext(stateContext);
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
        <Markdown>
          {`
\`\`\`mermaid
sequenceDiagram
participant Browser as Browser
participant Server as Server
participant RSC as React Server
participant SSP as Lifecycle

Browser->>Server: Request component with clientProps
Server->>RSC: Instantiate and render component with clientProps
RSC->>SSP: Render component on the server
RSC->>Server: Return serverSideProps and rendered component
Server->>Browser: Send serverSideProps and rendered component
Browser->>Browser: Render component with serverSideProps
Browser->>Server: Subscribe to component updates

Note over Browser, Server: User interacts with component (e.g. button click)

Browser->>Server: Request execution of server-side function
Server->>RSC: Execute server-side function and re-render component if needed
RSC->>SSP: Update serverSideProps if needed
RSC->>Server: Return updated serverSideProps and rendered component (if updated)
Server->>Browser: Send updated serverSideProps and rendered component (if updated)
Browser->>Browser: Update component with new serverSideProps (if needed)
\`\`\`         
`}
        </Markdown>
        <Navigation />
      </Paper>
    </Container>
  );
};
