import React, { memo } from "react";
import { InputText } from "primereact/inputtext";

const SearchInput = React.memo(({ value, onChange, placeholder }) => {
    return (
        <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText
                type="search"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
            />
        </span>
    );
});

export default SearchInput;
