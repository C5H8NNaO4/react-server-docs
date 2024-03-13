import { Paper, Container, Alert, Button, Link, Box } from '@mui/material';

import { Markdown } from '../components/Markdown';
import { getRawPath } from '../components/CollabEditButton';
import { Navigation } from '../components/NavigationButton';
import { MyLists } from '../server-components/examples/Lists';
import { useContext, useEffect, useRef, useState } from 'react';
import { authContext } from '@state-less/react-client';
import { ListsMeta, Meta } from '../components/Meta';
import { Link as RouterLink } from 'react-router-dom';

const PAGE_SRC = 'src/pages/lists.md';

export const ListsPage = () => {
  const ctx = useContext(authContext);
  const [timeLeft, setTimeLeft] = useState(10);
  const timeoutRef = useRef<null | NodeJS.Timeout>(null);
  const redirect = () =>
    (window.location.href = 'https://lists.state-less.cloud');
  useEffect(() => {
    if (timeLeft === 0) {
      redirect();
    } else if (timeLeft >= 0 ) {
      timeoutRef.current = setTimeout(setTimeLeft, 1000, timeLeft - 1);
    }
  }, [timeLeft]);

  return (
    <>
      <Alert
        severity="info"
        action={
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              disabled={timeoutRef.current === null}
              variant="contained"
              onClick={() => {
                clearTimeout(timeoutRef.current || 0);
                setTimeLeft(-1);
                timeoutRef.current = null;
              }}
            >
              Cancel
            </Button>
            <Button variant="contained" color="success" onClick={redirect}>
              Open
            </Button>
          </Box>
        }
      >
        Our app has a new home. Please visit https://lists.state-less.cloud.
        {timeLeft > 0 && `Redirecting in ${timeLeft}s`}
      </Alert>
      <Meta Component={ListsMeta} />
      <MyLists />
    </>
  );
};

export default ListsPage;