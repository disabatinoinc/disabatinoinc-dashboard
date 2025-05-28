"use client";

import { Box, Paper, TableContainer, Typography } from "@mui/material";

export default function TeamupSync() {

    return (
        <Box>
            <Typography variant="h4" sx={{ color: "white", mb: 2 }}>Teamup Sync</Typography>
            <TableContainer
                component={Paper}
                sx={{
                    background: "linear-gradient(to bottom right, #121929 0%, #0c111c 50%, #000000 100%)",
                    border: "1px solid #374151",
                    borderRadius: "12px",
                    maxHeight: "800px",
                    overflowY: "auto"
                }}
            ></TableContainer>
        </Box>
    );
}