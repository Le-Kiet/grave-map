import React, { useReducer, useCallback } from "react";
// import { FixedSizeList as List } from "react-window";
import InputField from "./InputField.jsx";

// 🧠 Reducer để quản lý trạng thái input
const formReducer = (state, action) => {
    switch (action.type) {
        case "UPDATE_FIELD":
            return { ...state, [action.field]: action.value };
        default:
            return state;
    }
};

// 🔢 Danh sách input mô phỏng (giả sử có 100 trường)
const fields = Array.from({ length: 100 }, (_, i) => ({
    field: `field${i + 1}`,
    label: `Field ${i + 1}`,
    placeholder: `Nhập giá trị cho Field ${i + 1}`,
}));

const VirtualizedForm = () => {
    const [formState, dispatch] = useReducer(formReducer, {});

    // ⚡ Callback tối ưu, tránh tạo lại hàm mới
    const handleChange = useCallback((field, value) => {
        dispatch({ type: "UPDATE_FIELD", field, value });
    }, []);

    // 📦 Render từng hàng input
    const Row = ({ index, style }) => {
        const { field, label, placeholder } = fields[index];
        return (
            <div style={style}>
                <InputField
                    field={field}
                    label={label}
                    value={formState[field] || ""}
                    placeholder={placeholder}
                    onChange={handleChange}
                    error={null} // hoặc xử lý validate
                />
            </div>
        );
    };

    return (
        <div style={{ height: "600px", width: "100%" }}>
            <List
                height={600}
                itemCount={fields.length}
                itemSize={80}
                width={"100%"}
            >
                {Row}
            </List>
        </div>
    );
};

export default VirtualizedForm;
