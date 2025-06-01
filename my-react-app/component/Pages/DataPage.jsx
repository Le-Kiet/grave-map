import React, { useEffect, useState, useCallback } from "react";
import "leaflet-draw/dist/leaflet.draw.css";
import axios from "axios";
import { IoPencilOutline } from "react-icons/io5";
import { IoTrash } from "react-icons/io5";
import { FaGripLinesVertical } from "react-icons/fa";
import { IoIosAddCircleOutline } from "react-icons/io";
import "./DataPage.css";
import * as XLSX from "xlsx";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { MultiSelect } from "primereact/multiselect";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import LeafletDrawMap from "../LeafletDrawMap.jsx";
import { Button } from "primereact/button";
import Statistic from "../Statistic.jsx";
const DataPage = ({ showUserTable, permissionsId }) => {
    console.log(permissionsId, "permissionsId");
    const [activeTab, setActiveTab] = useState("thongTin");
    const [dataOrImport, setDataOrImport] = useState(false);
    const [addOrUpdate, setAddOrUpdate] = useState("add");
    const [formData, setFormData] = useState({});
    const handleSubmit = async (data) => {
        // Gán giá trị cho trường 'ngay' là thời điểm hiện tại
        const currentDate = new Date()
            .toISOString()
            .slice(0, 19)
            .replace("T", " ");
        const updatedData = { ...data, ngay: currentDate }; // Thêm trường 'ngay' vào data

        setFormData(updatedData);
        setDataOrImport(false);
        console.log(updatedData); // In ra dữ liệu đã cập nhật

        try {
            const response = await fetch(
                "http://localhost:8000/api/lamnghiep",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updatedData), // Gửi dữ liệu đã cập nhật
                }
            );

            console.log(response, "response.data");
            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error details:", errorData);
                throw new Error("Network response was not ok");
            }

            const dataa = await response.json();
            console.log("Success:", dataa);

            setData((prev) => [...prev, dataa]); // Giả định rằng API trả về mục mới được thêm vào
            console.log(updatedData, "newInsertData");
            setDataDialog(false);
        } catch (error) {
            console.error("Error:", error);
        }
    };
    const handleUpdate = async (currentId) => {
        setAddOrUpdate((true, "update"));
    };
    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };
    const handleAddData = (newData) => {
        // Xử lý dữ liệu mới (ví dụ: thêm vào state hoặc gửi đến API)
        console.log("Dữ liệu mới được thêm:", newData);
    };
    const handleOpenDialog = () => {
        setDataOrImport(true);
        console.log("Dialog được mở");
    };

    return (
        <div className="data-page-container">
            {dataOrImport === true ? (
                {
                    /* <Dialog
                    onCloseDialog={handleCloseDialog}
                    initialValues={formData}
                    onSubmitDialog={handleSubmit}
                    addOrUpdate={addOrUpdate}
                /> */
                }
            ) : (
                <div></div>
            )}
            <div className="tab-header">
                <button
                    onClick={() => handleTabChange("thongTin")}
                    className={activeTab === "thongTin" ? "active-slider" : ""}
                    style={{ fontWeight: 700 }}
                >
                    Thông tin
                </button>
                <button
                    onClick={() => handleTabChange("thongKe")}
                    className={activeTab === "thongKe" ? "active-slider" : ""}
                    style={{ fontWeight: 700 }}
                >
                    Thống kê
                </button>
            </div>
            <div className="tab-content">
                {activeTab === "thongTin" && (
                    <ThongTin
                        // loading={loading}
                        showUserTable={showUserTable}
                        onAddData={handleAddData}
                        onOpenDialog={handleOpenDialog}
                        permissionsId={permissionsId}
                        onUpdateDialog={handleUpdate}
                    />
                )}
                {activeTab === "thongKe" &&
                showUserTable === "hiện trạng lô rừng" ? (
                    <ThongKe
                        data={filteredData}
                        permissionsId={permissionsId}
                        showUserTable={showUserTable}
                    />
                ) : activeTab === "thongKe" &&
                  showUserTable === "cảnh báo cháy rừng" ? (
                    <ThongKe
                        showUserTable={showUserTable}
                        permissionsId={permissionsId}
                    />
                ) : (
                    <div></div>
                )}
            </div>
        </div>
    );
};

