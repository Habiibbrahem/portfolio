import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

import AppRoutes from './routes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
  },
});

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1e293b',     // Deep slate (used for headings, navbar text)
      dark: '#0f172a',
    },
    secondary: {
      main: '#fbbf24',     // Bright yellow (buttons, accents)
      light: '#fcd34d',
      dark: '#f59e0b',
    },
    background: {
      default: '#f8fafc',  // Very light gray (main content background)
      paper: '#ffffff',    // White cards and forms
    },
    text: {
      primary: '#1e293b',
      secondary: '#475569',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 900,
      fontSize: '4.5rem',
      lineHeight: 1.1,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 800,
      fontSize: '3.5rem',
    },
    h3: {
      fontWeight: 700,
      fontSize: '2.8rem',
    },
    h4: {
      fontWeight: 700,
      fontSize: '2.2rem',
    },
    button: {
      textTransform: 'none',
      fontWeight: 700,
      fontSize: '1.1rem',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          padding: '14px 32px',
          borderRadius: 8,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        },
        containedSecondary: {
          backgroundColor: '#fbbf24',
          color: '#000000',
          fontWeight: 700,
          '&:hover': {
            backgroundColor: '#f59e0b',
            boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
          },
        },
        containedPrimary: {
          backgroundColor: '#1e293b',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#0f172a',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          overflow: 'hidden',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
  },
});

// Enable smooth scrolling
if (typeof window !== 'undefined') {
  document.documentElement.style.scrollBehavior = 'smooth';
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}