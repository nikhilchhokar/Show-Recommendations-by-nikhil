import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  TextField, 
  Button, 
  Snackbar, 
  Alert,
  CircularProgress,
  Paper,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  Chip,
  Stack,
  IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import DeleteIcon from '@mui/icons-material/Delete';
import ShowCard from './ShowCard';
import Recommendations from './Recommendations';
import { styled } from '@mui/material/styles';
import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

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

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    transition: 'all 0.3s ease',
    '&:hover': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.main,
      },
    },
    '&.Mui-focused': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.main,
        borderWidth: '2px',
      },
    },
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
  const [favorites, setFavorites] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [showForm, setShowForm] = useState({
    title: '',
    year: '',
    type: 'series',
    poster: '',
    imdbRating: '',
    genre: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [openAddShowDialog, setOpenAddShowDialog] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    fetchShows();
    fetchGenres();
    fetchFavorites();
  }, []);

  const fetchShows = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/shows`);
      setShows(response.data);
    } catch (error) {
      console.error('Error fetching shows:', error);
      setError('Failed to load shows');
    } finally {
      setLoading(false);
    }
  };

  const fetchGenres = async () => {
    try {
      const response = await axios.get(`${API_URL}/genres`);
      setGenres(['All', ...response.data]);
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  };

  const fetchFavorites = async () => {
    try {
      const response = await axios.get(`${API_URL}/favorites`);
      setFavorites(response.data.map(fav => fav.show_id));
    } catch (error) {
      console.error('Error fetching favorites:', error);
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
    if (!showForm.title || !showForm.year || !showForm.genre) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/shows`, showForm);
      setShows(prev => [...prev, response.data]);
      setShowForm({
        title: '',
        year: '',
        type: 'series',
        poster: '',
        imdbRating: '',
        genre: ''
      });
      setOpenAddShowDialog(false);
      setSuccess('Show added successfully!');
    } catch (error) {
      console.error('Error adding show:', error);
      setError('Failed to add show');
    }
  };

  const handleToggleFavorite = async (showId) => {
    try {
      if (favorites.includes(showId)) {
        await axios.delete(`${API_URL}/favorites/${showId}`);
        setFavorites(prev => prev.filter(id => id !== showId));
      } else {
        await axios.post(`${API_URL}/favorites`, { show_id: showId });
        setFavorites(prev => [...prev, showId]);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      setError('Failed to update favorites');
    }
  };

  const handleDeleteShow = async (id) => {
    if (!window.confirm('Are you sure you want to delete this show?')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/shows/${id}`);
      setShows(prev => prev.filter(show => show.id !== id));
      setSuccess('Show deleted successfully!');
    } catch (error) {
      console.error('Error deleting show:', error);
      setError('Failed to delete show');
    }
  };

  const handleCloseSnackbar = () => {
    setError('');
    setSuccess('');
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
                    label="Year"
                    name="year"
                    value={showForm.year}
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
                    label="IMDB Rating"
                    name="imdbRating"
                    value={showForm.imdbRating}
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
        open={!!error || !!success}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={error ? 'error' : 'success'}
          sx={{ 
            width: '100%',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
          }}
        >
          {error || success}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default ShowsList; 