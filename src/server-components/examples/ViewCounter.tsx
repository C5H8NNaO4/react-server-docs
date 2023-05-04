import VisibilityIcon from '@mui/icons-material/Visibility';
import { useComponent } from '@state-less/react-client';
import {
  Box,
  Tooltip,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';

export const ViewCounter = () => {
  const [component, { error, loading }] = useComponent('view-counter', {});

  return (
    <Tooltip title="Views" placement="left">
      <ListItem dense>
        <ListItemIcon>
          <VisibilityIcon />
        </ListItemIcon>
        <ListItemText>{loading ? '-' : component?.props?.views}</ListItemText>
      </ListItem>
    </Tooltip>
  );
};
