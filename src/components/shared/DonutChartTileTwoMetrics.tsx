"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, Typography, Box } from "@mui/material";

const COLORS = ["#10b981", "#3b82f6", "#1f2937"];

type DonutChartTileTwoMetricsProps = {
    label: string;
    actual1: number; // Paid
    actual2: number; // Billed Not Paid
    target: number;  // Total Opportunity Amount
    label1?: string;
    label2?: string;
    label3?: string;
};

const DonutChartTileTwoMetrics: React.FC<DonutChartTileTwoMetricsProps> = ({
    label,
    actual1,
    actual2,
    target,
    label1 = "Paid",
    label2 = "Billed Not Paid",
    label3 = "Unbilled"
}) => {
    const data = [
        { name: label1, value: actual1 },
        { name: label2, value: actual2 },
        { name: label3, value: Math.max(target - actual1 - actual2, 0) },
    ];

    const percentComplete = ((actual1 + actual2) / target) * 100;

    return (
        <Card
            sx={{
                width: "100%",
                maxWidth: 240,
                background: "linear-gradient(to bottom right, #121929 0%, #0c111c 50%, #000000 100%)",
                color: "white",
                border: "1px solid #374151",
                borderRadius: "12px",
                padding: 1.5,
            }}
        >
            <CardContent sx={{ paddingBottom: "16px !important" }}>
                <Typography variant="subtitle2" gutterBottom sx={{ textAlign: "center", textTransform: "uppercase", color: "#d1d5db" }}>
                    {label}
                </Typography>

                <Box sx={{ width: "100%", height: 120 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart key={`pie-${label}`}>
                            <Pie
                                data={data}
                                innerRadius={40}
                                outerRadius={56}
                                paddingAngle={2}
                                dataKey="value"
                                stroke="none"
                                isAnimationActive={false}
                            >
                                {data.map((_, index) => (
                                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value: number, name: string) => [`$${value.toLocaleString()}`, name]}
                                contentStyle={{ backgroundColor: "#1f2937", borderColor: "#374151", color: "white" }}
                                itemStyle={{ color: "#d1d5db" }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </Box>

                <Typography variant="subtitle1" sx={{ textAlign: "center", marginTop: 1 }}>
                    {`${percentComplete.toFixed(0)}%`}
                </Typography>
                <Typography variant="body2" sx={{ textAlign: "center", color: "#d1d5db" }}>
                    ${(actual1 + actual2).toLocaleString()} / ${target.toLocaleString()}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default DonutChartTileTwoMetrics;
