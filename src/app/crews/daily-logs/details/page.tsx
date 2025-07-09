"use client";

import DailyLogsDetails from "@/components/crews/DailyLogsDetails";
import { Suspense } from "react";

export default function DailyLogsDetailsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <DailyLogsDetails />
        </Suspense>
    );
}