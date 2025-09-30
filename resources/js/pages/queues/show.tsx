import {Beatmap, BeatmapsFiltersInterface, type BreadcrumbItem, PaginatedData, Queue, SharedData} from "@/types";
import {Head, Link, router, useForm, usePage} from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import Markdown from "react-markdown";
import React, {useState} from "react";
import LinkRenderer from "@/components/link-renderer";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {Button} from "@/components/ui/button";
import SubmitRequest from "@/components/submit-request";
import BeatmapsListing from "@/components/beatmaps-listing";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {Search} from "lucide-react";
import {toast} from "sonner";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";

export default function ShowQueue({ queue, beatmaps } : { queue: Queue, beatmaps: PaginatedData<Beatmap> }) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: queue.name,
            href: '/queue/' + queue.id,
        },
    ];

    const { auth } = usePage<SharedData>().props;
    const params = new URLSearchParams(window.location.search);
    const query_url = window.location.pathname;

    const [loading, setLoading] = useState(false);
    const { data, setData, get } = useForm<BeatmapsFiltersInterface>({
        query: params.get("query") === null ? "" : params.get("query"),
        status: params.get("status") === null ? "Any" : params.get("status"),
        genre: params.get("genre") === null ? "Any" : params.get("genre"),
        language: params.get("language") === null ? "Any" : params.get("language")
    })

    const isUserMember = auth.user
        ? queue.members.some(member => member.id === auth.user.id)
        : false;

    const applyFilters = () => {
        get(query_url, {
            preserveState: true
        });
    };

    const clearFilters = () => {
        setData({
            query: "",
            status: "Any",
            genre: "Any",
            language: "Any"
        });

        window.location.search = '';

        get(query_url, {
            preserveState: true
        });
    };

    const hasActiveFilters = window.location.search !== "";
    const isPersonalQueue = queue.type === 'personal';

    const clearBeatmaps = () => {
        setLoading(true);
        router.post(route('submit-multiple-response'), {
            'queue_id': queue.id,
            'user_id': auth.user.id,
            'query': data.query,
            'status': data.status,
            'genre': data.genre,
            'language': data.language,
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={queue.name}/>

            <div className="flex flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative flex-1 rounded-xl border px-6 py-6">

                    <div className="grid-cols-3 gap-20 lg:grid">
                        <div className="lg:col-span-1">
                            <img
                                src={queue.image === null ? `https://a.ppy.sh/${queue.user.osu_id}` : queue.image}
                                alt={queue.name}
                                className="w-full h-48 object-contain"
                            />
                        </div>
                        <div className="lg:col-span-2">
                            <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                                {queue.name}
                            </h2>

                            {queue.status === 'hidden' || queue.status === 'waiting_for_approval' ? (
                                <Alert variant="destructive">
                                    <AlertTitle>This queue is currently hidden from the public</AlertTitle>
                                    <AlertDescription>
                                        <p>Please contact Shmiklak to get an approval for your queue if you just created it.</p>
                                    </AlertDescription>
                                </Alert>
                            ) : (<></>)}

                            <div className="mt-5 markdown">
                                <Markdown components={{ a: LinkRenderer}}>
                                    {queue.description}
                                </Markdown>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">

                    {hasActiveFilters && (
                        <>
                            {isPersonalQueue && isUserMember && (beatmaps.data?.length > 0) && (
                                <Button
                                    variant="destructive"
                                    className="mr-2"
                                >
                                    <AlertDialog>
                                        <AlertDialogTrigger>Clear beatmaps</AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Mark all beatmaps as uninterested?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This will mark all filtered beatmaps as uninterested
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={clearBeatmaps}>Continue</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </Button>
                            )}
                            <Button
                                variant="outline"
                                className="mr-2"
                                onClick={clearFilters}
                            >
                                Clear filters
                            </Button>
                        </>
                    )}
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button className="mr-2" variant="outline">
                                <Search/>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                            <div className="flex flex-col gap-4">
                                <div>
                                    <label className="text-sm font-medium">Search (artist, title or mapper)</label>
                                    <Input
                                        placeholder="Search beatmaps..."
                                        value={data.query}
                                        onChange={(e) => setData('query', e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium">Status</label>
                                    <Select
                                        value={data.status}
                                        onValueChange={(value) => setData('status', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Any">Any</SelectItem>
                                            <SelectItem value="PENDING">Pending</SelectItem>
                                            <SelectItem value="INVALID">Invalid</SelectItem>
                                            <SelectItem value="ACCEPTED">Accepted</SelectItem>
                                            <SelectItem value="NOMINATED">Nominated</SelectItem>
                                            <SelectItem value="HIDDEN">Hidden</SelectItem>
                                            <SelectItem value="RANKED">Ranked</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <label className="text-sm font-medium">Language</label>
                                    <Select
                                        value={data.language}
                                        onValueChange={(value) => setData('language', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select language" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Any">Any</SelectItem>
                                            <SelectItem value="English">English</SelectItem>
                                            <SelectItem value="Chinese">Chinese</SelectItem>
                                            <SelectItem value="French">French</SelectItem>
                                            <SelectItem value="German">German</SelectItem>
                                            <SelectItem value="Italian">Italian</SelectItem>
                                            <SelectItem value="Japanese">Japanese</SelectItem>
                                            <SelectItem value="Korean">Korean</SelectItem>
                                            <SelectItem value="Spanish">Spanish</SelectItem>
                                            <SelectItem value="Swedish">Swedish</SelectItem>
                                            <SelectItem value="Russian">Russian</SelectItem>
                                            <SelectItem value="Polish">Polish</SelectItem>
                                            <SelectItem value="Instrumental">Instrumental</SelectItem>
                                            <SelectItem value="Unspecified">Unspecified</SelectItem>
                                            <SelectItem value="Other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <label className="text-sm font-medium">Genre</label>
                                    <Select
                                        value={data.genre}
                                        onValueChange={(value) => setData('genre', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select genre" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Any">Any</SelectItem>
                                            <SelectItem value="Unspecified">Unspecified</SelectItem>
                                            <SelectItem value="Video Game">Video Game</SelectItem>
                                            <SelectItem value="Anime">Anime</SelectItem>
                                            <SelectItem value="Rock">Rock</SelectItem>
                                            <SelectItem value="Pop">Pop</SelectItem>
                                            <SelectItem value="Other">Other</SelectItem>
                                            <SelectItem value="Novelty">Novelty</SelectItem>
                                            <SelectItem value="Hip Hop">Hip Hop</SelectItem>
                                            <SelectItem value="Electronic">Electronic</SelectItem>
                                            <SelectItem value="Metal">Metal</SelectItem>
                                            <SelectItem value="Classical">Classical</SelectItem>
                                            <SelectItem value="Folk">Folk</SelectItem>
                                            <SelectItem value="Jazz">Jazz</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <Button variant="default" className="mt-2" onClick={applyFilters}>Apply Filters</Button>
                            </div>
                        </PopoverContent>
                    </Popover>

                    {auth.user && auth.user.id === queue.user_id ? (
                        <>
                            <Button variant="outline" className="mr-2">
                                <Link href={route('edit-queue', queue.id)}>
                                    Edit queue
                                </Link>
                            </Button>
                            <Button variant="outline" className="mr-2">
                                <Link href={route('manage-queue-members', queue.id)}>
                                    Manage members
                                </Link>
                            </Button>
                        </>
                    ) : (<></>)}
                    { queue.type === 'subdivision' ? (<Button variant="outline" className="mr-2" asChild><Link href={route('queue.members', queue.id)}>View members</Link></Button>) : (<></>) }
                    { queue.status != 'open' ? (<></>) : (<SubmitRequest queue={queue}/>) }
                </div>

                <BeatmapsListing
                    members={queue.members}
                    paginatedData={beatmaps}
                    display_queue={false}
                    filters={data}
                />
            </div>


        </AppLayout>
    );
}