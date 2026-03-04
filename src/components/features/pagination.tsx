"use client";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useRouter, useSearchParams } from "next/navigation";

export function PaginationIconsOnly() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page") ?? "1");

  function goToPage(newPage: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="flex items-center justify-between gap-4">
      <Pagination className="mx-0 w-auto">
        <PaginationContent>
          <PaginationItem className={page === 1 ? "pointer-events-none opacity-50" : ""}>
            <PaginationPrevious onClick={() => page > 1 && goToPage(page - 1)} />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext onClick={() => goToPage(page + 1)} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
