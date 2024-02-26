import { Routes } from 'react-router';
import { useContext, useEffect, useRef, useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  Link,
  Card,
  CardContent,
  Grid,
  CardHeader,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Tooltip,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import GitHubIcon from '@mui/icons-material/GitHub';
import EmailIcon from '@mui/icons-material/Email';
import TwitterIcon from '@mui/icons-material/Twitter';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import GroupsIcon from '@mui/icons-material/Group';
import { useLocation } from 'react-router-dom';
import ChatIcon from '@mui/icons-material/Chat';
import Snackbar from '@mui/material/Snackbar';
import HeartIcon from '@mui/icons-material/Favorite';
import { useComponent, useLocalStorage } from '@state-less/react-client';

import { SidebarNavigation } from '../components/SidebarNavigation';
import { routes } from '../routes';
import { Actions, stateContext } from '../provider/StateProvider';
import {
  DarkWaves,
  SunnyBlueClouds,
  VantaBackground,
} from '../components/Background';
import ButtonAppBar from '../components/AppBar';
import { ViewCounter } from '../server-components/examples/ViewCounter';
import { CONTACT_MAIL, GITHUB_CONTRIBUTE } from '../lib/const';

import styles from './Layout.module.css';
import { Copyright } from '../components/Copyright';
import { VIEWS_KEY } from '../lib/config';
declare let gtag: (
  _: string,
  __: string,
  ___: { event_category: string }
) => void;

const messages = [
  'Building Layout',
  'Loading Animation...',
  'Loading Content...',
  `Notice: This is a pre-alpha version and a work in progress. Features and documentation may not be fully complete. Please use with caution.`,
];

export const PrankButton = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [move, setMove] = useState(false);
  const [moved, setMoved] = useState(false);
  const [style, setStyle] = useState<Record<string, string>>({});
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    if (move) {
      setStyle({
        transform: 'translateX(-75%)',

        transition: 'transform 0.5s ease-out',
      });
    } else {
      setStyle({
        transition: 'transform 1s ease-out',
      });
    }
  }, [setStyle, move]);
  return (
    <Tooltip ref={ref} open={open} title="Just kidding!" style={style}>
      <Box
        onMouseEnter={() => {
          if (moved) return;
          if (Math.random() > 1) {
            setMoved(true);
            return;
          }
          setMove(true);
          setMoved(true);
          setTimeout(() => {
            setMove(false);
            setTimeout(() => {
              setOpen(true);
              setTimeout(() => {
                setOpen(false);
              }, 1000);
            }, 0);
          }, 1500);
        }}
      >
        {children}
      </Box>
    </Tooltip>
  );
};
export const Layout = () => {
  const { state, dispatch } = useContext(stateContext);
  const [features] = useComponent('features');
  const { pathname } = useLocation();
  // const [_animated, setAnim] = useState(0);
  const _animated = state.animatedBackground || 0;
  const hasGtag = 'gtag' in window;
  const [time, setTime] = useState(0);

  useEffect(() => {
    if (_animated) {
      setTime(1000);
    } else if (time < 1000) {
      setTimeout(setTime, 100, time + 100);
    }
  }, [time, _animated]);

  useEffect(() => {
    localStorage.setItem('animatedBackground', features?.props?.animated);
    if (
      features?.props?.animated &&
      !localStorage.getItem('animatedBackgroundUser') &&
      !state.animatedBackground
    ) {
      dispatch({
        type: Actions.TOGGLE_ANIMATED_BACKGROUND,
      });
    }
  }, [features?.props?.animated, dispatch, state.animatedBackground]);

  const [cookieConsent, setCookieConsent] = useLocalStorage<boolean | null>(
    'cookie-consent',
    null
  );

  useEffect(() => {
    if (cookieConsent && 'gtag' in window) {
      gtag('event', 'load', { event_category: 'page' });
    } else {
      setTimeout(() => {
        const ele = document.getElementById('test');
        if (ele !== null)
          ele.onload = () => {
            gtag('event', 'load', { event_category: 'page' });
          };
      }, 0);
    }
  }, [pathname, cookieConsent, hasGtag]);

  return (
    <VantaBackground
      light={SunnyBlueClouds}
      dark={DarkWaves}
      enabled={_animated === 2}
      bg={_animated}
    >
      <Box
        id="scroll"
        key={pathname}
        sx={{
          maxHeight: '100vh',
          height: '100%',
          overflowY: 'auto',
          overflowX: 'hidden',
          zIndex: 1,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {
          <header>
            <ButtonAppBar />

            <Box
              sx={{
                mt: {
                  xs: 6,
                  sm: 8,
                },
              }}
            />
            <div
              id="loading-container"
              style={{ display: 'flex', width: '100%' }}
            />
          </header>
        }
        <main>
          <SidebarNavigation />
          {!state.fullscreen && state.alerts.info?.length > 0 && (
            <Alert
              severity="info"
              // sx={{ mt: 8 }}
              action={
                <Button>
                  <Link component={RouterLink} to="/changes">
                    Changes
                  </Link>
                </Button>
              }
            >
              {time < 1000 ? messages[1] : messages[3]}
            </Alert>
          )}
          {cookieConsent === null && (
            <Alert
              severity="info"
              action={
                <>
                  <PrankButton>
                    <Button
                      color="error"
                      onClick={() => {
                        setCookieConsent(false);
                      }}
                    >
                      Deny
                    </Button>
                  </PrankButton>
                  <Button
                    color="success"
                    onClick={() => {
                      setCookieConsent(true);
                    }}
                  >
                    Accept
                  </Button>
                </>
              }
            >
              We use Google Analytics to track page views.
            </Alert>
          )}
          <div id="app-warnings" />

          {state.messages.map((message) => {
            return (
              <Snackbar
                open={true}
                autoHideDuration={6000}
                onClose={() => dispatch({ type: Actions.HIDE_MESSAGE })}
                message={message.message}
                action={
                  message.action ? (
                    <SingleClickButton
                      onClick={() => {
                        message?.action?.();
                        dispatch({ type: Actions.HIDE_MESSAGE });
                      }}
                    >
                      Undo
                    </SingleClickButton>
                  ) : undefined
                }
              />
            );
          })}
          <Routes>{routes}</Routes>
        </main>
        {!state.fullscreen && (
          <footer style={{ marginTop: 'auto' }}>
            <Paper
              square
              sx={{
                padding: {
                  xs: 0,
                  sm: 1,
                  md: 2,
                },
                backgroundColor: 'primary.main',
              }}
            >
              <Typography variant="body2" color="textSecondary" align="center">
                <Copyright backgroundColor="primary" />
              </Typography>
              <Grid container spacing={1} justifyContent="center">
                <Grid item xs={12} sm={6} md={4} xl={2}>
                  <Card
                    sx={{ m: 1, mb: 0, bgcolor: 'secondary.main' }}
                    elevation={0}
                  >
                    <CardHeader title="Social"></CardHeader>
                    <CardContent>
                      <div className={styles.impressum}>
                        <List disablePadding>
                          <ListItem dense>
                            <ListItemIcon>
                              <GitHubIcon />
                            </ListItemIcon>
                            <ListItemText>
                              <Link
                                component={RouterLink}
                                to="https://github.com/state-less/react-server"
                              >
                                Github
                              </Link>
                            </ListItemText>
                          </ListItem>

                          <ListItem dense>
                            <ListItemIcon>
                              <TwitterIcon />
                            </ListItemIcon>
                            <ListItemText>
                              <Link
                                component={RouterLink}
                                to="https://twitter.com/statelesscloud"
                              >
                                Twitter
                              </Link>
                            </ListItemText>
                          </ListItem>
                          <ListItem dense>
                            <ListItemIcon>
                              <ChatIcon />
                            </ListItemIcon>
                            <ListItemText>
                              <Link
                                component={RouterLink}
                                to="https://discord.gg/vbEhvfKPFY"
                              >
                                Discord
                              </Link>
                            </ListItemText>
                          </ListItem>
                          <ListItem dense>
                            <ListItemIcon>
                              <ChatIcon />
                            </ListItemIcon>
                            <ListItemText>
                              <Link
                                component={RouterLink}
                                to="ircs://irc.eu.libera.chat/react-server"
                              >
                                IRC (Libera): #react-server
                              </Link>
                            </ListItemText>
                          </ListItem>
                        </List>
                      </div>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4} xl={2}>
                  <Card
                    sx={{ m: 1, mb: 0, bgcolor: 'secondary.main' }}
                    elevation={0}
                  >
                    <CardHeader title="Contact"></CardHeader>
                    <CardContent>
                      <div className={styles.impressum}>
                        <List disablePadding>
                          <ListItem dense>
                            <ListItemIcon>
                              <EmailIcon />
                            </ListItemIcon>
                            <ListItemText>
                              <Link
                                component={RouterLink}
                                to={`mailto:${CONTACT_MAIL}`}
                              >
                                {CONTACT_MAIL}
                              </Link>
                            </ListItemText>
                          </ListItem>
                        </List>
                      </div>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4} xl={2}>
                  <Card
                    square
                    sx={{
                      marginTop: 1,
                      boxShadow: { xs: '10px 0px 8px 1px', sm: 'none' },
                      bgcolor: 'secondary.main',
                    }}
                  >
                    <CardHeader title="More"></CardHeader>
                    <CardContent>
                      <div className={styles.impressum}>
                        <List disablePadding>
                          <ListItem dense>
                            <ListItemIcon>
                              <QuestionMarkIcon />
                            </ListItemIcon>
                            <ListItemText>
                              <Link component={RouterLink} to="/faq">
                                FAQ
                              </Link>
                            </ListItemText>
                          </ListItem>
                          <ListItem dense>
                            <ListItemIcon>
                              <GroupsIcon />
                            </ListItemIcon>
                            <ListItemText>
                              <Link
                                component={RouterLink}
                                to={GITHUB_CONTRIBUTE}
                              >
                                Contribute
                              </Link>
                            </ListItemText>
                          </ListItem>
                          <ListItem dense>
                            <ListItemIcon>
                              <HeartIcon />
                            </ListItemIcon>
                            <ListItemText>
                              <Link
                                component={RouterLink}
                                to="https://github.com/sponsors/state-less"
                              >
                                Sponsor
                              </Link>
                            </ListItemText>
                          </ListItem>
                          <ViewCounter
                            textColor="primary.main"
                            componentKey={VIEWS_KEY}
                          />
                        </List>
                      </div>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Paper>
          </footer>
        )}
      </Box>
    </VantaBackground>
  );
};

const SingleClickButton = (props) => {
  const { onClick, ...rest } = props;
  const [clicked, setClicked] = useState(false);
  const handleClick = (e) => {
    onClick(e);
    setClicked(true);
  };
  return <Button disabled={clicked} onClick={handleClick} {...rest} />;
};
