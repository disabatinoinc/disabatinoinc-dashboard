"use client";

import ProductionReadinessScoreCard from "@/components/schedule/ProductionReadinessScoreCard";
import { Suspense } from "react";

export default function ProductionReadinessPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ProductionReadinessScoreCard />
        </Suspense>
    );
}