const ThongTin = React.memo(
    ({
        showUserTable,

        permissionsId,
        // loading
    }) => {
        console.log(permissionsId, "permissionsId Id in data");
        const [data, setData] = useState([]);
        const [dataOrImport, setDataOrImport] = useState(true);
        const [columnName, setColumnName] = useState([]);
        const [visibleColumns, setVisibleColumns] = useState([]);

        const onColumnToggle = (event) => {
            let selectedColumns = event.value;
            let orderedSelectedColumns = columnName.filter((col) =>
                selectedColumns.some((sCol) => sCol.field === col.field)
            );

            setVisibleColumns(orderedSelectedColumns);
        };
        const [tempValues, setTempValues] = useState({
            geom: "",
            tentinh: "",
            tenhuyen: "",
            nhietdo: "",
            doam: "",
            luongmua: "",
            capdubao: "",
            ngay: new Date().toISOString().slice(0, 19).replace("T", " "),
        });
        const [lorungTempValues, setLorungTempValues] = useState({
            geom: "",
            maddlo: null,
            matinh: "",
            mahuyen: "",
            maxa: "",
            tenxa: "",
            matieukhu: "",
            makhoanh: "",
            soto: null,
            sothua: null,
            diadanh: "",
            dientich: null,
            mangr: null,
            ldlr: "",
            maldlr: null,
            loaicay: "",
            namtrong: null,
            captuoi: null,
            nkheptan: null,
            mangrt: null,
            mathanhrung: null,
            mgo: null,
            mtn: null,
            mgolo: null,
            mtnlo: null,
            malapdia: null,
            malr3: null,
            quyuocmdsd: "",
            mamdsd: null,
            madoituong: null,
            churung: "",
            machurung: null,
            matranhchap: null,
            malo: "",
            mattqsdd: null,
            thoihansd: null,
            makhoan: null,
            mattqh: null,
            nguoiky: "",
            nguoichiutn: "",
            manguoiky: null,
            manguoichiutn: null,
            mangsinh: null,
            kinhdo: null,
            vido: null,
            capkinhdo: "WGS84",
            capvido: "WGS84",
            malocu: "",
            mathuadat: null,
            tentinh: "",
            tenhuyen: "",
        });
        const fieldHints = {
            maddlo: "ID định danh (số)",
            matinh: "Mã tỉnh (chuỗi)",
            mahuyen: "Mã huyện (chuỗi)",
            maxa: "Mã xã (chuỗi)",
            tenxa: "Tên xã (chuỗi)",
            matieukhu: "Mã tiểu khu (chuỗi)",
            makhoanh: "Mã khoảnh (chuỗi)",
            soto: "Số tờ (số)",
            sothua: "Số thửa (số)",
            diadanh: "Địa danh (chuỗi)",
            dientich: "Ví dụ: 15.5 (ha)",
            mangr: "Mã nhóm rừng (số)",
            ldlr: "Loại đất lâm nghiệp (chuỗi)",
            maldlr: "Mã loại đất lâm nghiệp (số)",
            loaicay: "Loài cây trồng (chuỗi)",
            namtrong: "Ví dụ: 2020 (năm)",
            captuoi: "Cấp tuổi (số)",
            nkheptan: "Năm khép tán (số)",
            mangrt: "Mã nhóm rừng theo tiêu chí (số)",
            mathanhrung: "Mã trạng thái rừng (số)",
            mgo: "Mật độ gỗ (float)",
            mtn: "Mật độ tre nứa (float)",
            mgolo: "Mật độ gỗ (lọ) (float)",
            mtnlo: "Mật độ tre nứa (lọ) (float)",
            malapdia: "Mã lập địa (số)",
            malr3: "Mã lớp rừng (số)",
            quyuocmdsd: "Quy ước mục đích sử dụng đất (chuỗi)",
            mamdsd: "Mã mục đích sử dụng đất (số)",
            madoituong: "Mã đối tượng sử dụng (số)",
            churung: "Chủ rừng (chuỗi)",
            machurung: "Mã chủ rừng (số)",
            matranhchap: "Mã tranh chấp (số)",
            malo: "Mã lô (chuỗi)",
            mattqsdd: "Mã trạng thái quyền SDĐ (số)",
            thoihansd: "Số năm sử dụng đất (ví dụ: 50)",
            makhoan: "Mã khoán (số)",
            mattqh: "Mã tình trạng quy hoạch (số)",
            nguoiky: "Tên người ký (chuỗi)",
            nguoichiutn: "Người chịu trách nhiệm (chuỗi)",
            manguoiky: "Mã người ký (số)",
            manguoichiutn: "Mã người chịu trách nhiệm (số)",
            mangsinh: "Mã ngành sinh (số)",
            kinhdo: "Kinh độ (ví dụ: 105.123456)",
            vido: "Vĩ độ (ví dụ: 21.123456)",
            capkinhdo: "Hệ quy chiếu kinh độ (chuỗi)",
            capvido: "Hệ quy chiếu vĩ độ (chuỗi)",
            malocu: "Mã lô cũ (chuỗi)",
            mathuadat: "Mã thửa đất (số)",
            tentinh: "Tên tỉnh (ví dụ: Hòa Bình)",
            tenhuyen: "Tên huyện (ví dụ: Lạc Thủy)",
        };
        const [updateOrInsert, setUpdateOrInsert] = useState({
            state: false,
            type: "insert",
            id: null,
        });

        const handleCloseDialog = () => {
            setUpdateOrInsert({
                state: false,
                type: "insert",
                id: null,
            });
            setTempValues({});
            setLorungTempValues({});
            console.log("Dialog được ddongs");
        };

        const headerMapping = {
            luongmua: "Lượng mưa",
            nhietdo: "Nhiệt độ",
            doam: "Độ ẩm",
            capdubao: "Cấp dự báo",
            maddlo: "Mã đối tượng lô",
            matinh: "Mã tỉnh",
            mahuyen: "Mã huyện",
            maxa: "Mã xã",
            tenxa: "Tên xã",
            matieukhu: "Mã tiểu khu",
            makhoanh: "Mã khoảnh",
            soto: "Số tờ",
            sothua: " Số thửa",
            diadanh: "Địa danh",
            dientich: "Diện tích",
            mangr: "Mảng rừng",
            ldlr: "Loại đất loại rừng",
            maldlr: "Mã loại đất loại rừng",
            loaicay: "Loại cây",
            namtrong: "Năm trồng",
            captuoi: "Cấp tuổi",
            nkheptan: "Số năm khép tán",
            mangrt: "Mã nguồn gốc rừng trồng",
            mathanhrung: "Mã tình trạng thành rừng",
            mgo: "Trữ lượng gỗ của lô kiểm kê (m3/ha)",
            mtn: "Trữ lượng tre nứa (1000 cây/ha)",
            mgolo: "Trữ lượng gỗ của lô rừng (m3/lô)",
            mtnlo: "Số lượng cây tre nứa của lô (1000 cây/lô)",
            malapdia: "Mã điều kiện lập địa",
            malr3: "Mã mục đích sử dụng, phân loại chính",
            quyuocmdsd: "Viết tắt mục đích sử dụng rừng",
            mamdsd: "Mã mục đích sử dụng, phân loại phụ",
            madoituong: "Mã đối tượng",
            churung: "Chủ rừng",
            machurung: "Mã chủ rừng",
            matranhchap: "Mã tranh chấp",
            malo: "Mã lô",
            mattqsdd: "Mã tình trạng quyền sử dụng đất",
            thoihansd: "Thời hạn sử dụng",
            makhoan: "Mã tình trạng khoán bảo vệ rừng",
            mattqh: "Mã tình trạng quy hoạch",
            nguoiky: "Người ký",
            nguoichiutn: "Người chịu trách nhiệm",
            manguoiky: "Mã người ký",
            manguoichiutn: "Mã người chịu trách nhiệm",
            mangsinh: "Mã tình trạng nguyên sinh",
            kinhdo: "Kinh độ",
            vido: "Vĩ độ",
            malocu: "Mã lô cũ",
            mathuadat: "Mã vị trí thửa đất",
            tentinh: "Tên tỉnh",
            tenhuyen: "Tên huyện",
        };
        const [fileName, setFileName] = useState("");
        const [fileData, setFileData] = useState([]);
        const [tempExcelValues, setTempExcelValues] = useState([]);
        const [errors, setErrors] = useState({});
        const [dataDialog, setDataDialog] = useState(false);
        const [openImportData, setOpenImportData] = useState(false);
        const [deleteDialog, setDeleteDialog] = useState({
            state: false,
            id: null,
        });
        const [isValid, setIsValid] = useState(false);
        // const [dataExcel, setDataExcel] = useState([]);
        const [dataExcel, setDataExcel] = useState([]);

        const handleFileChange = (event) => {
            const file = event.target.files[0];
            console.log(file, "file dữ liệu");
            if (file) {
                setFileData(file);
                setFileName(file.name);
            } else {
                setFileName("");
            }

            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const binaryStr = e.target.result;
                    const workbook = XLSX.read(binaryStr, { type: "binary" });
                    const firstSheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[firstSheetName];
                    const jsonData = XLSX.utils.sheet_to_json(worksheet);
                    setTempExcelValues(jsonData);
                    setDataExcel(jsonData);
                    console.log(jsonData, "jsonData");
                };
                reader.readAsBinaryString(file);
            }
        };

        useEffect(() => {
            tempExcelValues.forEach((item) => {
                const excelDate = item.ngay;
                const jsDate = new Date((excelDate - 25569) * 86400 * 1000);

                const formattedDate = jsDate
                    .toISOString()
                    .slice(0, 19)
                    .replace("T", " ");

                item.ngay = formattedDate;
            });
        }, [tempExcelValues]);

        useEffect(() => {
            validateForm();
            validateLorungForm();
        }, [tempValues]);

        const validateForm = () => {
            const newErrors = {};

            const requiredFields = [
                "tentinh",
                "tenhuyen",
                "capdubao",
                // Nếu showUserTable !== "hiện trạng lô rừng" thì validate cả các field từ visibleColumns
                ...(showUserTable !== "hiện trạng lô rừng"
                    ? visibleColumns.map((col) => col.field)
                    : []),
            ];

            requiredFields.forEach((field) => {
                if (!tempValues[field]) {
                    newErrors[field] = `${
                        headerMapping[field] || field
                    } không được bỏ trống`;
                }
            });

            // Kiểm tra các trường số
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
            setIsValid(Object.keys(newErrors).length === 0);
        };
        const validateLorungForm = () => {
            const newErrors = {};

            setErrors(newErrors);
            setIsValid(Object.keys(newErrors).length === 0);
        };
        const handleOpenDialog = () => {
            setUpdateOrInsert({ state: true, type: "insert", id: null }); // Gọi callback khi mở dialog
            setDataDialog(true);
        };
        const handleInputChange = (e) => {
            const { name, value } = e.target;
            if (showUserTable === "cảnh báo cháy rừng") {
                setTempValues((prev) => ({
                    ...prev,
                    [name]: value,
                }));
            } else if (showUserTable === "hiện trạng lô rừng") {
                console.log(lorungTempValues, "lorungTempValues");
                setLorungTempValues((prev) => ({
                    ...prev,
                    [name]: value,
                }));
                console.log(lorungTempValues, "lorungTempValues");
            }
        };

        const handleDeleteConfirm = (id) => {
            setDeleteDialog({ state: true, id });
        };
        const handleSubmit = async (e) => {
            e.preventDefault();
            console.log("== BẮT ĐẦU SUBMIT ==");
            console.log("Giá trị table:", showUserTable);
            console.log("Giá trị updateOrInsert:", updateOrInsert);

            if (showUserTable === "cảnh báo cháy rừng") {
                console.log(updateOrInsert.type, "updateOrInsert.type");
                if (updateOrInsert.type === "insert") {
                    const invalidField = Object.entries(lorungTempValues).find(
                        ([key, value]) => /[.,\/?]/.test(value)
                    );

                    if (invalidField) {
                        const [field, value] = invalidField;
                        setErrors({
                            [field]: `Trường ${
                                headerMapping[field] || field
                            } không được chứa các ký tự đặc biệt !@#$%^.,/?`,
                        });
                        return;
                    }
                    try {
                        const payload = {
                            ...tempValues,
                            geom: JSON.stringify(tempValues.geom),
                        };
                        const response = await fetch(
                            "http://localhost:8000/api/lamnghiep",
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify(payload),
                            }
                        );

                        if (!response.ok) {
                            const errorData = await response.json();
                            console.error("Error details:", errorData);
                            throw new Error("Network response was not ok");
                        }

                        const dataa = await response.json();
                        setData((prev) => [...prev, dataa]);
                        setTempValues({});
                        setDataDialog(false);
                        setUpdateOrInsert({
                            state: false,
                            type: "insert",
                            id: null,
                        });
                    } catch (error) {
                        console.error("Error:", error);
                    }
                } else {
                    handleUpdate();
                }
            }

            // ==== XỬ LÝ FORM "hiện trạng lô rừng" ====
            else if (showUserTable === "hiện trạng lô rừng") {
                // --- Kiểm tra dữ liệu trước khi gửi ---

                if (updateOrInsert.type === "insert") {
                    const invalidField = Object.entries(lorungTempValues).find(
                        ([key, value]) => /[.,\/?]/.test(value)
                    );

                    if (invalidField) {
                        const [field, value] = invalidField;
                        setErrors({
                            [field]: `Trường ${
                                headerMapping[field] || field
                            } không được chứa các ký tự đặc biệt !@#$%^.,/?`,
                        });
                        return;
                    }
                    if (
                        !lorungTempValues.geom ||
                        !lorungTempValues.geom.type ||
                        !lorungTempValues.geom.coordinates
                    ) {
                        alert(
                            "Bạn cần vẽ hoặc chọn hình trên bản đồ trước khi lưu."
                        );
                        return;
                    }
                    try {
                        const payload = {
                            ...lorungTempValues,
                            // geom để nguyên là object
                        };
                        const response = await fetch(
                            "http://localhost:8000/api/lorung",
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify(payload),
                            }
                        );

                        if (!response.ok) {
                            const errorData = await response.json();
                            console.error("Chi tiết lỗi từ server:", errorData);
                            if (errorData.error) alert(errorData.error);
                            return;
                        }

                        setLorungTempValues({});
                        setDataDialog(false);
                        setUpdateOrInsert({
                            state: false,
                            type: "insert",
                            id: null,
                        });
                    } catch (error) {
                        console.error("Lỗi khi lưu dữ liệu:", error);
                    }
                } else {
                    console.log(lorungTempValues, "lorungTempValues");

                    handleUpdate();
                }
                console.log(updateOrInsert.type, "updateOrInsert.type");
            }
            console.log(updateOrInsert.type, "updateOrInsert.type");
        };

        const handleSubmitExcel = async (e) => {
            e.preventDefault();
            console.log(tempExcelValues[0]);
            // }
            try {
                for (const item of tempExcelValues) {
                    const response = await fetch(
                        "http://localhost:8000/api/lamnghiep",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(item),
                        }
                    );

                    if (!response.ok) {
                        const errorData = await response.json();
                        console.error("Error details:", errorData);
                        throw new Error("Network response was not ok");
                    }

                    const dataa = await response.json();
                    console.log("Success:", dataa);

                    setData((prev) => [...prev, dataa]); // Giả định rằng API trả về mục mới được thêm vào
                }

                setDataDialog(false);
            } catch (error) {
                console.error("Error:", error);
            }
        };

        const handleUpdate = async () => {
            console.log("Updating data...");
            console.log("Clicked Update!");
            if (!currentId) {
                console.error("ID cần cập nhật không tồn tại");
                return;
            }
            if (showUserTable === "cảnh báo cháy rừng") {
                try {
                    const response = await fetch(
                        `http://localhost:8000/api/lamnghiep/${currentId}`,
                        {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(tempValues),
                        }
                    );

                    if (!response.ok) {
                        const errorData = await response.json();
                        console.error("Error details:", errorData);
                        throw new Error("Network response was not ok");
                    }

                    const updatedItem = await response.json();

                    // Reload dữ liệu từ API (hoặc chỉ lấy item đã update)
                    const reloadResponse = await fetch(
                        "http://localhost:8000/api/lamnghiep"
                    );
                    const reloadData = await reloadResponse.json();

                    setData(reloadData); // Set lại toàn bộ dữ liệu từ API

                    setTempValues({}); // Clear input after update
                    setDataDialog(false);
                    setUpdateOrInsert({
                        state: false,
                        type: "insert",
                        id: null,
                    });
                    setCurrentId(null);
                } catch (error) {
                    console.error("Error:", error);
                }
            } else if (showUserTable === "hiện trạng lô rừng") {
                try {
                    const response = await fetch(
                        `http://localhost:8000/api/lorung/${currentId}`,
                        {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(lorungTempValues),
                        }
                    );

                    if (!response.ok) {
                        const errorData = await response.json();
                        console.error("Error details:", errorData);
                        throw new Error("Network response was not ok");
                    }
                    console.log("response", response);
                    const updatedItem = await response.json();

                    // Reload dữ liệu từ API (hoặc chỉ lấy item đã update)
                    const reloadResponse = await fetch(
                        "http://localhost:8000/api/lorung/all"
                    );
                    const reloadData = await reloadResponse.json();

                    setData(reloadData); // Set lại toàn bộ dữ liệu từ API

                    setLorungTempValues({}); // Clear input after update
                    setDataDialog(false);
                    setUpdateOrInsert({
                        state: false,
                        type: "insert",
                        id: null,
                    });
                    setCurrentId(null);
                } catch (error) {
                    console.error("Error:", error);
                }
            }
        };
        const [currentId, setCurrentId] = useState(null);

        const updatingData = (id) => {
            const selectedRow = data.find((item) => item.id === id);
            if (!selectedRow) return;
            console.log(id, "updating id");
            setUpdateOrInsert({ state: true, type: "update", id });
            setCurrentId(id);
            if (showUserTable === "cảnh báo cháy rừng") {
                setTempValues(selectedRow); // đổ vào form cảnh báo
            } else if (showUserTable === "hiện trạng lô rừng") {
                setLorungTempValues(selectedRow); // đổ vào form lô rừng
            }
            setDataDialog(true);
        };

        const handleDelete = async ([_, actualId]) => {
            console.log("deleting", actualId);
            if (showUserTable === "cảnh báo cháy rừng")
                try {
                    const response = await fetch(
                        `http://localhost:8000/api/lamnghiep/${actualId}`,
                        {
                            method: "DELETE",
                            headers: {
                                "Content-Type": "application/json",
                            },
                        }
                    );

                    if (!response.ok) {
                        const errorData = await response.json();
                        console.error("Error details:", errorData);
                        throw new Error("Network response was not ok");
                    }

                    setData((prev) =>
                        prev.filter((row) => row.id !== actualId)
                    );
                    console.log("Success: Item deleted");
                    setDeleteDialog({ state: false });
                } catch (error) {
                    console.error("Error:", error);
                }
            else if (showUserTable === "hiện trạng lô rừng")
                try {
                    const response = await fetch(
                        `http://localhost:8000/api/lorung/${actualId}`,
                        {
                            method: "DELETE",
                            headers: {
                                "Content-Type": "application/json",
                            },
                        }
                    );

                    if (!response.ok) {
                        const errorData = await response.json();
                        console.error("Error details:", errorData);
                        throw new Error("Network response was not ok");
                    }

                    console.log("Success: Item deleted");
                    setDeleteDialog({ state: false });
                } catch (error) {
                    console.error("Error:", error);
                }
        };

        const formatExcelDate = (excelDate) => {
            const jsDate = new Date((excelDate - 25569) * 86400 * 1000);
            return jsDate.toISOString().slice(0, 19).replace("T", " ");
        };

        // const handleOpenDialog = (id) => {
        //     setUpdateOrInsert({ state: true, id });
        //     setDataDialog(true);
        // };
        const [products, setProducts] = useState([]);

        const handleCloseDeleteDialog = () => {
            setDeleteDialog({ state: false, id: null });
        };
        const [filters, setFilters] = useState({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            tentinh: {
                operator: FilterOperator.AND,
                constraints: [
                    { value: null, matchMode: FilterMatchMode.CONTAINS },
                ],
            },
            tenxa: {
                operator: FilterOperator.AND,
                constraints: [
                    { value: null, matchMode: FilterMatchMode.CONTAINS },
                ],
            },
            tenhuyen: {
                operator: FilterOperator.AND,
                constraints: [
                    { value: null, matchMode: FilterMatchMode.CONTAINS },
                ],
            },
            nhietdo: {
                operator: FilterOperator.AND,
                constraints: [
                    { value: null, matchMode: FilterMatchMode.EQUALS },
                ],
            },
            doam: {
                operator: FilterOperator.AND,
                constraints: [
                    { value: null, matchMode: FilterMatchMode.EQUALS },
                ],
            },
            luongmua: {
                operator: FilterOperator.AND,
                constraints: [
                    { value: null, matchMode: FilterMatchMode.EQUALS },
                ],
            },
            loaicay: {
                operator: FilterOperator.AND,
                constraints: [
                    { value: null, matchMode: FilterMatchMode.EQUALS },
                ],
            },
            churung: {
                operator: FilterOperator.AND,
                constraints: [
                    { value: null, matchMode: FilterMatchMode.EQUALS },
                ],
            },
            capdubao: {
                operator: FilterOperator.AND,
                constraints: [
                    { value: null, matchMode: FilterMatchMode.EQUALS },
                ],
            },
        });

        const [globalFilterValue, setGlobalFilterValue] = useState("");
        const onGlobalFilterChange = (e) => {
            const value = e.target.value;
            let _filters = { ...filters };
            _filters["global"].value = value;

            setFilters(_filters);
            setGlobalFilterValue(value);
        };
        const options = columnName.map((col) => {
            return {
                field: col, // ví dụ: "tentinh"
                header: headerMapping[col] || col, // ví dụ: "Tên tỉnh"
            };
        });

        console.log(options, "options");
        // console.log(columnFilters, "columnFilters");
        const header = (
            <div
                className="table-header"
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "1rem",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "1rem",
                    }}
                >
                    <div style={{ fontWeight: "bold" }}>
                        Dữ liệu đối tượng rừng
                    </div>

                    <div
                        style={{
                            display: "flex",
                            gap: "1rem",
                            alignItems: "center",
                        }}
                    >
                        {permissionsId.includes(4) && (
                            <>
                                <IoIosAddCircleOutline
                                    onClick={handleOpenDialog}
                                    style={{
                                        height: "2em",
                                        width: "auto",
                                        cursor: "pointer",
                                        fill: "green",
                                    }}
                                />
                                <Button
                                    onClick={() => setDataOrImport(false)}
                                    style={{
                                        height: "2em",
                                        width: "auto",
                                        background: "#c4c4c4",
                                    }}
                                >
                                    Import Dữ liệu
                                </Button>
                            </>
                        )}
                    </div>
                </div>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        gap: "1rem",
                        width: "55%",
                    }}
                >
                    <MultiSelect
                        value={visibleColumns}
                        // value={headerMapping}
                        options={columnName}
                        optionLabel="header"
                        onChange={onColumnToggle}
                        className="multiple-select"
                        style={{ width: "100%", maxWidth: "20rem" }}
                        display="chip"
                        placeholder="Chọn cột hiển thị"
                    />

                    <span className="p-input-icon-left">
                        <i className="pi pi-search" />
                        <InputText
                            type="search"
                            value={globalFilterValue}
                            onChange={onGlobalFilterChange}
                            placeholder="Tìm kiếm"
                        />
                    </span>
                </div>
            </div>
        );

        const headerImport = (
            <div className="table-header">
                <div style={{ display: "flex", alignItems: "center" }}>
                    <div className="m-0" style={{ fontWeight: "bold" }}>
                        Dữ liệu đối tượng rừng
                    </div>
                </div>
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText
                        type="search"
                        value={globalFilterValue}
                        onChange={onGlobalFilterChange}
                        placeholder="Tìm kiếm"
                    />
                </span>
            </div>
        );
        const [sizeOptions] = useState([
            { label: "Small", value: "small" },
            { label: "Normal", value: "normal" },
            { label: "Large", value: "large" },
        ]);
        const [size, setSize] = useState(sizeOptions[1].value);
        // if (loading) {
        //     return <p>Loading...</p>;
        // }
        console.log(showUserTable, "showUserTable");
        const [filtersReset, setFiltersReset] = useState({}); // Quản lý filter
        const [columnFilters, setColumnFilters] = useState({});

        useEffect(() => {
            const fetchData = async () => {
                let currentData;

                if (showUserTable === "hiện trạng lô rừng") {
                    try {
                        const response = await axios.get(
                            "http://localhost:8000/api/lorung?page=3&limit=10"
                        );
                        console.log(response.data, "data");
                        currentData = response.data.data;
                    } catch (err) {
                        console.error("Error fetching data:", err);
                    }
                } else if (showUserTable === "cảnh báo cháy rừng") {
                    try {
                        const response = await axios.get(
                            "http://localhost:8000/api/lamnghiep"
                        );
                        console.log(response.data, "data");
                        currentData = response.data;
                    } catch (error) {
                        console.error("Error fetching data:", error);
                    }
                } else if (showUserTable === "biến động diện tích rừng") {
                    try {
                        const response = await axios.get(
                            "http://localhost:8000/api/geom"
                        );
                        const areas = response.data.map((area) => {
                            const geom = JSON.parse(area.geom);
                            return { ...area, coordinates: geom.coordinates };
                        });
                        currentData = areas; // Cập nhật currentData với dữ liệu đã xử lý
                    } catch (error) {
                        console.error("Error fetching data:", error);
                    }
                }

                if (currentData && currentData.length > 0) {
                    const columnNames = Object.keys(currentData[0])
                        .filter(
                            (key) =>
                                ![
                                    "id",
                                    "geom",
                                    "created_at",
                                    "updated_at",
                                    "centroid",
                                    "coordinates",
                                    "ngay",
                                ].includes(key)
                        )
                        .map((key) => ({
                            field: key,
                            header: key.charAt(0).toUpperCase() + key.slice(1),
                        }));

                    setColumnName(columnNames);
                    setVisibleColumns(columnNames);
                    setData(currentData);
                    setColumnFilters({});
                } else {
                    // Nếu không có dữ liệu, có thể cần thiết lập lại dữ liệu cũ
                    setData([]);
                    setColumnName([]);
                    setVisibleColumns([]);
                }
            };

            fetchData();
        }, [showUserTable]); // Đảm bảo showUserTable là dependency
        const handleColumnFilterChange = (field, value) => {
            setColumnFilters((prev) => ({
                ...prev,
                [field]: value,
            }));
        };
        const appliedFilters = { ...filters, ...columnFilters };
        console.log("Header Mapping:", headerMapping);
        console.log("Visible Columns:", visibleColumns);
        const [tableReady, setTableReady] = useState(false);
        console.log(columnFilters, "columnFilters");
        useEffect(() => {
            // ... (sau khi xử lý data, columns)
            setTableReady(true);
        }, [data]); // Hoặc visibleColumns
        const filterableFields = Object.keys(filters); // lấy các field có filter
        const sortedColumns = [...visibleColumns].sort((a, b) => {
            const aIsFilterable = filterableFields.includes(a.field);
            const bIsFilterable = filterableFields.includes(b.field);
            return (bIsFilterable ? 1 : 0) - (aIsFilterable ? 1 : 0); // cột có filter lên đầu
        });
        console.log(tempValues.geom, "geom");
        return (
            <div
                style={{ paddingLeft: "40px", paddingRight: "20px" }}
                className="data-table-container"
            >
                {dataOrImport === true && tableReady ? (
                    <DataTable
                        value={data}
                        showGridlines
                        size={size}
                        paginator
                        stripedRows
                        rows={10}
                        header={header}
                        tableStyle={{ minWidth: "50rem" }}
                        filters={appliedFilters}
                        className="data-table"
                    >
                        {permissionsId.includes(4) ? (
                            <Column
                                style={{
                                    width: "120px",
                                }}
                                body={(data) => (
                                    <div className="icon-column">
                                        <IoPencilOutline
                                            className="update-icon"
                                            // onClick={handleUpdate(data.id)}
                                            onClick={() =>
                                                updatingData(data.id)
                                            }
                                        />
                                        <FaGripLinesVertical />
                                        <IoTrash
                                            className="delete-icon"
                                            onClick={() =>
                                                handleDeleteConfirm([
                                                    true,
                                                    data.id,
                                                ])
                                            }
                                        />
                                    </div>
                                )}
                                header="Tùy chọn"
                            />
                        ) : (
                            <div></div>
                        )}
                        {sortedColumns.map(({ field, header }) => {
                            const isFilterable = filters.hasOwnProperty(field);

                            return (
                                <Column
                                    key={field}
                                    field={field}
                                    sortable
                                    header={headerMapping[field] ?? header}
                                    {...(isFilterable && {
                                        filter: true,
                                        filterField: field,
                                        filterMatchMode:
                                            filters[field]?.constraints?.[0]
                                                ?.matchMode,
                                        onFilterChange: (e) =>
                                            handleColumnFilterChange(
                                                field,
                                                e.value
                                            ),
                                    })}
                                />
                            );
                        })}
                    </DataTable>
                ) : (
                    <div></div>
                )}

                {dataOrImport === true ? (
                    <div></div>
                ) : /* <Dialog /> */

                permissionsId.includes(4) ? (
                    <div style={{ minWidth: "800px" }}>
                        <h1>Nhập dữ liệu</h1>
                        <div className="file-upload-container">
                            <span className="file-name">
                                {fileName || "Chọn file..."}
                            </span>
                            <input
                                type="file"
                                accept=".xlsx, .xls"
                                onChange={handleFileChange}
                                id="file-upload"
                                className="file-input"
                            />
                            <label
                                htmlFor="file-upload"
                                className="file-upload-button"
                            >
                                Chọn file
                            </label>
                        </div>

                        {dataExcel.length > 0 && (
                            <Button
                                label={
                                    openImportData
                                        ? "Đóng dữ liệu"
                                        : "Xem Dữ Liệu"
                                }
                                onClick={() =>
                                    setOpenImportData(!openImportData)
                                }
                                className="search-button"
                            />
                        )}

                        {openImportData && dataExcel.length > 0 ? (
                            <DataTable
                                value={dataExcel}
                                showGridlines
                                size={size}
                                paginator
                                stripedRows
                                rows={10}
                                header={headerImport}
                                tableStyle={{ minWidth: "50rem" }}
                            >
                                <Column
                                    field="tentinh"
                                    sortable
                                    header="Tên tỉnh"
                                />
                                <Column
                                    field="tenhuyen"
                                    sortable
                                    header="Tên huyện"
                                />
                                <Column
                                    field="nhietdo"
                                    sortable
                                    header="Nhiệt độ"
                                />
                                <Column field="doam" sortable header="Độ ẩm" />
                                <Column
                                    field="luongmua"
                                    sortable
                                    header="Lượng mưa"
                                />
                                <Column
                                    field="capdubao"
                                    sortable
                                    header="Cấp dự báo"
                                />
                            </DataTable>
                        ) : (
                            <div>Không có dữ liệu để hiển thị.</div>
                        )}

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                marginBottom: "8px",
                            }}
                        >
                            <Button
                                label="Gửi Dữ Liệu"
                                onClick={handleSubmitExcel}
                                className="search-button"
                            />
                            <Button
                                label="Quay về"
                                onClick={() => setDataOrImport(true)}
                                className="close-button"
                            />
                        </div>
                    </div>
                ) : (
                    <div style={{ color: "gray", fontStyle: "italic" }}>
                        Bạn không có quyền nhập dữ liệu.
                    </div>
                )}

                {updateOrInsert.state === true && (
                    <div
                        style={{
                            display: "flex",
                            gap: "16px",
                            alignItems: "flex-start",
                        }}
                    >
                        <form onSubmit={handleSubmit} className="dialog">
                            <div className="dialog-content">
                                {updateOrInsert.type === "insert" ? (
                                    <div>
                                        <h1>Thêm dữ liệu</h1>
                                    </div>
                                ) : (
                                    <div>
                                        <h1>Cập nhật dữ liệu</h1>
                                    </div>
                                )}
                                {showUserTable === "cảnh báo cháy rừng" ? (
                                    <div className="input-container input-container-fire-warning">
                                        <div className="input-group">
                                            <label htmlFor="tentinh">
                                                Tên tỉnh{" "}
                                                <span className="important">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                id="tentinh"
                                                name="tentinh"
                                                type="text"
                                                value={tempValues.tentinh}
                                                onChange={handleInputChange}
                                                placeholder="Thừa Thiên Huế"
                                            />
                                            {errors.tentinh && (
                                                <div className="error">
                                                    {errors.tentinh}
                                                </div>
                                            )}
                                        </div>
                                        <div className="input-group">
                                            <label htmlFor="diadanh">
                                                Tên huyện{" "}
                                                <span className="important">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                id="diadanh"
                                                name="tenhuyen"
                                                type="text"
                                                value={tempValues.tenhuyen}
                                                onChange={handleInputChange}
                                                placeholder="thành phố Huế"
                                            />
                                            {errors.tenhuyen && (
                                                <div className="error">
                                                    {errors.tenhuyen}
                                                </div>
                                            )}
                                        </div>
                                        <div className="input-group">
                                            <label htmlFor="nguongocrung">
                                                Nhiệt độ{" "}
                                                <span className="important">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                id="nguongocrung"
                                                name="nhietdo"
                                                type="text"
                                                value={tempValues.nhietdo}
                                                onChange={handleInputChange}
                                                placeholder="37"
                                            />
                                            {errors.nhietdo && (
                                                <p className="error">
                                                    {errors.nhietdo}
                                                </p>
                                            )}
                                        </div>
                                        <div className="input-group">
                                            <label htmlFor="malo">
                                                Độ ẩm{" "}
                                                <span className="important">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                id="malo"
                                                name="doam"
                                                type="text"
                                                value={tempValues.doam}
                                                onChange={handleInputChange}
                                                placeholder="80"
                                            />
                                            {errors.doam && (
                                                <p className="error">
                                                    {errors.doam}
                                                </p>
                                            )}
                                        </div>
                                        <div className="input-group">
                                            <label htmlFor="luongmua">
                                                Lượng mưa
                                            </label>
                                            <input
                                                id="luongmua"
                                                name="luongmua"
                                                type="text"
                                                value={tempValues.luongmua}
                                                onChange={handleInputChange}
                                                placeholder="200"
                                            />
                                            {errors.luongmua && (
                                                <p className="error">
                                                    {errors.luongmua}
                                                </p>
                                            )}
                                        </div>
                                        <div className="input-group">
                                            <label htmlFor="capdubao">
                                                Cấp dự báo
                                                <span className="important">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                id="capdubao"
                                                name="capdubao"
                                                type="text"
                                                value={tempValues.capdubao}
                                                onChange={handleInputChange}
                                                placeholder="I,II,III,IV,V"
                                            />
                                            {errors.capdubao && (
                                                <p className="error">
                                                    {errors.capdubao}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <div className="input-container">
                                            {visibleColumns
                                                .filter(
                                                    ({ field }) =>
                                                        field in headerMapping
                                                )
                                                .map(({ field }) => (
                                                    <div
                                                        className="input-group"
                                                        key={field}
                                                        style={{
                                                            fontSize: "14px",
                                                        }}
                                                    >
                                                        <label htmlFor={field}>
                                                            {
                                                                headerMapping[
                                                                    field
                                                                ]
                                                            }{" "}
                                                            <span className="important">
                                                                *
                                                            </span>
                                                        </label>
                                                        <input
                                                            id={field}
                                                            name={field}
                                                            type="text"
                                                            value={
                                                                lorungTempValues[
                                                                    field
                                                                ] || ""
                                                            }
                                                            onChange={
                                                                handleInputChange
                                                            }
                                                            placeholder={
                                                                fieldHints[
                                                                    field
                                                                ] ||
                                                                headerMapping[
                                                                    field
                                                                ]
                                                            }
                                                        />

                                                        {errors[field] && (
                                                            <div className="error">
                                                                {errors[field]}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    className="search-button"
                                    disabled={!isValid}
                                    // onClick={() =>
                                    //     setUpdateOrInsert({
                                    //         state: false,
                                    //         type: "insert",
                                    //         id: null,
                                    //     })
                                    // }
                                >
                                    {updateOrInsert.type === "insert"
                                        ? "Thêm"
                                        : "Cập nhật"}
                                </button>
                                <button
                                    onClick={handleCloseDialog}
                                    className="close-button"
                                >
                                    Đóng
                                </button>
                            </div>
                            {/* <div style={{ height: "100vh", padding: "1rem" }}>
                                <LeafletDrawMap
                                    onGeometryChange={(geom) =>
                                        setTempValues((prev) => ({
                                            ...prev,
                                            geom,
                                        }))
                                    }
                                />
                            </div> */}
                            <div
                                style={{
                                    width: "100vh",
                                    padding: "1rem",
                                    borderLeft: "1px solid #ccc",
                                }}
                            >
                                <h2>Bản đồ lấy tọa độ khu vực</h2>
                                <LeafletDrawMap
                                    onGeometryChange={(geom) => {
                                        if (
                                            showUserTable ===
                                            "cảnh báo cháy rừng"
                                        ) {
                                            setTempValues((prev) => ({
                                                ...prev,
                                                geom,
                                            }));
                                        } else if (
                                            showUserTable ===
                                            "hiện trạng lô rừng"
                                        ) {
                                            setLorungTempValues((prev) => ({
                                                ...prev,
                                                geom,
                                            }));
                                        }
                                    }}
                                />
                            </div>
                            {/* <ul>
                                {lorungTempValues.geom?.coordinates[0].map(
                                    ([lng, lat], index) => (
                                        <li key={index}>
                                            Kinh độ: {lng}, Vĩ độ: {lat}
                                        </li>
                                    )
                                )}
                            </ul> */}
                        </form>
                    </div>
                )}
                {deleteDialog.state && (
                    <div className="dialog">
                        <div className="dialog-delete">
                            <h3>Bạn thật sự muốn xóa dữ liệu này?</h3>
                            <button
                                onClick={() => handleDelete(deleteDialog.id)}
                                className="close-button"
                            >
                                Xác nhận
                            </button>
                            <button
                                onClick={() =>
                                    setDeleteDialog({ state: false })
                                }
                                className="button"
                            >
                                Hủy bỏ
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    }
);

import {
    CartesianGrid,
    Tooltip,
    Legend,
    BarChart,
    XAxis,
    YAxis,
    Bar,
} from "recharts";
import { RiGitClosePullRequestFill } from "react-icons/ri";

const ThongKe = ({ data, showUserTable }) => {
    console.log(data, "data from thongke");

    const [selectedXa, setSelectedXa] = useState("");
    const [selectedMetrics, setSelectedMetrics] = useState(["name"]);
    const [groupedData, setGroupedData] = useState([]);
    const [tenxa, setTenxa] = useState([]);
    const [metrics, setMetrics] = useState([]);
    const [toggleDataTable, setToggleDataTable] = useState(false); // Bật tắt bảng dữ liệu khi thống kê

    //start các biến kết hợp để làm hàm chức năng mỗi khi sort dữ liệu trên bảng thì dữ liệu biểu đồ được sắp xếp theo thứ tự đó
    const [sortField, setSortField] = useState(null);
    const [sortOrder, setSortOrder] = useState(null); // 1 = asc, -1 = desc
    const [sortedChartData, setSortedChartData] = useState([]);
    //end các biến kết hợp để làm hàm chức năng mỗi khi sort dữ liệu trên bảng thì dữ liệu biểu đồ được sắp xếp theo thứ tự đó
    const chartData = groupedData
        .filter((item) => !selectedXa || item.tenxa === selectedXa)
        .map((item) => {
            const result = { name: item.tenxa }; // Sử dụng tenxa cho cột x
            selectedMetrics.forEach((metric) => {
                result[metric] = item[metric];
            });
            return result;
        })
        .filter((item) =>
            selectedMetrics.some((metric) => item[metric] !== undefined)
        );
    {
        metrics.map((metric, index) => console.log(metric)), "metrics";
    }
    useEffect(() => {
        setSelectedMetrics([]);

        if (showUserTable === "hiện trạng lô rừng") {
            const grouped = data.reduce((acc, item) => {
                const { tenxa, soto, sothua, dientich } = item;
                if (!acc[tenxa]) {
                    acc[tenxa] = { tenxa, soto: 0, sothua: 0, dientich: 0 };
                }
                acc[tenxa].soto += soto || 0;
                acc[tenxa].sothua += sothua || 0;
                acc[tenxa].dientich += dientich || 0;
                return acc;
            }, {});

            // Chuyển đổi đối tượng thành mảng
            setGroupedData(Object.values(grouped));

            // Danh sách xã
            const uniqueTenxa = Object.keys(grouped);
            setTenxa(uniqueTenxa);

            // Lấy danh sách các chỉ số tùy theo showUserTable
            const keys = ["soto", "sothua", "dientich"];
            setMetrics(keys);
        }

        if (showUserTable === "cảnh báo cháy rừng") {
            const grouped = data.reduce((acc, item) => {
                const { tenhuyen, nhietdo, doam, luongmua, capdubao } = item;
                if (!acc[tenhuyen]) {
                    acc[tenhuyen] = {
                        tenxa: tenhuyen, // để đồng bộ với các phần còn lại
                        nhietdo: 0,
                        doam: 0,
                        luongmua: 0,
                        capdubao: "",
                        count: 0,
                    };
                }

                acc[tenhuyen].nhietdo += nhietdo || 0;
                acc[tenhuyen].doam += doam || 0;
                acc[tenhuyen].luongmua += luongmua || 0;
                acc[tenhuyen].count += 1;
                acc[tenhuyen].capdubao = item.capdubao; // Hoặc xử lý thống kê riêng
                return acc;
            }, {});

            const averaged = Object.values(grouped).map((item) => ({
                ...item,
                nhietdo: item.nhietdo / item.count,
                doam: item.doam / item.count,
                luongmua: item.luongmua / item.count,
            }));

            setGroupedData(averaged);
            setTenxa(Object.keys(grouped));
            setMetrics(["nhietdo", "doam", "luongmua", "capdubao"]);
        }
    }, [data, showUserTable]);

    //start các hàm kết hợp để làm hàm chức năng mỗi khi sort dữ liệu trên bảng thì dữ liệu biểu đồ được sắp xếp theo thứ tự đó
    const handleSort = (e) => {
        setSortField(e.sortField);
        setSortOrder(e.sortOrder);
    };
    useEffect(() => {
        if (sortField && sortOrder !== null) {
            const sortedData = [...chartData].sort((a, b) => {
                const aValue = a[sortField];
                const bValue = b[sortField];

                if (aValue == null) return 1;
                if (bValue == null) return -1;

                if (typeof aValue === "string") {
                    return sortOrder * aValue.localeCompare(bValue);
                }

                return sortOrder * (aValue - bValue);
            });

            setSortedChartData(sortedData);
        } else {
            setSortedChartData(chartData);
        }
    }, [chartData, sortField, sortOrder]);
    //end các hàm kết hợp để làm hàm chức năng mỗi khi sort dữ liệu trên bảng thì dữ liệu biểu đồ được sắp xếp theo thứ tự đó
    const handleXaChange = (event) => {
        setSelectedXa(event.target.value);
    };

    const handleMetricChange = (event) => {
        const value = event.target.value;
        setSelectedMetrics((prev) =>
            prev.includes(value)
                ? prev.filter((metric) => metric !== value)
                : [...prev, value]
        );
    };
    // Bảng màu cố định cho các bar trong barchart
    const getBarColor = (metric) => {
        switch (metric) {
            case "nhietdo":
                return "#FF6347";
            case "doam":
                return "#4682B4";
            case "luongmua":
                return "#82ca9d";
            case "capdubao":
                return "#FFD700";
            case "soto":
                return "blue";
            case "sothua":
                return "#82ca9d";
            case "dientich":
                return "black";
            default:
                return "#8884d8";
        }
    };

    // Chuẩn bị dữ liệu cho biểu đồ

    console.log(chartData, "chartData");
    const labelMapping = {
        name: "Tên xã",
        nhietdo: "Nhiệt độ",
        doam: "Độ ẩm",
        luongmua: "Lượng mưa",
        created_at: "Thời gian tạo",
        updated_at: "Thời gian cập nhật",
        capdubao: "Cấp dự báo",
        soto: "Số tờ",
        sothua: "Số thửa",
        dientich: "Diện tích",
    };
    const formatKeyToLabel = (key) => {
        // Nếu có trong mapping thì trả về mapping
        if (labelMapping[key]) return labelMapping[key];
        if (typeof key !== "string") return "";
        // Nếu không có: tách từ, viết hoa chữ cái đầu (ví dụ: "luongmuaTrungBinh" -> "Luongmua Trung Binh")
        return key
            .replace(/([A-Z])/g, " $1") // thêm dấu cách trước chữ in hoa
            .replace(/_/g, " ") // nếu là snake_case
            .replace(/\b\w/g, (char) => char.toUpperCase()); // viết hoa chữ cái đầu
    };
    const dynamicColumns =
        chartData && chartData.length > 0
            ? Object.keys(chartData[0]).map((key) => ({
                  field: key,
                  header: key.charAt(0).toUpperCase() + key.slice(1),
              }))
            : [];
    return (
        <div>
            <div
                style={{
                    paddingLeft: "40px",
                    paddingRight: "20px",
                    display: "flex",
                }}
            >
                <div>
                    <h2>Thống kê Hiện trạng Lô Rừng</h2>
                    {showUserTable === "hiện trạng lô rừng" ? (
                        <div>
                            {Array.isArray(tenxa) && tenxa.length > 1 && (
                                <div className="combobox">
                                    <label>Xã:</label>
                                    <select
                                        onChange={handleXaChange}
                                        value={selectedXa}
                                    >
                                        <option value="">Chọn xã</option>
                                        {tenxa.map((item, index) => (
                                            <option key={index} value={item}>
                                                {item}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                            <div>
                                <label>Chọn chỉ số thống kê:</label>
                                {metrics.map((metric, index) => (
                                    <div
                                        key={metric}
                                        style={{ marginBottom: "4px" }}
                                    >
                                        <input
                                            type="checkbox"
                                            id={metric}
                                            value={metric}
                                            onChange={handleMetricChange}
                                        />
                                        <label htmlFor={metric}>{metric}</label>
                                    </div>
                                ))}
                                {metrics.includes("sothua") && (
                                    <i
                                        style={{
                                            fontSize: "14px",
                                        }}
                                    >
                                        <u>Chú thích:</u>Chỉ có chỉ số{" "}
                                        <u style={{ color: "red" }}>số thửa</u>{" "}
                                        sẽ được đối chiếu với cột bên phải trong
                                        đồ thị thống kê
                                    </i>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div>
                            {Array.isArray(tenxa) && tenxa.length > 1 && (
                                <div className="combobox">
                                    <label>Xã:</label>
                                    <select
                                        onChange={handleXaChange}
                                        value={selectedXa}
                                    >
                                        <option value="">Chọn xã</option>
                                        {tenxa.map((item, index) => (
                                            <option key={index} value={item}>
                                                {item}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                            <div>
                                <label>Chọn chỉ số thống kê:</label>
                                {metrics.map((metric, index) => (
                                    <div
                                        key={metric}
                                        style={{ marginBottom: "4px" }}
                                    >
                                        <input
                                            type="checkbox"
                                            id={metric}
                                            value={metric}
                                            onChange={handleMetricChange}
                                        />
                                        <label htmlFor={metric}>{metric}</label>
                                    </div>
                                ))}
                                {metrics.includes("luongmua") && (
                                    <i style={{ fontSize: "14px" }}>
                                        <u>Chú thích:</u> Chỉ có chỉ số{" "}
                                        <u style={{ color: "red" }}>
                                            lượng mưa
                                        </u>{" "}
                                        sẽ được đối chiếu với cột bên phải trong
                                        đồ thị thống kê
                                    </i>
                                )}
                            </div>
                        </div>
                    )}
                </div>
                <div style={{ minWidth: "600px" }}>
                    <h3 style={{ marginLeft: "20px" }}>Kết quả thống kê:</h3>
                    {chartData.length > 0 ? (
                        <BarChart
                            width={600}
                            height={300}
                            data={sortedChartData}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" /> {/* Cột x sử dụng tenxa */}
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
                            {selectedMetrics.map((metric, index) => (
                                <Bar
                                    key={index}
                                    dataKey={metric}
                                    yAxisId={
                                        metric === "luongmua" ||
                                        metric === "sothua"
                                            ? "right"
                                            : "left"
                                    }
                                    fill={getBarColor(metric)} // Gọi hàm để lấy màu cố định cho từng cột
                                />
                            ))}
                        </BarChart>
                    ) : (
                        <p style={{ marginLeft: "20px" }}>
                            Không có dữ liệu để hiển thị.
                        </p>
                    )}
                </div>
            </div>
            {chartData.length > 0 ? (
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <button
                        onClick={() => setToggleDataTable(!toggleDataTable)}
                        style={{
                            justifyItems: "center",
                            fontWeight: "bold",
                            fontSize: "16px",
                            border: "1px solid #000",
                            borderRadius: "12px",
                        }}
                    >
                        Bảng dữ liệu
                    </button>
                </div>
            ) : (
                <div></div>
            )}
            {chartData.length > 0 && toggleDataTable === true ? (
                <div style={{ marginLeft: "40px" }}>
                    <DataTable
                        value={sortedChartData}
                        paginator
                        rows={5}
                        stripedRows
                        showGridlines
                        sortField={sortField}
                        sortOrder={sortOrder}
                        onSort={handleSort}
                    >
                        {["name", ...selectedMetrics].map((key) => (
                            <Column
                                key={key}
                                field={key}
                                header={formatKeyToLabel(key)}
                                sortable
                                filter
                            />
                        ))}
                    </DataTable>
                </div>
            ) : (
                <div></div>
            )}
        </div>
    );
};
export default DataPage;
