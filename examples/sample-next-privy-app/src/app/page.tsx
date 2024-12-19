'use client';

import { Container } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import React from 'react';

const Homepage = dynamic(() => import('./pages/homepage'), {
    ssr: false,
});

export default function Page() {
    return (
        <Container maxW="container.xl">
            <Homepage />
        </Container>
    );
}
