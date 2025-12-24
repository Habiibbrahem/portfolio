import { Routes, Route } from 'react-router-dom';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import Overview from './components/admin/Overview';
import NavbarManager from './components/admin/NavbarManager';
import ContentManager from './components/admin/ContentManager';
import UploadManager from './components/admin/UploadManager';
import ServicesManager from './components/admin/ServicesManager';
import ContactManager from './components/admin/ContactManager';
import MessagesManager from './components/admin/MessagesManager';
import SocialMediaManager from './components/admin/SocialMediaManager'; // ← NEW IMPORT
import Home from './pages/public/Home';
import Contact from './pages/public/Contact';
import Services from './pages/public/Services';
import ProtectedRoute from './components/ProtectedRoute';

export default function AppRoutes() {
    return (
        <Routes>
            {/* PUBLIC ROUTES */}
            <Route path="/" element={<Home />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/services" element={<Services />} />

            {/* ADMIN ROUTES */}
            <Route path="/admin/login" element={<Login />} />
            <Route
                path="/admin/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            >
                <Route index element={<Overview />} />
                <Route path="navbar" element={<NavbarManager />} />
                <Route path="content" element={<ContentManager />} />
                <Route path="uploads" element={<UploadManager />} />
                <Route path="services" element={<ServicesManager />} />
                <Route path="messages" element={<MessagesManager />} />
                <Route path="contact" element={<ContactManager />} />
                <Route path="social" element={<SocialMediaManager />} /> {/* ← NEW ROUTE */}
            </Route>
        </Routes>
    );
}