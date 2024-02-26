import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  CircularProgress,
  FormControlLabel,
  Switch,
  Grid,
  IconButton,
  StepContent,
  TextField,
} from '@mui/material';
import { LockOutlined } from "@mui/icons-material";
import postgesIconUrl from '../assets/postgresql.png';
import { useRootContext } from "./RootWindow";

export default function ImportPostgresScreen() {
  const [activeStep, setActiveStep] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const {onTitleChange} = useRootContext();
  useEffect(() => {
    onTitleChange("PostgresSQL");
  }, []);

  const connectorId = searchParams.get('connector_id');
  const connectionId = searchParams.get('connection_id');
  if(connectionId === null || connectorId === null) {
    return <Box>Invalid connectionId</Box>;
  }

  const [importParams, setImportParams] = useState({
    sheet: '',
    maxRows: 100,
  });

  const [loading, setLoading] = useState(false);
  const [refreshScheduleEnabled, setRefreshScheduleEnabled] = useState(false);

  const steps = ['Select SQL Writer', 'Import Parameters', 'Import', 'Set Refresh Schedule'];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleImport = () => {
    // Call backend API for import
    setLoading(true);
    // Simulating API call delay
    setTimeout(() => {
      setLoading(false);
      handleNext();
    }, 2000);
  };

  const handleToggleRefreshSchedule = () => {
    setRefreshScheduleEnabled((prev) => !prev);
  };

  const getStepContent = (stepIndex: number) => {
    switch (stepIndex) {
      case 0:
        return (
          <Box>
            {/* SQL Writer selection component */}
            <Typography>Select SQL Writer</Typography>
          </Box>
        );
      case 1:
        return (
        <Box>
            {/* Import parameters form */}
            <Typography>Import Parameters</Typography>
            {/* Example input fields */}
            <TextField
                label="Sheet"
                variant="outlined"
                value={importParams.sheet}
                onChange={(e) => setImportParams({ ...importParams, sheet: e.target.value })}
            />
            <TextField
                label="Max Rows"
                variant="outlined"
                type="number"
                value={importParams.maxRows}
                onChange={(e) => setImportParams({ ...importParams, maxRows: parseInt(e.target.value) })}
            />
        </Box>
        );
      case 2:
        return (
          <Box>
            {/* Import button */}
            <Typography>Importing...</Typography>
            {loading ? (
              <CircularProgress />
            ) : (
              <Button variant="contained" onClick={handleImport}>
                Import
              </Button>
            )}
          </Box>
        );
      case 3:
        return (
          <Box>
            {/* Refresh schedule setup */}
            <Typography>Set Refresh Schedule</Typography>
            <Box alignItems="center">
              <Box>
                <FormControlLabel
                  control={
                    <Switch
                      checked={refreshScheduleEnabled}
                      onChange={handleToggleRefreshSchedule}
                      color="primary"
                    />
                  }
                  label="Enable Refresh Schedule"
                />
              </Box>
              <Box>
                {refreshScheduleEnabled ? (
                  <Typography variant="body2">Refresh schedule enabled</Typography>
                ) : (
                  <IconButton disabled>
                    <LockOutlined />
                  </IconButton>
                )}
              </Box>
            </Box>
          </Box>
        );
      default:
        return 'Unknown stepIndex';
    }
  };

  return (
    <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        alignItems: 'left',
        marginTop: '20px',
    }}>
      {/* Postgres icon */}
      <Box sx={{display: "flex", justifyContent: "center"}}>
        <img src={postgesIconUrl} alt="Postgres Icon" style={{ width: '32px', height: '32px', marginRight: '8px' }} />
      </Box>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'left',
        marginTop: '20px',
        marginLeft: '10px',
      }}>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
            <StepContent>
                <Box>
                    {getStepContent(activeStep)}
                    <Box>
                        {activeStep !== 0 && (
                        <Button onClick={handleBack}>
                            Back
                        </Button>)}
                        <Button variant="contained" onClick={handleNext}>
                            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                        </Button>
                    </Box>
                </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      </Box>
      <Box>
        {/* Step content */}
        {activeStep === steps.length ? (
          <Box>
            <Typography>All steps completed</Typography>
          </Box>
        ) : null}
      </Box>
    </Box>
  );
};