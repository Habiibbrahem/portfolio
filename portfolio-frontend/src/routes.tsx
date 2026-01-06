// src/routes.tsx (or wherever your routes file is)
import { Routes, Route } from 'react-router-dom';

import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard'; // ← Your new beautiful dashboard page
import NavbarManager from './components/admin/NavbarManager';
import ContentManager from './components/admin/ContentManager';
import NewsManager from './components/admin/NewsManager';
import SocialMediaManager from './components/admin/SocialMediaManager';
import UploadManager from './components/admin/UploadManager';
import ServicesManager from './components/admin/ServicesManager';
import ContactManager from './components/admin/ContactManager';
import MessagesManager from './components/admin/MessagesManager';
import SettingsManager from './components/admin/SettingsManager';

import Home from './pages/public/Home';
import Contact from './pages/public/Contact';
import Services from './pages/public/Services';

import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/admin/DashboardLayout'; // ← Import the layout

export default function AppRoutes() {
    return (
        <Routes>
            {/* PUBLIC ROUTES */}
            <Route path="/" element={<Home />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/services" element={<Services />} />

            {/* ADMIN LOGIN */}
            <Route path="/admin/login" element={<Login />} />

            {/* PROTECTED ADMIN ROUTES - ALL WRAPPED BY DashboardLayout */}
            <Route
                path="/admin"
                element={
                    <ProtectedRoute>
                        <DashboardLayout />
                    </ProtectedRoute>
                }
            >
                {/* Default admin route → Dashboard overview */}
                <Route path="dashboard" element={<Dashboard />} />

                {/* Other admin pages */}
                <Route path="dashboard/navbar" element={<NavbarManager />} />
                <Route path="dashboard/content" element={<ContentManager />} />
                <Route path="dashboard/news" element={<NewsManager />} />
                <Route path="dashboard/social" element={<SocialMediaManager />} />
                <Route path="dashboard/uploads" element={<UploadManager />} />
                <Route path="dashboard/services" element={<ServicesManager />} />
                <Route path="dashboard/contact" element={<ContactManager />} />
                <Route path="dashboard/messages" element={<MessagesManager />} />
                <Route path="dashboard/settings" element={<SettingsManager />} />

                {/* Optional: Redirect /admin to dashboard */}
                <Route index element={<Dashboard />} />
            </Route>

            {/* Fallback for unknown routes (optional) */}
            {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
        </Routes>
    );
}