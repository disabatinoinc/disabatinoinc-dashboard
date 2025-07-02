"use client";

import SalesDetails from "@/components/sales/SalesDetails";
import { Suspense } from "react";

export default function SalesDetailsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SalesDetails />
        </Suspense>
    );
}