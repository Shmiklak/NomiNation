import {Beatmap, type SharedData, User} from "@/types";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Link, router, usePage} from "@inertiajs/react";
import Markdown from "react-markdown";
import {Button} from "@/components/ui/button";
import {Download, MoreHorizontal} from "lucide-react";
import React from "react";
import {Badge} from "@/components/ui/badge";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {toast} from "sonner";
import BeatmapWindow from "@/components/beatmap-window";
import {AudioPlayButton} from "@/components/audio-play-button";

export default function BeatmapListItem({ beatmap, members, display_queue = false } : {beatmap : Beatmap, members: User[], display_queue: boolean}) {
    const { auth } = usePage<SharedData>().props;

    const isUserMember = () => {
        if (auth.user) {
            return members.some(member => member.id === auth.user.id);
        }
        return null;
    }

    const updateNominatorResponse = (status: string) => {
        router.post(route('submit-response'), {
            'beatmap_id': beatmap.id,
            'status': status
        }, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Your response has been saved.");
            }
        })
    }

    const matchingBadgeColor = () => {
        switch (beatmap.status) {
            case "ACCEPTED":
            case "NOMINATED":
            case "RANKED":
            case "MODDED":
                return "default";
            case "INVALID":
                return "destructive";
            default:
                return "secondary";
        }
    }

    return (
        <>
            <Card className="overflow-hidden rounded-2xl bg-white/5 border ">
                <div className="relative">
                    <img
                        src={beatmap.cover === null ? '' : beatmap.cover}
                        alt={beatmap.title}
                        className="w-full aspect-square object-cover rounded-2xl"
                    />
                    <Badge
                        variant={matchingBadgeColor()}
                        className="absolute top-3 left-3 z-10 text-xs px-2 py-1"
                    >
                        {beatmap.status}
                    </Badge>

                    <AudioPlayButton className="absolute bottom-3 left-3 z-10 px-2 py-1" src={`https://b.ppy.sh/preview/${beatmap.beatmapset_id}.mp3`} />
                </div>

                <CardHeader>
                    <div>
                        <CardTitle className="text-lg line-clamp-1 min-h-[1rem]">
                            <a target="_blank" href={`https://osu.ppy.sh/beatmapsets/${beatmap.beatmapset_id}`}>
                                {beatmap.artist} - {beatmap.title}
                            </a>
                        </CardTitle>
                        <CardDescription>mapped by {beatmap.creator}</CardDescription>
                    </div>
                </CardHeader>

                <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-sm text-foreground font-medium">
                        <div>
                            <p className="text-muted-foreground font-semibold">Genre</p>
                            <p>{beatmap.genre ?? 'Unknown'}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground font-semibold">Language</p>
                            <p>{beatmap.language ?? 'Unknown'}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground font-semibold">BPM</p>
                            <p>{beatmap.bpm ?? '—'}</p>
                        </div>
                    </div>

                    <div className="text-sm text-muted-foreground line-clamp-3 min-h-[3.5rem]">
                        <strong>Request comment:</strong>
                        <Markdown>{beatmap.comment}</Markdown>
                    </div>

                    <div className="flex items-center gap-3 mt-4">
                        <img
                            src={`https://a.ppy.sh/${beatmap.author.osu_id}`}
                            alt={beatmap.author.username}
                            className="w-8 h-8 rounded-full object-cover"
                        />
                        <span className="text-sm">Requested by <a target="_blank" className="text-violet-500" href={`https://osu.ppy.sh/users/${beatmap.author.osu_id}`}>{beatmap.author.username}</a>
                    </span>
                    </div>

                    { display_queue && (
                        <div className="flex items-center gap-3 mt-4">
                            <span className="text-sm">Requested in <a target="_blank" className="text-violet-500" href={route('queue', beatmap.queue.id)}>{beatmap.queue.name}</a></span>
                        </div>
                    ) }
                </CardContent>

                <CardFooter>
                    { isUserMember() ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem className="cursor-pointer" onClick={() => updateNominatorResponse('UNINTERESTED')}>
                                    Mark as not interested
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer" onClick={() => updateNominatorResponse('ACCEPTED')}>
                                    Mark as accepted
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer" onClick={() => updateNominatorResponse('INVALID')}>
                                    Mark as invalid
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer" onClick={() => updateNominatorResponse('MODDED')}>
                                    Mark as modded
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer" onClick={() => updateNominatorResponse('RECHECKED')}>
                                    Mark as rechecked
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer" onClick={() => updateNominatorResponse('NOMINATED')}>
                                    Mark as nominated
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer" onClick={() => updateNominatorResponse('RANKED')}>
                                    Mark as ranked
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : ( <></> ) }


                    <div className="ml-auto">
                        <Button asChild variant="outline" className="mr-2 text-sm">
                            <a href={`osu://s/${beatmap.beatmapset_id}`}>
                                <Download/>
                            </a>
                        </Button>
                        <BeatmapWindow beatmap={beatmap} members={members} />
                    </div>
                </CardFooter>
            </Card>
        </>

    )
}