import { Routes } from 'react-router';
import ButtonAppBar from '../components/AppBar';
import {
  DarkWaves,
  SunnyBlueClouds,
  VantaBackground,
} from '../components/Background';
import { stateContext } from '../provider/StateProvider';
import { routes } from '../routes';
import { useContext, useEffect } from 'react';
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
} from '@mui/material';
import styles from './Layout.module.css';
import { Link as RouterLink } from 'react-router-dom';

import GitHubIcon from '@mui/icons-material/GitHub';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import TwitterIcon from '@mui/icons-material/Twitter';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import GroupsIcon from '@mui/icons-material/Group';
import { useLocation } from 'react-router-dom';
import { SidebarNavigation } from '../components/SidebarNavigation';
import ChatIcon from '@mui/icons-material/Chat';

declare let gtag: Function;

export const Layout = () => {
  const { state, dispatch } = useContext(stateContext);
  const { pathname } = useLocation();
  useEffect(() => {
    gtag('event', 'load', { event_category: 'page' });
  }, [pathname]);
  return (
    <VantaBackground
      light={SunnyBlueClouds}
      dark={DarkWaves}
      enabled={state.animatedBackground}
    >
      <Box
        key={pathname}
        sx={{ maxHeight: '100vh', overflowY: 'auto', overflowX: 'hidden' }}
      >
        <header>
          <ButtonAppBar />
        </header>
        <main>
          <SidebarNavigation />
          <Alert severity="info" sx={{ mt: 8 }}>
            Notice: This is a pre-alpha version and a work in progress. Features
            and documentation may not be fully complete. Please use with
            caution.
          </Alert>
          <Routes>{routes}</Routes>
        </main>
        <footer>
          <Paper
            square
            sx={{
              padding: {
                xs: 0,
                sm: 1,
                md: 2,
              },
              mt: 9,
            }}
          >
            <Typography variant="body2" color="textSecondary" align="center">
              © 2023 React Server
            </Typography>
            <Grid container spacing={1} justifyContent="center">
              <Grid item xs={12} sm={6} md={4} xl={2}>
                <Card sx={{ marginTop: 1 }} elevation={0}>
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
                              @statelesscloud
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
                              to="ircs://chat.freenode.net/react-server"
                            >
                              IRC (Freenode): #react-server
                            </Link>
                          </ListItemText>
                        </ListItem>
                      </List>
                    </div>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={4} xl={2}>
                <Card sx={{ marginTop: 1 }} elevation={0}>
                  <CardHeader title="Contact"></CardHeader>
                  <CardContent>
                    <div className={styles.impressum}>
                      <List disablePadding>
                        <ListItem dense>
                          <ListItemIcon>
                            <PhoneIcon />
                          </ListItemIcon>
                          <ListItemText>
                            <Link
                              component={RouterLink}
                              to="tel://+4917620350106"
                            >
                              +49 176 20350106
                            </Link>
                          </ListItemText>
                        </ListItem>

                        <ListItem dense>
                          <ListItemIcon>
                            <EmailIcon />
                          </ListItemIcon>
                          <ListItemText>
                            <Link
                              component={RouterLink}
                              to="mailto:moritz.roessler@gmail.com"
                            >
                              moritz.roessler@gmail.com
                            </Link>
                          </ListItemText>
                        </ListItem>
                      </List>
                    </div>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={4} xl={2}>
                <Card sx={{ marginTop: 1 }} elevation={0}>
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
                            <Link component={RouterLink} to="/collaborating">
                              Collaborate
                            </Link>
                          </ListItemText>
                        </ListItem>
                      </List>
                    </div>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </footer>
      </Box>
    </VantaBackground>
  );
};
