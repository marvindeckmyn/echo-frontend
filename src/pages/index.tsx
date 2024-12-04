import { useSession } from 'next-auth/react';
import Head from 'next/head';

const Home = () => {
    const { data: session } = useSession();

    return (
        <>
            <Head>
                <title>Echo - Share Your Voice</title>
                <meta name="description" content="Echo - A modern social platform" />
            </Head>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Left Sidebar */}test
            </div>
        </>
    );
};

export default Home;