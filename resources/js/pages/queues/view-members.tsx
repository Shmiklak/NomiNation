import {type BreadcrumbItem, Queue, User} from "@/types";
import {Head} from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import React from "react";

export default function ShowQueue({ queue, members } : { queue: Queue, members: User[] }) {

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: queue.name,
            href: '/queue/' + queue.id,
        },
        {
            title: 'Members',
            href: '/queue/' + queue.id + '/members',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={'Members of ' + queue.name}/>

            <div className="flex h-full flex-col gap-4 rounded-xl p-4">
                <div className="relative flex-1 rounded-xl px-6 py-6">

                    <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                        Members of {queue.name}
                    </h2>

                    <div className="container mt-16 grid gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-4">
                        {members.map((member) => (
                            <div key={member.id} className="flex flex-col items-center">
                                <div className="mb-4 size-40 border md:mb-5 lg:size-50 rounded-full">
                                    <a href={`https://osu.ppy.sh/users/${member.osu_id}`} target="_blank">
                                        <img className="object-cover w-full rounded-full" src={`https://a.ppy.sh/${member.osu_id}`} alt={member.username} />
                                    </a>
                                </div>
                                <p className="text-center font-medium">
                                    <a href={`https://osu.ppy.sh/users/${member.osu_id}`} target="_blank">
                                        {member.username}
                                    </a>
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}