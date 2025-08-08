
import AppLayout from '@/layouts/app-layout';
import {type BreadcrumbItem, Queue} from '@/types';
import {Head, Link} from '@inertiajs/react';
import {QueuesList} from "@/components/queues-list";
import {Frown} from "lucide-react";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'My queues',
        href: '/my-queues',
    },
];

export default function MyQueues({ queues } : { queues: Queue[] }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My queues" />
            <div className="flex h-full flex-col gap-4 rounded-xl p-4">
                <div className="relative flex-1 rounded-xl px-6 py-6">
                    {queues.length === 0 ? (
                        <Alert>
                            <Frown/>
                            <AlertTitle>You don't have any queues at the moment!</AlertTitle>
                            <AlertDescription>
                                You can create a new one <Link className="text-violet-500" href={route('create-queue')}>here</Link>.
                            </AlertDescription>
                        </Alert>
                    ) : (<QueuesList queues={queues} />)}
                </div>
            </div>
        </AppLayout>
    );
}
