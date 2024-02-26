import { Link as RouterLink } from 'react-router-dom';
import { Button, Link } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { GH_CONTENT_BRANCH, GH_CONTENT_REPO } from '../lib/config';

export const getRawPath = (path: string) => {
  return `https://raw.githubusercontent.com/${GH_CONTENT_REPO}/${GH_CONTENT_BRANCH}/${path}`;
};

export const getGHPath = (path: string) => {
  return `https://github.com/${GH_CONTENT_REPO}/blob/${GH_CONTENT_BRANCH}/${path}`;
};

export const CollabEditButton = ({ to }: { to: string }) => {
  return (
    <Link component={RouterLink} to={to}>
      <Button>
        <EditIcon sx={{ pr: 1 }} />
        Edit this page
      </Button>
    </Link>
  );
};
