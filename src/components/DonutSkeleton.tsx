"use client";

import { Box, Skeleton } from "@mui/material";

export const DonutSkeleton = () => (
    <Box
        sx={{
            width: 200,
            height: 200,
            background: "linear-gradient(to bottom right, #121929 0%, #0c111c 50%, #000000 100%)",
            border: "1px solid #374151",
            borderRadius: "12px",
            padding: 1.5,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
        }}
    >
        <Skeleton variant="circular" width={80} height={80} sx={{ bgcolor: "#1f2937" }} />
        <Skeleton variant="text" width={100} height={20} sx={{ mt: 2, bgcolor: "#1f2937" }} />
        <Skeleton variant="text" width={140} height={18} sx={{ mt: 1, bgcolor: "#1f2937" }} />
    </Box>
);
