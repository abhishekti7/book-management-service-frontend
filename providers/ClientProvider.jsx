'use client';

import { AuthProvider } from '@/contexts/auth-context';
import ApolloWrapper from './ApolloWrapper';

export default function ClientProviders({ children }) {
    return (
        <ApolloWrapper>
            <AuthProvider>
                {children}
            </AuthProvider>
        </ApolloWrapper>
    );
}