import { Box, Button, TextField, Typography } from "@mui/material";
import postgresIconUrl from '../assets/postgresql.png';
import { ErrorOutline } from "@mui/icons-material";
import { useEffect } from "react";
import { useRootContext } from "./RootWindow";

export default function AddPostgreSqlConfig() {
    const {onTitleChange} = useRootContext();

    useEffect(() => {
        onTitleChange("PostgresSQL");
    }, []);

  return (
    <Box
    component="form"
    sx={{
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        alignItems: 'center',
        '& .MuiTextField-root': { m: 1, width: '25ch', height: '3em' },
        marginTop: '50px'
    }}
    noValidate
    autoComplete="off"
    >
        <img src={postgresIconUrl} alt={"Postgres Config"} style={{ width: '32px', height: '32px', marginRight: '8px' }} />
        <TextField required id="host" label="Host" />
        <TextField required id="port" label="Port" type="number" />
        <TextField required id="database" label="Database" />
        <TextField required id="user" label="User" />
        <TextField required id="password" label="Password" type="password" />
        <Box>
            <Button variant="contained" sx={{ alignSelf: 'center', marginTop: '20px', marginRight: 3 }}>Submit</Button>
            <Button variant="contained" sx={{ alignSelf: 'center', marginTop: '20px' }}>Test</Button>
        </Box>
        <Box sx={{ 
            position: 'fixed',
            backgroundColor: 'rgba(255, 255, 0, 0.3)', 
            bottom: '0',
        }}>
            <Box sx={{ 
                display: 'flex',
                alignItems: 'center', 
                marginTop: '10px', 
                padding: '10px',
                justifyContent: 'center', 
                backgroundColor: 'rgba(255, 255, 0, 0.3)', 
            }}>
            <ErrorOutline color="error" />
            <Typography variant="body2" color="error">
                Please make sure the connections from IP - 1.2.3.4 are allowed on the database host
            </Typography>
            </Box>
        </Box>
    </Box>
  );
}