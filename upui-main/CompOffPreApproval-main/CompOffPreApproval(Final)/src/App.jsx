import React from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import CompOffEmployeeSubmit from './components/CompOffEmployeeSubmit';

const theme = createTheme({
  palette: {
    background: {
      default: '#f5f5f5',
    },
    primary: {
      main: '#00b0ff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CompOffEmployeeSubmit />
    </ThemeProvider>
  );
}

export default App; 