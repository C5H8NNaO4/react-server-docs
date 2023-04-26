import {
  Alert,
  Box,
  Card,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
} from '@mui/material';
import { useComponent } from '@state-less/react-client';
import HeartIcon from '@mui/icons-material/Favorite';
import { ReactNode } from 'react';

export const Poll = ({
  id = 'poll',
  message,
}: {
  id?: string;
  message?: (props: Record<string, any>) => ReactNode;
}) => {
  const [component, { error, loading }] = useComponent(id, {});
  const sum = component?.props?.votes.reduce((a, b) => a + b, 0);
  return (
    <Card>
      {loading && <Alert severity="info">Loading...</Alert>}
      {error && <Alert severity="error">{error.message}</Alert>}
      {message && message?.(component?.props || {})}
      <List>
        {component?.props?.values?.map((value, i) => {
          const percentage = (100 / sum) * component?.props?.votes[i];
          return (
            <ListItem dense>
              <Box
                sx={{
                  ml: -2,
                  zIndex: 0,
                  position: 'absolute',
                  width: `${percentage}%`,
                  height: `100%`,
                  backgroundColor: 'info.main',
                }}
              />
              <ListItemText
                sx={{ zIndex: 0 }}
                primary={value}
                secondary={component?.props?.votes[i]}
              />
              <ListItemSecondaryAction>
                <IconButton
                  onClick={() => component?.props?.vote(i)}
                  disabled={
                    component?.props?.voted > -1 &&
                    component?.props?.voted !== i
                  }
                  color={component.props.voted === i ? 'success' : 'default'}
                >
                  <HeartIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          );
        })}
      </List>
    </Card>
  );
};
