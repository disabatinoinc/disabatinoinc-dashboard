"use client"

import { Skeleton, TableRow, TableCell } from "@mui/material";
import React from "react";

export const SalesDetailsSkeleton = () => {
    const rows = Array.from({ length: 10 });

    return (
        <>
            {rows.map((_, idx) => (
                <TableRow key={idx}>
                    {Array.from({ length: 8 }).map((__, colIdx) => (
                        <TableCell key={colIdx}>
                            <Skeleton variant="text" height={20} sx={{ bgcolor: "#1f2937" }} />
                        </TableCell>
                    ))}
                </TableRow>
            ))}
        </>
    );
};