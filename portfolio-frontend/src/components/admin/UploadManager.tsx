// src/components/admin/UploadManager.tsx
import { useState } from 'react';
import { Box, Button, LinearProgress, Typography, Alert } from '@mui/material';
import { uploadImage } from '../../api/upload.ts';

export default function UploadManager() {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [url, setUrl] = useState('');
    const [error, setError] = useState('');

    const handleUpload = async () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                setUploading(true);
                setProgress(0);
                try {
                    // Simulate progress
                    const interval = setInterval(() => setProgress(p => Math.min(p + 10, 90)), 100);
                    const uploadedUrl = await uploadImage(file);
                    clearInterval(interval);
                    setProgress(100);
                    setUrl(uploadedUrl);
                } catch (err) {
                    setError('Upload failed');
                }
                setUploading(false);
            }
        };
        input.click();
    };

    return (
        <Box>
            <Typography variant="h5" gutterBottom>Media Uploads</Typography>
            <Button variant="contained" onClick={handleUpload} disabled={uploading}>
                Upload Image
            </Button>
            {uploading && <LinearProgress variant="determinate" value={progress} sx={{ mt: 2 }} />}
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            {url && (
                <Box sx={{ mt: 2 }}>
                    <Typography>Uploaded successfully!</Typography>
                    <img src={url} alt="uploaded" style={{ maxWidth: '500px', marginTop: '10px' }} />
                    <TextField fullWidth value={url} label="Image URL" sx={{ mt: 2 }} />
                </Box>
            )}
        </Box>
    );
}