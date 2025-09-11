import {Beatmap, SharedData, User} from "@/types";
import React, {useState} from "react";
import {router, usePage} from "@inertiajs/react";
import {Spinner} from "@/components/ui/spinner";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {toast} from "sonner";

// type NominatorResponseFormInterface = {
//     nominator_id: number,
//     beatmap_id: number,
//     status: string,
//     comment: string
// }

export default function NominatorResponseForm({ beatmap, members } : {beatmap : Beatmap, members: User[]}) {

    const { auth } = usePage<SharedData>().props;

    const [loading, setLoading] = useState(false);

    const [nominator_id, setNominatorId] = useState<number>(auth.user.id);
    const [status, setStatus] = useState<string>('');
    const [comment, setComment] = useState<string>('');
    const isUserAdmin = () => {

        return members.some(member => member.is_admin || (member.id === auth.user.id && member.pivot.is_admin === 1));
    }

    const submitResponse = () => {
        setLoading(true);
        router.post(route('submit-response'), {
            'beatmap_id': beatmap.id,
            'nominator_id': nominator_id,
            'status': status,
            'comment': comment,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Your response has been saved.");
            },
            onFinish: () => {
                setLoading(false);
            }
        })
    }

    const submitRanked = () => {
        setLoading(true);
        router.post(route('submit-ranked'), {
            'beatmap_id': beatmap.id
        }, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Beatmap has been marked as Ranked.");
            },
            onFinish: () => {
                setLoading(false);
            }
        })
    }

    return (
        <>
            <h3 className="scroll-m-20 text-xl font-semibold tracking-tight mt-5 mb-5">Edit my response:</h3>

            <div className="grid gap-4">

                <div className="grid gap-3 mb-2">
                    <Label htmlFor="comment">Status</Label>
                    <Select onValueChange={(newValue) => setStatus(newValue)}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ACCEPTED">ACCEPTED</SelectItem>
                            <SelectItem value="MODDED">MODDED</SelectItem>
                            <SelectItem value="RECHECKED">RECHECKED</SelectItem>
                            <SelectItem value="NOMINATED">NOMINATED</SelectItem>
                            <SelectItem value="INVALID">INVALID</SelectItem>
                            <SelectItem value="UNINTERESTED">UNINTERESTED</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {isUserAdmin() ? (
                    <div className="grid gap-3 mb-2">
                        <Label htmlFor="comment">Nominator</Label>
                        <Select defaultValue={auth.user.id.toString()} onValueChange={(newValue) => setNominatorId(parseInt(newValue))}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {members.map((member) => (
                                    <SelectItem value={member.id.toString()}>{member.username}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                ) : (<></>)}

                <div className="grid gap-3 mb-2">
                    <Label htmlFor="comment">Comment</Label>
                    <Input
                        id="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                </div>
            </div>
            <div className="flex gap-3 mt-3">
                <Button onClick={() => submitResponse()} disabled={loading}>
                    Submit
                    {loading ? <Spinner className="text-primary-foreground" size="small" /> : null}
                </Button>

                {isUserAdmin() && (
                    <Button
                        variant="destructive"
                        onClick={() => submitRanked()}
                        disabled={loading}
                    >
                        Set as Ranked
                        {loading ? <Spinner className="text-primary-foreground" size="small" /> : null}
                    </Button>
                )}
            </div>
        </>
    )

}