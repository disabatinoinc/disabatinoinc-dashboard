"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SalesRedirectPage() {
    const router = useRouter();

    useEffect(() => {
        router.push("/sales/summary");
    }, [router]);

    return null;
}
