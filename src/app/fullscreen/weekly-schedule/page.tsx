// /app/schedule/fullscreen/page.tsx (Next.js) or your fullscreen route
'use client';
import { useEffect, useState } from 'react';
import WeeklySchedule from "@/components/schedule/WeeklySchedule";
import { Button, Box } from '@mui/material';

export default function FullscreenView() {
  const [isFs, setIsFs] = useState(false);

  useEffect(() => {
    const onChange = () => setIsFs(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  const enterFs = async () => {
    try {
      const options: FullscreenOptions = { navigationUI: 'hide' };
      await document.documentElement.requestFullscreen(options);
    } catch (e) {
      console.error('Fullscreen failed', e);
    }
  };
  const exitFs = async () => {
    try { await document.exitFullscreen(); } catch { }
  };

  return (
    <Box sx={{ position: "relative", minHeight: "100vh", bgcolor: "#030712" }}>
      {/* Floating fullscreen toggle button */}
      <Box
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 1000,
        }}
      >
        {!isFs ? (
          <Button
            variant="contained"
            onClick={enterFs}
            sx={{
              backgroundColor: "#111827",
              border: "1px solid #374151",
              color: "#374151",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#1f2937",
                borderColor: "white",
              },
            }}
          >
            Enter Fullscreen
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={exitFs}
            sx={{
              backgroundColor: "#111827",
              border: "1px solid #374151",
              color: "#374151",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#1f2937",
                borderColor: "white",
              },
            }}
          >
            Exit Fullscreen (Esc)
          </Button>
        )}
      </Box>

      {/* Main content */}
      <WeeklySchedule />
    </Box>
  );
}