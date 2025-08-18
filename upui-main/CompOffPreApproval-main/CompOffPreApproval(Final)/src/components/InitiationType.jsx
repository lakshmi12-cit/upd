import React from 'react';
import {
  Box,
  Typography,
} from '@mui/material';
import './InitiationType.css';

// InitiationType Component
export const InitiationType = ({ selectedType = 'forMe', onChange }) => {
  return (
    <Box className="initiation-type-container">
      <Box className="initiation-type-header">
        <Typography className="initiation-type-title">Initiation Type</Typography>
      </Box>
      <Box className="initiation-type-options">
        <input 
          type="radio" 
          id="forMe" 
          name="initiationType" 
          checked={selectedType === 'forMe'}
          onChange={() => onChange && onChange('forMe')}
          className="initiation-type-radio"
        />
        <label 
          htmlFor="forMe" 
          className={`initiation-type-label ${selectedType === 'forMe' ? 'initiation-type-label-active' : 'initiation-type-label-inactive'}`}
        >
          For Me
        </label>
        <input 
          type="radio" 
          id="forMyReportee" 
          name="initiationType" 
          checked={selectedType === 'forMyReportee'}
          onChange={() => onChange && onChange('forMyReportee')}
          className="initiation-type-radio"
        />
        <label 
          htmlFor="forMyReportee" 
          className={`initiation-type-label ${selectedType === 'forMyReportee' ? 'initiation-type-label-active' : 'initiation-type-label-inactive'}`}
        >
          For My Reportee
        </label>
      </Box>
    </Box>
  );
};