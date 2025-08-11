"use client";
import { Suspense } from "react";

function DisconnectContent() {
    return (
        <main className="mx-auto max-w-2xl p-6 leading-7">
            <h1 className="text-2xl font-semibold mb-4">QuickBooks Disconnected</h1>
            <p className="mb-4">
                Access has been revoked.
            </p>
        </main>
    );
}

export default function Page() {
    return (
        <Suspense fallback={<div>Loading…</div>}>
            <DisconnectContent />
        </Suspense>
    );
}