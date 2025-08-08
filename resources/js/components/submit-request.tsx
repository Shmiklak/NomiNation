import {Queue} from "@/types";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import Markdown from "react-markdown";
import LinkRenderer from "@/components/link-renderer";
import {useForm} from "@inertiajs/react";
import {toast} from "sonner";
import React, {useState} from "react";
import {Spinner} from "@/components/ui/spinner";

type RequestFormInterface = {
    beatmap_link: string,
    queue_id: number,
    comments: string
}
export default function SubmitRequest({ queue } : { queue: Queue }) {

    const [isOpen, setIsOpen] = useState(false);

    const [loading, setLoading] = useState(false);

    const { data, setData, post } = useForm<RequestFormInterface>({
        beatmap_link: '',
        queue_id: queue.id,
        comments: ''
    });

    const submit = (e) => {
        e.preventDefault();
        setLoading(true);
        post(route('submit-request'), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Your request has been submitted successfully!");
                setIsOpen(false);
            },
            onError: (exceptions: Record<string, string>) => {
                console.error(exceptions);
                for (const key in exceptions) {
                    if (Object.prototype.hasOwnProperty.call(exceptions, key)) {
                        toast.error(`${exceptions[key]}`);
                    }
                }
            },
            onFinish: () => {
                setLoading(false);
            }
        })
    }

    return (
        <>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <form onSubmit={submit}>
                    <DialogTrigger asChild>
                        <Button>Send request</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-fit overflow-y-auto max-h-5/6">
                        <DialogHeader>
                            <DialogTitle>Submit request</DialogTitle>

                            <div className="mt-5 markdown">
                                <Markdown components={{ a: LinkRenderer}}>
                                    {queue.request_information}
                                </Markdown>
                            </div>
                        </DialogHeader>
                        <div className="grid gap-4">
                            <div className="grid gap-3">
                                <Label htmlFor="beatmap_link">Beatmap link</Label>
                                <Input
                                    id="beatmap_link"
                                    value={data.beatmap_link}
                                    onChange={(e) => setData('beatmap_link', e.target.value)}
                                />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="comments">Request comment</Label>
                                <Input
                                    id="comments"
                                    value={data.comments}
                                    onChange={(e) => setData('comments', e.target.value)}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button disabled={loading} onClick={submit}>
                                Submit
                                { loading ? ( <Spinner className="text-primary-foreground" size="small" />) : (<></>) }
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </form>
            </Dialog>
        </>
    )

}