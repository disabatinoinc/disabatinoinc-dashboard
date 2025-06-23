import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import { Typography, Box } from '@mui/material';

const sampleData = [
    {
        stage: 'Closed Won - Signed',
        entered: 7,
        stayed: 5,
        exited: -2,
    },
    {
        stage: 'Ready to be Scheduled',
        entered: 2,
        stayed: 3,
        exited: -3,
    },
    {
        stage: 'Scheduled',
        entered: 3,
        stayed: 3,
        exited: -2,
    },
    {
        stage: 'Work in Progress',
        entered: 2,
        stayed: 4,
        exited: -5,
    },
    {
        stage: 'Closed Won - Paid',
        entered: 5,
        stayed: 0,
        exited: 0,
    },
];

const COLORS = {
    entered: '#10b981', // green
    stayed: '#1e3a8a',  // navy
    exited: '#ef4444',  // red
};

const ProjectStageVelocityChart = () => {
    return (
        <Box>
            <Typography variant="h6" sx={{ mb: 2, color: 'white' }}>
                Project Velocity Through Stages
            </Typography>
            <ResponsiveContainer width="100%" height={320}>
                <BarChart data={sampleData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis
                        dataKey="stage"
                        tick={{ fill: 'white', fontSize: 12 }}
                        interval={0}
                        textAnchor="end"
                    />
                    <YAxis tick={{ fill: 'white' }} />
                    <Tooltip
                        formatter={(value: number, name: string) => [`${Math.abs(value)} project(s)`, name]}
                        contentStyle={{
                            backgroundColor: '#1e293b',
                            borderColor: '#334155',
                            color: 'white',
                        }}
                    />
                    <Legend />
                    <Bar dataKey="stayed" stackId="a" fill={COLORS.stayed} name="Stayed" />
                    <Bar dataKey="entered" stackId="a" fill={COLORS.entered} name="Entered" />
                    <Bar dataKey="exited" stackId="b" fill={COLORS.exited} name="Exited" />
                </BarChart>
            </ResponsiveContainer>
        </Box>
    );
};

export default ProjectStageVelocityChart;
