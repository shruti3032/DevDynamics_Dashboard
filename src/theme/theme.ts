import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f4f6f8',
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      'Helvetica Neue',
      'Arial',
      'sans-serif'
    ].join(','),
    h4: {
      fontWeight: 600,
    },
  },
});

export default theme;
