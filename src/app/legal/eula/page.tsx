"use client";

import { Suspense } from "react";

function EulaContent() {
    return (
        <main className="mx-auto max-w-3xl p-6 leading-7">
            <h1 className="text-2xl font-semibold mb-4">End-User License Agreement</h1>
            <p className="text-sm text-gray-500 mb-6">Last updated: {new Date().toISOString().slice(0, 10)}</p>

            <p>
                This Agreement governs use of {`“disabatinoinc”`} provided by {`DiSabatino Inc`} (“Company”).
                The Application is for Company’s internal business purposes only.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">License</h2>
            <p>
                Company grants authorized employees/contractors a limited, non-transferable license to use the
                Application solely for internal operations.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">Acceptable Use</h2>
            <ul className="list-disc pl-6">
                <li>No reverse engineering, resale, or public offering</li>
                <li>Comply with QuickBooks and third-party service terms</li>
            </ul>

            <h2 className="text-xl font-semibold mt-6 mb-2">Privacy</h2>
            <p>
                Use is subject to our <a className="underline" href="/legal/privacy">Privacy Policy</a>.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">Availability & Changes</h2>
            <p>
                Company may modify, suspend, or terminate the Application at any time.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">Disclaimer; Limitation of Liability</h2>
            <p>
                The Application is provided “as is” without warranties. To the maximum extent permitted by law,
                Company is not liable for indirect, incidental, or consequential damages.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">Termination</h2>
            <p>
                Access terminates upon employment end or notice from Company.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">Governing Law & Contact</h2>
            <p>
                Governed by {`DE`} law. Contact:{" "}
                <a className="underline" href="mailto:[mdisabatino@disabatinoinc.com]">[mdisabatino@disabatinoinc.coms]</a>.
            </p>
        </main>
    );
}

export default function EulaPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <EulaContent />
        </Suspense>
    );
}
