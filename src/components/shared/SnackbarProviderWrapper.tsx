// app/components/SnackbarProviderWrapper.tsx
'use client';

import { SnackbarProvider } from 'notistack';
import React from 'react';

const SnackbarProviderWrapper = ({ children }: { children: React.ReactNode }) => {
    return (
        <SnackbarProvider
            maxSnack={5}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            autoHideDuration={4000}
            preventDuplicate
        >
            {children}
        </SnackbarProvider>
    );
};

export default SnackbarProviderWrapper;
