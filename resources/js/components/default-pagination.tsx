import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import {BeatmapsFiltersInterface, PaginatedData} from "@/types";

export function DefaultPagination({ data, filters }: { data: PaginatedData, filters?: BeatmapsFiltersInterface }) {
    if (!data.last_page || data.last_page <= 1) return null;

    const { current_page, last_page } = data;
    const pageWindow = 1;

    const pages: (number | "...")[] = [];

    for (let i = 1; i <= last_page; i++) {
        if (
            i === 1 ||
            i === last_page ||
            (i >= (current_page ?? 1) - pageWindow &&
                i <= (current_page ?? 1) + pageWindow)
        ) {
            pages.push(i);
        } else if (pages[pages.length - 1] !== "...") {
            pages.push("...");
        }
    }

    const buildUrl = (page: number) => {
        const params = new URLSearchParams();
        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value && value !== "Any") {
                    params.set(key, value);
                }
            });
        }
        params.set("page", String(page));
        return `${data.path}?${params.toString()}`;
    };

    return (
        <Pagination className="overflow-x-auto">
            <PaginationContent>
                {/* Previous */}
                <PaginationItem>
                    <PaginationPrevious
                        href={data.prev_page_url ? buildUrl((current_page ?? 1) - 1) : "#"}
                        isActive={!!data.prev_page_url}
                    />
                </PaginationItem>

                {/* Page buttons */}
                {pages.map((page, idx) =>
                    page === "..." ? (
                        <PaginationItem key={`ellipsis-${idx}`}>
                            <PaginationEllipsis />
                        </PaginationItem>
                    ) : (
                        <PaginationItem key={`page-${page}`}>
                            <PaginationLink
                                href={buildUrl(page)}
                                isActive={page === current_page}
                            >
                                {page}
                            </PaginationLink>
                        </PaginationItem>
                    )
                )}

                {/* Next */}
                <PaginationItem>
                    <PaginationNext
                        href={data.next_page_url ? buildUrl((current_page ?? 1) + 1) : "#"}
                        isActive={!!data.next_page_url}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}