import { Box, Typography } from "@mui/material";
import { useRootContext } from "./RootWindow";
import { useEffect } from "react";

export default function homeWindow() {

    const {onTitleChange} = useRootContext();

    useEffect(() => {
        onTitleChange("Home");
    }, []);


    return <Box sx={{ flexGrow: 1, justifyContent:"center", flexDirection:"column"}}>
        <Typography sx={{}} component="div">
            Hello, Welcome!
        </Typography>
    </Box>
}