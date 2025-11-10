// src/pages/public/Home.tsx
import { Box } from '@mui/material';
import PublicNavbar from '../../components/public/Navbar.tsx';
import Footer from '../../components/public/Footer.tsx';
import SectionRenderer from '../../components/public/SectionRenderer.tsx';

export default function Home() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <PublicNavbar />
      <SectionRenderer />
      <Footer />
    </Box>
  );
}