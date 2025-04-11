import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  Button,
  TextField,
  Paper,
  IconButton,
  useTheme,
  Grid
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/material/styles';
import axios from 'axios';

// Use environment variable for API URL
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

function Recommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [recommendationForm, setRecommendationForm] = useState({
    show_name: '', // Changed from showName
    genre: '',
    recommender_name: '', // Changed from recommenderName
    reason: ''
  });
  const theme = useTheme();

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      const response = await axios.get(`${API_URL}/recommendations`);
      setRecommendations(response.data);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };

  const handleRecommendationInputChange = (e) => {
    const { name, value } = e.target;
    setRecommendationForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddRecommendation = async () => {
    if (!recommendationForm.show_name || !recommendationForm.genre || !recommendationForm.recommender_name) {
      alert('Please fill in all required fields.');
      return;
    }

    try {
      console.log('Sending recommendation:', recommendationForm); // Debugging log
      await axios.post(`${API_URL}/recommendations`, recommendationForm);
      console.log('Recommendation added successfully');
      fetchRecommendations(); // Fetch the updated list of recommendations
      setRecommendationForm({
        show_name: '',
        genre: '',
        recommender_name: '',
        reason: ''
      });
    } catch (error) {
      console.error('Error adding recommendation:', error);
      alert('Failed to add recommendation. Please try again.');
    }
  };

  const handleDeleteRecommendation = async (id) => {
    try {
      await axios.delete(`${API_URL}/recommendations/${id}`);
      setRecommendations(prev => prev.filter(rec => rec.id !== id));
    } catch (error) {
      console.error('Error deleting recommendation:', error);
    }
  };

  return (
    <Box p={3}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <StyledPaper elevation={0} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: theme.palette.primary.main }}>
              Add Recommendation
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <StyledTextField
                  fullWidth
                  label="Show Name"
                  name="show_name" // Changed from showName
                  value={recommendationForm.show_name}
                  onChange={handleRecommendationInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <StyledTextField
                  fullWidth
                  label="Genre"
                  name="genre"
                  value={recommendationForm.genre}
                  onChange={handleRecommendationInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <StyledTextField
                  fullWidth
                  label="Your Name"
                  name="recommender_name" // Changed from recommenderName
                  value={recommendationForm.recommender_name}
                  onChange={handleRecommendationInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <StyledTextField
                  fullWidth
                  label="Reason for Recommendation"
                  name="reason"
                  value={recommendationForm.reason}
                  onChange={handleRecommendationInputChange}
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item xs={12}>
                <StyledButton
                  onClick={handleAddRecommendation}
                  fullWidth
                >
                  Add Recommendation
                </StyledButton>
              </Grid>
            </Grid>
          </StyledPaper>
        </Grid>
        <Grid item xs={12} md={6}>
          <List>
            {recommendations.map((rec) => (
              <React.Fragment key={rec.id}>
                <ListItem
                  sx={{
                    background: 'linear-gradient(145deg, #1a1a1a, #2a2a2a)',
                    borderRadius: '12px',
                    mb: 2,
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start'
                  }}
                >
                  <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6" sx={{ color: theme.palette.primary.main }}>
                      {rec.show_name}
                    </Typography>
                    <IconButton 
                      onClick={() => handleDeleteRecommendation(rec.id)}
                      sx={{ color: theme.palette.error.main }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Recommended by: {rec.recommender_name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Genre: {rec.genre}
                  </Typography>
                  {rec.reason && (
                    <Typography variant="body2" sx={{ color: 'text.primary' }}>
                      {rec.reason}
                    </Typography>
                  )}
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                    {new Date(rec.created_at).toLocaleDateString()}
                  </Typography>
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Recommendations;