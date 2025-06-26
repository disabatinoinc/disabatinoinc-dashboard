"use client";

import SalesDetails from "@/components/sales/SalesDetails";
import { Suspense } from "react";

export default function SalesSummaryPage() {
    <Suspense fallback={<div>Loading...</div>}>
        <SalesDetails />
    </Suspense>
}