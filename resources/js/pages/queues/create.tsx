import AppLayout from "@/layouts/app-layout";
import type {BreadcrumbItem} from "@/types";
import {Head, useForm} from "@inertiajs/react";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {toast} from "sonner";
import {Textarea} from "@/components/ui/textarea";
import {SingleSelect} from "@/components/single-select";
import {Button} from "@/components/ui/button";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Create new queue',
        href: '/create-queue',
    },
];

type QueueFormInterface = {
    name: string,
    short_description: string,
    description: string,
    request_information: string,
    image: File | null,
    type: string,
    not_interested_requirement: number,
    discord_webhook: string | undefined,
    autoclose_amount: number | undefined,
    reqs_per_user_per_month: number | undefined,
}

export default function CreateQueue() {

    const { data, setData, post } = useForm<QueueFormInterface>({
        name: '',
        short_description: '',
        description: '',
        request_information: '',
        image: null,
        type: 'subdivision',
        not_interested_requirement: 3,
        discord_webhook: undefined,
        autoclose_amount: undefined,
        reqs_per_user_per_month: undefined,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('create-queue'), {
            preserveScroll: true,
            onSuccess: () => {

            },
            onError: (exceptions: Record<string, string>) => {
                console.error(exceptions);
                for (const key in exceptions) {
                    if (Object.prototype.hasOwnProperty.call(exceptions, key)) {
                        toast.error(`${exceptions[key]}`);
                    }
                }
            }
        })
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create new queue" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className=" relative  md:min-h-min px-6 py-6">
                    <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                        Create new queue
                    </h2>
                    <p className="mt-5 text-foreground/50">
                        Enter information for your queue here.<br/>
                        Markdown is supported for all text fields except for queue title. In case you want to know
                        more about Markdown please visit this <a href="https://commonmark.org/help/" className="text-violet-500" target="_blank">page</a>
                    </p>

                    <form onSubmit={submit}>
                        <div className="grid gap-4 py-4 lg:grid-cols-2">
                            <div>
                                <Label htmlFor="name" className="mb-2">
                                    Name
                                </Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                />
                            </div>

                            <div>
                                <Label htmlFor="short_description" className="mb-2">
                                    Short description
                                </Label>
                                <Input
                                    id="short_description"
                                    value={data.short_description}
                                    onChange={(e) => setData('short_description', e.target.value)}
                                />
                            </div>

                            <div>
                                <Label htmlFor="description" className="mb-2">
                                    Description
                                </Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                />
                            </div>

                            <div>
                                <Label htmlFor="request_information" className="mb-2">
                                    Request information
                                </Label>
                                <Textarea
                                    id="request_information"
                                    value={data.request_information}
                                    onChange={(e) => setData('request_information', e.target.value)}
                                />
                            </div>

                            <div>
                                <Label htmlFor="image" className="mb-2">
                                    Queue image
                                </Label>
                                <Input
                                    id="image"
                                    type="file"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            setData('image', file);
                                        }
                                    }}
                                />
                            </div>

                            <div>
                                <Label htmlFor="type" className="mb-2">
                                    Queue type
                                </Label>
                                <SingleSelect
                                    value={data.type}
                                    options={[{
                                        label: "Subdivision",
                                        value: "subdivision"
                                    }, {
                                        label: "Personal queue",
                                        value: "personal"
                                    }]}
                                    onChange={(newVal) => setData('type', newVal)}/>
                            </div>

                            <div>
                                <Label htmlFor="not_interested_requirement" className="mb-2">
                                    Number of "Not interested" responses to hide request
                                </Label>
                                <Input
                                    id="not_interested_requirement"
                                    value={data.not_interested_requirement}
                                    type="number"
                                    onChange={(e) => setData('not_interested_requirement', parseInt(e.target.value))}
                                />
                            </div>

                            <div>
                                <Label htmlFor="autoclose_amount" className="mb-2">
                                    Number of requests before closing the queue
                                </Label>
                                <Input
                                    id="autoclose_amount"
                                    value={data.autoclose_amount}
                                    type="number"
                                    onChange={(e) => setData('autoclose_amount', parseInt(e.target.value))}
                                />
                            </div>

                            <div>
                                <Label htmlFor="reqs_per_user_per_month" className="mb-2">
                                    Number of requests per month per user
                                </Label>
                                <Input
                                    id="reqs_per_user_per_month"
                                    value={data.reqs_per_user_per_month}
                                    type="number"
                                    onChange={(e) => setData('reqs_per_user_per_month', parseInt(e.target.value))}
                                />
                            </div>

                            <div>
                                <Label htmlFor="discord_webhook" className="mb-2">
                                    Discord Webhook URL for logging purposes
                                </Label>
                                <Input
                                    id="discord_webhook"
                                    value={data.discord_webhook}
                                    type="text"
                                    onChange={(e) => setData('discord_webhook', e.target.value)}
                                />
                            </div>
                        </div>

                        <Button type="submit">Submit for approval</Button>
                    </form>
                </div>
            </div>
        </AppLayout>
    )
}