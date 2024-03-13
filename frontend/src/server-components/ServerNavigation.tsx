import {
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  TextField,
  Alert,
  Button,
  LinearProgress,
} from '@mui/material';
import { useComponent } from '@state-less/react-client/dist/index';
import { useState } from 'react';

import CloseIcon from '@mui/icons-material/Close';

/** This should check if the path contains a / and also that it doesn't contain any special characters */
export const isValidPath = (path: string) => {
  return /^\/([0-9A-Za-z_\-][\/]?)*$/.test(path);
};

export const errors = (messages) => {
  return messages
    .filter(([, isErr]) => isErr)
    .map(([msg]) => msg)
    .join(', ');
};
export const ServerNavigation = () => {
  const [component, { error, loading }] = useComponent('navigation', {});
  const [title, setTitle] = useState('');
  const [path, setPath] = useState('');

  const errs = [
    ['Invalid path', !isValidPath(path)],
    ['Path must start with /', path[0] !== '/'],
    ['Title and path are required', !title || !path],
  ];
  const titleMessage = errors(errs.slice(2));
  const pathMessage = errors(errs);
  return (
    <div>
      {loading && <LinearProgress />}
      {error && <Alert severity="error">{error.message}</Alert>}
      <TextField
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        error={!!titleMessage}
        helperText={titleMessage}
      ></TextField>
      <TextField
        label="Path"
        value={path}
        onChange={(e) => setPath(e.target.value)}
        error={!!pathMessage}
        helperText={pathMessage}
      ></TextField>
      <List>
        {component?.props?.entries.map((entry) => {
          return (
            <ListItem key={entry.path}>
              <ListItemText primary={entry.title} secondary={entry.path} />
              <ListItemSecondaryAction>
                <IconButton
                  onClick={() => component.props.removeEntry(entry.id)}
                >
                  <CloseIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          );
        })}
      </List>
      <Button onClick={() => component.props.addEntry({ title, path })}>
        Add Entry
      </Button>
    </div>
  );
};
