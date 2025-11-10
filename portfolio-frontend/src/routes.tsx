// src/routes.tsx
import { Routes, Route } from 'react-router-dom';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import Overview from './components/admin/Overview';
import NavbarManager from './components/admin/NavbarManager';
import ContentManager from './components/admin/ContentManager';
import UploadManager from './components/admin/UploadManager';
import Home from './pages/public/Home';
import ProtectedRoute from './components/ProtectedRoute'; // FIXED PATH

export default function AppRoutes() {
    return (
        <Routes>
            {/* PUBLIC ROUTES */}
            <Route path="/" element={<Home />} />

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
            </Route>
        </Routes>
    );
}