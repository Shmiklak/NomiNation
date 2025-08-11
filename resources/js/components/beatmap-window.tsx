import {usePage} from "@inertiajs/react";
import {Beatmap, SharedData, User} from "@/types";
import React, {useState} from "react";
import {Button} from "@/components/ui/button";
import {Download, EyeIcon, Globe} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import Markdown from "react-markdown";
import LinkRenderer from "@/components/link-renderer";
import {Badge} from "@/components/ui/badge";
import {AudioPlayButton} from "@/components/audio-play-button";
import NominatorResponseForm from "@/components/nominator-response-form";

export default function BeatmapWindow({ beatmap, members } : {beatmap : Beatmap, members: User[]}) {

    const { auth } = usePage<SharedData>().props;

    const isUserMember = () => {
        if (auth.user) {
            return members.some(member => member.id === auth.user.id);
        }
        return null;
    }

    const [isOpen, setIsOpen] = useState(false);

    const [loading, setLoading] = useState(false);

    const matchingBadgeColor = () => {
        switch (beatmap.status) {
            case "ACCEPTED":
            case "NOMINATED":
                return "default";
            case "INVALID":
                return "destructive";
            default:
                return "secondary";
        }
    }

    return (
        <>

            <Button onClick={() => setIsOpen(true)} className="ml-auto text-sm">
                <EyeIcon/>
            </Button>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <form>
                    <DialogContent className="max-w-6xl overflow-y-auto max-h-5/6">
                        <DialogHeader>
                            <DialogTitle>{beatmap.artist} - {beatmap.title} (mapped by {beatmap.creator})</DialogTitle>

                        </DialogHeader>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                            <div className="md:col-span-1">
                                <div className="relative">
                                    <img
                                        src={beatmap.cover ?? ''}
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

                                <div className="mt-5 grid grid-cols-2 gap-4 font-medium">
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

                                <div className="mt-5 flex">
                                    <Button asChild variant="outline" className="mr-2 text-sm">
                                        <a href={`osu://s/${beatmap.beatmapset_id}`}>
                                            osu!direct <Download/>
                                        </a>
                                    </Button>
                                    <Button asChild className="mr-2 text-sm">
                                        <a target="_blank" href={`https://osu.ppy.sh/beatmapsets/${beatmap.beatmapset_id}`}>
                                            Beatmap page <Globe/>
                                        </a>
                                    </Button>
                                </div>
                            </div>


                            <div className="text-foreground md:col-span-2">
                                <div>
                                    <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">Request information:</h3>

                                    <div className="flex items-center gap-3 mt-2 mb-2">
                                        <img
                                            src={`https://a.ppy.sh/${beatmap.author.osu_id}`}
                                            alt={beatmap.author.username}
                                            className="w-8 h-8 rounded-full object-cover"
                                        />
                                        <span className="text-sm">Requested by <a target="_blank" className="text-violet-500" href={`https://osu.ppy.sh/users/${beatmap.author.osu_id}`}>{beatmap.author.username}</a> at <strong>{new Date(beatmap.created_at).toUTCString()}</strong></span>
                                    </div>

                                    <Markdown components={{ a: LinkRenderer }}>
                                        {beatmap.comment}
                                    </Markdown>

                                    <h3 className="scroll-m-20 text-xl font-semibold tracking-tight mt-5">Nominator responses:</h3>

                                    {beatmap.responses && beatmap.responses.map((response) => (
                                        <>
                                            <div key={response.id} className="flex items-center gap-3 mt-2 mb-2">
                                                <img
                                                    src={`https://a.ppy.sh/${response.nominator.osu_id}`}
                                                    alt={response.nominator.username}
                                                    className="w-8 h-8 rounded-full object-cover"
                                                />
                                                <span className="text-sm"><a target="_blank" className="text-violet-500" href={`https://osu.ppy.sh/users/${response.nominator.osu_id}`}>{response.nominator.username}</a> marked this beatmap as <strong>{response.status}</strong></span>
                                            </div>
                                            <p>
                                                {response.comment}
                                            </p>
                                        </>
                                    ))}

                                    {isUserMember() ? (<NominatorResponseForm beatmap={beatmap} members={members} />) : (<></>)}
                                </div>
                            </div>
                        </div>
                    </DialogContent>
                </form>
            </Dialog>


        </>
    )
}