import { usePage } from "@inertiajs/react";
import {QueueListItem} from "@/components/queue-list-item";
import type { SharedData } from "@/types";
import {Button} from "@/components/ui/button";
import {Link} from "@inertiajs/react";
import {Queue} from "@/types";

export const QueuesList = ({ queues } : { queues: Queue[] }) => {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <div className="flex items-center justify-between mb-5">
                <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                    Available Queues
                </h2>
                {auth.user && (
                    <Button variant="secondary">
                        <Link href={route('create-queue')}>
                            Create Queue
                        </Link>
                    </Button>
                )}
            </div>

            <div className="grid items-center gap-8 bg-muted-2 lg:grid-cols-4">

                { queues.map((queue) => (
                    <QueueListItem key={queue.id}
                                   imageUrl={queue.image}
                                   title={queue.name}
                                   description={queue.short_description}
                                   status={queue.status}
                                   id={queue.id}
                                   is_bn_queue={queue.is_bn_queue}
                                   host={{
                                       id: queue.user.id,
                                       osu_id: queue.user.osu_id,
                                       name: queue.user.username,
                                       avatarUrl: `https://a.ppy.sh/${queue.user.osu_id}`
                                   }}/>
                ))}
            </div>

        </>
    )
}