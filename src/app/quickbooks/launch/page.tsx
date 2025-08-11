"use client";
import { Suspense } from "react";

function LaunchContent() {
    return (
        <main className="mx-auto max-w-2xl p-6 leading-7">
            <h1 className="text-2xl font-semibold mb-4">QuickBooks Connected</h1>
            <p className="mb-4">
                This internal app is for DiSabatino Inc. staff.
            </p>
        </main>
    );
}

export default function Page() {
    return (
        <Suspense fallback={<div>Loading…</div>}>
            <LaunchContent />
        </Suspense>
    );
}