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

    // Hide all menu/nav when on privacy pages (e.g., /privacy or /privacy/anything)
    const HIDE_NAV_PREFIXES = ["/legal", "/quickbooks"]; // add "/eula" etc. if needed
    const hideNav = HIDE_NAV_PREFIXES.some(
        (p) => pathname === p || pathname.startsWith(`${p}/`)
    );

    const [salesAnchorEl, setSalesAnchorEl] = useState<null | HTMLElement>(null);
    const [collectionsAnchorEl, setCollectionsAnchorEl] = useState<null | HTMLElement>(null);
    const [mobileAnchorEl, setMobileAnchorEl] = useState<null | HTMLElement>(null);
    const [projectsAnchorEl, setProjectsAnchorEl] = useState<null | HTMLElement>(null);
    const [crewsAnchorEl, setCrewsAnchorEl] = useState<null | HTMLElement>(null);
    const [scheduleAnchorEl, setScheduleAnchorEl] = useState<null | HTMLElement>(null);


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

    const handleProjectsMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setProjectsAnchorEl(event.currentTarget);
    };
    const handleProjectsMenuClose = () => {
        setProjectsAnchorEl(null);
    };
    const handleCrewsMenuOpen = (e: React.MouseEvent<HTMLButtonElement>) => setCrewsAnchorEl(e.currentTarget);
    const handleCrewsMenuClose = () => setCrewsAnchorEl(null);

    const handleScheduleMenuOpen = (e: React.MouseEvent<HTMLButtonElement>) => setScheduleAnchorEl(e.currentTarget);
    const handleScheduleMenuClose = () => setScheduleAnchorEl(null);

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
                        {!hideNav && (isMobile ? (
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
                                    <MenuItem onClick={() => { setMobileAnchorEl(null); router.push("/sales/details"); }} sx={menuItemStyles}>
                                        Sales Details
                                    </MenuItem>
                                    <MenuItem onClick={() => { setMobileAnchorEl(null); router.push("/sales/snapshots"); }} sx={menuItemStyles}>
                                        Sales Snapshots
                                    </MenuItem>
                                    <MenuItem onClick={() => { setMobileAnchorEl(null); router.push("/schedule/teamup-sync"); }} sx={menuItemStyles}>
                                        Schedule Teamup Sync
                                    </MenuItem>
                                    <MenuItem onClick={() => { setMobileAnchorEl(null); router.push("/schedule/teamup-template"); }} sx={menuItemStyles}>
                                        Schedule Teamup Template
                                    </MenuItem>
                                    <MenuItem onClick={() => { setMobileAnchorEl(null); router.push("/projects/summary"); }} sx={menuItemStyles}>
                                        Projects Summary
                                    </MenuItem>
                                    <MenuItem onClick={() => { setMobileAnchorEl(null); router.push("/projects/stage-details"); }} sx={menuItemStyles}>
                                        Projects Stage Details
                                    </MenuItem>
                                    <MenuItem onClick={() => { setMobileAnchorEl(null); router.push("/projects/velocity-details"); }} sx={menuItemStyles}>
                                        Projects Velocity Details
                                    </MenuItem>
                                    <MenuItem onClick={() => { setMobileAnchorEl(null); router.push("/projects/buildertrend-sync"); }} sx={menuItemStyles}>
                                        Buildertrend Sync
                                    </MenuItem>
                                    <MenuItem onClick={() => { setMobileAnchorEl(null); router.push("/collections/summary"); }} sx={menuItemStyles}>
                                        Collections Summary
                                    </MenuItem>
                                    <MenuItem onClick={() => { setMobileAnchorEl(null); router.push("/collections/details"); }} sx={menuItemStyles}>
                                        Collections Details
                                    </MenuItem>
                                    <MenuItem onClick={() => { setMobileAnchorEl(null); router.push("/collections/3ms"); }} sx={menuItemStyles}>
                                        Collections 3Ms
                                    </MenuItem>
                                    <MenuItem onClick={() => { setMobileAnchorEl(null); router.push("/collections/schedule"); }} sx={menuItemStyles}>
                                        Collections Schedule
                                    </MenuItem>
                                    <MenuItem onClick={() => { setMobileAnchorEl(null); router.push("/collections/snapshots"); }} sx={menuItemStyles}>
                                        Collections Snapshots
                                    </MenuItem>
                                    <MenuItem onClick={() => { setMobileAnchorEl(null); router.push("/crews/daily-logs"); }} sx={menuItemStyles}>
                                        Daily Logs
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
                                        <MenuItem onClick={() => { handleSalesMenuClose(); router.push("/sales/details"); }} sx={menuItemStyles}>
                                            Details
                                        </MenuItem>
                                        <MenuItem onClick={() => { handleSalesMenuClose(); router.push("/sales/snapshots"); }} sx={menuItemStyles}>
                                            Snapshots
                                        </MenuItem>
                                    </Menu>
                                    <Button
                                        color="inherit"
                                        onClick={handleScheduleMenuOpen}
                                        sx={{
                                            textTransform: "uppercase",
                                            color: pathname.startsWith("/schedule") ? "white" : "#d1d5db",
                                            "&:hover": { color: "white" },
                                        }}
                                    >
                                        Schedule
                                    </Button>
                                    <Menu
                                        anchorEl={scheduleAnchorEl}
                                        open={Boolean(scheduleAnchorEl)}
                                        onClose={handleScheduleMenuClose}
                                        sx={menuPaperStyles}
                                    >
                                        <MenuItem onClick={() => { handleScheduleMenuClose(); router.push("/schedule/teamup-sync"); }} sx={menuItemStyles}>
                                            Teamup Sync
                                        </MenuItem>
                                        <MenuItem onClick={() => { handleScheduleMenuClose(); router.push("/schedule/teamup-template"); }} sx={menuItemStyles}>
                                            Teamup Template
                                        </MenuItem>
                                    </Menu>

                                    <Button
                                        color="inherit"
                                        onClick={handleProjectsMenuOpen}
                                        sx={{
                                            textTransform: "uppercase",
                                            color: pathname.startsWith("/projects") ? "white" : "#d1d5db",
                                            "&:hover": { color: "white" },
                                        }}
                                    >
                                        Projects
                                    </Button>
                                    <Menu
                                        anchorEl={projectsAnchorEl}
                                        open={Boolean(projectsAnchorEl)}
                                        onClose={handleProjectsMenuClose}
                                        sx={menuPaperStyles}
                                    >
                                        <MenuItem onClick={() => { handleProjectsMenuClose(); router.push("/projects/summary"); }} sx={menuItemStyles}>
                                            Summary
                                        </MenuItem>
                                        <MenuItem onClick={() => { handleProjectsMenuClose(); router.push("/projects/stage-details"); }} sx={menuItemStyles}>
                                            Stage Details
                                        </MenuItem>
                                        <MenuItem onClick={() => { handleProjectsMenuClose(); router.push("/projects/velocity-details"); }} sx={menuItemStyles}>
                                            Velocity Details
                                        </MenuItem>
                                        <MenuItem onClick={() => { handleProjectsMenuClose(); router.push("/projects/buildertrend-sync"); }} sx={menuItemStyles}>
                                            Buildertrend Sync
                                        </MenuItem>
                                    </Menu>
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
                                        <MenuItem onClick={() => { handleCollectionsMenuClose(); router.push("/collections/3ms"); }} sx={menuItemStyles}>
                                            3Ms
                                        </MenuItem>
                                        <MenuItem onClick={() => { handleCollectionsMenuClose(); router.push("/collections/schedule"); }} sx={menuItemStyles}>
                                            Schedule
                                        </MenuItem>
                                        <MenuItem onClick={() => { handleCollectionsMenuClose(); router.push("/collections/snapshots"); }} sx={menuItemStyles}>
                                            Snapshots
                                        </MenuItem>
                                    </Menu>
                                    <Button
                                        color="inherit"
                                        onClick={handleCrewsMenuOpen}
                                        sx={{
                                            textTransform: "uppercase",
                                            color: pathname.startsWith("/crews") ? "white" : "#d1d5db",
                                            "&:hover": { color: "white" },
                                        }}
                                    >
                                        Crews
                                    </Button>
                                    <Menu
                                        anchorEl={crewsAnchorEl}
                                        open={Boolean(crewsAnchorEl)}
                                        onClose={handleCrewsMenuClose}
                                        sx={menuPaperStyles}
                                    >
                                        <MenuItem onClick={() => { handleCrewsMenuClose(); router.push("/crews/daily-logs"); }} sx={menuItemStyles}>
                                            Daily Logs
                                        </MenuItem>
                                    </Menu>
                                </Box>



                            </>
                        ))}
                    </Toolbar>
                </Box>
            </AppBar>
            <Box sx={{ padding: 2, maxWidth: "1200px", margin: "0 auto" }}>{children}</Box>
        </>
    );
}