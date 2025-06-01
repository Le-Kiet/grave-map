import React, { useEffect, useState } from "react";
import "./Pagination.css";
import { PiDotsThreeOutlineFill } from "react-icons/pi";

const Pagination = ({
    currentPage,
    setCurrentPage,
    lorungData,
    filteredData,
}) => {
    const data = Array.from({ length: 817 }, (_, index) => `Item ${index + 1}`);
    const itemsPerPage = 10;
    const [leftDots, setLeftDots] = useState(false);
    const [rightDots, setRightDots] = useState(true);
    const [singlePage, setSinglePage] = useState(false);
    const totalPages =
        lorungData.length === 0
            ? Math.ceil(filteredData.length / itemsPerPage)
            : Math.ceil(lorungData.length / itemsPerPage);

    useEffect(() => {
        if (currentPage > 3 && currentPage < totalPages - 2) {
            setRightDots(true);
            setLeftDots(true);
        } else if (currentPage >= totalPages - 2) {
            setLeftDots(true);
            setRightDots(false);
        } else if (currentPage <= 3) {
            setRightDots(true);
            setLeftDots(false);
        }
    }, [currentPage, totalPages]);
    useEffect(() => {
        // (currentPage == totalPages)  == 1 ||
        if (totalPages == 1) {
            setSinglePage(true);
        } else {
            setSinglePage(false);
        }
        // console.log(currentPage, "currentPage");
        // console.log(totalPages, "totalPages");
        // console.log(singlePage, "singlePAge");
    }, [currentPage, totalPages]);
    useEffect(() => {
        setSinglePage(totalPages === 1);
    }, [totalPages]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleNext = (step) => {
        setCurrentPage((prevPage) =>
            Math.min(Math.max(prevPage + step, 1), totalPages)
        );
    };

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = data.slice(startIndex, startIndex + itemsPerPage);

    const renderPagination = () => {
        const pages = [];

        if (currentPage <= 3) {
            for (let i = 2; i <= Math.min(4, totalPages - 1); i++) {
                if (i == totalPages) break;
                pages.push(i);
            }
        } else if (currentPage > totalPages - 2) {
            for (let i = Math.max(1, totalPages - 3); i < totalPages; i++) {
                pages.push(i);
            }

            console.log(pages);
        } else {
            for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                pages.push(i);
            }
        }
        return pages.map((page) => (
            <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={currentPage === page ? "active" : ""}
            >
                {page}
            </button>
        ));
    };

    return (
        <div>
            {singlePage ? (
                <div className="pagination">
                    <button
                        onClick={() => handleNext(-5)}
                        disabled={currentPage <= 5}
                        className={currentPage <= 5 ? "disabled" : ""}
                    >
                        &laquo;
                    </button>
                    <button
                        onClick={() => handleNext(-1)}
                        disabled={currentPage <= 1}
                        className={currentPage <= 1 ? "disabled" : ""}
                    >
                        &lsaquo;
                    </button>

                    {renderPagination()}

                    <button
                        onClick={() => handleNext(1)}
                        disabled={currentPage >= totalPages}
                        className={currentPage >= totalPages ? "disabled" : ""}
                    >
                        &rsaquo;
                    </button>
                    <button
                        onClick={() => handleNext(5)}
                        disabled={currentPage + 5 > totalPages}
                        className={
                            currentPage + 5 > totalPages ? "disabled" : ""
                        }
                    >
                        &raquo;
                    </button>
                </div>
            ) : (
                <div className="pagination">
                    <button
                        onClick={() => handleNext(-5)}
                        disabled={currentPage <= 5}
                        className={currentPage <= 5 ? "disabled" : ""}
                    >
                        &laquo;
                    </button>
                    <button
                        onClick={() => handleNext(-1)}
                        disabled={currentPage <= 1}
                        className={currentPage <= 1 ? "disabled" : ""}
                    >
                        &lsaquo;
                    </button>
                    <button
                        key={1}
                        onClick={() => handlePageChange(1)}
                        className={currentPage === 1 ? "active" : ""}
                    >
                        1
                    </button>
                    {leftDots && (
                        <button className="icon">
                            <PiDotsThreeOutlineFill />
                        </button>
                    )}
                    {renderPagination()}
                    {rightDots && (
                        <button>
                            <PiDotsThreeOutlineFill />
                        </button>
                    )}
                    <button
                        key={totalPages}
                        onClick={() => handlePageChange(totalPages)}
                        className={currentPage === totalPages ? "active" : ""}
                    >
                        {totalPages}
                    </button>
                    <button
                        onClick={() => handleNext(1)}
                        disabled={currentPage >= totalPages}
                        className={currentPage >= totalPages ? "disabled" : ""}
                    >
                        &rsaquo;
                    </button>
                    <button
                        onClick={() => handleNext(5)}
                        disabled={currentPage + 5 > totalPages}
                        className={
                            currentPage + 5 > totalPages ? "disabled" : ""
                        }
                    >
                        &raquo;
                    </button>
                </div>
            )}
        </div>
    );
};

