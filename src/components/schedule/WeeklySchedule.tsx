'use client';

import React, { useCallback, useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Box, Typography, Paper, SxProps, Theme, Tooltip, Button } from '@mui/material';
import Fullscreen from '@mui/icons-material/Fullscreen';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { usePathname } from 'next/navigation';
import WeeklyScheduleSkeleton from './WeeklyScheduleSkeleton';
import html2canvas from 'html2canvas';

type DayKey = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
type Job = {
  text: string;
  date: string;
  pm?: string;
  sp?: string;
  projectNumber?: string;
  projectGoals?: string[];
  stageName?: string;
};
type Crew = {
  name: string;
  color: string;
  members?: string[];
  compact?: boolean;
  jobs: Job[];
};

/* =========================
   THEME & STYLE CONSTANTS
   ========================= */
const COLORS = {
  pageBg: '#030712',
  headerBg: '#111827',
  headerDarker: '#0b0f1a',
  border: '#374151',
  text: '#FFFFFF',
  textMuted: '#9CA3AF',
  textFaint: '#4B5563',
  memberText: '#e5e7eb',
  outOfOffice: '#fbbf24',
};

const SIZES = {
  gridLeftColXs: 1.8,
  cellMinHeight: 110,
  compactRowHeight: 48,
  padding: 1,
  crewLabelPadding: 2,
};

// Move this outside the `styles` object
const getCrewLabelStyles = (bg: string): SxProps<Theme> => ({
  border: `1px solid ${COLORS.border}`,
  backgroundColor: bg,
  p: SIZES.crewLabelPadding,
  height: '100%',
});

const getCrewLabelCompactStyles = (bg: string): SxProps<Theme> => {
  console.log("Compact Label BG Color:", bg);
  return {
    border: `1px solid ${COLORS.border}`,
    backgroundColor: bg,
    p: SIZES.crewLabelPadding,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: SIZES.compactRowHeight,
  };
};

const getCellPaperStyles = (isCompact?: boolean): SxProps<Theme> => ({
  backgroundColor: COLORS.headerBg,
  border: `1px solid ${COLORS.border}`,
  p: SIZES.padding,
  color: COLORS.text,
  height: '100%',
  minHeight: isCompact ? SIZES.compactRowHeight : SIZES.cellMinHeight,
});

const styles: Record<string, SxProps<Theme>> = {
  page: { backgroundColor: COLORS.pageBg, color: COLORS.text, minHeight: '100vh', p: 3 },
  headerTitle: { mb: 3 },
  headerCell: {
    textAlign: 'center',
    border: `1px solid ${COLORS.border}`,
    backgroundColor: COLORS.headerDarker,
    p: 1,
  },
  crewName: { fontWeight: 'bold' },
  crewMember: { color: COLORS.memberText, mt: 0.5 },
  jobTitle: { fontWeight: 'bold' },
  jobPm: { color: COLORS.textMuted },
  dash: { color: COLORS.textFaint },
};

const getToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // optional: normalize to start of day
  return today;
};

const getNextWeek = () => {
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 6);
  nextWeek.setHours(0, 0, 0, 0); // optional: normalize to start of day
  return nextWeek;
};

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

/* =========================
   COMPONENT
   ========================= */
