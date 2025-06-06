'use client';

import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
    Box, Typography, Paper, TableContainer, Table, TableHead,
    TableRow, TableCell, TableBody, TableSortLabel, CircularProgress,
    Checkbox, Toolbar, Button, Tooltip,
    TextField,
    FormControl,
    InputLabel,
    Select,
    OutlinedInput,
    MenuItem
} from "@mui/material";
import { useSnackbar } from 'notistack';
import TeamupSyncRow, { TeamupScheduleRow } from "./TeamupSyncRow";
import { scheduleApi } from "@/utils/apiClient"; // ✅ your custom Axios instance

const headCells: { id: keyof TeamupScheduleRow; label: string }[] = [
    { id: "scheduleItemName", label: "Schedule Item" },
    { id: "crewName", label: "Crew" },
    { id: "startDateTeamup", label: "Start Date Teamup" },
    { id: "endDateTeamup", label: "End Date Teamup" },
    { id: "syncedDate", label: "Last Synced" },
    { id: "syncStatus", label: "Sync Status" },
    { id: "syncMessage", label: "Sync Message" }
];

type CrewResponse = {
    teamupCalendarId: string | null;
    buildertrendCrewId: string | null;
    crewName: string;
    foremanName: string;
};

function formatDate(date: Date): string {
    return date.toISOString().split("T")[0];
}

