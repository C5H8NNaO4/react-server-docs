import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  Box,
  ListItemText,
  IconButtonProps,
} from '@mui/material';
import { Component, ComponentType, ReactNode, useContext } from 'react';
import { Actions, stateContext } from '../provider/StateProvider';
import { Link as RouterLink } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { navigation } from '../routes';

export const SidebarNavigation = () => {
  const { state, dispatch } = useContext(stateContext);
  return (
    <Drawer
      variant="persistent"
      open={state.menuOpen}
      onClose={() => dispatch({ type: Actions.TOGGLE_MENU })}
    >
      <Box
        sx={{
          maxWidth: '30ch',
          overflowX: 'hidden',
        }}
      >
        <List sx={{ paddingTop: 8, minWidth: 256 }}>
          <List disablePadding>
            {navigation.map((e: any) => {
              return (
                <LinkItem
                  key={e[0]}
                  Icon={e[4]}
                  to={e[0]}
                  sx={{
                    pl:
                      1 +
                      (e[0] === '/' || e[0].includes('://')
                        ? 0
                        : (e[0].match(/\//g)?.length || 0 - 2) * 2),
                  }}
                  dense={!e[0].includes('://')}
                >
                  {e[1]}
                </LinkItem>
              );
            })}
          </List>
        </List>
      </Box>
    </Drawer>
  );
};

type LinkItemProps = {
  to: string;
  children: React.ReactNode;
  sx?: any;
  Icon: ComponentType<IconButtonProps>;
  dense?: boolean;
};

const LinkItem = ({ to, children, sx, Icon, dense }: LinkItemProps) => {
  const { pathname } = useLocation();
  return (
    <ListItem
      button
      component={RouterLink}
      to={to}
      sx={sx}
      selected={pathname === to}
      dense={!dense}
      disablePadding
    >
      {Icon && (
        <ListItemIcon>
          <Icon color={to === pathname ? 'secondary' : 'primary'} />
        </ListItemIcon>
      )}
      <ListItemText primary={children} secondary={dense ? undefined : to} />
    </ListItem>
  );
};
