// src/App.tsx
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import AppRoutes from './routes.tsx';  // FIXED

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
  },
});

const theme = createTheme({
  palette: {
    primary: { main: '#FF5722' },
    secondary: { main: '#FFC107' },
    background: { default: '#f5f5f5' },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <AppRoutes />  // FIXED
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
