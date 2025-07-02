"use client";

import { useRouter } from "next/navigation";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer
} from 'recharts';
import { Typography, Box, Button, TextField, CardContent, Card } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { api } from "@/utils/apiClient"; // ✅ Use the helper
import ProjectStageVelocitySkeleton from './ProjectStageVelocitySkeleton';

type StageFlowItem = {
    stageName: string;
    enteredCount: number;
    stayedCount: number;
    exitedCount: number;
};

type Movement = "entered" | "stayed" | "exited";

/** payload shape Recharts sends to a <Bar onClick> */
interface BarClickData {
    payload: { stage: string };
}

/** limited shape we read from BarChart onClick */
interface ChartClickState {
    activeLabel?: string;
    activePayload?: unknown[];
    event?: { target?: Element };
}

const COLORS = {
    entered: '#10b981', // green
    stayed: '#1e3a8a',  // navy
    exited: '#ef4444',  // red
};

const ProjectStageVelocityChart = () => {
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

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

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get(`/salesforce/opportunities/stage-flow-summary?startDate=${startDate}&endDate=${endDate}`);
            const formatted = res.data.data.map((item: StageFlowItem) => ({
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
    }, [startDate, endDate]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const STAGE_SLUG_MAP: Record<string, string> = {
        "Closed Won - Signed": "closed-won-signed",
        "Ready to be Scheduled": "ready-to-be-scheduled",
        Scheduled: "scheduled",
        "Work in Progress": "work-in-progress",
        "Closed Won-Paid": "closed-won-paid",
    };


    const handleBarClick = (
        d: BarClickData,
        _idx: number,
        movement: Movement
    ) => {
        console.log("BAR-CLICK", { d, movement });
        gotoVelocity(d.payload.stage, movement);
    };

    /* click helper */
    const gotoVelocity = (stageLabel: string, movement: string) => {
        const stageSlug = STAGE_SLUG_MAP[stageLabel] ?? "all";
        router.push(
            `/projects/velocity-details?stage=${stageSlug}` +
            `&movement=${movement}` +
            `&startDate=${startDate}` +
            `&endDate=${endDate}`
        );
    };

    /* handle clicks on empty space of a column */
    const handleChartClick = (s: unknown) => {
        const state = s as ChartClickState;
        if (!state?.activeLabel) return;

        const isBar =
            state.event?.target?.closest?.("path.recharts-rectangle") !== null;

        if (!isBar) {
            console.log("BACKGROUND-CLICK", state);
            gotoVelocity(state.activeLabel, "all");
        }
    };

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
                        <BarChart data={chartData} onClick={handleChartClick} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis dataKey="stage" tick={{ fill: 'white', fontSize: 12 }} interval={0} textAnchor="end" />
                            <YAxis tick={{ fill: 'white' }} />
                            <Tooltip
                                formatter={(value: number, name: string) => [`${Math.abs(value)} project(s)`, name]}
                                contentStyle={{
                                    backgroundColor: '#1e293b',
                                    borderColor: '#334155',
                                    color: 'white',
                                    cursor: 'pointer'
                                }}
                            />
                            <Legend />
                            <Bar
                                dataKey="stayed"
                                stackId="a"
                                fill={COLORS.stayed}
                                name="Stayed"
                                onClick={(d, idx) => handleBarClick(d as BarClickData, idx, "stayed")}
                                cursor="pointer"
                            />
                            <Bar
                                dataKey="entered"
                                stackId="a"
                                fill={COLORS.entered}
                                name="Entered"
                                onClick={(d, idx) => handleBarClick(d as BarClickData, idx, "entered")}
                                cursor="pointer"
                            />
                            <Bar
                                dataKey="exited"
                                stackId="b"
                                fill={COLORS.exited}
                                name="Exited"
                                onClick={(d, idx) => handleBarClick(d as BarClickData, idx, "exited")}
                                cursor="pointer"
                            />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    );
};

export default ProjectStageVelocityChart;
