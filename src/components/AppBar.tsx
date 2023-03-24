import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Actions, stateContext } from '../provider/StateProvider';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import { Link as RouterLink } from 'react-router-dom';

export default function ButtonAppBar() {
  const { state, dispatch } = React.useContext(stateContext);
  return (
    <AppBar sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          onClick={() => dispatch({ type: Actions.TOGGLE_MENU })}
        >
          <MenuIcon />
        </IconButton>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <img src="/react-server.png" style={{ width: 24, height: 24 }} />
          <Link component={RouterLink} to="/" sx={{ color: 'white' }}>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              React Server
            </Typography>
          </Link>
        </Box>
        <Box sx={{ flexGrow: 1 }}></Box>
        <IconButton
          color={state.animatedBackground ? 'secondary' : 'inherit'}
          onClick={() => dispatch({ type: Actions.TOGGLE_ANIMATED_BACKGROUND })}
        >
          <AutoFixHighIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
