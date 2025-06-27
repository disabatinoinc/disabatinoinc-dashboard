"use client";

import CollectionsDetailsTransactions from "@/components/collections/CollectionsDetailsTransactions";
import { Suspense } from "react";

export default function SalesSummaryPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CollectionsDetailsTransactions />
        </Suspense>
    );
}