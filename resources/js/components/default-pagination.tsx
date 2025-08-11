import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { PaginatedData } from "@/types";

export function DefaultPagination({ data }: { data: PaginatedData }) {
    if (!data.last_page || data.last_page <= 1) return null;

    const { current_page, last_page } = data;
    const pageWindow = 1; // show this many pages on each side of the active page

    const pages: (number | "...")[] = [];

    for (let i = 1; i <= last_page; i++) {
        if (
            i === 1 || // always show first page
            i === last_page || // always show last page
            (i >= (current_page ?? 1) - pageWindow &&
                i <= (current_page ?? 1) + pageWindow)
        ) {
            pages.push(i);
        } else if (pages[pages.length - 1] !== "...") {
            pages.push("...");
        }
    }

    return (
        <Pagination className="overflow-x-auto">
            <PaginationContent>
                {/* Previous */}
                <PaginationItem>
                    <PaginationPrevious
                        href={data.prev_page_url || "#"}
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
                                href={`${data.path}?page=${page}`}
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
                        href={data.next_page_url || "#"}
                        isActive={!!data.next_page_url}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}
