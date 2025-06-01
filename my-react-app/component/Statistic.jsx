import React, { useState, useEffect, useMemo } from "react";
import {
    CartesianGrid,
    Tooltip,
    Legend,
    BarChart,
    XAxis,
    YAxis,
    Bar,
} from "recharts";

function Statistic({
    groupedData,
    selectedOption,
    onOptionChange,
    onCloseDialog,
    data,
}) {
    const [isVisible, setIsVisible] = useState(true);
    const [position, setPosition] = useState({ x: 100, y: 100 });
    const [size, setSize] = useState({ width: 300, height: 200 });
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);

    const provinces = [
        { value: "Xã Hòa Khánh", label: "Xã Hòa Khánh" },
        { value: "Phường Khánh Xuân", label: "Phường Khánh Xuân" },
        { value: "Xã Ea Kao", label: "Xã Ea Kao" },
        { value: "Tổ 5", label: "Tổ 5" },
        { value: "Xã Cư ÊBur", label: "Xã Cư ÊBur" },
        { value: "Phường Ea Tam", label: "Phường Ea Tam" },
        { value: "Phường Tân Thành", label: "Phường Tân Thành" },
        { value: "Tổ 9", label: "Tổ 9" },
        { value: "Phường Tân An", label: "Phường Tân An" },
    ];

    const handleChange = (event) => {
        const selectedValue = event.target.value;
        onOptionChange(selectedValue);
    };

    const toggleDialog = () => {
        setIsVisible(!isVisible);
    };

    const handleMouseDown = (e) => {
        if (e.target.classList.contains("resizer")) {
            setIsResizing(true);
        } else {
            setIsDragging(true);
            setOffset({
                x: e.clientX - position.x,
                y: e.clientY - position.y,
            });
        }
    };
    const handleMouseMove = (e) => {
        if (isDragging) {
            setPosition({
                x: e.clientX - offset.x,
                y: e.clientY - offset.y,
            });
        } else if (isResizing) {
            const newWidth = e.clientX - position.x;
            const newHeight = e.clientY - position.y;

            setSize({
                width: newWidth > 100 ? newWidth : 100, // Giới hạn kích thước tối thiểu
                height: newHeight > 100 ? newHeight : 100,
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        setIsResizing(false);
    };
    const handleCloseDialog = () => {
        onCloseDialog(); // Gọi callback khi mở dialog
    };
    useEffect(() => {
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isDragging, isResizing]);
    console.log(groupedData, "groupData");
    return (
        <div className="statistic-container" onMouseDown={handleMouseDown}>
            {isVisible === true && size.width < 900 ? (
                <div
                    className="dialog"
                    style={{
                        left: position.x + 500 + "px",
                        top: position.y + 200 + "px",
                        width: Math.max(size.width, 600),
                        display: "flex",
                        flexDirection: "column",
                        background: "white",
                        borderRadius: "8px",
                        padding: "10px",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                    }}
                    onMouseDown={handleMouseDown}
                >
                    <div
                        className="dialog-header"
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "10px",
                            height: "40px", // Đặt chiều cao phù hợp hơn
                        }}
                    >
                        <h2>
                            Biểu đồ thống kê hiện trạng lô rừng của{" "}
                            {selectedOption}
                        </h2>
                        <button
                            onClick={() => setIsVisible(false)}
                            style={{ cursor: "pointer" }}
                        >
                            Đóng
                        </button>
                    </div>
                    <div className="content" style={{ justifyItems: "center" }}>
                        <BarChart width={600} height={300} data={groupedData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis
                                yAxisId="left"
                                orientation="left"
                                stroke="#8884d8"
                            />
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                stroke="#82ca9d"
                            />
                            <Tooltip />
                            <Legend />
                            <Bar
                                dataKey="totalSoto"
                                yAxisId="right"
                                fill="#8884d8"
                            />
                            <Bar
                                dataKey="totalDienTich"
                                yAxisId="left"
                                fill="#82ca9d"
                            />
                        </BarChart>

                        <div
                            className="combobox"
                            style={{
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            <select
                                id="comboBox"
                                value={selectedOption}
                                onChange={handleChange}
                            >
                                <option value="">Tất cả các huyện, xã</option>
                                {provinces.map((province) => (
                                    <option
                                        key={province.value}
                                        value={province.value}
                                    >
                                        {province.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div
                        className="resizer"
                        onMouseDown={handleMouseDown}
                        style={{
                            width: "10px",
                            height: "10px",
                            background: "#888",
                            cursor: "nwse-resize",
                            position: "absolute",
                            bottom: "0",
                            right: "0",
                        }}
                    ></div>
                </div>
            ) : isVisible === true && size.width > 900 ? ( // Added the '?' here
                <div
                    className="dialog"
                    style={{
                        left: position.x,
                        top: position.y,
                        width: Math.max(size.width, 600),
                        display: "flex",
                        flexDirection: "column",
                        background: "white",
                        borderRadius: "8px",
                        padding: "10px",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                    }}
                    onMouseDown={handleMouseDown}
                >
                    <div
                        className="dialog-header"
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "10px",
                            height: "40px", // Đặt chiều cao phù hợp hơn
                        }}
                    >
                        <h2>
                            Biểu đồ thống kê hiện trạng lô rừng của{" "}
                            {selectedOption}
                        </h2>
                        <button
                            onClick={handleCloseDialog}
                            style={{ cursor: "pointer" }}
                        >
                            Đóng
                        </button>
                    </div>
                    <div className="content" style={{ justifyItems: "center" }}>
                        <BarChart
                            width={size.width}
                            height={size.height}
                            data={groupedData}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis
                                yAxisId="left"
                                orientation="left"
                                stroke="#8884d8"
                            />
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                stroke="#82ca9d"
                            />
                            <Tooltip />
                            <Legend />
                            <Bar
                                dataKey="totalSoto"
                                yAxisId="right"
                                fill="#8884d8"
                            />
                            <Bar
                                dataKey="totalDienTich"
                                yAxisId="left"
                                fill="#82ca9d"
                            />
                        </BarChart>

                        <div
                            className="combobox"
                            style={{
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            <select
                                id="comboBox"
                                value={selectedOption}
                                onChange={handleChange}
                            >
                                <option value="">Tất cả các huyện, xã</option>
                                {provinces.map((province) => (
                                    <option
                                        key={province.value}
                                        value={province.value}
                                    >
                                        {province.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div
                        className="resizer"
                        onMouseDown={handleMouseDown}
                        style={{
                            width: "10px",
                            height: "10px",
                            background: "#888",
                            cursor: "nwse-resize",
                            position: "absolute",
                            bottom: "0",
                            right: "0",
                        }}
                    ></div>
                </div>
            ) : (
                <div></div>
            )}
        </div>
    );
}

export default Statistic;
