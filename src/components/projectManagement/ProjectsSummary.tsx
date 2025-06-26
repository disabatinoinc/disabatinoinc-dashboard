import { useEffect, useState } from 'react';
import { Typography, CircularProgress, Box, Paper, Skeleton } from '@mui/material';
import Grid from '@mui/material/Grid2';
import Tile from '../shared/Tile';
import ProjectStageVelocityChart from './ProjectStageVelocityChart';
import { api } from "@/utils/apiClient";
import { TileSkeleton } from '../shared/TileSkeleton';

interface StageCount {
    stageName: string;
    projectCount: number;
}

const ProjectsSummaryPage = () => {
    const [data, setData] = useState<StageCount[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await api.get("/salesforce/opportunities/stage-counts");
            const formatted = res.data.data.map((stage: any) => ({
                stageName: stage.stageName,
                projectCount: stage.projectCount
            }));
            setData(formatted);
        } catch (error) {
            console.error("Error fetching stage counts:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <Box p={4}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h4" sx={{ color: 'white' }}>
                    Projects Summary
                </Typography>
            </Box>

            <Grid container spacing={2} marginTop={2} justifyContent="space-between">
                {loading
                    ? Array.from({ length: 4 }).map((_, idx) => (
                        <Grid key={idx}>
                            <TileSkeleton />
                        </Grid>
                    ))
                    : data.map((stage) => (
                        <Grid key={stage.stageName}>
                            <Tile label={stage.stageName} value={stage.projectCount} />
                        </Grid>
                    ))}
            </Grid>
            <Box mt={6}>
                <Paper
                    elevation={3}
                    sx={{
                        p: 3,
                        background: 'linear-gradient(to bottom right, #121929 0%, #0c111c 50%, #000000 100%)',
                        border: '1px solid #374151',
                        borderRadius: '12px'
                    }}
                >
                    <ProjectStageVelocityChart />
                </Paper>
            </Box>
        </Box>
    );
};

export default ProjectsSummaryPage;
