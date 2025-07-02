import { useEffect, useState } from "react";
import { Typography, Box } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useRouter } from "next/navigation";
import Tile from "../shared/Tile";
import { TileSkeleton } from "../shared/TileSkeleton";
import ProjectStageVelocityChart from "./ProjectStageVelocityChart";
import { api } from "@/utils/apiClient";

interface StageCount {
    stageName: string;
    projectCount: number;
}

const PARAM_MAP: Record<string, string> = {
    "Closed Won - Signed": "closed-won-signed",
    "Ready to be Scheduled": "ready-to-be-scheduled",
    Scheduled: "scheduled",
    "Work in Progress": "work-in-progress",
    "Closed Won-Paid": "closed-won-paid",
};

const ProjectsSummary = () => {
    const router = useRouter();
    const [data, setData] = useState<StageCount[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await api.get("/salesforce/opportunities/stage-counts");
            const formatted = res.data.data.map((s: StageCount) => ({
                stageName: s.stageName,
                projectCount: s.projectCount,
            }));
            setData(formatted);
        } catch (err) {
            console.error("Error fetching stage counts:", err);
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
                <Typography variant="h4" sx={{ color: "white" }}>
                    Projects Summary
                </Typography>
            </Box>

            {/* tiles */}
            <Grid container spacing={2} mt={2} justifyContent="space-between">
                {loading
                    ? Array.from({ length: 4 }).map((_, idx) => (
                        <Grid key={idx}>
                            <TileSkeleton />
                        </Grid>
                    ))
                    : data.map((stage) => (
                        <Grid key={stage.stageName}>
                            <Tile
                                label={stage.stageName}
                                value={stage.projectCount}
                                onClick={() => {
                                    const param = PARAM_MAP[stage.stageName] || "all";
                                    router.push(`/projects/stage-details?stage=${param}`);
                                }}
                            />
                        </Grid>
                    ))}
            </Grid>

            {/* velocity chart */}
            <Box mt={6}>
                <ProjectStageVelocityChart />
            </Box>
        </Box>
    );
};

export default ProjectsSummary;
