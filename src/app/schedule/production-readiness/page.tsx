"use client";

import ProductionReadiness from "@/components/schedule/ProductionReadiness";
import { Suspense } from "react";

export default function ProductionReadinessPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ProductionReadiness />
        </Suspense>
    );
}