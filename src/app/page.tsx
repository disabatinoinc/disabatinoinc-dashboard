import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import CollectionsSummary from "@/components/CollectionsSummary";

const navItems = [
    { label: "Collections", href: "#" }
];

const Page = () => {
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
                            <Button key={item.label} color="inherit" href={item.href} sx={{ color: "#d1d5db", '&:hover': { color: 'white' } }}>
                                {item.label}
                            </Button>
                        ))}
                    </Toolbar>
                </AppBar>
                <Box sx={{ padding: 2 }}>
                    <CollectionsSummary />
                </Box>
            </Box>
        </Box>
    );
};

export default Page;
