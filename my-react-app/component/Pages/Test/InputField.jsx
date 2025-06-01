import React, { useState, useEffect } from "react";
import { TextInput } from "@mantine/core";

const InputField = React.memo(
    ({ field, label, value, placeholder, onChange, error }) => {
        const [tempValue, setTempValue] = useState(value || "");

        // Đồng bộ nếu value từ props thay đổi (ví dụ khi edit)
        useEffect(() => {
            setTempValue(value || "");
        }, [value]);

        const handleBlur = () => {
            onChange(tempValue, field); // Gửi giá trị lên component cha
        };

        return (
            <div className="input-group" style={{ fontSize: "14px" }}>
                <label htmlFor={field}>
                    {label} <span className="important">*</span>
                </label>
                <TextInput
                    id={field}
                    name={field}
                    value={tempValue}
                    onChange={(event) =>
                        setTempValue(event.currentTarget.value)
                    }
                    onBlur={handleBlur}
                    placeholder={placeholder}
                    error={error}
                />
                {error && <div className="error">{error}</div>}
            </div>
        );
    }
);

export default InputField;
