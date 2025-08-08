import {type BreadcrumbItem, Queue, User} from "@/types";
import {Head} from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import {ColumnDef} from "@tanstack/react-table";
import React, {useEffect, useState} from "react";
import {DataTable} from "@/components/ui/data-table";
import {Button} from "@/components/ui/button";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {MoreHorizontal} from "lucide-react";
import { router } from "@inertiajs/react";
import {toast} from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import axios from "axios";
import {Spinner} from "@/components/ui/spinner";

export default function ManageMembersPage({ queue, members }: { queue: Queue, members: User[] }) {

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
            title: `Manage members`,
            href: '/manage-queue-members/' + queue.id,
        },
    ];

    const [found_users, set_found_users] = useState([]);
    const [search_query, set_search_query] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!search_query.trim()) {
            set_found_users([]);
            return;
        }

        if (search_query.trim().length <= 2) {
            return;
        }

        const controller = new AbortController();
        const delayDebounce = setTimeout(() => {
            setLoading(true);

            axios.get(route('search-user'), {
                params: {
                    query: search_query
                }
            }).then((response) => {
                set_found_users(response.data);
            }).catch(() => {
                toast.error('Something went wrong! Please let Shmiklak know.')
            }).finally(() => {
                setLoading(false);
            });
        }, 300);

        return () => {
            controller.abort();
            clearTimeout(delayDebounce);
        };
    }, [search_query]);

    const updateMembershipType = (id: number) => {
        router.post(route('update-user-membership'), {
            queue_id: queue.id,
            user_id: id
        }, {
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

    const removeUser = (id: number) => {
        router.post(route('remove-user-from-queue'), {
            queue_id: queue.id,
            user_id: id
        }, {
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

    const addUser = (id: number) => {
        axios.post(route('add-user-to-queue'), {
            queue_id: queue.id,
            user_id: id,
        }).then((response) => {
            toast.success('User has been added successfully')
        }).catch(() => {
            toast.error('Something went wrong! Please let Shmiklak know.')
        });
    }

    const columns: ColumnDef<User>[] = [
        {
            accessorKey: 'username',
            header: 'Username',
            maxSize: 11,
            cell: ({row}) => {
                return (
                        <div className="flex items-center gap-3 mt-4">
                            <img
                                src={`https://a.ppy.sh/${row.original.osu_id}`}
                                alt={row.original.username}
                                className="w-8 h-8 rounded-full object-cover"
                            />
                            <span className="text-sm">{row.original.username}</span>
                        </div>
                )
            }
        },
        {
            header: 'Member since',
            maxSize: 11,
            cell: ({row}) => {
                // @ts-ignore
                return row.original.pivot.joined_at
            }
        },
        {
            header: 'Member type',
            maxSize: 11,
            cell: ({row}) => {
                // @ts-ignore
                return row.original.pivot.is_admin ? 'Admin' : 'Member'
            }
        },
        {
            id: "actions",
            maxSize: 8,
            cell: ({row}) => {
                return (
                    <>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Открыть меню</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => updateMembershipType(row.original.id)}>Change membership type</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => removeUser(row.original.id)}>Remove member</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </>
                )
            },
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage members"/>

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className=" relative  md:min-h-min px-6 py-6">
                    <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                        Manage members
                    </h2>

                    <p className="mt-5 text-foreground/50">
                        Here you can manage members of your queue.<br/>
                        The users don't have to be beatmap nominators in order to be a part of your queue, however make
                        sure they logged in on the website at least once, otherwise you won't be able to find them.
                    </p>

                    <div className="overflow-hidden rounded-lg border mt-8">
                        <DataTable columns={columns} data={members} />
                    </div>

                    <div className="flex items-center gap-2 justify-end mt-4">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button>Add member</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Add new member</DialogTitle>
                                    <DialogDescription>
                                        Enter your member's username or osu! account ID.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4">
                                    <div className="grid gap-3">
                                        <Input id="user_search" name="user_search" value={search_query}
                                               onChange={(e) => set_search_query(e.target.value)}/>
                                    </div>
                                </div>
                                { loading ? ( <Spinner size="large" />) : (<></>) }

                                {found_users.map((user : User) => (
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3 mt-4">
                                            <img
                                                src={`https://a.ppy.sh/${user.osu_id}`}
                                                alt={user.username}
                                                className="w-8 h-8 rounded-full object-cover"
                                            />
                                            <span className="text-sm">{user.username}</span>
                                        </div>
                                        <Button onClick={() => addUser(user.id)}>Add</Button>
                                    </div>
                                ))}
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}