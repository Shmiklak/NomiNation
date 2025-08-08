
import AppLayout from '@/layouts/app-layout';
import {Beatmap, type BreadcrumbItem, PaginatedData, User} from '@/types';
import {Head, Link} from '@inertiajs/react';
import {Frown} from "lucide-react";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {Button} from "@/components/ui/button";
import BeatmapsListing from "@/components/beatmaps-listing";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'My requests',
        href: '/my-requests',
    },
];

export default function MyResponses({ beatmaps, members } : { beatmaps: PaginatedData<Beatmap>, members: User[] }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My queues" />
            <div className="flex h-full flex-col gap-4 rounded-xl p-4">
                <div className="relative flex-1 rounded-xl px-6 py-6">
                    {beatmaps.data !== null && beatmaps.data.length === 0 ? (
                        <Alert>
                            <Frown/>
                            <AlertTitle>You don't have any responses at the moment!</AlertTitle>
                            <AlertDescription>
                                You can check your requests in your queues <Link className="text-violet-500" href={route('my-queues')}>here</Link>.
                            </AlertDescription>
                        </Alert>
                    ) : (
                        <>
                            <div className="flex items-center justify-between mb-5">
                                <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                                    My Responses
                                </h2>
                                <Button variant="secondary">
                                    <Link href={route('my-queues')}>
                                        Browse my queues
                                    </Link>
                                </Button>
                            </div>

                            <BeatmapsListing paginatedData={beatmaps} members={members} display_queue={true}/>
                        </>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
