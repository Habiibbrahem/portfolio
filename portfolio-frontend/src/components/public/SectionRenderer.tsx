import { useQuery } from '@tanstack/react-query';
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    Button,
    TextField,
    Alert,
    Modal,
    IconButton,
} from '@mui/material';
import dayjs from 'dayjs';
import { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import HeroSection from './sections/HeroSection';
import api from '../../api/client';

const getHero = async () => (await api.get('/cms/hero')).data;
const getNews = async () => {
    try {
        const { data } = await api.get('/cms/news');
        return data.published !== false ? data : null;
    } catch { return null; }
};
const getServices = async () => {
    try {
        const { data } = await api.get('/cms/services');
        return data.published !== false ? data : null;
    } catch { return null; }
};
const getContact = async () => {
    try {
        const { data } = await api.get('/cms/contact');
        return data.data;
    } catch { return {}; }
};

export default function SectionRenderer() {
    const { data: hero } = useQuery({ queryKey: ['hero'], queryFn: getHero });
    const { data: news } = useQuery({ queryKey: ['news'], queryFn: getNews });
    const { data: servicesSection } = useQuery({ queryKey: ['services'], queryFn: getServices });
    const { data: contactData } = useQuery({ queryKey: ['contact'], queryFn: getContact });

    const sortedNewsItems = [...(news?.data?.items || [])].sort((a: any, b: any) =>
        new Date(b.date || Date.now()).getTime() - new Date(a.date || Date.now()).getTime()
    );

    const services = servicesSection?.data?.services || [];

    const [showAllNews, setShowAllNews] = useState(false);
    const initialCount = 6;
    const visibleNews = showAllNews ? sortedNewsItems : sortedNewsItems.slice(0, initialCount);
    const hasMoreNews = sortedNewsItems.length > initialCount;

    // Contact form state
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitStatus('loading');
        try {
            await api.post('/contact-messages', formData);
            setSubmitStatus('success');
            setFormData({ name: '', email: '', phone: '', message: '' });
            setTimeout(() => setSubmitStatus('idle'), 5000);
        } catch (err) {
            setSubmitStatus('error');
            setTimeout(() => setSubmitStatus('idle'), 5000);
        }
    };

    // Modal state
    const [openModal, setOpenModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [modalType, setModalType] = useState<'news' | 'service'>('news');

    const handleOpenModal = (item: any, type: 'news' | 'service') => {
        setSelectedItem(item);
        setModalType(type);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedItem(null);
    };

    return (
        <Box>
            {hero && <HeroSection data={hero.data} />}

            {/* Latest News */}
            {sortedNewsItems.length > 0 && (
                <Box sx={{ py: 12, bgcolor: 'background.default' }}>
                    <Container maxWidth="lg">
                        <Typography variant="h4" align="center" color="primary.main" mb={8} sx={{ position: 'relative' }}>
                            Latest News
                            <Box sx={{ height: 4, width: 80, bgcolor: 'secondary.main', mx: 'auto', mt: 2 }} />
                        </Typography>

                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
                                gap: 4,
                            }}
                        >
                            {visibleNews.map((item: any) => {
                                const desc = item.description || '';
                                const isLong = desc.length > 120;
                                const preview = isLong ? desc.substring(0, 120).trim() + '...' : desc;

                                return (
                                    <Box
                                        key={item.id}
                                        onClick={() => handleOpenModal(item, 'news')}
                                        sx={{
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                transform: 'translateY(-12px)',
                                                boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                                            },
                                        }}
                                    >
                                        <Card sx={{ height: '100%', minHeight: 420, display: 'flex', flexDirection: 'column', borderRadius: 4, overflow: 'hidden', boxShadow: 3 }}>
                                            <Box sx={{ height: 240, position: 'relative' }}>
                                                {item.image ? (
                                                    <img
                                                        src={`${item.image}?w=600&h=400&fit=crop`}
                                                        alt={item.title}
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    />
                                                ) : (
                                                    <Box
                                                        sx={{
                                                            height: '100%',
                                                            bgcolor: 'grey.300',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                        }}
                                                    >
                                                        <Typography variant="h6" color="text.secondary">No Image</Typography>
                                                    </Box>
                                                )}
                                                <Box
                                                    sx={{
                                                        position: 'absolute',
                                                        bottom: 0,
                                                        left: 0,
                                                        right: 0,
                                                        bgcolor: 'rgba(0,0,0,0.6)',
                                                        color: 'white',
                                                        p: 2,
                                                        textAlign: 'center',
                                                        opacity: 0,
                                                        transition: 'opacity 0.3s ease',
                                                        pointerEvents: 'none',
                                                    }}
                                                >
                                                    <Typography variant="subtitle2">Read more...</Typography>
                                                </Box>
                                            </Box>

                                            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                                <Typography
                                                    variant="h6"
                                                    fontWeight="bold"
                                                    gutterBottom
                                                    sx={{
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: 'vertical',
                                                    }}
                                                >
                                                    {item.title}
                                                </Typography>

                                                {desc && (
                                                    <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1, mb: 2 }}>
                                                        {preview}
                                                    </Typography>
                                                )}

                                                {isLong && (
                                                    <Typography variant="caption" sx={{ color: 'secondary.main', fontWeight: 600, alignSelf: 'flex-start' }}>
                                                        Read more...
                                                    </Typography>
                                                )}

                                                <Typography variant="caption" color="text.secondary" sx={{ mt: 'auto', display: 'block' }}>
                                                    {dayjs(item.date || Date.now()).format('MMMM D, YYYY')}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Box>
                                );
                            })}
                        </Box>

                        {hasMoreNews && !showAllNews && (
                            <Box sx={{ textAlign: 'center', mt: 8 }}>
                                <Button
                                    variant="contained"
                                    size="large"
                                    onClick={() => setShowAllNews(true)}
                                    sx={{
                                        px: 6,
                                        py: 2,
                                        borderRadius: 12,
                                        bgcolor: 'secondary.main',
                                        color: 'black',
                                        fontWeight: 600,
                                        '&:hover': { bgcolor: 'secondary.dark' },
                                    }}
                                >
                                    Show More News
                                </Button>
                            </Box>
                        )}
                    </Container>
                </Box>
            )}

            {/* Our Services - 4 PER ROW, FIXED SIZE, ICON ONLY */}
            {services.length > 0 && (
                <Box sx={{ py: 12, bgcolor: 'grey.50' }}>
                    <Container maxWidth="lg">
                        <Typography variant="h4" align="center" color="primary.main" mb={8} sx={{ position: 'relative' }}>
                            Our Services
                            <Box sx={{ height: 4, width: 80, bgcolor: 'secondary.main', mx: 'auto', mt: 2 }} />
                        </Typography>

                        <Grid container spacing={4}>
                            {services.map((service: any, index: number) => {
                                const desc = service.description || '';
                                const isLong = desc.length > 20;
                                const preview = isLong ? desc.substring(0, 20).trim() + '...' : desc;

                                return (
                                    <Grid item xs={12} sm={6} md={3} key={index}>
                                        <Box
                                            onClick={() => handleOpenModal(service, 'service')}
                                            sx={{
                                                cursor: 'pointer',
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    transform: 'translateY(-12px)',
                                                    boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                                                },
                                            }}
                                        >
                                            <Card
                                                sx={{
                                                    height: 340, // Fixed height for all cards
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    textAlign: 'center',
                                                    p: 4,
                                                    borderRadius: 4,
                                                    boxShadow: 3,
                                                }}
                                            >
                                                {/* Admin-selected icon */}
                                                <Box sx={{ fontSize: 80, color: 'secondary.main', mb: 3 }}>
                                                    🔨 {/* Will be dynamic with service.icon */}
                                                </Box>

                                                <Typography
                                                    variant="h5"
                                                    fontWeight="bold"
                                                    gutterBottom
                                                    sx={{
                                                        minHeight: 72, // Ensures title area is same height
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        px: 2,
                                                    }}
                                                >
                                                    {service.title}
                                                </Typography>

                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                    sx={{
                                                        minHeight: 80, // Ensures description area is same height
                                                        mb: 2,
                                                        px: 2,
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 4,
                                                        WebkitBoxOrient: 'vertical',
                                                    }}
                                                >
                                                    {preview}
                                                </Typography>

                                                {isLong && (
                                                    <Typography variant="caption" sx={{ color: 'secondary.main', fontWeight: 600 }}>
                                                        Read more...
                                                    </Typography>
                                                )}
                                            </Card>
                                        </Box>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    </Container>
                </Box>
            )}

            {/* Unified Modal */}
            <Modal open={openModal} onClose={handleCloseModal} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box
                    sx={{
                        width: { xs: '95%', md: '75%' },
                        maxHeight: '90vh',
                        bgcolor: 'background.paper',
                        borderRadius: 4,
                        boxShadow: 24,
                        overflow: 'hidden',
                        position: 'relative',
                        outline: 'none',
                    }}
                >
                    <IconButton
                        onClick={handleCloseModal}
                        sx={{
                            position: 'absolute',
                            top: 16,
                            right: 16,
                            zIndex: 10,
                            bgcolor: 'rgba(255,255,255,0.8)',
                            '&:hover': { bgcolor: 'rgba(255,255,255,1)' },
                        }}
                    >
                        <CloseIcon />
                    </IconButton>

                    {/* Full background image in modal */}
                    {selectedItem?.backgroundImage && modalType === 'service' && (
                        <Box sx={{ height: { xs: 300, md: 500 } }}>
                            <img
                                src={`${selectedItem.backgroundImage}?w=1200&h=800&fit=crop`}
                                alt={selectedItem.title}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </Box>
                    )}

                    {selectedItem?.image && modalType === 'news' && (
                        <Box sx={{ height: { xs: 300, md: 500 } }}>
                            <img
                                src={`${selectedItem.image}?w=1200&h=800&fit=crop`}
                                alt={selectedItem.title}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </Box>
                    )}

                    <Box sx={{ p: { xs: 4, md: 8 }, overflowY: 'auto' }}>
                        <Typography variant="h3" fontWeight={900} mb={3}>
                            {selectedItem?.title}
                        </Typography>

                        {modalType === 'news' && selectedItem?.date && (
                            <Typography variant="subtitle1" color="text.secondary" mb={4}>
                                {dayjs(selectedItem.date).format('MMMM D, YYYY')}
                            </Typography>
                        )}

                        <Typography variant="body1" sx={{ lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                            {selectedItem?.description || 'No description available.'}
                        </Typography>
                    </Box>
                </Box>
            </Modal>

            {/* Get In Touch */}
            <Box sx={{ py: { xs: 10, md: 14 }, bgcolor: 'background.default' }}>
                <Container maxWidth="lg">
                    <Typography variant="h4" align="center" color="primary.main" mb={10} sx={{ position: 'relative' }}>
                        Get In Touch
                        <Box sx={{ height: 4, width: 80, bgcolor: 'secondary.main', mx: 'auto', mt: 2 }} />
                    </Typography>

                    <Grid container spacing={6} alignItems="stretch">
                        <Grid item xs={12} md={6}>
                            <Box
                                component="form"
                                onSubmit={handleSubmit}
                                sx={{
                                    bgcolor: 'white',
                                    p: { xs: 4, md: 6 },
                                    borderRadius: 4,
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                }}
                            >
                                {submitStatus === 'success' && (
                                    <Alert severity="success" sx={{ mb: 3 }}>
                                        Message sent successfully! We will reply soon.
                                    </Alert>
                                )}
                                {submitStatus === 'error' && (
                                    <Alert severity="error" sx={{ mb: 3 }}>
                                        Failed to send message. Please try again.
                                    </Alert>
                                )}

                                <Box sx={{ display: 'grid', gap: 3 }}>
                                    <TextField
                                        placeholder="Name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        fullWidth
                                        variant="standard"
                                        InputProps={{ disableUnderline: false }}
                                        sx={{ '& .MuiInput-underline:before': { borderBottomColor: 'grey.400' } }}
                                    />
                                    <TextField
                                        placeholder="Email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        fullWidth
                                        variant="standard"
                                    />
                                    <TextField
                                        placeholder="Phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        fullWidth
                                        variant="standard"
                                    />
                                    <TextField
                                        placeholder="Message"
                                        name="message"
                                        multiline
                                        rows={5}
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        fullWidth
                                        variant="standard"
                                    />
                                </Box>

                                <Button
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                    disabled={submitStatus === 'loading'}
                                    sx={{
                                        mt: 4,
                                        py: 2,
                                        bgcolor: 'secondary.main',
                                        color: 'black',
                                        fontWeight: 700,
                                        borderRadius: 3,
                                        '&:hover': { bgcolor: 'secondary.dark' },
                                    }}
                                >
                                    {submitStatus === 'loading' ? 'Sending...' : 'Send Message'}
                                </Button>
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Box
                                sx={{
                                    height: { xs: 400, md: '100%' },
                                    borderRadius: 4,
                                    overflow: 'hidden',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                                }}
                            >
                                {contactData?.homeImage ? (
                                    <img
                                        src={contactData.homeImage}
                                        alt="Contact us"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                ) : (
                                    <Box
                                        sx={{
                                            height: '100%',
                                            bgcolor: 'grey.300',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <Typography variant="h5" color="text.secondary">
                                            No image uploaded yet
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Box>
    );
}