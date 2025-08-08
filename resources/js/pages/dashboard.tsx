
import AppLayout from '@/layouts/app-layout';
import {type BreadcrumbItem, Queue} from '@/types';
import { Head } from '@inertiajs/react';
import {QueuesList} from "@/components/queues-list";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard({ queues } : { queues: Queue[] }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-col gap-4 rounded-xl p-4">
                <div className="relative flex-1 rounded-xl px-6 py-6">
                    <QueuesList queues={queues} />
                </div>
            </div>
        </AppLayout>
    );
}
