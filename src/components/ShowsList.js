import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  Paper,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  IconButton,
  Stack,
  Chip,
  useTheme
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import ShowCard from './ShowCard';
import Recommendations from './Recommendations';

// Use environment variable for API URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const StyledPaper = styled(Paper)(({ theme }) => ({
  background: 'linear-gradient(145deg, #1a1a1a, #2a2a2a)',
  borderRadius: '16px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3)',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
  border: 0,
  borderRadius: '12px',
  color: 'white',
  padding: '10px 24px',
  boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 10px 4px rgba(33, 203, 243, .3)',
  },
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  '& .MuiTabs-indicator': {
    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
    height: '3px',
    borderRadius: '3px',
  },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 'bold',
  fontSize: '1rem',
  transition: 'all 0.3s ease',
  '&.Mui-selected': {
    color: theme.palette.primary.main,
  },
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    background: 'linear-gradient(145deg, #1a1a1a, #2a2a2a)',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
}));

function ShowsList() {
  const [shows, setShows] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [activeTab, setActiveTab] = useState(0);
  const [openAddShowDialog, setOpenAddShowDialog] = useState(false);
  const [showForm, setShowForm] = useState({
    title: '',
    genre: '',
    rating: 0,
    poster: '',
    year: '',
    imdb_rating: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    console.log('API URL:', API_URL);
    fetchShows();
  }, []);

  const fetchShows = async () => {
    try {
      setLoading(true);
      console.log('Fetching shows from:', `${API_URL}/shows`);
      const response = await axios.get(`${API_URL}/shows`);
      console.log('API Response:', response.data);
      
      if (response.data && Array.isArray(response.data)) {
        setShows(response.data);
        // Extract unique genres
        const uniqueGenres = new Set();
        response.data.forEach(show => {
          if (show.genre) {
            show.genre.split(',').forEach(g => uniqueGenres.add(g.trim()));
          }
        });
        setGenres(['All', ...Array.from(uniqueGenres)]);
      } else {
        console.error('Invalid response format:', response.data);
        setError('Invalid data received from server');
      }
    } catch (error) {
      console.error('Error fetching shows:', error);
      setError('Failed to load shows. Please check if the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleShowInputChange = (e) => {
    const { name, value } = e.target;
    setShowForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddShow = async () => {
    if (!showForm.title || !showForm.genre) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      console.log('Adding show:', showForm);
      const response = await axios.post(`${API_URL}/shows`, showForm);
      console.log('Add show response:', response.data);
      setShows(prev => [...prev, response.data]);
      setShowForm({
        title: '',
        genre: '',
        rating: 0,
        poster: '',
        year: '',
        imdb_rating: ''
      });
      setOpenAddShowDialog(false);
    } catch (error) {
      console.error('Error adding show:', error);
      setError('Failed to add show');
    }
  };

  const handleDeleteShow = async (id) => {
    if (!window.confirm('Are you sure you want to delete this show?')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/shows/${id}`);
      setShows(prev => prev.filter(show => show.id !== id));
    } catch (error) {
      console.error('Error deleting show:', error);
      setError('Failed to delete show');
    }
  };

  const filteredShows = selectedGenre === 'All' 
    ? shows 
    : shows.filter(show => show.genre.includes(selectedGenre));

  return (
    <Box sx={{ 
      background: 'linear-gradient(135deg, #121212 0%, #1a1a1a 100%)',
      minHeight: '100vh',
      py: 4
    }}>
      <Typography 
        variant="h4" 
        sx={{ 
          mb: 4, 
          textAlign: 'center',
          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 'bold',
          textShadow: '0 2px 10px rgba(33, 203, 243, 0.3)'
        }}
      >
        My Shows
      </Typography>

      <StyledPaper elevation={0} sx={{ mb: 4, mx: 2 }}>
        <StyledTabs
          value={activeTab}
          onChange={handleTabChange}
          centered
          sx={{ mb: 3 }}
        >
          <StyledTab label="My Shows" />
          <StyledTab label="Recommendations" />
        </StyledTabs>

        {activeTab === 0 ? (
          <Box p={3}>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                {genres.map((genre) => (
                  <Chip
                    key={genre}
                    label={genre}
                    onClick={() => setSelectedGenre(genre)}
                    sx={{
                      backgroundColor: selectedGenre === genre ? theme.palette.primary.main : 'transparent',
                      color: selectedGenre === genre ? 'white' : theme.palette.text.primary,
                      border: `1px solid ${theme.palette.primary.main}`,
                      '&:hover': {
                        backgroundColor: theme.palette.primary.main,
                        color: 'white',
                      },
                    }}
                  />
                ))}
              </Stack>
              <StyledButton
                startIcon={<AddIcon />}
                onClick={() => setOpenAddShowDialog(true)}
              >
                Add Show
              </StyledButton>
            </Box>

            <StyledDialog 
              open={openAddShowDialog} 
              onClose={() => setOpenAddShowDialog(false)}
              maxWidth="sm"
              fullWidth
            >
              <DialogTitle sx={{ 
                color: theme.palette.primary.main,
                textAlign: 'center',
                fontWeight: 'bold'
              }}>
                Add New Show
              </DialogTitle>
              <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
                  <TextField
                    label="Title"
                    name="title"
                    value={showForm.title}
                    onChange={handleShowInputChange}
                    required
                  />
                  <TextField
                    label="Genre"
                    name="genre"
                    value={showForm.genre}
                    onChange={handleShowInputChange}
                    required
                  />
                  <TextField
                    label="Poster URL"
                    name="poster"
                    value={showForm.poster}
                    onChange={handleShowInputChange}
                  />
                  <TextField
                    label="Rating"
                    name="rating"
                    value={showForm.rating}
                    onChange={handleShowInputChange}
                  />
                </Box>
              </DialogContent>
              <DialogActions sx={{ p: 2 }}>
                <Button 
                  onClick={() => setOpenAddShowDialog(false)}
                  sx={{ 
                    color: theme.palette.text.secondary,
                    '&:hover': {
                      color: theme.palette.primary.main
                    }
                  }}
                >
                  Cancel
                </Button>
                <StyledButton onClick={handleAddShow}>
                  Add Show
                </StyledButton>
              </DialogActions>
            </StyledDialog>

            <Grid container spacing={3}>
              {filteredShows.map((show) => (
                <Grid item xs={12} sm={6} md={4} key={show.id}>
                  <Box sx={{ position: 'relative' }}>
                    <ShowCard show={show} />
                    <IconButton
                      onClick={() => handleDeleteShow(show.id)}
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        },
                      }}
                    >
                      <DeleteIcon sx={{ color: 'white' }} />
                    </IconButton>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        ) : (
          <Recommendations />
        )}
      </StyledPaper>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setError('')}
          severity="error"
          sx={{ 
            width: '100%',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
          }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default ShowsList; 