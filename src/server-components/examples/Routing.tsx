import {
  Box,
  List,
  ListItem,
  ListItemText,
  Paper,
  TextField,
} from '@mui/material';
import { useComponent } from '@state-less/react-client';
import { useState } from 'react';
import { ServerPageContainer } from '../../server-components/ServerPages';

export const DynamicPageExample = () => {
  const [navigation, { loading, error }] = useComponent('navigation', {});
  const [path, setPath] = useState('/');

  return (
    <Box sx={{ display: 'flex' }}>
      <Paper square>
        <List sx={{ minWidth: '250px', marginTop: '50px' }}>
          {navigation?.props?.entries.map((child) => {
            return (
              <ListItem
                key={child.title}
                selected={path === child.path}
                button
                onClick={(e) => setPath(child.path)}
              >
                <ListItemText
                  primary={child.title}
                  secondary={child.path}
                ></ListItemText>
              </ListItem>
            );
          })}
        </List>
      </Paper>
      <Box sx={{ width: '100%' }}>
        <TextField
          fullWidth
          value={path}
          onChange={(e) => setPath(e.target.value)}
        ></TextField>
        <ServerPageContainer path={path} />
      </Box>
    </Box>
  );
};
