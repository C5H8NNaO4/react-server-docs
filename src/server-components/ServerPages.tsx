import { useComponent } from '@state-less/react-client';
import {
  TextField,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CardActions,
  CardContent,
  Card,
  Alert,
  Paper,
  Box,
  IconButton,
} from '@mui/material';
import ReplayIcon from '@mui/icons-material/Replay';
import { useState } from 'react';
import { errors, isValidPath } from './ServerNavigation';
export const ServerPages = () => {
  const [component, { loading, error }] = useComponent('pages', {});

  const [path, setPath] = useState('');
  const [content, setContent] = useState('');

  const errs = [
    ['Invalid path', !isValidPath(path)],
    ['Path must start with /', path[0] !== '/'],
    ['Path and content are required', !content || !path],
  ];
  const contentMessage = errors(errs.slice(2));
  const pathMessage = errors(errs);

  return (
    <>
      {error && <Alert severity="error">{error.message}</Alert>}
      <Card>
        <CardContent>
          <TextField
            label="Path"
            onChange={(e) => setPath(e.target.value)}
            error={pathMessage}
            helperText={pathMessage}
          />
          <TextField
            fullWidth
            rows={3}
            multiline
            label="Content"
            onChange={(e) => setContent(e.target.value)}
            error={contentMessage}
            helperText={contentMessage}
          />
        </CardContent>
        <CardActions>
          <Button
            onClick={() =>
              component.props.addPage({
                path,
                content: [content],
              })
            }
          >
            ADD
          </Button>
        </CardActions>
      </Card>
      {component?.children?.map((page, i) => {
        return <ServerPage key={i} {...page.props} />;
      })}
    </>
  );
};

export const ServerPageContainer = ({ path }) => {
  const [component, { loading, error, refetch }] = useComponent('page', {
    props: { path },
  });

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <Paper square sx={{ minHeight: '25vh', width: '100%', padding: 2 }}>
        {component?.props?.content}
      </Paper>
    </>
  );
};

const ServerPage = ({ path, content }) => {
  return (
    <Accordion>
      <AccordionSummary>{path}</AccordionSummary>
      <AccordionDetails>{content}</AccordionDetails>
    </Accordion>
  );
};
