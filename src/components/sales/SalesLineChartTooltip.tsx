import React from "react";
import { TooltipProps } from "recharts";
import { Box, Typography } from "@mui/material";

/**
 * Custom tooltip for sales line chart showing Actual vs. Target.
 */
const SalesLineChartTooltip: React.FC<TooltipProps<any, any>> = ({ active, payload, label }) => {
    if (!active || !payload || payload.length === 0) {
        return null;
    }

    // Currency formatter
    const formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });

    return (
        <Box
            sx={{
                backgroundColor: "#1f2937",
                border: "1px solid #374151",
                borderRadius: 1,
                p: 1,
                minWidth: 140,
            }}
        >
            <Typography variant="caption" sx={{ color: "#9ca3af", mb: 0.5 }}>
                {label}
            </Typography>

            {payload.map((entry, index) => (
                <Box
                    key={index}
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: index < payload.length - 1 ? 0.5 : 0,
                    }}
                >
                    <Typography variant="body2" sx={{ color: "#d1d5db" }}>
                        {entry.name}
                    </Typography>
                    <Typography variant="body2">
                        {formatter.format(entry.value)}
                    </Typography>
                </Box>
            ))}
        </Box>
    );
};

export default SalesLineChartTooltip;