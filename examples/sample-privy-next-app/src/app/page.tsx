"use client";

import dynamic from "next/dynamic";
import React from "react";

const Homepage = dynamic(() => import('./pages/homepage'), {
    ssr: false,
});

export default function Page() {
    return (
        <Homepage />
    );
}
