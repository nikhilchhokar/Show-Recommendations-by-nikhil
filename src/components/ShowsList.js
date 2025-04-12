import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Tabs,
  Tab,
  Snackbar,
  Alert,
  Stack,
  Chip,
  useTheme
} from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import ShowCard from './ShowCard';
import Recommendations from './Recommendations';

// Use environment variable for API URL
const API_URL = process.env.REACT_APP_API_URL;

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

function ShowsList() {
  const [shows, setShows] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [activeTab, setActiveTab] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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
      console.log('API Response:', response);

      if (response.data && Array.isArray(response.data)) {
        setShows(response.data);
      } else {
        console.error('Invalid response format:', response.data);
        setError('No shows found. Try adding some shows!');
      }

      // Fetch all genres
      console.log('Fetching genres from:', `${API_URL}/genres`);
      const genresResponse = await axios.get(`${API_URL}/genres`);
      console.log('Genres Response:', genresResponse);

      if (genresResponse.data && Array.isArray(genresResponse.data)) {
        setGenres(['All', ...genresResponse.data]);
      } else {
        console.error('Invalid genres response format:', genresResponse.data);
        setError('Failed to load genres.');
      }
    } catch (error) {
      console.error('Error fetching shows or genres:', error);
      setError('Failed to load shows or genres. Please check if the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const filteredShows = selectedGenre === 'All' 
    ? shows 
    : shows.filter(show => show.genre.includes(selectedGenre));

  if (loading) {
    return <div>Loading...</div>;
  }

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
            </Box>

            <Grid container spacing={3}>
              {filteredShows.map((show) => (
                <Grid item xs={12} sm={6} md={4} key={show.id}>
                  <ShowCard show={show} />
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