export default function TeamupSyncTable() {
    const [order, setOrder] = useState<"asc" | "desc">("asc");
    const [orderBy, setOrderBy] = useState<keyof TeamupScheduleRow>("scheduleItemName");
    const [loading, setLoading] = useState(true);
    const [rows, setRows] = useState<TeamupScheduleRow[]>([]);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [startDate, setStartDate] = useState(() => formatDate(new Date()));
    const { enqueueSnackbar } = useSnackbar();

    const [endDate, setEndDate] = useState(() => {
        const threeMonthsLater = new Date();
        threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);
        return formatDate(threeMonthsLater);
    });
    const [crewList, setCrewList] = useState<CrewResponse[]>([]);
    const [selectedCrewId, setSelectedCrewId] = useState<string>("");

    const fetchSyncStatus = useCallback(async () => {
        try {
            setLoading(true);

            const params: {
                startDate: string;
                endDate: string;
                crewCalendarIds?: string;
            } = {
                startDate,
                endDate,
            };

            if (selectedCrewId) {
                params.crewCalendarIds = selectedCrewId;
            }

            const res = await scheduleApi.get("/teamup/sync-status", { params });
            setRows(res.data);
        } catch (err) {
            console.error("Error fetching Teamup sync data:", err);
        } finally {
            setLoading(false);
        }
    }, [startDate, endDate, selectedCrewId]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedId = localStorage.getItem("selectedCrewId");
            setSelectedCrewId(storedId || "");
        }
    }, []);

    useEffect(() => {
        fetchSyncStatus();
    }, [fetchSyncStatus]);

    useEffect(() => {
        const fetchCrews = async () => {
            try {
                const res = await scheduleApi.get("/teamup/crews");
                const crewData: CrewResponse[] = res.data;

                // Sort and store
                const sorted = crewData.sort((a, b) => a.crewName.localeCompare(b.crewName));
                setCrewList([{ crewName: "All", teamupCalendarId: null, buildertrendCrewId: null, foremanName: "" }, ...sorted]);

                // Don't override if already valid
                setSelectedCrewId((prev) => {
                    const validIds = sorted.map(c => c.teamupCalendarId);
                    return (!prev || !validIds.includes(prev)) ? "" : prev;
                });
            } catch (err) {
                console.error("Error fetching crews:", err);
            }
        };
        fetchCrews();
    }, []);

    const handleRequestSort = (property: keyof TeamupScheduleRow) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    const sortedRows = useMemo(() => {
        return [...rows].sort((a, b) => {
            if (a[orderBy] < b[orderBy]) return order === "asc" ? -1 : 1;
            if (a[orderBy] > b[orderBy]) return order === "asc" ? 1 : -1;
            return 0;
        });
    }, [rows, order, orderBy]);

    const handleSelectRow = (id: string) => {
        setSelectedIds(prev => {
            const updated = new Set(prev);
            if (updated.has(id)) updated.delete(id);
            else updated.add(id);
            return new Set(updated);
        });
    };

    const handleSelectAll = () => {
        if (sortedRows.every(row => selectedIds.has(row.teamupScheduleItemId))) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(sortedRows.map(row => row.teamupScheduleItemId)));
        }
    };

    const handleSync = async () => {
        const selected = Array.from(selectedIds);
        if (selected.length === 0) return;

        try {
            const payload = {
                startDate,
                endDate,
                crews: Array.from(new Set(
                    rows
                        .filter(row => selectedIds.has(row.teamupScheduleItemId))
                        .map(row => row.crewName.toUpperCase())
                )),
                eventIds: selected
            };

            console.log(`Sync payload: ${JSON.stringify(payload)}`);

            const res = await scheduleApi.post("/teamup/sync-to-buildertrend", payload);

            console.log("Sync result:", res.data);
            enqueueSnackbar("Sync completed successfully!", { variant: "success" });

            // Optionally refetch
            await fetchSyncStatus();
            setSelectedIds(new Set());
        } catch (error) {
            console.error("Sync failed:", error);
            enqueueSnackbar("Something went wrong while syncing.", { variant: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            <Typography variant="h4" sx={{ color: "white", mb: 2 }}>
                Teamup Sync
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 2 }}>
                <FormControl size="small" sx={{ minWidth: 200 }}>
                    <InputLabel id="crew-select-label" sx={{ color: "#9ca3af" }}>Crew</InputLabel>
                    <Select
                        labelId="crew-select-label"
                        value={selectedCrewId}
                        onChange={(e) => {
                            const newVal = e.target.value;
                            setSelectedCrewId(newVal);
                            if (typeof window !== 'undefined') {
                                localStorage.setItem("selectedCrewId", newVal);
                            }
                        }}
                        input={<OutlinedInput label="Crew" />}
                        sx={{
                            color: "white",
                            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#374151' },
                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#6b7280' },
                        }}
                    >
                        {crewList.map((crew) => (
                            <MenuItem key={crew.teamupCalendarId ?? "all"} value={crew.teamupCalendarId ?? ""}>
                                {crew.crewName}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
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
                            filter: 'invert(1)', // This inverts the black icon to white
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
                            filter: 'invert(1)', // This inverts the black icon to white
                            cursor: 'pointer'
                        }
                    }}
                />
                <Button
                    onClick={fetchSyncStatus}
                    variant="outlined"
                    size="small"
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

            <Toolbar sx={{ display: "flex", justifyContent: "space-between", mb: 1, px: 0 }}>
                <Typography variant="body2" sx={{ color: "#9ca3af" }}>
                    {selectedIds.size} selected
                </Typography>
                <Box>
                    <Button
                        onClick={() => setSelectedIds(new Set())}
                        disabled={selectedIds.size === 0}
                        variant="outlined"
                        sx={{
                            color: "#d1d5db",
                            borderColor: "#374151",
                            fontSize: "0.75rem",
                            textTransform: "none",
                            mr: 1
                        }}
                    >
                        Clear All
                    </Button>
                    <Button
                        onClick={handleSync}
                        disabled={selectedIds.size === 0}
                        variant="contained"
                        sx={{
                            backgroundColor: "#42de80",
                            textTransform: "none",
                            fontSize: "0.75rem",
                            "&:hover": {
                                backgroundColor: "#3ac06f"
                            },
                            borderColor: "#374151"
                        }}
                    >
                        Sync ({selectedIds.size}) to Buildertrend
                    </Button>
                </Box>
            </Toolbar>

            <TableContainer
                component={Paper}
                sx={{
                    marginTop: 2,
                    padding: "0px 4px 4px 4px",
                    background: "linear-gradient(to bottom right, #121929, #0c111c, #000000)",
                    border: "1px solid #374151",
                    borderRadius: "12px",
                    maxHeight: "800px",
                    overflowY: "auto"
                }}
            >
                <Table stickyHeader sx={{ tableLayout: 'fixed', width: '100%' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox" sx={{
                                position: 'sticky',
                                top: 0,
                                zIndex: 10,
                                backgroundColor: '#121929'
                            }}>
                                <Tooltip title="Select All" arrow>
                                    <Checkbox
                                        checked={
                                            sortedRows.every(row => selectedIds.has(row.teamupScheduleItemId)) &&
                                            sortedRows.length > 0
                                        }
                                        indeterminate={
                                            sortedRows.some(row => selectedIds.has(row.teamupScheduleItemId)) &&
                                            !sortedRows.every(row => selectedIds.has(row.teamupScheduleItemId))
                                        }
                                        onChange={handleSelectAll}
                                        sx={{ color: "#9ca3af" }}
                                        disableRipple
                                    />
                                </Tooltip>
                            </TableCell>
                            {headCells.map((cell) => (
                                <TableCell
                                    key={cell.id}
                                    sx={{
                                        color: "#d1d5db",
                                        position: 'sticky',
                                        top: 0,
                                        zIndex: 10,
                                        backgroundColor: '#121929',
                                        fontSize: "0.75rem",
                                        textTransform: "uppercase",
                                        padding: "6px",
                                        width: "120px",
                                        textOverflow: 'ellipsis'
                                    }}
                                >
                                    <TableSortLabel
                                        active={orderBy === cell.id}
                                        direction={orderBy === cell.id ? order : "asc"}
                                        onClick={() => handleRequestSort(cell.id)}
                                        sx={{
                                            color: "#d1d5db",
                                            '&.Mui-active': { color: "white" },
                                            '& .MuiTableSortLabel-icon': { color: "white !important" },
                                            '&:hover': { color: 'white' },
                                            display: "flex",
                                            flexDirection: { xs: "column", sm: "row" },
                                            alignItems: "center",
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            maxWidth: "100%"
                                        }}
                                    >
                                        {cell.label}
                                    </TableSortLabel>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={headCells.length + 1} align="center">
                                    <CircularProgress color="inherit" />
                                </TableCell>
                            </TableRow>
                        ) : (
                            sortedRows.map((row) => (
                                <TeamupSyncRow
                                    key={row.teamupScheduleItemId}
                                    row={row}
                                    isSelected={selectedIds.has(row.teamupScheduleItemId)}
                                    onSelect={handleSelectRow}
                                />
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
