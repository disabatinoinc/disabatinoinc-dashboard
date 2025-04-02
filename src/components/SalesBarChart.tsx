"use client";

import React, { useState } from "react";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from "recharts";
import {
    Card,
    CardContent,
    Typography,
    Box,
    MenuItem,
    Select,
    SelectChangeEvent,
} from "@mui/material";

// Sample data for each period
const sampleData = {
    WTD: [
        { name: "Mon", sales: 12000 },
        { name: "Tue", sales: 18000 },
        { name: "Wed", sales: 14000 },
        { name: "Thu", sales: 16000 },
        { name: "Fri", sales: 20000 },
    ],
    MTD: [
        { name: "Week 1", sales: 42000 },
        { name: "Week 2", sales: 37000 },
        { name: "Week 3", sales: 48000 },
        { name: "Week 4", sales: 29000 },
    ],
    QTD: [
        { name: "Jan", sales: 65000 },
        { name: "Feb", sales: 72000 },
        { name: "Mar", sales: 81000 },
    ],
    YTD: [
        { name: "Q1", sales: 218000 },
        { name: "Q2", sales: 174000 },
        { name: "Q3", sales: 199000 },
        { name: "Q4", sales: 135000 },
    ],
};

const periods = [
    { label: "Week to Date", value: "WTD" },
    { label: "Month to Date", value: "MTD" },
    { label: "Quarter to Date", value: "QTD" },
    { label: "Year to Date", value: "YTD" },
];

const SalesBarChart = () => {
    const [period, setPeriod] = useState<keyof typeof sampleData>("WTD");

    const handleChange = (event: SelectChangeEvent) => {
        setPeriod(event.target.value as keyof typeof sampleData);
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
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Typography variant="h6" sx={{ textTransform: "uppercase", color: "#d1d5db" }} >Sales by Period</Typography>
                    <Select
                        value={period}
                        onChange={handleChange}
                        size="small"
                        sx={{
                            color: "#d1d5db",
                            minWidth: 180,
                            ".MuiOutlinedInput-notchedOutline": {
                                borderColor: "#374151",
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                                borderColor: "white",
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                borderColor: "white",
                            },
                            "& .MuiSvgIcon-root": {
                                color: "#d1d5db",
                            },
                        }}
                    >
                        {periods.map((p) => (
                            <MenuItem key={p.value} value={p.value}>
                                {p.label}
                            </MenuItem>
                        ))}
                    </Select>
                </Box>

                <Box sx={{ width: "100%", height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={sampleData[period]}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="name" stroke="#d1d5db" />
                            <YAxis stroke="#d1d5db" />
                            <Tooltip
                                contentStyle={{ backgroundColor: "#1f2937", borderColor: "#4b5563", color: "white" }}
                                labelStyle={{ color: "#d1d5db" }}
                                cursor={{ fill: "#374151" }}
                            />
                            <Bar dataKey="sales" fill="#10b981" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </Box>
            </CardContent>
        </Card>
    );
};

export default SalesBarChart;
