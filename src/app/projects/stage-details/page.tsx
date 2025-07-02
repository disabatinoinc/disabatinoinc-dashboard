"use client";

import ProjectsStageDetails from "@/components/projectManagement/ProjectsStageDetails";
import { Suspense } from "react";

export default function ProjectsDetailsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ProjectsStageDetails />
        </Suspense>
    );
}