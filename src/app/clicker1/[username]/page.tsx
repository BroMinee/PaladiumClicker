import { ClickerPage } from '@/components/clicker/clicker-page';
import ProfileFetcherWrapper from '@/components/ProfileFetcher.client';

export default async function ClickerOptimizerPage(props: { params: Promise<{ username: string }> }) {
    const params = await props.params;
    return (
        <div className="bg-gray-900 text-white min-h-screen p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold mb-2 text-white">Optimiseur de Clicker</h1>
                <ProfileFetcherWrapper username={params.username}>
                    <ClickerPage/>
                </ProfileFetcherWrapper>
            </div>
        </div>
    );
}