import React from 'react';
import { Box, Typography, Link } from '@mui/material';
import Header from './Header';
import { ReactComponent as ViewPoliciesIcon } from '../assets/Viewpolicies.svg';
import { ReactComponent as ArrowForwardIcon } from '../assets/arrow_forward.svg';
import { ReactComponent as AccessAlarmsIcon } from '../assets/access_alarms.svg';
import AvtharImage from '../assets/avthar.svg';

// Reusable Vertical Divider Component
const VerticalDivider = () => (
  <Box
    sx={{
      width: '1px',
      height: 44,
      bgcolor: '#e3e8ee',
      display: { xs: 'none', sm: 'block' },
    }}
  />
);

// Reusable Info Block Component
const InfoBlock = ({ label, value, sx = {} }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      minWidth: 150,
      ...sx,
    }}
  >
    <Typography sx={{ fontSize: 14, color: '#6B7280', mb: 0.5 }}>{label}</Typography>
    <Typography sx={{ fontWeight: 700, fontSize: 16, color: '#111827' }}>{value}</Typography>
  </Box>
);

// CompOffLayout Component
export const CompOffLayout = ({
  children,
  title,
  showBackButton = false,
  onBackClick
}) => {
  const employeeData = {
    name: 'Manoj Kandan M',
    genId: '25504878',
    email: 'Manoj.kandan@partner.samsung.com',
    designation: 'Outsourcing',
    division: 'Tech Strategy Team\\Smart Infra Group\\Information System & AI Tools',
    manager: 'Ravindra S R (06786669)',
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: '#ffffff' }}>
      {/* Header */}
      <Header />

      {/* Main Content */}
      <Box sx={{ flex: 1, bgcolor: '#ffffff', p: { xs: 1, md: 3 } }}>
        {/* Breadcrumb */}
        <Typography sx={{ color: '#6B7280', fontSize: 13, mb: 1 }}>
          My Workspace {'>'} Comp off Pre Approval
        </Typography>

        {/* Title and Employee Info */}
        <Box sx={{
          bgcolor: 'white', 
          borderRadius: 2, 
          p: 3, 
          mb: 3, 
          boxShadow: '0 1px 2px rgba(16,30,115,0.04)',
          width: '100%',
        }}>
          {/* Title Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, position: 'relative' }}>
            {showBackButton && (
              <Box
                sx={{
                  mr: 0.5,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
                onClick={onBackClick}
              >
                <ArrowForwardIcon style={{ width: 28, height: 28 }} />
              </Box>
            )}
            <Typography sx={{
              fontWeight: 700,
              fontSize: { xs: 18, sm: 20 },
              color: '#111827',
              mr: 0.5
            }}>
              {title}
            </Typography>
            <Box sx={{
              position: 'absolute',
              right: 1,
              top: '50%',
              transform: 'translateY(-50%)',
              display: 'flex',
              alignItems: 'center'
            }}>
              <AccessAlarmsIcon style={{ width: 26, height: 26, color: '#00b0ff' }} />
            </Box>
          </Box>

          {/* Employee Details Section */}
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: 2,
              rowGap: 2,
              justifyContent: { xs: 'center', sm: 'flex-start' },
              width: '100%',
            }}
          >
            {/* Profile Info */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
              <Box sx={{ position: 'relative' }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '1px solid #E5E7EB',
                    bgcolor: '#4CAF50',
                  }}
                >
                  <Box
                    component="img"
                    src={AvtharImage}
                    alt={employeeData.name}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </Box>
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 2,
                    right: 2,
                    width: 12,
                    height: 12,
                    backgroundColor: '#eaf5ebff',
                    borderRadius: '50%',
                    border: '2px solid white',
                  }}
                />
              </Box>
              <Box>
                <Typography sx={{
                  fontWeight: 700,
                  fontSize: { xs: 14, sm: 16 },
                  color: '#111827'
                }}>
                  {employeeData.name} - Gen ID: {employeeData.genId}
                </Typography>
                <Typography sx={{ fontSize: { xs: 12, sm: 14 }, color: '#6B7280' }}>
                  {employeeData.email}
                </Typography>
              </Box>
            </Box>

            {/* Vertical Divider */}
            <VerticalDivider />

            {/* Designation */}
            <InfoBlock label="Designation" value={employeeData.designation} />

            {/* Vertical Divider */}
            <VerticalDivider />

            {/* Division */}
            <InfoBlock
              label="Division"
              value={employeeData.division}
              sx={{ flexGrow: 1, minWidth: 250 }}
            />

            {/* Vertical Divider */}
            <VerticalDivider />

            {/* Manager */}
            <InfoBlock label="Manager" value={employeeData.manager} />
          </Box>
        </Box>

        {/* Content */}
        {children}

        {/* View Policies Link */}
        <Box sx={{ mt: 1 }}>
          <Link href="#" underline="hover" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#6B7280' }}>
            <ViewPoliciesIcon style={{ width: 20, height: 20 }} />
            View Policies
          </Link>
        </Box>
      </Box>
    </Box>
  );
};
