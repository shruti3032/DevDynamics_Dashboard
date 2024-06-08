import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';
import logo from '../components/devdynamics.png';

const Navbar: React.FC = () => {
  return (
    <AppBar position="static" style={{ backgroundColor: '#fff', boxShadow: 'none' }}>
      <Toolbar>
        <img src={logo} alt="Logo" style={{ height: '40px', marginRight: '20px' }} />
        <Typography variant="h6" color="textPrimary">
          DevDynamics
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
