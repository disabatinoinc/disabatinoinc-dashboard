"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, Typography, Box } from "@mui/material";

const COLORS = ["#10b981", "#1f2937"];

type DonutChartTileProps = {
    label: string;
    actual: number;
    target: number;
};

const DonutChartTile: React.FC<DonutChartTileProps> = ({ label, actual, target }) => {

    const data = [
        { name: "Sold", value: actual },
        { name: "Remaining", value: Math.max(target - actual, 0) },
    ];

    return (
        <Card
            sx={{
                width: "100%",
                maxWidth: 200,
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
                        <PieChart key={`pie-${label}}`}>
                            <Pie
                                data={data}
                                innerRadius={40}
                                outerRadius={56}
                                paddingAngle={2}
                                dataKey="value"
                                stroke="none"
                                isAnimationActive={false}
                            >
                                {COLORS.map((color, index) => (
                                    <Cell key={index} fill={color} />
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
                    {`${((actual / target) * 100).toFixed(0)}%`}
                </Typography>
                <Typography variant="body2" sx={{ textAlign: "center", color: "#d1d5db" }}>
                    ${actual.toLocaleString()} / ${target.toLocaleString()}
                </Typography>
            </CardContent>
        </Card >
    );
};

export default DonutChartTile;
