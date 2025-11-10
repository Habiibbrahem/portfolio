// src/pages/public/Home.tsx
import { Box } from '@mui/material';
import PublicNavbar from '../../components/public/Navbar';
import Footer from '../../components/public/Footer';
import SectionRenderer from '../../components/public/SectionRenderer'; // FIXED PATH

export default function Home() {
  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      bgcolor: 'background.default'
    }}>
      <PublicNavbar />
      <Box sx={{ flex: 1 }}>
        <SectionRenderer />
      </Box>
      <Footer />
    </Box>
  );
}