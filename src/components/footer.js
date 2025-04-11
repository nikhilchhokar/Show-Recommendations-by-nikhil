import React from 'react';
import { Box, Typography } from '@mui/material';

function Footer() {
  return (
    <Box
      sx={{
        backgroundColor: '#1a1a1a',
        color: '#ffffff',
        textAlign: 'center',
        py: 2,
        mt: 'auto',
        boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.2)',
      }}
    >
      <Typography variant="body2">
        © 2025 Made by - Nikhil Chhokar
      </Typography>
    </Box>
  );
}

export default Footer;