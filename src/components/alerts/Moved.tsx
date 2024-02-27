import { Alert } from '@mui/material';
import { SL_DOMAIN } from '../../lib/config';
import { Markdown } from '../Markdown';

export const MovedDomainWarning = ({ domain }) => {
  const isOldDomain = window.location.host !== domain;
  if (!isOldDomain) return null;
  return (
    <Alert severity="success">
      <Markdown disablePadding>
        {`We moved to a new domain [${domain}](${'https://' + domain})`}
      </Markdown>
    </Alert>
  );
};
