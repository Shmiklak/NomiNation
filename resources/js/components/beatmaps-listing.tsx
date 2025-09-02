import {Beatmap, PaginatedData, User} from "@/types";
import BeatmapListItem from "@/components/beatmap-list-item";
import {DefaultPagination} from "@/components/default-pagination";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {Frown} from "lucide-react";
import { BeatmapsFiltersInterface } from "@/types";

export default function BeatmapsListing({
                                            paginatedData,
                                            members,
                                            display_queue = false,
                                            filters,
                                        } : {
    paginatedData : PaginatedData<Beatmap>,
    members : User[],
    display_queue: boolean,
    filters?: BeatmapsFiltersInterface
}) {
    return (
        <>
            {paginatedData.data?.length === 0 ? (
                <Alert>
                    <Frown/>
                    <AlertTitle>This queue does not have any requests at the moment!</AlertTitle>
                    <AlertDescription>
                        Be the first to drop your request!
                    </AlertDescription>
                </Alert>
            ) : (
                <>
                    <div className="grid items-center gap-8 bg-muted-2 lg:grid-cols-4">
                        { paginatedData.data?.map((beatmap: Beatmap, index: number) => (
                            <BeatmapListItem
                                beatmap={beatmap}
                                members={members}
                                key={index}
                                display_queue={display_queue}
                            />
                        )) }
                    </div>

                    <DefaultPagination data={paginatedData} filters={filters}/>
                </>
            )}
        </>
    )
}