export default Pagination;
// import React, { useEffect, useState } from "react";
// import "./Pagination.css";
// import { PiDotsThreeOutlineFill } from "react-icons/pi";

// const Pagination = ({ currentPage, setCurrentPage, lorungData }) => {
//     const itemsPerPage = 10;
//     const totalPages = Math.ceil(lorungData.length / itemsPerPage);
//     const [leftDots, setLeftDots] = useState(false);
//     const [rightDots, setRightDots] = useState(true);
//     const [singlePage, setSinglePage] = useState(false);

//     useEffect(() => {
//         setSinglePage(totalPages === 1);
//     }, [totalPages]);

//     useEffect(() => {
//         setLeftDots(currentPage > 3);
//         setRightDots(currentPage < totalPages - 2);
//     }, [currentPage, totalPages]);

//     const handlePageChange = (page) => {
//         setCurrentPage(page);
//     };

//     const handleNext = (step) => {
//         setCurrentPage((prevPage) =>
//             Math.min(Math.max(prevPage + step, 1), totalPages)
//         );
//     };

//     const startIndex = (currentPage - 1) * itemsPerPage;
//     const currentItems = lorungData.slice(
//         startIndex,
//         startIndex + itemsPerPage
//     );

//     const renderPagination = () => {
//         const pages = [];

//         if (currentPage <= 3) {
//             for (let i = 2; i <= Math.min(4, totalPages - 1); i++) {
//                 if (i === totalPages) break;
//                 pages.push(i);
//             }
//         } else if (currentPage > totalPages - 2) {
//             for (let i = Math.max(1, totalPages - 3); i <= totalPages; i++) {
//                 pages.push(i);
//             }
//         } else {
//             for (let i = currentPage - 1; i <= currentPage + 1; i++) {
//                 pages.push(i);
//             }
//         }
//         return pages.map((page) => (
//             <button
//                 key={page}
//                 onClick={() => handlePageChange(page)}
//                 className={currentPage === page ? "active" : ""}
//             >
//                 {page}
//             </button>
//         ));
//     };

//     return (
//         <div>
//             <div className="pagination">
//                 <button
//                     onClick={() => handleNext(-5)}
//                     disabled={currentPage <= 5}
//                     className={currentPage <= 5 ? "disabled" : ""}
//                 >
//                     &laquo;
//                 </button>
//                 <button
//                     onClick={() => handleNext(-1)}
//                     disabled={currentPage <= 1}
//                     className={currentPage <= 1 ? "disabled" : ""}
//                 >
//                     &lsaquo;
//                 </button>

//                 {singlePage ? (
//                     <span>1</span>
//                 ) : (
//                     <>
//                         <button
//                             key={1}
//                             onClick={() => handlePageChange(1)}
//                             className={currentPage === 1 ? "active" : ""}
//                         >
//                             1
//                         </button>
//                         {leftDots && (
//                             <button className="icon">
//                                 <PiDotsThreeOutlineFill />
//                             </button>
//                         )}
//                         {renderPagination()}
//                         {rightDots && (
//                             <button className="icon">
//                                 <PiDotsThreeOutlineFill />
//                             </button>
//                         )}
//                         <button
//                             key={totalPages}
//                             onClick={() => handlePageChange(totalPages)}
//                             className={
//                                 currentPage === totalPages ? "active" : ""
//                             }
//                         >
//                             {totalPages}
//                         </button>
//                     </>
//                 )}

//                 <button
//                     onClick={() => handleNext(1)}
//                     disabled={currentPage >= totalPages}
//                     className={currentPage >= totalPages ? "disabled" : ""}
//                 >
//                     &rsaquo;
//                 </button>
//                 <button
//                     onClick={() => handleNext(5)}
//                     disabled={currentPage + 5 > totalPages}
//                     className={currentPage + 5 > totalPages ? "disabled" : ""}
//                 >
//                     &raquo;
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default Pagination;
