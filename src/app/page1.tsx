"use client"; // Ensures this is a Client Component

import { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";
import api from "@/utils/apiClient";
import { Project } from "@/types/project";

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]); // ✅ Ensure it's an array
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/collections/summary/work-in-progress")
      .then((response) => {
        const data = response.data;
        if (Array.isArray(data)) {
          setProjects(data); // ✅ If it's an array, set state normally
        } else if (data && Array.isArray(data.data)) {
          setProjects(data.data); // ✅ If it's inside an object, extract it
        } else {
          console.error("Unexpected API response:", data);
          setProjects([]); // Prevent map() error
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Projects Dashboard
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : Array.isArray(projects) && projects.length > 0 ? (
        projects.map((project, index) => (
          <Paper key={index} sx={{ p: 2, mb: 2, bgcolor: "#121212" }}>
            <Typography variant="h6">{project.opportunityName}</Typography>
            <Typography>Manager: {project.projectManager}</Typography>
            <Typography>Billed: ${project.totalBilled}</Typography>
            <Typography>Paid: ${project.totalPaid}</Typography>
          </Paper>
        ))
      ) : (
        <Typography>No projects available.</Typography>
      )}
    </Container>
  );
}
