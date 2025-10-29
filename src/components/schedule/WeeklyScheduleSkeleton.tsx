'use client';

import React from 'react';
import { Box, Skeleton } from '@mui/material';

const CREW_COUNT = 6;
const DAY_COUNT = 5;

export default function WeeklyScheduleSkeleton() {
  return (
    <Box sx={{ px: 3, py: 2 }}>
      {/* Header Row Skeleton */}
      <Box sx={{ display: 'flex', mb: 1 }}>
        {/* Crew Label Header */}
        <Box sx={{ width: '180px', flexShrink: 0 }}>
          <Skeleton variant="rectangular" width={180} height={50} sx={{ bgcolor: '#1f2937' }} />
        </Box>

        {/* Day Headers */}
        {Array.from({ length: DAY_COUNT }).map((_, idx) => (
          <Box key={idx} sx={{ width: '180px', flexShrink: 0, ml: 0.5 }}>
            <Skeleton variant="rectangular" width={180} height={50} sx={{ bgcolor: '#1f2937' }} />
          </Box>
        ))}
      </Box>

      {/* Crew Rows */}
      {Array.from({ length: CREW_COUNT }).map((_, crewIdx) => (
        <Box
          key={crewIdx}
          sx={{
            display: 'flex',
            alignItems: 'stretch',
            mb: 1,
          }}
        >
          {/* Crew Label Column */}
          <Box
            sx={{
              width: '180px',
              flexShrink: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              p: 2,
              bgcolor: '#111827',
              border: '1px solid #374151',
            }}
          >
            <Skeleton variant="text" width={80} height={28} sx={{ bgcolor: '#1f2937' }} />
            <Skeleton variant="text" width={100} height={18} sx={{ bgcolor: '#1f2937' }} />
            <Skeleton variant="text" width={90} height={18} sx={{ bgcolor: '#1f2937' }} />
          </Box>

          {/* Day Cells */}
          {Array.from({ length: DAY_COUNT }).map((_, dayIdx) => (
            <Box
              key={dayIdx}
              sx={{
                width: '160px',
                flexShrink: 0,
                border: '1px solid #374151',
                backgroundColor: '#111827',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                p: 2,
              }}
            >
              <Skeleton variant="rectangular" width="100%" height={60} sx={{ bgcolor: '#1f2937' }} />
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  );
}
