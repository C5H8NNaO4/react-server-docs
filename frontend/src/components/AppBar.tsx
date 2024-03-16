import * as React from 'react';
import { useTheme, useMediaQuery } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useComponent } from '@state-less/react-client';

import { Actions, stateContext } from '../provider/StateProvider';
import { ConnectionCounter } from '../server-components/examples/ConnectionCounter';

import { BackgroundButton } from './BackgroundButton';
import { GoogleLoginButton } from './LoggedInGoogleButton';
import Favicon from '../assets/favicon.svg?react';

const getBreadCrumbs = (pathName, getTitle) => {
  const arr = ['', ...pathName.split('/').filter(Boolean)].map((e) =>
    getTitle(e)
  );
  for (let i = 0; i < arr.length; i++) {
    if (i % 2 !== 0) {
      arr.splice(i, 0, '/');
    }
  }
  return arr;
};
export default function ButtonAppBar() {
  const { state, dispatch } = React.useContext(stateContext);
  const { pathname } = useLocation();
  const postId = pathname.split('/').at(-1) || '';
  const [component] = useComponent(postId, {
    skip: !postId,
  });
  const theme = useTheme();

  const lessThanSmall = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <AppBar sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          minHeight: {
            xs: '48px',
            sm: '64px',
          },
          px: 2,
        }}
      >
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="Toggle menu"
          sx={{ mr: 2 }}
          onClick={() => dispatch({ type: Actions.TOGGLE_MENU })}
        >
          <MenuIcon />
        </IconButton>
        {!lessThanSmall && (
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Favicon
              alt="React Server Logo"
              src="/favicon.svg"
              style={{ width: 24, height: 24 }}
              loading="lazy"
            />

            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, color: 'white' }}
            >
              {getBreadCrumbs(pathname, (part, i, arr) => {
                if (part.includes('post-'))
                  return (
                    <Link
                      sx={{ color: 'white' }}
                      to={pathname}
                      component={RouterLink}
                    >
                      {component?.props?.title || 'Post'}
                    </Link>
                  );
                return (
                  <Link component={RouterLink} sx={{ color: 'white' }} to={'/'}>
                    Forum
                  </Link>
                );
              }).slice(0, state?.showBC ? 3 : 1)}
            </Typography>
          </Box>
        )}
        {/* <Box
          sx={{ display: pathname === '/lists' ? 'flex' : 'none', flexGrow: 1 }}
        >
          <TextField
            label="Search"
            value={state.search}
            onChange={(e) => {
              dispatch({ type: Actions.SEARCH, value: e.target.value });
            }}
            sx={{
              mx: 'auto',
              background: '#FFF',
              borderRadius: 1,
              width: lessThanSmall ? '100%' : '90%',
              marginTop: 1,
              '& label': {
                background: '#FFF',
                borderTopLeftRadius: 50,
                borderTopRightRadius: 200,
                pr: 4,
                pl: 2,
                ml: '-13px',
                // transform: 'translate(0px, 0px)',
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="end">
                  <IconSearch sx={{ mr: 1 }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={(e) => {
                      dispatch({ type: Actions.SEARCH, value: '' });

                      // setTimeout(() => inputRef.current?.focus(), 0);
                    }}
                    disabled={!state.search}
                  >
                    <IconClear />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box> */}
        <Box sx={{ ml: 'auto' }} />
        {!lessThanSmall && (
          <Box sx={{ display: 'flex' }}>
            <ConnectionCounter />
            <BackgroundButton />
            <GoogleLoginButton ssr />
          </Box>
        )}
        {lessThanSmall && (
          <Box sx={{ ml: 1 }}>
            <GoogleLoginButton ssr />
          </Box>
        )}
      </Box>
    </AppBar>
  );
}
