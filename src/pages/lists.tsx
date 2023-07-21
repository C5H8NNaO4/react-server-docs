import { Paper, Container, Alert } from '@mui/material';

import { Markdown } from '../components/Markdown';
import { getRawPath } from '../components/CollabEditButton';
import { Navigation } from '../components/NavigationButton';
import { MyLists } from '../server-components/examples/Lists';
import { useContext } from 'react';
import { authContext } from '@state-less/react-client';

const PAGE_SRC = 'src/pages/lists.md';

export const ListsPage = () => {
  const ctx = useContext(authContext);

  return (
    <>
      {/* <Alert severity="warning">
        Please don't store any valuable data in Lists for now, as they will be
        deleted on every deploy.
      </Alert> */}

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
