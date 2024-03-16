import Checkbox from '@mui/material/Checkbox';
import {
  createTheme,
  ThemeProvider as MUIThemeProvider,
  styled,
} from '@mui/material/styles/';

declare module '@mui/material/styles' {
  interface Theme {
    status: {
      danger: string;
    };
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    status?: {
      danger?: string;
    };
  }
}

const CustomCheckbox = styled(Checkbox)(({ theme }) => ({
  color: theme.status.danger,
  '&.Mui-checked': {
    color: theme.status.danger,
  },
}));

const theme = createTheme({
  palette: {
    primary: {
      main: '#001F3F', //'#FDD804',
    },
    secondary: {
      main: '#348C31', //'#F66528',
    },
    // info: {
    //   main: '#01579b',
    // },
  },
});

export const ThemeProvider = ({ children }) => {
  return <MUIThemeProvider theme={theme}>{children}</MUIThemeProvider>;
};
