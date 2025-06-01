import React from "react";
import DataTable from "./DataTable";
import "./Table.css";
const Table = ({
    currentPage,
    itemsPerPage,
    data,
    handleClick,
    selectedOption,
    // searchValues,
    lorungData,
}) => {
    return (
        <div className="table">
            <DataTable
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                data={data}
                handleClick={handleClick}
                selectedOption={selectedOption}
                // searchValues={searchValues}
                lorungData={lorungData}
            />
        </div>
    );
};

export default Table;
