import React, { useState, useEffect } from 'react';

import api from './ApiClient';
import {
  Box,
  Typography,
  Button,
  Alert,
  Snackbar,
  InputBase,
  IconButton,
} from '@mui/material';
import { RequiredInformationHeader } from './RequiredInformationHeader';
import { CompOffLayout } from './CompOffLayout.jsx';
import CompOffManagerApprove from './CompOffManagerApprove';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import './CompOffEmployeeSubmit.css';
import './NoteBox.css';
import './Icons.css';
import './Buttons.css';
import noteIcon from '../assets/note.svg';
import deleteIcon from '../assets/delete.svg';
import CloseIcon from '@mui/icons-material/Close';
const employeeId = 12345;
// AddCircleIcon component
const AddCircleIcon = ({ className }) => (
  <svg
    className={className || "add-circle-icon"}
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="20" cy="20" r="14" stroke="#29abe2" strokeWidth="2" />
    <line x1="20" y1="15.5" x2="20" y2="24.5" stroke="#29abe2" strokeWidth="2" strokeLinecap="round" />
    <line x1="15.5" y1="20" x2="24.5" y2="20" stroke="#29abe2" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// ArrowForwardIcon for dropdown
const ArrowForwardIcon = ({ className }) => (
  <svg className={className || "arrow-forward-icon"} viewBox="0 0 24 24">
    <path d="M12 4l1.41 1.41L7.83 11H20v2H7.83l5.58 5.59L12 20l-8-8z" fill="#6B7280" />
  </svg>
);

// NoteBox component matching image 2
const NoteBox = ({ onClose }) => (
  <Box className="note-box">
    {/* Top-right icons */}
    <Box className="note-box-icons">
      <Box className="note-icon-container">
        <img src={noteIcon} alt="Note" className="note-icon" />
      </Box>
      <IconButton
        className="close-button"
        size="small"
        disabled // Remove this line if you want the close button to be functional
      >
        <CloseIcon className="close-icon" />
      </IconButton>
    </Box>
    {/* Content */}
    <Typography className="note-title">
      Note:
    </Typography>
    <Typography className="note-content">
      1. Pre-approval to be raised within 5 working days from working on a non-working day
    </Typography>
  </Box>
);

const CompOffEmployeeSubmit = () => {
  const [initiationType, setInitiationType] = useState('forMe');
  const [selectedDate, setSelectedDate] = useState(null);
  const [reason, setReason] = useState('');
  const [requests, setRequests] = useState([
    {
      id: 1,
      requestDate: '15-Jun-2025',
      reason: 'Work on Saturdays due to product deadline',
      reportee: 'Karandeep Sahni'
    }
  ]);
  const [selectedReportee, setSelectedReportee] = useState('');
  const [showManagerApprove, setShowManagerApprove] = useState(false);
  const [snackbar, setSnackbar] = useState({
  });

  const [reportees, setReportees] = useState([]);

  // Fetch reportees from API when component mounts or employeeId changes
  useEffect(() => {
  const fetchReportees = async () => {
    try {
      const response = await api.get('/api/PreCompOffRequest/GetReportees', {
        params: { eid: employeeId }
      });
      setReportees(Array.isArray(response.data) ? response.data : response.data.data || []);
    } catch (error) {
      console.error('Error fetching reportees:', error);
      setSnackbar({
        open: true,
        message: 'Failed to fetch reportees',
        severity: 'error'
      });
    }
  };
  fetchReportees();
}, []);

const handleAddRequest = () => {
  if (!selectedDate || !reason.trim()) {
    setSnackbar({
      open: true,
      message: 'Please fill in both date and reason',
      severity: 'warning'
    });
    return;
  }

  if (initiationType === 'forMyReportee' && !selectedReportee) {
    setSnackbar({
      open: true,
      message: 'Please select a reportee',
      severity: 'warning'
    });
    return;
  }

  const newRequest = {
    id: Date.now(),
    reportee: initiationType === 'forMyReportee' ? selectedReportee : '',
    requestDate: selectedDate.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }),
    reason: reason,
    initiationType: initiationType,
  };

  setRequests([...requests, newRequest]);
  setSelectedDate(null);
  setReason('');
};

const handleDeleteRequest = (id) => {
  setRequests(requests.filter(req => req.id !== id));
};

