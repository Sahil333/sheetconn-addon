import React from 'react';
import { Box, Typography } from '@mui/material';

const ComingSoonPage = () => {
    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="100vh"
        >
            <img src="/path/to/your/image.jpg" alt="Coming Soon" />
            <Typography variant="h5" align="center" mt={2}>
                We are working on it!
            </Typography>
            <Typography variant="subtitle1" align="center">
                Coming soon
            </Typography>
        </Box>
    );
};

export default ComingSoonPage;