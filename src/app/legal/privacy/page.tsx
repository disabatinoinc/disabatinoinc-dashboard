"use client";

import { Suspense } from "react";

function PrivacyContent() {
    return (
        <main className="mx-auto max-w-3xl p-6 leading-7">
            <h1 className="text-2xl font-semibold mb-4">Privacy Policy</h1>
            <p className="text-sm text-gray-500 mb-6">Last updated: {new Date().toISOString().slice(0, 10)}</p>

            <p>
                {`DiSabatino Inc`} (“we”, “us”) operates the internal application
                {` “disabatinoinc”`}. This app connects to QuickBooks Online for internal
                reporting and operations. It is not offered to the public.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">Data We Access</h2>
            <ul className="list-disc pl-6">
                <li>QuickBooks data (e.g., CompanyInfo, Payments, Customers, Invoices)</li>
                <li>OAuth identifiers (realmId, access/refresh tokens, expirations)</li>
                <li>Operational logs (timestamps, request metadata, errors)</li>
            </ul>

            <h2 className="text-xl font-semibold mt-6 mb-2">Purpose</h2>
            <p>
                We use data solely for internal business processes (billing, collections,
                scheduling, analytics) for our organization.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">Storage & Security</h2>
            <ul className="list-disc pl-6">
                <li>Transport: HTTPS/TLS for all communication</li>
                <li>Storage: data and tokens stored on secured servers; encrypted at rest</li>
                <li>Access: restricted to authorized personnel (least privilege)</li>
                <li>Retention: logs kept for {`30 days`}; accounting data per policy</li>
            </ul>

            <h2 className="text-xl font-semibold mt-6 mb-2">Sharing</h2>
            <p>
                We do not sell data. Infrastructure/communications sub-processors may include
                {` [AWS]`} and Microsoft Graph (email notifications).
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">Your Rights & Contact</h2>
            <p>
                Employees or data subjects may request access or deletion by emailing{" "}
                <a className="underline" href="mailto:[mdisabatino@disabatinoinc.com]">[mdisabatino@disabatinoinc.com]</a>.
                <br />
                {`DiSabatino Inc`} • {`471 B and O Lane Wilmington, DE 19804`}
            </p>
        </main>
    );
}

export default function PrivacyPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PrivacyContent />
        </Suspense>
    );
}