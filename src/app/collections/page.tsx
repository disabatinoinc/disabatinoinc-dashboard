"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CollectionsRedirectPage() {
    const router = useRouter();

    useEffect(() => {
        router.push("/collections/summary");
    }, [router]);

    return null;
}
