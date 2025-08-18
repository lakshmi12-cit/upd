import { ReactComponent as ArrowForwardIcon } from '../assets/arrow_forward.svg';
        {/* Header Icons Row */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <ArrowForwardIcon style={{ marginRight: '12px', height: 28 }} />
          {/* ...existing code... */}
        </Box>
import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Snackbar,
  InputBase,
} from '@mui/material';
import api from './ApiClient';

import { RequiredInformationHeader } from './RequiredInformationHeader';
import { CompOffLayout } from './CompOffLayout.jsx';
import CompOffReport from './CompOffReport';
// SVG imports
import { ReactComponent as TransferWorkflowIcon } from '../assets/TransferWorkflow.svg';
import { ReactComponent as RefreshSyncIcon } from '../assets/refresh_sync_icon.svg';

const CompOffManagerApprove = ({ onBack, submittedRequests = [] }) => {
  const [showReport, setShowReport] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [rmRemarks, setRmRemarks] = useState({});
  const [approvalStatus, setApprovalStatus] = useState({});
  const manager_user_id=22454221;
  useEffect(() => {
    const masterid = 123; // ⬅️ Replace with actual master ID (can be passed via props or context)
    api.get('/api/PreCompOffRequest/GetCompoffRequestDetails', {
      params: { masterid: masterid }
    })
      .then((res) => {
        console.log('Request Details:', res.data);
        // Optionally set to state
      })
      .catch((err) => {
        console.error('Error fetching details:', err);
      });
  }, []);
  
  
    // Convert submitted requests to approval format using the data from state 1
    const approvalRequests = submittedRequests.map((request) => ({
    id: request.id,
    employeeId: request.employeeId || '22454221',       // ✅ use actual request data
    employeeName: request.employeeName || 'Karandeep Sahni', // ✅ fallback only if missing
    requestDate: request.requestDate,
    reason: request.reason,
    initiationType: request.initiationType || 'forMe',
    reportee: request.reportee || ''
  }));

  // Check if any requests are "For My Reportee" to show Reportee column
  const hasReporteeRequests = approvalRequests.some(request => request.initiationType === 'forMyReportee');

  const handleRmRemarksChange = (id, value) => {
    setRmRemarks(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleApproveRequest = (requestId) => {
    if (!rmRemarks[requestId] || rmRemarks[requestId].trim() === '') {
      setSnackbar({
        open: true,
        message: 'Please add remarks before approving',
        severity: 'warning'
      });
      return;
    }
  const payload = {
    preApprovalID: 1,
    employeeID: "22454221",
    employeename: "Karandeep Sahni",
    compRefDate: "2025-08-08T09:14:21.873Z",
    reason: "Test reason",
    rmRemarks: "Test remarks",
    approvedBy: 22454221
  };
  console.log("Submitting payload:", payload);
    api.post('/api/PreCompOffRequest/UpdateManagerApproval', payload, {
      headers: { 'Content-Type': 'application/json' }
    })
      .then(() => {
        setApprovalStatus(prev => ({
          ...prev,
          [requestId]: 'approved'
        }));
        setSnackbar({
          open: true,
          message: 'Request approved successfully',
          severity: 'success'
        });
      })
      .catch((err) => {
        console.error('Approval failed:', err);
        setSnackbar({
          open: true,
          message: 'Approval failed. Please try again.',
          severity: 'error'
        });
      });
  };
  const handleRejectRequest = (requestId) => {
    if (!rmRemarks[requestId] || rmRemarks[requestId].trim() === '') {
      setSnackbar({
        open: true,
        message: 'Please add remarks before rejecting',
        severity: 'warning'
      });
      return;
    }
  
    const request = approvalRequests.find(req => req.id === requestId);
  
    api.post('api/PreCompOffRequest/UpdateManagerApproval', {
       preApprovalID: 1,
    employeeID: "22454221",
    employeename: "Karandeep Sahni",
    compRefDate: "2025-08-08T09:14:21.873Z",
    reason: "Test reason",
    rmRemarks: "Test remarks",
    approvedBy: 22454221
    }).then(() => {
      setApprovalStatus(prev => ({
        ...prev,
        [requestId]: 'rejected'
      }));
      setSnackbar({
        open: true,
        message: 'Request rejected',
        severity: 'error'
      });
    }).catch((err) => {
      console.error('Rejection failed:', err);
      setSnackbar({
        open: true,
        message: 'Rejection failed. Please try again.',
        severity: 'error'
      });
    });
  };
  const handleTransferWorkflow = () => {
    const unprocessedRequests = approvalRequests.filter(req => !approvalStatus[req.id]);
    if (unprocessedRequests.length > 0) {
      setSnackbar({
        open: true,
        message: 'Please approve or reject all requests before viewing report',
        severity: 'warning'
      });
      return;
    }
    setShowReport(true);
  };

  const handleBackFromReport = () => {
    setShowReport(false);
  };

  const getReportData = () => {
    return approvalRequests
      .filter(request => approvalStatus[request.id] === 'approved' || approvalStatus[request.id] === 'rejected')
      .map(request => ({
        ...request,
        rmRemarks: rmRemarks[request.id] || '',
        status: approvalStatus[request.id]
      }));
  };

  return (
    <>
      {showReport ? (
        <CompOffReport 
          onBack={handleBackFromReport} 
          approvedRequests={getReportData()}
          initiationType={submittedRequests[0]?.initiationType || 'forMe'}
        />
      ) : (
        <CompOffLayout 
          title="Comp off Pre Approval - (Manager Approve)" 
          showBackButton={true} 
          onBackClick={onBack}
        >
          {/* Required Information */}
          <Box sx={{ bgcolor: '#F9FAFB', borderRadius: 2, p: 3, mb: 3, boxShadow: '0 1px 2px rgba(16,30,115,0.04)' }}>
            <RequiredInformationHeader />

            {/* Approval List Table */}
            <Box sx={{ mt: 2, mb: 2 }}>
              <Typography sx={{ fontWeight: 700, fontSize: 16, color: '#111827', mb: 2 }}>
                Approval List
              </Typography>
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
                  <Box sx={{ flex: 1 }}>Employee ID</Box>
                  {hasReporteeRequests && <Box sx={{ flex: 1 }}>Reportee</Box>}
                  <Box sx={{ flex: 1 }}>Employee Name</Box>
                  <Box sx={{ flex: 1 }}>Request Date</Box>
                  <Box sx={{ flex: 2 }}>Reason</Box>
                  <Box sx={{ flex: 1 }}>RM Remarks</Box>
                </Box>
                {/* Table Rows */}
                {approvalRequests.length > 0 ? (
                  approvalRequests.map((req) => (
                    <Box key={req.id} sx={{ display: 'flex', alignItems: 'center', borderTop: '1px solid #E5E7EB', p: 1 }}>
                      <Box sx={{ flex: 1, fontSize: 14, color: '#111827' }}>{req.employeeId}</Box>
                      {hasReporteeRequests && (
                        <Box sx={{ flex: 1, fontSize: 14, color: '#111827' }}>{req.reportee || 'xxx-xx-x-xx'}</Box>
                      )}
                      <Box sx={{ flex: 1, fontSize: 14, color: '#111827' }}>{req.employeeName}</Box>
                      <Box sx={{ flex: 1, fontSize: 14, color: '#111827' }}>{req.requestDate}</Box>
                      <Box sx={{ flex: 2, fontSize: 14, color: '#111827' }}>{req.reason}</Box>
                      <Box sx={{ flex: 1, px: 1 }}>
                        <TextField
                          fullWidth
                          multiline
                          minRows={2}
                          maxRows={4}
                          size="small"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': {
                                borderColor: '#E5E7EB',
                                borderWidth: '1px',
                              },
                              '&:hover fieldset': {
                                borderColor: '#D1D5DB',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: '#6B7280',
                              },
                            },
                            '& .MuiInputBase-input': {
                              fontSize: 15,
                              color: '#111827',
                            },
                          }}
                          value={rmRemarks[req.id] || ''}
                          onChange={(e) => handleRmRemarksChange(req.id, e.target.value)}
                          placeholder="Enter your remarks here..."
                        />
                      </Box>
                    </Box>
                  ))
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center', borderTop: '1px solid #E5E7EB', p: 1 }}>
                    <Box sx={{ flex: 1, fontSize: 14, color: '#111827', textAlign: 'center' }} colSpan={6}>
                      No requests submitted yet
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>

            {/* Comment Section */}
            <Box sx={{ mt: 3, mb: 2 }}>
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

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
              <Button
                variant="outlined"
                sx={{
                  bgcolor: '#FFFFFF',
                  color: '#36B1E6',
                  borderRadius: 2,
                  px: 5,
                  py: 1.5,
                  fontWeight: 700,
                  fontSize: 16,
                  textTransform: 'none',
                  boxShadow: 'none',
                  borderColor: '#3B82F6',
                  '&:hover': { bgcolor: '#F3F4F6' }
                }}
                onClick={() => {
                  approvalRequests.forEach(req => {
                    if (!approvalStatus[req.id]) {
                      handleRejectRequest(req.id);
                    }
                  });
                }}
              >
                Reject
              </Button>
              <Button
                variant="contained"
                sx={{
                  bgcolor: '#36B1E6',
                  color: '#FFFFFF',
                  borderRadius: 2,
                  px: 5,
                  py: 1.5,
                  fontWeight: 700,
                  fontSize: 16,
                  textTransform: 'none',
                  boxShadow: 'none',
                  '&:hover': { bgcolor: '#1D4ED8' }
                }}
                onClick={() => {
                  approvalRequests.forEach(req => {
                    if (!approvalStatus[req.id]) {
                      handleApproveRequest(req.id);
                    }
                  });
                }}
              >
                Approve
              </Button>
            </Box>
          </Box>

          {/* Transfer Workflow Row */}
          <Box sx={{
            mt: 2,
            mb: 10,
            bgcolor: '#F8FAFC',
            borderRadius: 0,
            height: 48,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            px: 0,
            pl: 2,
            pr: 2,
            boxShadow: 'none',
            border: '1px solid #E2E8F0',
            '&:hover': { bgcolor: '#F1F5F9' }
          }}
            onClick={handleTransferWorkflow}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <RefreshSyncIcon style={{ width: 24, height: 24, marginRight: 8 }} />
              <Typography sx={{
                fontWeight: 600,
                fontSize: 16,
                color: '#1E293B',
                letterSpacing: 0,
                fontFamily: 'inherit'
              }}>
                Transfer Workflow
              </Typography>
            </Box>
            <Box sx={{ pr: 1, display: 'flex', alignItems: 'center' }}>
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path d="M9 6l6 6-6 6" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
            </Box>
          </Box>

          {/* Snackbar */}
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

export default CompOffManagerApprove;