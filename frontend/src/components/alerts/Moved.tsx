import { Alert } from '@mui/material';
import { SL_DOMAIN } from '../../lib/config';
import { Markdown } from '../Markdown';

export const MovedDomainWarning = ({ domain }) => {
  /** TODO: Fix this */
  const isOldDomain =
    typeof window === 'undefined' ? false : window.location.host !== domain;
  if (!isOldDomain) return null;
  return (
    <Alert severity="success">
      <Markdown disablePadding>
        {`We moved to a new domain [${domain}](${'https://' + domain})`}
      </Markdown>
    </Alert>
  );
};

export default MovedDomainWarning;
