"use client";

import ProjectsVelocityDetails from "@/components/projectManagement/ProjectsVelocityDetails";
import { Suspense } from "react";

export default function ProjectsVelocityDetailsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ProjectsVelocityDetails />
        </Suspense>
    );
}