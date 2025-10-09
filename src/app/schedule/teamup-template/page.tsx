"use client";

import TeamupTemplate from "@/components/schedule/TeamupTemplate";
import { Suspense } from "react";

export default function TeamupTemplatePage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <TeamupTemplate />
        </Suspense>
    );
}