export default function WeeklySchedule() {
  const [crews, setCrews] = useState<Crew[]>([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(() => formatDate(getToday()));
  const [endDate, setEndDate] = useState(() => formatDate(getNextWeek()));
  const [isFullscreen, setIsFullscreen] = useState(false);
  const pathname = usePathname();
  const scheduleRef = useRef<HTMLDivElement>(null);
  const lastRefreshDayRef = useRef(formatDate(getToday()));

  const handleCapture = async () => {
    if (!scheduleRef.current) return;

    const canvas = await html2canvas(scheduleRef.current, {
      backgroundColor: "#030712", // Match dark background
      scale: 2, // Higher quality
    });

    const link = document.createElement("a");
    link.download = `schedule-${new Date().toISOString()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  useEffect(() => {
    setIsFullscreen(pathname?.includes('fullscreen'));
  }, [pathname]);

  const daysFull = React.useMemo(() => {
    const start = dayjs(startDate);
    const days: string[] = [];

    for (let i = 0; i <= 6; i++) {
      const day = start.add(i, 'day');
      if (day.day() === 0) continue; // Skip Sunday

      const dayName = day.format('dddd');
      const dateLabel = day.format('MM/DD/YYYY');
      days.push(`${dayName} ${dateLabel}`);
    }

    return days;
  }, [startDate]);

  const dayKeyFromLabel = (label: string): DayKey => label.split(' ')[0] as DayKey;

  const fetchWeeklySchedule = useCallback(async () => {
    try {
      setLoading(true);

      const params: { startDate: string; endDate: string; } = {
        startDate,
        endDate,
      };

      const res = await axios.get('https://schedule-api.disabatinoinc.io/teamup/weekly', {
        params,
      });

      setCrews(res.data.crews || []);
    } catch (err) {
      console.error('Error fetching weekly schedule:', err);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchWeeklySchedule();
  }, [fetchWeeklySchedule]);

  // Auto-refresh data every 10 minutes (300,000 ms)
  useEffect(() => {
    const interval = setInterval(() => {
      const currentDay = formatDate(getToday());

      // 🔍 Check if we've crossed over to a new day
      if (currentDay !== lastRefreshDayRef.current) {
        console.log("📅 New day detected — updating start and end dates");
        lastRefreshDayRef.current = currentDay;

        const newStart = formatDate(getToday());
        const newEnd = formatDate(getNextWeek());
        setStartDate(newStart);
        setEndDate(newEnd);

        // Automatically fetch the new week
        fetchWeeklySchedule();
      } else {
        console.log("🔄 Regular auto-refresh (same day)");
        fetchWeeklySchedule();
      }
    }, 600000); // 10 minutes

    return () => clearInterval(interval);
  }, [fetchWeeklySchedule]);

  return (
    <Box sx={styles.page}>
      <Typography variant="h4" sx={styles.headerTitle}>
        Weekly Schedule
      </Typography>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: 2,
          marginBottom: 2,
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Week Start"
            value={dayjs(startDate)}
            onChange={(newValue: Dayjs | null) => {
              if (!newValue) return;

              if (newValue) {
                setStartDate(newValue.format('YYYY-MM-DD'));
                setEndDate(newValue.add(6, 'day').format('YYYY-MM-DD'));
              }
            }}
            slotProps={{
              textField: {
                size: 'small',
                InputLabelProps: { shrink: true },
                sx: {
                  input: { color: 'white' },
                  label: { color: '#9ca3af' },
                  '& fieldset': { borderColor: '#374151' },
                  '& input::-webkit-calendar-picker-indicator': {
                    filter: 'invert(1)',
                  },
                },
              },
              openPickerButton: {
                sx: {
                  color: '#9ca3af',
                  '&:hover': { color: 'white' },
                  '& .MuiSvgIcon-root': { color: 'white' },
                },
              },
            }}
          />
        </LocalizationProvider>

        <Tooltip title="Refresh schedule data">
          <Button
            variant="outlined"
            size="small"
            onClick={fetchWeeklySchedule}
            sx={{
              color: '#9ca3af',
              borderColor: '#374151',
              textTransform: 'none',
              '&:hover': {
                borderColor: 'white',
                backgroundColor: 'rgba(56, 189, 248, 0.08)',
              },
            }}
          >
            Refresh
          </Button>
        </Tooltip>
        <Tooltip title="Download screenshot">
          <Button
            variant="outlined"
            size="small"
            onClick={handleCapture}
            sx={{
              color: '#9ca3af',
              borderColor: '#374151',
              textTransform: 'none',
              '&:hover': {
                borderColor: 'white',
                backgroundColor: 'rgba(56, 189, 248, 0.08)',
              },
            }}
          >
            Screenshot
          </Button>
        </Tooltip>

        {!isFullscreen && (
          <Tooltip title="Open fullscreen view">
            <Button
              variant="outlined"
              size="small"
              startIcon={<Fullscreen />}
              onClick={() => {
                const url = `/fullscreen/weekly-schedule?startDate=${startDate}&endDate=${endDate}`;
                window.open(url, '_blank', 'noopener,noreferrer');
              }}
              sx={{
                color: '#ffffff',
                borderColor: '#374151',
                textTransform: 'none',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(251, 191, 36, 0.08)',
                },
              }}
            >
              Fullscreen
            </Button>
          </Tooltip>
        )}
      </Box>
      {loading ? <WeeklyScheduleSkeleton /> : <>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center', // ⬅️ This centers children horizontally
            backgroundColor: '#030712',
            color: '#FFFFFF',
            minHeight: '100vh',
            px: 3, // Optional side padding
          }}
        >
          <Box
            sx={{
              overflowX: 'visible', // ⬅️ Allows horizontal scroll if needed
            }}
          >
            <div ref={scheduleRef}>
              <Box
                sx={{
                  display: 'flex',
                  mb: 1,
                  overflowX: 'visible',
                  position: 'sticky',
                  top: 0,
                  zIndex: 10,
                  backgroundColor: '#030712',
                }}
              >
                <Box sx={{ width: '180px', flexShrink: 0 }}>
                  <Box sx={{ ...styles.headerCell, backgroundColor: '#030712', border: 'none' }} />
                </Box>
                {daysFull.map((d) => {
                  const [day, date] = d.split(' ');
                  const isSaturday = day === 'Saturday';
                  return (
                    <Box
                      key={d}
                      sx={{
                        flex: '0 0 180px',
                        borderRight: isSaturday ? '4px solid #fbbf24' : undefined, // ✅ Moved here
                      }}
                    >
                      <Box
                        sx={{
                          ...styles.headerCell,
                          backgroundColor: '#0f172a',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          border: `1px solid ${COLORS.border}`,
                        }}
                      >
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                          {day}
                        </Typography>
                        <Typography variant="body2" sx={{ color: COLORS.textMuted, textAlign: 'center' }}>
                          {date}
                        </Typography>
                      </Box>
                    </Box>
                  );
                })}
              </Box>

              {crews.filter((crew) => crew.name !== 'Unknown').map((crew) => (
                <Box key={crew.name} sx={{ display: 'flex', alignItems: 'stretch', width: '100%' }}>
                  <Box sx={{ width: '180px', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
                    <Box
                      sx={
                        crew.compact
                          ? getCrewLabelCompactStyles(crew.color)
                          : getCrewLabelStyles(crew.color)
                      }
                    >
                      <Typography variant={crew.compact ? 'subtitle1' : 'h6'} sx={styles.crewName}>
                        {crew.name}
                      </Typography>
                      {!crew.compact &&
                        crew.members?.map((m, i) => (
                          <Typography key={i} variant="body2" sx={styles.crewMember}>
                            {m}
                          </Typography>
                        ))}
                    </Box>
                  </Box>

                  {daysFull.map((label) => {
                    const key = dayKeyFromLabel(label);
                    const [dayName] = label.split(' ');
                    const isSaturday = dayName === 'Saturday';
                    const jobs = crew.jobs.filter((job) => {
                      const jobDay = dayjs(job.date).format('dddd');
                      return jobDay === key;
                    });

                    return (
                      <Box key={`${crew.name}-${label}`} sx={{
                        width: '180px', flexShrink: 0,
                        borderRight: isSaturday ? '4px solid #fbbf24' : undefined, // ✨ Gold border on Saturday
                      }}>
                        <Paper
                          elevation={0}
                          sx={{
                            ...getCellPaperStyles(crew.compact),
                            flexGrow: 1,
                            height: '100%',
                          }}
                        >
                          {jobs.length === 0 ? (
                            <Typography variant="caption" sx={styles.dash}>
                              —
                            </Typography>
                          ) : (
                            jobs.map((job, idx) => (
                              <Box key={idx} sx={{ mb: idx < jobs.length - 1 ? 1 : 0 }}>
                                <Typography variant="body2" sx={styles.jobTitle}>
                                  {job.text}
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                  {!!job.pm && (
                                    <Typography variant="caption" sx={styles.jobPm}>
                                      PM: {job.pm}
                                    </Typography>
                                  )}
                                  {!!job.sp && (
                                    <Typography variant="caption" sx={{ ...styles.jobPm, mt: 0.25 }}>
                                      SP: {job.sp}
                                    </Typography>
                                  )}
                                </Box>
                              </Box>
                            ))
                          )}
                        </Paper>
                      </Box>
                    );
                  })}
                </Box>
              ))}
            </div>
          </Box>
        </Box>
      </>
      }
    </Box>
  );
}
