"use client";

import WeeklySchedule from "@/components/schedule/WeeklySchedule";
import { Suspense } from "react";

export default function WeeklySchedulePage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <WeeklySchedule />
        </Suspense>
    );
}