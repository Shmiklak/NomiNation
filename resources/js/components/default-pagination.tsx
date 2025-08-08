import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import {PaginatedData} from "@/types";

export function DefaultPagination({ data } : {data : PaginatedData}) {



    return (
        <Pagination>
            <PaginationContent>

                { data.links.map((link, index) => (
                    <PaginationItem>
                        { index === 0 ? (<PaginationPrevious isActive={link.active} href={link.url} />) :
                            ( index === data.links.length - 1 ? ( <PaginationNext isActive={link.active} href={link.url} />) :
                                ( link.label === "..." ? (<PaginationEllipsis/>) :
                                    (<PaginationLink key={index} isActive={link.active} href={link.url}>
                                            {link.label}
                                        </PaginationLink>
                                    )))}
                    </PaginationItem>
                )) }
            </PaginationContent>
        </Pagination>
    )
}
