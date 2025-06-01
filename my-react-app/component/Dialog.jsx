import { useState, useEffect } from "react";
import "./Header.css";
import React from "react";

function Dialog({ onCloseDialog, onSubmitDialog, initialValues, addOrUpdate }) {
    const [updateOrInsert, setUpdateOrInsert] = useState({
        state: false,
        id: null,
    });
    const [errors, setErrors] = useState({});
    const [isValid, setIsValid] = useState(false);

    const [tempValues, setTempValues] = useState(
        initialValues || {
            tentinh: "",
            tenhuyen: "",
            nhietdo: "",
            doam: "",
            luongmua: "",
            capdubao: "",
            ngay: new Date().toISOString().slice(0, 19).replace("T", " "),
        }
    );
    const [dataDialog, setDataDialog] = useState(false);
    useEffect(() => {
        validateForm();
    }, [tempValues]);
    useEffect(() => {
        setTempValues(initialValues); // Cập nhật tempValues khi initialValues thay đổi
    }, [initialValues]);
    const validateForm = () => {
        const newErrors = {};

        if (!tempValues.tentinh) {
            newErrors.tentinh = "Dữ liệu không được phép bỏ trống";
        }
        if (!tempValues.tenhuyen) {
            newErrors.tenhuyen = "Dữ liệu không được phép bỏ trống";
        }
        if (!tempValues.capdubao) {
            newErrors.capdubao = "Dữ liệu không được phép bỏ trống";
        }

        if (tempValues.nhietdo && isNaN(tempValues.nhietdo)) {
            newErrors.nhietdo = "Nhiệt độ phải là số";
        }
        if (tempValues.doam && isNaN(tempValues.doam)) {
            newErrors.doam = "Độ ẩm phải là số";
        }
        if (tempValues.luongmua && isNaN(tempValues.luongmua)) {
            newErrors.luongmua = "Lượng mưa phải là số";
        }

        setErrors(newErrors);
        setIsValid(Object.keys(newErrors).length === 0); // Nếu không có lỗi thì form hợp lệ
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmitDialog(tempValues); // Gọi callback với tempValues
    };

    const handleCloseDialog = () => {
        onCloseDialog(); // Gọi callback khi mở dialog
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTempValues((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     console.log(tempValues);
    //     try {
    //         const response = await fetch(
    //             "http://localhost:8000/api/lamnghiep",
    //             {
    //                 method: "POST",
    //                 headers: {
    //                     "Content-Type": "application/json",
    //                 },
    //                 body: JSON.stringify(tempValues),
    //             }
    //         );
    //         console.log(response, "response.data");
    //         if (!response.ok) {
    //             const errorData = await response.json();
    //             console.error("Error details:", errorData);
    //             throw new Error("Network response was not ok");
    //         }

    //         const dataa = await response.json();
    //         console.log("Success:", dataa);

    //         setData((prev) => [...prev, dataa]); // Giả định rằng API trả về mục mới được thêm vào
    //         console.log(data, "newInsertData");
    //         setDataDialog(false);
    //     } catch (error) {
    //         console.error("Error:", error);
    //     }
    // };
    return (
        <>
            <form onSubmit={handleSubmit} className="dialog">
                <div className="dialog-content">
                    {addOrUpdate === "add" ? (
                        <div>
                            <h1>Thêm dữ liệu</h1>
                        </div>
                    ) : (
                        <div>
                            <h1>Cập nhật dữ liệu</h1>
                        </div>
                    )}
                    <div className="input-container">
                        <div className="input-group">
                            <label htmlFor="tentinh">
                                Tên tỉnh <span className="important">*</span>
                            </label>
                            <input
                                id="tentinh"
                                name="tentinh"
                                type="text"
                                value={tempValues.tentinh}
                                onChange={handleInputChange}
                                placeholder="Tên tỉnh"
                            />
                            {errors.tentinh && (
                                <div className="error">{errors.tentinh}</div>
                            )}
                        </div>
                        <div className="input-group">
                            <label htmlFor="diadanh">
                                Tên huyện <span className="important">*</span>
                            </label>
                            <input
                                id="diadanh"
                                name="tenhuyen"
                                type="text"
                                value={tempValues.tenhuyen}
                                onChange={handleInputChange}
                                placeholder="Tên huyện"
                            />
                            {errors.tenhuyen && (
                                <div className="error">{errors.tenhuyen}</div>
                            )}
                        </div>
                        <div className="input-group">
                            <label htmlFor="nguongocrung">
                                Nhiệt độ <span className="important">*</span>
                            </label>
                            <input
                                id="nguongocrung"
                                name="nhietdo"
                                type="text"
                                value={tempValues.nhietdo}
                                onChange={handleInputChange}
                                placeholder="Nhiệt độ"
                            />
                            {errors.nhietdo && (
                                <p className="error">{errors.nhietdo}</p>
                            )}
                        </div>
                        <div className="input-group">
                            <label htmlFor="malo">
                                Độ ẩm <span className="important">*</span>
                            </label>
                            <input
                                id="malo"
                                name="doam"
                                type="text"
                                value={tempValues.doam}
                                onChange={handleInputChange}
                                placeholder="Độ ẩm"
                            />
                            {errors.doam && (
                                <p className="error">{errors.doam}</p>
                            )}
                        </div>
                        <div className="input-group">
                            <label htmlFor="luongmua">Lượng mưa</label>
                            <input
                                id="luongmua"
                                name="luongmua"
                                type="text"
                                value={tempValues.luongmua}
                                onChange={handleInputChange}
                                placeholder="Lượng mưa"
                            />
                            {errors.luongmua && (
                                <p className="error">{errors.luongmua}</p>
                            )}
                        </div>
                        <div className="input-group">
                            <label htmlFor="capdubao">
                                Cấp dự báo
                                <span className="important">*</span>
                            </label>
                            <input
                                id="capdubao"
                                name="capdubao"
                                type="text"
                                value={tempValues.capdubao}
                                onChange={handleInputChange}
                                placeholder="Cấp dự báo"
                            />
                            {errors.capdubao && (
                                <p className="error">{errors.capdubao}</p>
                            )}
                        </div>
                        <button
                            type="submit"
                            className="search-button"
                            disabled={!isValid}
                        >
                            {updateOrInsert ? "Thêm" : "Cập nhật"}
                        </button>
                        <button
                            onClick={handleCloseDialog}
                            className="close-button"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            </form>
        </>
    );
}

export default Dialog;
