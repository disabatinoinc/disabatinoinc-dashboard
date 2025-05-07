"use client";

import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Menu,
    MenuItem,
    Box,
    IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import useMediaQuery from "@mui/material/useMediaQuery";
import Link from "next/link";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const isMobile = useMediaQuery("(max-width: 600px)");

    const [collectionsAnchorEl, setCollectionsAnchorEl] = useState<null | HTMLElement>(null);
    const [mobileAnchorEl, setMobileAnchorEl] = useState<null | HTMLElement>(null);

    const navItems = [
        { label: "Sales", href: "/sales" },
        { label: "Project Management", href: "/project-management" },
    ];

    return (
        <>
            <AppBar
                position="static"
                sx={{ backgroundColor: "#030712", boxShadow: "none" }}
            >
                <Box sx={{ maxWidth: "1200px", margin: "0 auto", width: "100%" }}>
                    <Toolbar disableGutters sx={{ paddingX: 0, borderBottom: "2px solid #1f2937" }}>
                        <Typography variant="h6" sx={{ flexGrow: 1, textTransform: "uppercase" }}>
                            disabatinoinc dashboard
                        </Typography>

                        {isMobile ? (
                            <>
                                <IconButton
                                    color="inherit"
                                    onClick={(e) => setMobileAnchorEl(e.currentTarget)}
                                >
                                    <MenuIcon />
                                </IconButton>
                                <Menu
                                    anchorEl={mobileAnchorEl}
                                    open={Boolean(mobileAnchorEl)}
                                    onClose={() => setMobileAnchorEl(null)}
                                >
                                    <MenuItem onClick={() => router.push("/collections/summary")}>
                                        Collections Summary
                                    </MenuItem>
                                    <MenuItem onClick={() => router.push("/collections/details")}>
                                        Collections Details
                                    </MenuItem>
                                    {navItems.map((item) => (
                                        <MenuItem key={item.href} onClick={() => router.push(item.href)}>
                                            {item.label}
                                        </MenuItem>
                                    ))}
                                </Menu>
                            </>
                        ) : (
                            <>
                                <Box>
                                    <Button
                                        color="inherit"
                                        onClick={(e) => setCollectionsAnchorEl(e.currentTarget)}
                                        sx={{
                                            textTransform: "uppercase",
                                            color: pathname.startsWith("/collections") ? "white" : "#d1d5db",
                                            "&:hover": { color: "white" },
                                        }}
                                    >
                                        Collections
                                    </Button>
                                    <Menu
                                        anchorEl={collectionsAnchorEl}
                                        open={Boolean(collectionsAnchorEl)}
                                        onClose={() => setCollectionsAnchorEl(null)}
                                        sx={{
                                            mt: 1,
                                            '& .MuiPaper-root': {
                                                backgroundColor: '#111827',         // same as dark table background
                                                border: '1px solid #374151',        // match table border
                                                borderRadius: '8px',                // consistent rounding
                                                color: '#ffffff',
                                                fontFamily: 'inherit',
                                            }
                                        }}
                                    >
                                        <MenuItem onClick={() => router.push("/collections/summary")}
                                            sx={{
                                                textTransform: 'uppercase',
                                                fontSize: '0.875rem',                 // ~14px
                                                fontWeight: 500,
                                                color: '#d1d5db',
                                                letterSpacing: '0.05em',
                                                '&:hover': {
                                                    backgroundColor: '#374151',         // dark hover like table rows
                                                    color: 'white',                   // green hover like paid values
                                                },
                                                px: 2,
                                                py: 1.25
                                            }}
                                        >
                                            Summary
                                        </MenuItem>
                                        <MenuItem onClick={() => router.push("/collections/details")}
                                            sx={{
                                                textTransform: 'uppercase',
                                                fontSize: '0.875rem',                 // ~14px
                                                fontWeight: 500,
                                                color: '#d1d5db',
                                                letterSpacing: '0.05em',
                                                '&:hover': {
                                                    backgroundColor: '#374151',         // dark hover like table rows
                                                    color: 'white',                   // green hover like paid values
                                                },
                                                px: 2,
                                                py: 1.25
                                            }}
                                        >
                                            Details
                                        </MenuItem>
                                    </Menu>
                                </Box>
                                {navItems.map((item) => (
                                    <Link key={item.href} href={item.href} passHref>
                                        <Button
                                            color="inherit"
                                            sx={{
                                                textTransform: "uppercase",
                                                color: pathname === item.href ? "white" : "#d1d5db",
                                                "&:hover": { color: "white" },
                                            }}
                                        >
                                            {item.label}
                                        </Button>
                                    </Link>
                                ))}
                            </>
                        )}
                    </Toolbar>
                </Box>
            </AppBar>

            <Box sx={{ padding: 2, maxWidth: "1200px", margin: "0 auto" }}>{children}</Box>
        </>
    );
}
