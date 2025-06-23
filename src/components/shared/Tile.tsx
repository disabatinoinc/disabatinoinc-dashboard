"use client";

import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";

interface TileProps {
    label: string;
    value: number;
}

const Tile: React.FC<TileProps> = ({ label, value }) => {
    return (
        <Card
            sx={{
                width: "100%",
                maxWidth: 150,
                minHeight: 150,
                background: "linear-gradient(to bottom right, #121929 0%, #0c111c 50%, #000000 100%)",
                color: "white",
                border: "1px solid #374151",
                borderRadius: "12px",
                padding: 1.5,
            }}
        >
            <CardContent sx={{ paddingBottom: "16px !important" }}>
                <Typography
                    variant="subtitle2"
                    gutterBottom
                    sx={{ textAlign: "center", textTransform: "uppercase", color: "#d1d5db", minHeight: 45, minWidth: 118 }}
                >
                    {label}
                </Typography>

                <Box mt={2}>
                    <Typography variant="h4" sx={{ textAlign: "center" }}>
                        {value}
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
};

export default Tile;
