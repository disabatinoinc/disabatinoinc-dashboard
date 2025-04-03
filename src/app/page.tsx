"use client"

import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import CollectionsSummary from "@/components/CollectionsSummary";
import SalesSummary from "@/components/SalesSummary";

const navItems = [
    { label: "Collections", value: "collections" },
    { label: "Sales", value: "sales" },
];

const Page = () => {
    const [activeTab, setActiveTab] = useState(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("activeTab") || "collections";
        }
        return "collections";
    });

    return (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", padding: 2 }}>
            <Box sx={{ width: "100%", maxWidth: "1200px" }}>
                <AppBar
                    position="static"
                    sx={{ backgroundColor: "#030712", borderBottom: "2px solid #1f2937" }}
                >
                    <Toolbar>
                        <Typography variant="h6" sx={{ flexGrow: 1, textTransform: "uppercase" }}>
                            disabatinoinc dashboard
                        </Typography>
                        {navItems.map((item) => (
                            <Button
                                key={item.value}
                                onClick={() => {
                                    localStorage.setItem("activeTab", item.value);
                                    setActiveTab(item.value);
                                }}
                                color="inherit"
                                sx={{
                                    color: activeTab === item.value ? "white" : "#d1d5db",
                                    textTransform: "uppercase",
                                    '&:hover': { color: "white" },
                                }}
                            >
                                {item.label}
                            </Button>
                        ))}
                    </Toolbar>
                </AppBar>
                <Box sx={{ padding: 2 }}>
                    {activeTab === "collections" && <CollectionsSummary />}
                    {activeTab === "sales" && <SalesSummary />}
                </Box>
            </Box>
        </Box>
    );
};

export default Page;
