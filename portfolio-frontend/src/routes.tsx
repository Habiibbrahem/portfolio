// src/routes.tsx
import { Routes, Route } from 'react-router-dom';
import Login from './pages/admin/Login.tsx';
import Dashboard from './pages/admin/Dashboard.tsx';
import Overview from './components/admin/Overview.tsx';
import NavbarManager from './components/admin/NavbarManager.tsx';
import ContentManager from './components/admin/ContentManager.tsx';
import UploadManager from './components/admin/UploadManager.tsx';
import Home from './pages/public/Home.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';

export default function AppRoutes() {
    return (
        <Routes>
            {/* PUBLIC */}
            <Route path="/" element={<Home />} />

            {/* ADMIN */}
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