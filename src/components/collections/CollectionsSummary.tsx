"use client";

import React, { useState, useEffect } from "react";
import Grid from '@mui/material/Grid2';
import { Typography, Box, Button } from "@mui/material";
import dynamic from "next/dynamic";
import { api } from "@/utils/apiClient";
import { subDays, format, eachDayOfInterval, isWeekend } from 'date-fns';
import { DonutSkeleton } from "../shared/DonutSkeleton";

// Lazy load the shared DonutChartTile
const DonutChartTile = dynamic(() => import("@/components/shared/DonutChartTile"), {
    ssr: false,
});

/**
 * Shape of each crew's daily-log summary returned by API
 */
interface CrewSummary {
    addedById: number;
    addedBy: string;
    dailyLogCount: number;
    dailyLogs: any[];
}

const DailyLogsSummary: React.FC = () => {
    const [data, setData] = useState<CrewSummary[]>([]);
    const [businessDays, setBusinessDays] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchData = () => {
        setLoading(true);
        const end = new Date();
        const start = subDays(end, 7);
        const startDate = format(start, 'yyyy-MM-dd');
        const endDate = format(end, 'yyyy-MM-dd');

        // Calculate Mon–Fri days
        const days = eachDayOfInterval({ start, end });
        setBusinessDays(days.filter(day => !isWeekend(day)).length);

        api.get('/daily-logs/user-summary', {
            params: { startDate, endDate, pageNumber: 1, pageSize: 100 }
        })
            .then(response => {
                // API responds { success, data: CrewSummary[] }
                setData(response.data.data);
            })
            .catch(error => {
                console.error('Error fetching daily logs summary', error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <Box>
            {/* Header */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h4" sx={{ color: 'white' }}>
                    Daily Logs Summary
                </Typography>
                <Button
                    variant="outlined"
                    size="small"
                    onClick={fetchData}
                    sx={{
                        color: '#d1d5db',
                        borderColor: '#374151',
                        '&:hover': { borderColor: '#6b7280', backgroundColor: '#1f2937' },
                        textTransform: 'none',
                        fontSize: '0.75rem',
                        display: { xs: 'none', sm: 'inline-flex' }
                    }}
                >
                    Refresh
                </Button>
            </Box>

            {/* Donut charts grid */}
            <Grid container spacing={2} marginTop={2} justifyContent="space-between">
                {loading
                    ? Array.from({ length: 4 }).map((_, idx) => (
                        <Grid key={idx}>
                            <DonutSkeleton />
                        </Grid>
                    ))
                    : data.map(cs => {
                        const remaining = Math.max(businessDays - cs.dailyLogCount, 0);
                        return (
                            <Grid key={cs.addedById}>
                                <DonutChartTile
                                    label={cs.addedBy}
                                    actual={cs.dailyLogCount}
                                    target={businessDays}
                                    paidLabelOverride="Logged"
                                    unpaidLabelOverride="Remaining"
                                />
                            </Grid>
                        );
                    })
                }
            </Grid>
        </Box>
    );
};

export default DailyLogsSummary;
