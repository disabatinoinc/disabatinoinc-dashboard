"use client";

import { useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Typography, Box, TableSortLabel, Button, TextField,
    FormControl, InputLabel, Select, MenuItem
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import { api } from "@/utils/apiClient";
import { exportToCSV } from "@/utils/exportCSV";
import { format } from 'date-fns';
import { DailyLogsDetailsSkeleton } from "./DailyLogsDetailsSkeleton";

interface DailyLogDetail {
    addedBy: string;
    jobsiteName: string;
    logDate: string;
    dailyLogUrl: string;
}

type RawCrewSummary = {
    addedBy: string;
    dailyLogs: Array<{
        jobsiteName: string;
        logDate: string;
        dailyLogUrl: string;
    }>;
};

interface CrewOption {
    userId: number;
    crewName: string;
}

const baseCellSx = {
    color: '#d1d5db',
    padding: '4px',
    fontSize: '1rem',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    textAlign: 'center' as const,
    borderBottom: '1px solid #374151',
};
const headerCellSx = {
    ...baseCellSx,
    backgroundColor: '#121929',
    borderBottom: '1px solid rgb(224, 224, 224)',
};

const DailyLogsDetails: React.FC = () => {
    const searchParams = useSearchParams();

    // initial URL params
    const getDateParam = (key: string): string | null => {
        const param = searchParams.get(key);
        return param && !isNaN(Date.parse(param)) ? param : null;
    };
    const initialUserId = searchParams.get('userId') || '';

    // state
    const [data, setData] = useState<DailyLogDetail[]>([]);
    const [loading, setLoading] = useState(true);
    const [orderBy, setOrderBy] = useState<keyof DailyLogDetail>('logDate');
    const [order, setOrder] = useState<'asc' | 'desc'>('desc');

    const today = new Date();
    const defaultStart = new Date(today);
    defaultStart.setDate(today.getDate() - 6);
    defaultStart.setHours(0, 0, 0, 0);
    const defaultEnd = new Date(today);
    defaultEnd.setHours(23, 59, 59, 999);

    const [fromDate, setFromDate] = useState<string>(
        getDateParam('startDate') || format(defaultStart, 'yyyy-MM-dd')
    );
    const [toDate, setToDate] = useState<string>(
        getDateParam('endDate') || format(defaultEnd, 'yyyy-MM-dd')
    );

    // for the crew dropdown
    const [crewOptions, setCrewOptions] = useState<CrewOption[]>([]);
    const [selectedUser, setSelectedUser] = useState<string>(initialUserId);

    // fetch crew list once
    useEffect(() => {
        api.get<{ data: CrewOption[] }>('/buildertrend/crews', {
            params: { pageNumber: 1, pageSize: 50 }
        })
            .then(res => setCrewOptions(res.data.data))
            .catch(err => console.error('Error loading crews:', err));
    }, []);

    // fetch the details table
    const fetchData = useCallback(() => {
        setLoading(true);
        const params: Record<string, string | number> = {
            startDate: fromDate,
            endDate: toDate,
            pageNumber: 1,
            pageSize: 100,
        };
        if (selectedUser) {
            params.userIds = selectedUser;
        }
        api.get<{ data: RawCrewSummary[] }>(
            '/buildertrend/daily-logs/user-summary',
            { params }
        )
            .then(res => {
                const flat: DailyLogDetail[] = res.data.data.flatMap(c =>
                    c.dailyLogs.map(log => ({
                        addedBy: c.addedBy,
                        jobsiteName: log.jobsiteName,
                        logDate: log.logDate,
                        dailyLogUrl: log.dailyLogUrl,
                    }))
                );
                setData(flat);
            })
            .catch(error => console.error('Error fetching daily logs details', error))
            .finally(() => setLoading(false));
    }, [fromDate, toDate, selectedUser]);

    // auto-refetch when dates or selectedUser change
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleRequestSort = (property: keyof DailyLogDetail) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const sortedData = [...data].sort((a, b) => {
        const aVal = a[orderBy];
        const bVal = b[orderBy];
        if (aVal === bVal) return 0;
        if (aVal == null) return 1;
        if (bVal == null) return -1;
        return order === 'asc'
            ? (aVal < bVal ? -1 : 1)
            : (aVal > bVal ? -1 : 1);
    });

    // crew dropdown change handler
    const handleCrewChange = (e: SelectChangeEvent<string>) => {
        const val = e.target.value;
        setSelectedUser(val);
        const qs = new URLSearchParams(window.location.search);
        if (val) qs.set('userId', val);
        else qs.delete('userId');
        window.history.replaceState(null, '', `?${qs.toString()}`);
    };

    return (
        <Box>
            <Typography variant="h4" sx={{ color: 'white', mb: 2 }}>
                Daily Logs Details
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, mb: 2, justifyContent: 'flex-end' }}>
                <TextField
                    type="date"
                    label="Start Date"
                    size="small"
                    value={fromDate}
                    onChange={e => setFromDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    sx={{
                        input: { color: "white" },
                        label: { color: "#9ca3af" },
                        '&:hover': { backgroundColor: "#1f2937" },
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: '#374151' },
                            '&:hover fieldset': { borderColor: '#ffffff' },
                        },
                        '& input::-webkit-calendar-picker-indicator': {
                            filter: 'invert(1)', cursor: 'pointer'
                        },
                    }}
                />

                <TextField
                    type="date"
                    label="End Date"
                    size="small"
                    value={toDate}
                    onChange={e => setToDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    sx={{
                        input: { color: "white" },
                        label: { color: "#9ca3af" },
                        '&:hover': { backgroundColor: "#1f2937" },
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: '#374151' },
                            '&:hover fieldset': { borderColor: '#ffffff' },
                        },
                        '& input::-webkit-calendar-picker-indicator': {
                            filter: 'invert(1)', cursor: 'pointer'
                        },
                    }}
                />

                <FormControl
                    size="small"
                    variant="outlined"
                    sx={{
                        minWidth: 160,
                        "& .MuiOutlinedInput-root": {
                            "& fieldset": { borderColor: "#374151" },
                            "&:hover fieldset": { borderColor: "#ffffff" },
                        },
                    }}
                >
                    <InputLabel
                        shrink
                        sx={{
                            color: "#9ca3af",
                            "&.Mui-focused": { color: "#ffffff" },
                        }}
                    >
                        Crew
                    </InputLabel>
                    <Select
                        displayEmpty
                        value={selectedUser}
                        onChange={handleCrewChange}
                        label="Crew"
                        renderValue={(val) => val
                            ? (crewOptions.find(c => c.userId.toString() === val)?.crewName || val)
                            : "All"
                        }
                        sx={{
                            color: "white",
                            "& .MuiSelect-icon": { color: "white" },
                        }}
                    >
                        <MenuItem value="">All</MenuItem>
                        {crewOptions.map(opt => (
                            <MenuItem key={opt.userId} value={opt.userId.toString()}>
                                {opt.crewName}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Button
                    variant="outlined"
                    size="small"
                    onClick={fetchData}
                    sx={{
                        color: '#d1d5db',
                        borderColor: '#374151',
                        textTransform: 'none'
                    }}
                >
                    Refresh
                </Button>

                <Button
                    variant="outlined"
                    size="small"
                    onClick={() => exportToCSV('daily-logs-details', data as unknown as Record<string, unknown>[], [
                        { label: 'Crew', key: 'addedBy' },
                        { label: 'Jobsite', key: 'jobsiteName' },
                        { label: 'Date', key: 'logDate' },
                        { label: 'URL', key: 'dailyLogUrl' },
                    ])}
                    sx={{
                        color: '#d1d5db',
                        borderColor: '#374151',
                        textTransform: 'none'
                    }}
                >
                    Export CSV
                </Button>
            </Box>

            <TableContainer component={Paper}
                sx={{
                    background: 'linear-gradient(to bottom right,#121929 0%,#0c111c 50%,#000000 100%)',
                    border: '1px solid #374151',
                    borderRadius: 2
                }}
            >
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            {(['Crew', 'Jobsite', 'Date', 'URL'] as const).map(label => (
                                <TableCell
                                    key={label}
                                    sx={headerCellSx}
                                    sortDirection={orderBy === label.toLowerCase() ? order : false}
                                >
                                    <TableSortLabel
                                        active={orderBy === label.toLowerCase()}
                                        direction={orderBy === label.toLowerCase() ? order : 'asc'}
                                        onClick={() => handleRequestSort(label.toLowerCase() as keyof DailyLogDetail)}
                                        sx={{
                                            color: '#d1d5db',
                                            '&.Mui-active': { color: 'white' },
                                            '& .MuiTableSortLabel-icon': { color: 'white!important' }
                                        }}
                                    >
                                        {label}
                                    </TableSortLabel>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading
                            ? <DailyLogsDetailsSkeleton />
                            : sortedData.map((row, idx) => (
                                <TableRow key={idx}>
                                    <TableCell sx={baseCellSx}>{row.addedBy}</TableCell>
                                    <TableCell sx={baseCellSx}>{row.jobsiteName}</TableCell>
                                    <TableCell sx={baseCellSx}>{row.logDate.split('T')[0]}</TableCell>
                                    <TableCell sx={baseCellSx}>
                                        <a
                                            href={row.dailyLogUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{ color: "#3b82f6", textDecoration: 'underline' }}
                                        >
                                            View
                                        </a>
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default DailyLogsDetails;
