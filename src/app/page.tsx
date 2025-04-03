"use client";

import React, { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";
import CollectionsSummary from "@/components/CollectionsSummary";
import dynamic from "next/dynamic";

const SalesSummary = dynamic(() => import("@/components/SalesSummary"), {
    ssr: false,
});

const navItems = [
    { label: "Collections", value: "collections" },
    { label: "Sales", value: "sales" },
];

const Page = () => {
    const [activeTab, setActiveTab] = useState<string | null>(null);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const isMobile = useMediaQuery("(max-width: 600px)");

    useEffect(() => {
        const stored = localStorage.getItem("activeTab");
        setActiveTab(stored || "collections");
    }, []);

    const handleTabChange = (value: string) => {
        localStorage.setItem("activeTab", value);
        setActiveTab(value);
        setAnchorEl(null);
    };

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

                        {isMobile ? (
                            <>
                                <IconButton
                                    color="inherit"
                                    onClick={(e) => setAnchorEl(e.currentTarget)}
                                >
                                    <MenuIcon />
                                </IconButton>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={() => setAnchorEl(null)}
                                >
                                    {navItems.map((item) => (
                                        <MenuItem
                                            key={item.value}
                                            onClick={() => handleTabChange(item.value)}
                                            selected={activeTab === item.value}
                                        >
                                            {item.label}
                                        </MenuItem>
                                    ))}
                                </Menu>
                            </>
                        ) : (
                            navItems.map((item) => (
                                <Button
                                    key={item.value}
                                    onClick={() => handleTabChange(item.value)}
                                    color="inherit"
                                    sx={{
                                        color: activeTab === item.value ? "white" : "#d1d5db",
                                        textTransform: "uppercase",
                                        "&:hover": { color: "white" },
                                    }}
                                >
                                    {item.label}
                                </Button>
                            ))
                        )}
                    </Toolbar>
                </AppBar>

                {activeTab && (
                    <Box sx={{ padding: 2 }}>
                        {activeTab === "collections" && <CollectionsSummary />}
                        {activeTab === "sales" && <SalesSummary />}
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default Page;
