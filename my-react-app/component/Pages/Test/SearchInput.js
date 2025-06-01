import React, { useState, useEffect } from "react";

const SearchInput = ({ onSearchChange }) => {
    const [localQuery, setLocalQuery] = useState("");

    useEffect(() => {
        onSearchChange(localQuery);
    }, [localQuery, onSearchChange]);

    return (
        <input
            type="text"
            placeholder="Tìm kiếm..."
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            style={{
                padding: "0.5rem",
                width: "200px",
                margin: "8px",
                borderRadius: "4px",
            }}
        />
    );
};

export default React.memo(SearchInput);
