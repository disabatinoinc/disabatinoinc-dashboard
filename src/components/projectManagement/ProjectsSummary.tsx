import { useEffect, useState } from 'react';
import { Typography, CircularProgress, Box, Paper } from '@mui/material';
import Grid from '@mui/material/Grid2';
import Tile from '../shared/Tile';
import ProjectStageVelocityChart from './ProjectStageVelocityChart';

interface FinancialProgress {
    stageName: string;
    projectCount: number;
    totalOpportunityAmount: number;
    totalBilled: number;
    totalPaid: number;
    percentBilled: number;
    percentPaid: number;
}

const ProjectsSummaryPage = () => {
    const [data, setData] = useState<FinancialProgress[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const sampleData: FinancialProgress[] = [
            {
                stageName: 'Closed Won - Signed',
                projectCount: 7,
                totalOpportunityAmount: 650000,
                totalBilled: 325000,
                totalPaid: 220000,
                percentBilled: (325000 / 650000) * 100,
                percentPaid: (220000 / 650000) * 100
            },
            {
                stageName: 'Ready to be Scheduled',
                projectCount: 5,
                totalOpportunityAmount: 480000,
                totalBilled: 200000,
                totalPaid: 100000,
                percentBilled: (200000 / 480000) * 100,
                percentPaid: (100000 / 480000) * 100
            },
            {
                stageName: 'Scheduled',
                projectCount: 8,
                totalOpportunityAmount: 720000,
                totalBilled: 500000,
                totalPaid: 400000,
                percentBilled: (500000 / 720000) * 100,
                percentPaid: (400000 / 720000) * 100
            },
            {
                stageName: 'Work in Progress',
                projectCount: 6,
                totalOpportunityAmount: 550000,
                totalBilled: 420000,
                totalPaid: 350000,
                percentBilled: (420000 / 550000) * 100,
                percentPaid: (350000 / 550000) * 100
            },
            {
                stageName: 'Closed Won - Paid',
                projectCount: 4,
                totalOpportunityAmount: 400000,
                totalBilled: 400000,
                totalPaid: 400000,
                percentBilled: 100,
                percentPaid: 100
            }
        ];

        setData(sampleData);
        setLoading(false);
    }, []);

    if (loading) return <CircularProgress />;

    return (
        <Box p={4}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h4" sx={{ color: 'white' }}>
                    Projects Summary
                </Typography>
            </Box>

            <Grid container spacing={2} marginTop={2} justifyContent="space-between">
                {data.map((stage) => (
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