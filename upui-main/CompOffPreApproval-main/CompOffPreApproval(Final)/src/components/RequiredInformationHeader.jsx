import React from 'react';
import {
  Box,
  Typography,
} from '@mui/material';
import requiredInfoIcon from '../assets/requriedinfo.svg';
import './RequiredInformationHeader.css';

// RequiredInformationHeader Component
export const RequiredInformationHeader = ({ title = "Required Information" }) => {
  return (
    <Box className="required-info-container">
      <Box className="required-info-icon-container">
        <img src={requiredInfoIcon} alt="Required Information" />
      </Box>
      <Typography className="required-info-title">
        {title}
      </Typography>
    </Box>
  );
};