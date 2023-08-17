import { Paper, Container, Alert, Button, Link } from '@mui/material';

import { Markdown } from '../components/Markdown';
import { getRawPath } from '../components/CollabEditButton';
import { Navigation } from '../components/NavigationButton';
import { MyLists } from '../server-components/examples/Lists';
import { useContext } from 'react';
import { authContext } from '@state-less/react-client';
import { ListsMeta, Meta } from '../components/Meta';
import { Link as RouterLink } from 'react-router-dom';

const PAGE_SRC = 'src/pages/lists.md';

export const ListsPage = () => {
  const ctx = useContext(authContext);

  return (
    <>
      <Alert
        severity="warning"
        action={
          <Button>
            <Link to="/lists/about" component={RouterLink}>
              More
            </Link>
          </Button>
        }
      >
        Please backup / sync your data frequently as there's currently no
        database connected to the server. Data-loss may occur in unexpected
        circumstances.
      </Alert>
      <Meta Component={ListsMeta} />
      <MyLists key={ctx?.session?.id} />

      {/* <Paper
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
      </Paper> */}
    </>
  );
};
