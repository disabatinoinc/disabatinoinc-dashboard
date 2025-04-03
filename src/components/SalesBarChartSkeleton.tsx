// components/SalesBarChartSkeleton.tsx

"use client";

import React from "react";
import { Card, CardContent, Skeleton, Box } from "@mui/material";
import { TargetBucket } from "@/types/TargetBucket";

type SalesBarChartProps = {
    data: {
        WTD: TargetBucket[];
        MTD: TargetBucket[];
        QTD: TargetBucket[];
        YTD: TargetBucket[];
    };
};

const SalesBarChartSkeleton = () => {
    return (
        <Card
            sx={{
                background: "linear-gradient(to bottom right, #121929 0%, #0c111c 50%, #000000 100%)",
                color: "white",
                border: "1px solid #374151",
                borderRadius: "12px",
                padding: 2,
                mt: 3,
            }}
        >
            <CardContent>
                <Skeleton variant="text" width={200} height={32} sx={{ bgcolor: "#1f2937", mb: 2 }} />
                <Box sx={{ width: "100%", height: 300, display: "flex", gap: 1 }}>
                    {Array.from({ length: 6 }).map((_, idx) => (
                        <Skeleton
                            key={idx}
                            variant="rectangular"
                            width="100%"
                            height={Math.random() * 200 + 60}
                            sx={{ flex: 1, bgcolor: "#1f2937", borderRadius: "4px" }}
                        />
                    ))}
                </Box>
            </CardContent>
        </Card>
    );
};

export default SalesBarChartSkeleton;