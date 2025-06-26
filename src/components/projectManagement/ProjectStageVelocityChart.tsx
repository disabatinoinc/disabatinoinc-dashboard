"use client";

import {
    BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer
} from 'recharts';
import { Typography, Box, Skeleton, Button, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { api } from "@/utils/apiClient"; // ✅ Use the helper
import ProjectStageVelocitySkeleton from './ProjectStageVelocitySkeleton';

const COLORS = {
    entered: '#10b981', // green
    stayed: '#1e3a8a',  // navy
    exited: '#ef4444',  // red
};

const ProjectStageVelocityChart = () => {
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);

    const today = new Date();
    const dayOfWeek = today.getDay();

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek);
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + (6 - dayOfWeek));

    const [startDate, setStartDate] = useState(() => {
        const d = new Date();
        d.setDate(d.getDate() - 14);
        return d.toISOString().split("T")[0];
    });

    const [endDate, setEndDate] = useState(() => {
        const d = new Date();
        d.setDate(d.getDate() + (6 - d.getDay()));
        return d.toISOString().split("T")[0];
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/salesforce/opportunities/stage-flow-summary?startDate=${startDate}&endDate=${endDate}`);
            const formatted = res.data.data.map((item: any) => ({
                stage: item.stageName,
                entered: item.enteredCount,
                stayed: item.stayedCount,
                exited: -item.exitedCount,
            }));
            setChartData(formatted);
        } catch (error) {
            console.error("Error fetching project stage velocity:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [startDate, endDate]);

    return (
        <Box>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 2, mb: 2 }}>
                <TextField
                    type="date"
                    label="Start Date"
                    size="small"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    sx={{
                        input: { color: "white" },
                        label: { color: "#9ca3af" },
                        '& fieldset': { borderColor: '#374151' },
                        '& input::-webkit-calendar-picker-indicator': {
                            filter: 'invert(1)',
                            cursor: 'pointer'
                        }
                    }}
                />
                <TextField
                    type="date"
                    label="End Date"
                    size="small"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    sx={{
                        input: { color: "white" },
                        label: { color: "#9ca3af" },
                        '& fieldset': { borderColor: '#374151' },
                        '& input::-webkit-calendar-picker-indicator': {
                            filter: 'invert(1)',
                            cursor: 'pointer'
                        }
                    }}
                />
                <Button
                    variant="outlined"
                    size="small"
                    onClick={fetchData}
                    sx={{
                        color: "#d1d5db",
                        borderColor: "#374151",
                        fontSize: "0.75rem",
                        textTransform: "none",
                        "&:hover": {
                            backgroundColor: "#1f2937",
                            borderColor: "#6b7280"
                        }
                    }}
                >
                    Refresh
                </Button>
            </Box>
            <Typography variant="h6" sx={{ mb: 2, color: 'white' }}>
                Project Velocity Through Stages
            </Typography>
            {loading ? (
                <ProjectStageVelocitySkeleton />
            ) : (
                <ResponsiveContainer width="100%" height={320}>
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="stage" tick={{ fill: 'white', fontSize: 12 }} interval={0} textAnchor="end" />
                        <YAxis tick={{ fill: 'white' }} />
                        <Tooltip
                            formatter={(value: number, name: string) => [`${Math.abs(value)} project(s)`, name]}
                            contentStyle={{
                                backgroundColor: '#1e293b',
                                borderColor: '#334155',
                                color: 'white',
                            }}
                        />
                        <Legend />
                        <Bar dataKey="stayed" stackId="a" fill={COLORS.stayed} name="Stayed" />
                        <Bar dataKey="entered" stackId="a" fill={COLORS.entered} name="Entered" />
                        <Bar dataKey="exited" stackId="b" fill={COLORS.exited} name="Exited" />
                    </BarChart>
                </ResponsiveContainer>
            )}
        </Box>
    );
};

export default ProjectStageVelocityChart;
