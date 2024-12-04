import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Navbar from '../components/layout/Navbar';

const queryClient = new QueryClient();

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
    return (
        <SessionProvider session={session}>
            <QueryClientProvider client={queryClient}>
                <div className="min-h-screen bg-gray-50">
                    <Navbar />
                    <main className="pt-16">
                        <Component {...pageProps} />
                    </main>
                </div>
            </QueryClientProvider>
        </SessionProvider>
    );
}