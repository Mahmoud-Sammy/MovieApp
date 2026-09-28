export default function Pagination({currentPage, totalPages, onPageChange} : any){

    const isFirstPage = currentPage === 1;
    const isLastPage = currentPage >= totalPages;
    const maxPagesToShow = 5;
    const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2)); 
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1)
    const Pages = Array.from({length : endPage - startPage + 1}, (_, i) => startPage + i)

    return (
    <div className="flex justify-center items-center gap-2 py-6">
        {/* previous button */}
        <button className={`px-4 py-2 rounded-md text-white font-semibold border border-[#252525] transition bg-black hover:bg-yellow-500 cursor-pointer disabled:cursor-not-allowed disabled:bg-[#252525]`}
        disabled = {isFirstPage}
        onClick={() => !isFirstPage && onPageChange(currentPage - 1)}
        >Previous</button>


    {Pages.map((page) => (
        <button key={page} onClick={() => onPageChange(page)}
        className={`px-4 py-2 rounded-md text-white border border-[#252525] font-semibold transition ${
            page === currentPage
                ? "bg-yellow-500"
                : "bg-black hover:bg-yellow-500"
            }`}
        >
            {page}
        </button>
    ))}


    {/* Next button */}
    <button className={`px-4 py-2 rounded-md text-white font-semibold border border-[#252525] transition bg-black hover:bg-yellow-500 cursor-pointer disabled:cursor-not-allowed disabled:bg-[#252525]`}
        disabled = {isLastPage }
        onClick={() => !isLastPage && onPageChange(currentPage + 1)}
    >Next</button>

    </div>
)
}