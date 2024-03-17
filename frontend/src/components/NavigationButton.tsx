import { Button, Link, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HomeIcon from '@mui/icons-material/Home';
import { useLocation } from 'react-router-dom';
import { navigation } from '../routes';
import { pascalCase } from 'change-case';
import { PropsWithChildren, ReactNode, useEffect, useRef } from 'react';
import { CollabEditButton, getGHPath } from './CollabEditButton';
import { useIsInterSecting, useIsOffScreen, useIsOnScreen } from '../lib/hooks';
import clsx from 'clsx';

export const Navigation = ({}) => {
  const { pathname } = useLocation();
  const ghSrc = navigation.find((n) => n[0] === pathname)?.[2] || null;
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: 2,
      }}
    >
      <NavigationButton2D prev />
      {ghSrc && <CollabEditButton to={getGHPath(ghSrc)} />}
      <NavigationButton2D next />
    </Box>
  );
};

export const NavigationButton2D = ({
  next,
  prev,
  animate,
  children,
}: {
  next?: boolean;
  prev?: boolean;
  animate?: boolean;
  children?: ReactNode;
}) => {
  const { pathname } = useLocation();
  const index = navigation.findIndex((e) => e[0] === pathname);

  const nextIndex = next
    ? (index + 1) % navigation.length
    : Math.max(0, index - 1);
  const nextPath = navigation[nextIndex][0];
  const nextTitle = navigation[nextIndex][1];
  navigation[
    next ? (index + 1) % navigation.length : Math.max(0, index - 1)
  ][0];

  return (
    <Link to={nextPath} component={RouterLink}>
      <Button color="info" sx={{ alignItems: 'center' }}>
        {nextPath == '/' && <HomeIcon sx={{ pr: 1 }} />}
        {prev && nextPath !== '/' && <ArrowBackIcon sx={{ pr: 1 }} />}
        {children || nextPath == '/' ? 'Home' : nextTitle}
        {next && nextPath !== '/' && (
          <Bounce enabled={animate} onEnterScreen direction="right">
            <ArrowForwardIcon sx={{ pl: 1 }} />
          </Bounce>
        )}
      </Button>
    </Link>
  );
};

export const Bounce = ({
  children,
  onEnterScreen,
  enabled,
  direction,
}: PropsWithChildren<{
  onEnterScreen: boolean;
  enabled: boolean;
  direction: 'right';
}>) => {
  const [ref, isOnScreen] = useIsOnScreen<HTMLDivElement>();

  return (
    <Box
      ref={ref}
      sx={{ display: 'flex' }}
      className={clsx({
        ['bounce-' + direction]: (enabled && isOnScreen) || !onEnterScreen,
      })}
    >
      {children}
    </Box>
  );
};
