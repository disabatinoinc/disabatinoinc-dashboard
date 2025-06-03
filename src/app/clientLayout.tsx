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

const menuPaperStyles = {
    mt: 1,
    '& .MuiPaper-root': {
        backgroundColor: '#111827',
        border: '1px solid #374151',
        borderRadius: '8px',
        color: '#ffffff',
        fontFamily: 'inherit',
    }
};

const menuItemStyles = {
    textTransform: 'uppercase',
    fontSize: '0.875rem',
    fontWeight: 500,
    color: '#d1d5db',
    letterSpacing: '0.05em',
    '&:hover': {
        backgroundColor: '#374151',
        color: 'white',
    },
    px: 2,
    py: 1.25
};

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const isMobile = useMediaQuery("(max-width: 600px)", { noSsr: true });

    const [salesAnchorEl, setSalesAnchorEl] = useState<null | HTMLElement>(null);
    const [collectionsAnchorEl, setCollectionsAnchorEl] = useState<null | HTMLElement>(null);
    const [mobileAnchorEl, setMobileAnchorEl] = useState<null | HTMLElement>(null);

    const handleSalesMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setSalesAnchorEl(event.currentTarget);
    };
    const handleSalesMenuClose = () => {
        setSalesAnchorEl(null);
    };

    const handleCollectionsMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setCollectionsAnchorEl(event.currentTarget);
    };
    const handleCollectionsMenuClose = () => {
        setCollectionsAnchorEl(null);
    };

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
                                    sx={menuPaperStyles}
                                >
                                    <MenuItem onClick={() => { setMobileAnchorEl(null); router.push("/sales/summary"); }} sx={menuItemStyles}>
                                        Sales Summary
                                    </MenuItem>
                                    <MenuItem onClick={() => { setMobileAnchorEl(null); router.push("/sales/snapshots"); }} sx={menuItemStyles}>
                                        Sales Snapshots
                                    </MenuItem>
                                    <MenuItem onClick={() => { setMobileAnchorEl(null); router.push("/schedule"); }} sx={menuItemStyles}>
                                        Schedule
                                    </MenuItem>
                                    <MenuItem onClick={() => { setMobileAnchorEl(null); router.push("/projects"); }} sx={menuItemStyles}>
                                        Projects
                                    </MenuItem>
                                    <MenuItem onClick={() => { setMobileAnchorEl(null); router.push("/collections/summary"); }} sx={menuItemStyles}>
                                        Collections Summary
                                    </MenuItem>
                                    <MenuItem onClick={() => { setMobileAnchorEl(null); router.push("/collections/details"); }} sx={menuItemStyles}>
                                        Collections Details
                                    </MenuItem>
                                </Menu>
                            </>
                        ) : (
                            <>
                                <Box>
                                    <Button
                                        color="inherit"
                                        onClick={handleSalesMenuOpen}
                                        sx={{
                                            textTransform: "uppercase",
                                            color: pathname.startsWith("/sales") ? "white" : "#d1d5db",
                                            "&:hover": { color: "white" },
                                        }}
                                    >
                                        Sales
                                    </Button>
                                    <Menu
                                        anchorEl={salesAnchorEl}
                                        open={Boolean(salesAnchorEl)}
                                        onClose={handleSalesMenuClose}
                                        sx={menuPaperStyles}
                                    >
                                        <MenuItem onClick={() => { handleSalesMenuClose(); router.push("/sales/summary"); }} sx={menuItemStyles}>
                                            Summary
                                        </MenuItem>
                                        <MenuItem onClick={() => { handleSalesMenuClose(); router.push("/sales/snapshots"); }} sx={menuItemStyles}>
                                            Snapshots
                                        </MenuItem>
                                    </Menu>
                                    <Button
                                        color="inherit"
                                        href="/schedule"
                                        sx={{
                                            textTransform: "uppercase",
                                            color: pathname.startsWith("/schedule") ? "white" : "#d1d5db",
                                            '&:hover': {
                                                backgroundColor: '#374151',
                                                color: 'white',
                                            }
                                        }}
                                    >
                                        Schedule
                                    </Button>
                                    <Button color="inherit" href="/projects"
                                        sx={{
                                            textTransform: "uppercase",
                                            color: pathname.startsWith("/projects") ? "white" : "#d1d5db",
                                            '&:hover': {
                                                backgroundColor: '#374151',
                                                color: 'white',
                                            }
                                        }}>
                                        Projects
                                    </Button>
                                    <Button
                                        color="inherit"
                                        onClick={handleCollectionsMenuOpen}
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
                                        onClose={handleCollectionsMenuClose}
                                        sx={menuPaperStyles}
                                    >
                                        <MenuItem onClick={() => { handleCollectionsMenuClose(); router.push("/collections/summary"); }} sx={menuItemStyles}>
                                            Summary
                                        </MenuItem>
                                        <MenuItem onClick={() => { handleCollectionsMenuClose(); router.push("/collections/details"); }} sx={menuItemStyles}>
                                            Details
                                        </MenuItem>
                                    </Menu>
                                </Box>



                            </>
                        )}
                    </Toolbar>
                </Box>
            </AppBar>
            <Box sx={{ padding: 2, maxWidth: "1200px", margin: "0 auto" }}>{children}</Box>
        </>
    );
}