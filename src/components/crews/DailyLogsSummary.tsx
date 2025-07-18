"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Grid from '@mui/material/Grid2';
import { Typography, Box, Button, TextField } from "@mui/material";
import dynamic from "next/dynamic";
import { api } from "@/utils/apiClient";
import { subDays, format, eachDayOfInterval, isWeekend, startOfDay, parseISO } from 'date-fns';
import Holidays from 'date-holidays';
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
    dailyLogs: unknown[];
}

const DailyLogsSummary: React.FC = () => {
    const router = useRouter();
    const [data, setData] = useState<CrewSummary[]>([]);
    const [businessDays, setBusinessDays] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);

    const today = new Date();
    const defaultStart = subDays(today, 6);
    const defaultEnd = today;
    const [fromDate, setFromDate] = useState<Date>(defaultStart);
    const [toDate, setToDate] = useState<Date>(defaultEnd);

    const fetchData = useCallback(() => {
        setLoading(true);

        // Normalize dates to local midnight
        const start = startOfDay(fromDate);
        const end = startOfDay(toDate);

        const startDate = format(start, 'yyyy-MM-dd');
        const endDate = format(end, 'yyyy-MM-dd');

        // calculate business days
        const days = eachDayOfInterval({ start, end });
        const hd = new Holidays('US');
        const businessDaysOnly = days.filter(day => {
            const isHoliday = hd.isHoliday(day);
            const isBizDay = !isWeekend(day) && !isHoliday;
            return isBizDay;
        });
        setBusinessDays(businessDaysOnly.length);

        api.get<{ data: CrewSummary[] }>('/buildertrend/daily-logs/user-summary', {
            params: { startDate, endDate, pageNumber: 1, pageSize: 100 }
        })
            .then((response) => {
                setData(response.data.data);
            })
            .catch((error: unknown) => {
                console.error('Error fetching daily logs summary', error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [fromDate, toDate]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // helpers for routing
    const formattedFrom = format(fromDate, 'yyyy-MM-dd');
    const formattedTo = format(toDate, 'yyyy-MM-dd');

    return (
        <Box>
            {/* Header */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h4" sx={{ color: 'white' }}>
                    Daily Logs Summary
                </Typography>
                <Box display="flex" gap={2}>
                    <TextField
                        type="date"
                        size="small"
                        label="Start Date"
                        value={formattedFrom}
                        onChange={e => {
                            const val = e.target.value;
                            setFromDate(val ? startOfDay(parseISO(val)) : fromDate);
                        }}
                        InputLabelProps={{ shrink: true }}
                        sx={{
                            input: { color: "white" },
                            label: { color: "#9ca3af" },
                            '& fieldset': { borderColor: '#374151' },
                            '& input::-webkit-calendar-picker-indicator': { filter: 'invert(1)', cursor: 'pointer' }
                        }}
                    />
                    <TextField
                        type="date"
                        size="small"
                        label="End Date"
                        value={formattedTo}
                        onChange={e => {
                            const val = e.target.value;
                            setToDate(val ? startOfDay(parseISO(val)) : toDate);
                        }}
                        InputLabelProps={{ shrink: true }}
                        sx={{
                            input: { color: "white" },
                            label: { color: "#9ca3af" },
                            '& fieldset': { borderColor: '#374151' },
                            '& input::-webkit-calendar-picker-indicator': { filter: 'invert(1)', cursor: 'pointer' }
                        }}
                    />
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={fetchData}
                        sx={{
                            color: '#d1d5db',
                            borderColor: '#374151',
                            '&:hover': { borderColor: '#6b7280', backgroundColor: '#1f2937' },
                            textTransform: 'none',
                            fontSize: '0.75rem'
                        }}
                    >
                        Refresh
                    </Button>
                </Box>
            </Box>

            {/* Donut charts grid */}
            <Grid container spacing={2} marginTop={2} justifyContent="space-between">
                {loading
                    ? Array.from({ length: 4 }).map((_, idx) => (
                        <Grid key={idx}>
                            <DonutSkeleton />
                        </Grid>
                    ))
                    : data.map((cs) => (
                        <Grid key={cs.addedById}>
                            <DonutChartTile
                                label={cs.addedBy}
                                actual={cs.dailyLogCount}
                                target={businessDays}
                                paidLabelOverride="Logged"
                                unpaidLabelOverride="Remaining"
                                isCurrency={false}
                                actualOnClick={() => {
                                    router.push(
                                        `/crews/daily-logs/details?startDate=${formattedFrom}` +
                                        `&endDate=${formattedTo}` +
                                        `&userId=${cs.addedById}`
                                    );
                                }}
                            />
                        </Grid>
                    ))
                }
            </Grid>
        </Box>
    );
};

export default DailyLogsSummary;