const handleSubmit = async () => {
  if (requests.length === 0) {
    setSnackbar({
      open: true,
      message: 'Please add at least one request',
      severity: 'warning'
    });
    return;
  }

  const payload = {
preApprovalID: 0,
initiationType: initiationType === 'forMe' ? 1 : 2, // if backend accepts 1/2 for types
mEmpID: employeeId,
selfReportee: 0,
initiationByMEmpID: employeeId,
requestedDatesModels: requests.map(req => ({
  preApprovalID: 0,
  compRefDate: new Date(req.requestDate).toISOString(),
  reason: req.reason,
}))
};


  try {
    const response = await api.post('/api/PreCompOffRequest/SubmitPreCompOffRequest', payload);
    setSnackbar({
      open: true,
      message: 'Submission successful',
      severity: 'success'
    });
    setShowManagerApprove(true);
  } catch (error) {
    console.error('Submission error:', error);
    setSnackbar({
      open: true,
      message: 'Submission failed',
      severity: 'error'
    });
  }
};

  

  const handleBackToSubmit = () => {
    setShowManagerApprove(false);
  };

  return (
    <>
      {showManagerApprove ? (
        <CompOffManagerApprove onBack={handleBackToSubmit} submittedRequests={requests.map(request => ({
          ...request,
          initiationType: initiationType,
          reportee: initiationType === 'forMyReportee' ? selectedReportee : ''
        }))} />
      ) : (
        <CompOffLayout title="Comp off Pre Approval - (Employee Submit)">
          <Box className="compoff-container" sx={{
            bgcolor: '#F9FAFB',
            borderRadius: 2,
            p: 3,
            mb: 2,
            boxShadow: '0 1px 2px rgba(16,30,115,0.04)'
          }}>
            <RequiredInformationHeader />

            <Box sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1,
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              mb: 2
            }}>
              <Box sx={{ flex: 1, minWidth: 220 }}>
                <Typography sx={{ fontWeight: 700, fontSize: 15, mb: 1 }}>Initiation Type</Typography>
                <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                  <input
                    type="radio"
                    id="forMe"
                    name="initiationType"
                    checked={initiationType === 'forMe'}
                    onChange={() => setInitiationType('forMe')}
                    style={{ accentColor: '#2563EB', width: 18, height: 18, marginRight: 6 }}
                  />
                  <label htmlFor="forMe" style={{
                    fontWeight: 500,
                    fontSize: 15,
                    color: initiationType === 'forMe' ? '#111827' : '#6B7280',
                    marginRight: 18
                  }}>For Me</label>
                  <input
                    type="radio"
                    id="forMyReportee"
                    name="initiationType"
                    checked={initiationType === 'forMyReportee'}
                    onChange={() => setInitiationType('forMyReportee')}
                    style={{ accentColor: '#2563EB', width: 18, height: 18, marginRight: 6 }}
                  />
                  <label htmlFor="forMyReportee" style={{
                    fontWeight: 500,
                    fontSize: 15,
                    color: initiationType === 'forMyReportee' ? '#111827' : '#6B7280'
                  }}>For My Reportee</label>
                </Box>
              </Box>
              {/* Note Box as per correct placement (top-right icon) */}
              <Box sx={{
                flex: 1.5,
                minWidth: 260,
                ml: { md: 4, xs: 0 },
                display: 'flex',
                justifyContent: 'flex-end'
              }}>
                <NoteBox />
              </Box>
            </Box>

            <Box sx={{ mt: 1, mb: 2 }}>
              <Typography sx={{ fontWeight: 700, fontSize: 15, mb: 0.5 }}>Employee Details</Typography>
              <Box sx={{
                mt: 1,
                display: 'flex',
                gap: 2,
                flexWrap: 'wrap',
                alignItems: 'flex-start',
                mb: 1
              }}>
                {initiationType === 'forMyReportee' && (
                  <Box sx={{ flex: 1, minWidth: 220 }}>
                    <Typography sx={{ fontWeight: 700, fontSize: 14, mb: 1 }}>Select Reportee</Typography>
                    <Box sx={{ position: 'relative', mb: 1 }}>
                      <InputBase
                        fullWidth
                        sx={{
                          bgcolor: '#FFFFFF',
                          border: '1px solid #E5E7EB',
                          borderRadius: '12px',
                          px: 2,
                          py: 1.2,
                          fontSize: 15,
                          pr: 5
                        }}
                        placeholder="Select"
                        value={selectedReportee}
                        onChange={e => setSelectedReportee(e.target.value)}
                        list="reportee-list"
                      />
                      <datalist id="reportee-list">
                        {reportees.map(r => (
                          <option key={r.id} value={r.name} />
                        ))}
                      </datalist>
                      <Box sx={{
                        position: 'absolute',
                        right: 12,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#6B7280'
                      }}>
                        <ArrowForwardIcon style={{ width: '20px', height: '20px', transform: 'rotate(90deg)' }} />
                      </Box>
                    </Box>
                  </Box>
                )}
                <Box sx={{ flex: 1, minWidth: 220, mr: { md: 1, xs: 0 } }}>
                  <Typography sx={{ fontWeight: 700, fontSize: 14, mb: 1 }}>Request Date(Weekend/Holiday)</Typography>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      value={selectedDate}
                      onChange={setSelectedDate}
                      slotProps={{
                        textField: {
                          size: "small",
                          fullWidth: true,
                          placeholder: "Select Date",
                          sx: {
                            bgcolor: '#FFFFFF',
                            border: '1px solid #E5E7EB',
                            borderRadius: '12px',
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': {
                                border: 'none',
                              },
                              '& input': {
                                px: 2,
                                py: 1.2,
                                fontSize: 15,
                              },
                            },
                          }
                        }
                      }}
                    />
                  </LocalizationProvider>
                </Box>
                {initiationType === 'forMe' && (
                  <Box sx={{ flex: 2, minWidth: 220 }}>
                    <Typography sx={{ fontWeight: 700, fontSize: 14, mb: 1 }}>Reason For Request</Typography>
                    <InputBase
                      fullWidth
                      sx={{
                        bgcolor: '#FFFFFF',
                        border: '1px solid #E5E7EB',
                        borderRadius: '12px',
                        px: 2,
                        py: 1.2,
                        fontSize: 15,
                        mb: 0
                      }}
                      placeholder="Enter your reason here..."
                      value={reason}
                      onChange={e => setReason(e.target.value)}
                    />
                  </Box>
                )}
              </Box>
              {initiationType === 'forMyReportee' && (
                <Box sx={{ mt: 2, width: '100%' }}>
                  <Typography sx={{ fontWeight: 700, fontSize: 14, mb: 1 }}>Reason For Request</Typography>
                  <InputBase
                    fullWidth
                    sx={{
                      bgcolor: '#FFFFFF',
                      border: '1px solid #E5E7EB',
                      borderRadius: '12px',
                      px: 2,
                      py: 1.2,
                      fontSize: 15,
                      mb: 0
                    }}
                    placeholder="Enter your reason here..."
                    value={reason}
                    onChange={e => setReason(e.target.value)}
                  />
                </Box>
              )}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                <Button
                  variant="outlined"
                  sx={{
                    minWidth: 100,
                    height: 40,
                    borderRadius: '8px',
                    gap: 1,
                    px: 2,
                    py: 0,
                    color: '#003049',
                    fontWeight: 600,
                    fontSize: 16,
                    borderColor: '#29abe2',
                    bgcolor: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textTransform: 'none',
                    boxShadow: 'none',
                    '&:hover': { bgcolor: '#FFFFFF', borderColor: '#29abe2' }
                  }}
                  onClick={handleAddRequest}
                >
                  <AddCircleIcon className="add-circle-icon-small" />
                  <span className="add-button-text">Add</span>
                </Button>
              </Box>
            </Box>

            <Box sx={{ mt: 1, mb: 2 }}>
              <Box sx={{
                border: '1px solid #E5E7EB',
                borderRadius: '16px',
                overflow: 'hidden',
                bgcolor: '#FFFFFF',
                boxShadow: '0 1px 2px rgba(16,30,115,0.04)'
              }}>
                <Box sx={{
                  display: 'flex',
                  bgcolor: '#F1F6FB',
                  p: 1,
                  borderTopLeftRadius: '16px',
                  borderTopRightRadius: '16px',
                  fontWeight: 700,
                  fontSize: 15,
                  color: '#111827'
                }}>
                  {initiationType === 'forMyReportee' && <Box sx={{ flex: 1 }}>Reportee</Box>}
                  <Box sx={{ flex: 1 }}>Request Date</Box>
                  <Box sx={{ flex: 3 }}>Reason</Box>
                  <Box sx={{ width: 80, textAlign: 'center' }}>Delete</Box>
                </Box>
                {requests.map((req, idx) => (
                  <Box key={req.id} sx={{
                    display: 'flex',
                    alignItems: 'center',
                    borderTop: '1px solid #E5E7EB',
                    p: 1
                  }}>
                    {initiationType === 'forMyReportee' && <Box sx={{ flex: 1, fontSize: 14, color: '#111827' }}>{req.reportee || 'Karandeep Sahni'}</Box>}
                    <Box sx={{ flex: 1, fontSize: 14, color: '#111827' }}>{req.requestDate}</Box>
                    <Box sx={{ flex: 3, fontSize: 14, color: '#111827' }}>{req.reason}</Box>
                    <Box sx={{ width: 80, textAlign: 'center' }}>
                      <IconButton size="medium" sx={{ p: 0.5 }} onClick={() => handleDeleteRequest(req.id)}>
                        <img src={deleteIcon} alt="Delete" style={{ width: '16px', height: '16px' }} />
                      </IconButton>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>

            <Box sx={{ mt: 2, mb: 2 }}>
              <Typography sx={{ fontWeight: 700, fontSize: 14, mb: 1 }}>Comment (Max 500 Chars)</Typography>
              <InputBase
                fullWidth
                multiline
                minRows={2}
                maxRows={4}
                sx={{
                  bgcolor: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: 1,
                  px: 2,
                  py: 1.2,
                  fontSize: 15
                }}
                placeholder="XXX-XXX-XX-XXX-X"
              />
            </Box>

            {/* Submit Button - exactly as in image 5 */}
            <Box sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              mt: 2
            }}>
              <Button
                variant="contained"
                sx={{
                  bgcolor: '#36B1E6',
                  color: '#fff',
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  fontWeight: 600,
                  fontSize: 16,
                  textTransform: 'none',
                  boxShadow: 'none',
                  minWidth: 100,
                  height: 40,
                  '&:hover': { bgcolor: '#36B1E6' }
                }}
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </Box>
          </Box>

          <Snackbar
            open={snackbar.open}
            autoHideDuration={4000}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <Alert
              onClose={() => setSnackbar({ ...snackbar, open: false })}
              severity={snackbar.severity}
              variant="filled"
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </CompOffLayout>
      )}
    </>
  );
};

export default CompOffEmployeeSubmit;