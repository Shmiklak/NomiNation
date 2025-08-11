import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {ArrowRight, MoreHorizontal} from "lucide-react";
import Markdown from 'react-markdown'
import {Link, usePage} from "@inertiajs/react";
import type {SharedData} from "@/types";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";

type QueueCardProps = {
    imageUrl: string;
    title: string;
    description: string;
    status: string;
    id: number;
    is_bn_queue: boolean;
    host: {
        name: string;
        avatarUrl: string;
        id: number;
        osu_id: number;
    };
};

export function QueueListItem({ imageUrl, title, description, status, id, is_bn_queue, host }: QueueCardProps) {

    const { auth } = usePage<SharedData>().props;

    const statusColor = status === "open" ? "default" : "destructive";

    return (
        <Card className="overflow-hidden rounded-2xl bg-white/5 border ">
            <div className="px-3 py-3">
                <img
                    src={imageUrl === null ? host.avatarUrl : imageUrl}
                    alt={title}
                    className="h-48 rounded-2xl mx-auto object-contain"
                />
            </div>

            <CardHeader>
                <div>
                    <CardTitle className="text-lg">
                        <Link href={route('queue', id)}>{title}</Link>
                    </CardTitle>
                    <Badge variant={statusColor}>{status}</Badge>
                    {is_bn_queue ? (
                        <Badge className="ml-1 bg-purple-600 text-white hover:bg-purple-700">Beatmap Nominators</Badge>
                    ) : (<></>)}
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="text-sm text-muted-foreground line-clamp-3 min-h-[3.5rem]">
                    <Markdown>{description}</Markdown>
                </div>

                <div className="flex items-center gap-3 mt-4">
                    <img
                        src={host.avatarUrl}
                        alt={host.name}
                        className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="text-sm">Hosted by <a target="_blank" className="text-violet-500" href={`https://osu.ppy.sh/users/${host.osu_id}`}>{host.name}</a>
                    </span>
                </div>
            </CardContent>

            <CardFooter>
                { auth.user && auth.user.id === host.id ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                                <Link href={route('edit-queue', id)}>
                                    Edit queue
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href={route('manage-queue-members', id)}>
                                    Manage members
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : ( <></> ) }

                <Button asChild className="ml-auto text-sm">
                    <Link href={route('queue', id)}>
                        View Queue
                        <ArrowRight className="ml-2 size-4" />
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}