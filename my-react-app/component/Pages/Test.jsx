import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { MultiSelect } from "primereact/multiselect";
import { FaSortAmountDown } from "react-icons/fa";
import { FaSortAmountUp } from "react-icons/fa";
import { FaSort, FaFilter } from "react-icons/fa6";
import { IoPencilOutline } from "react-icons/io5";
import { IoTrash } from "react-icons/io5";
import { FaGripLinesVertical } from "react-icons/fa";
import LeafletDrawMap from "../LeafletDrawMap.jsx";
import DataDialog from "./Test/DataDialog.jsx";
import DataTable from "./Test/DataTable.jsx";
// import VirtualizedForm from "./Test/VirtualizedForm.jsx";

function Test({ showUserTable }) {
    const [data, setData] = useState([]);
    const [columnName, setColumnName] = useState([]);
    const [visibleColumns, setVisibleColumns] = useState([]);
    const [globalFilterValue, setGlobalFilterValue] = useState("");
    const [errors, setErrors] = useState({});
    const [isValid, setIsValid] = useState(false);

    const [inputValue, setInputValue] = useState("");
    const [zoomMarker, setZoomMarker] = useState(false);
    // 👇 Thêm các state cho phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    //sort
    const [sortConfig, setSortConfig] = useState({
        field: null,
        direction: null,
    });
    //filter
    const [filterVisible, setFilterVisible] = useState({});
    const [filters, setFilters] = useState({});
    //giá trị tạm thời cho form
    const [noMapDialog, setNoMapDialog] = useState(false);

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
    const [lorungDraftValues, setLorungDraftValues] = useState({});
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
    const [testInputPerformance, setTestInputPerformance] = useState("");
    //delete dialog
    const [deleteDialog, setDeleteDialog] = useState({
        state: false,
        id: null,
    });
    const [updateOrInsert, setUpdateOrInsert] = useState({
        state: false,
        type: "insert",
        id: null,
    });
    const [dataDialog, setDataDialog] = useState(false);

    const [filterInput, setFilterInput] = useState("");
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
    const handleOpenDialog = () => {
        setUpdateOrInsert({ state: true, type: "insert", id: null }); // Gọi callback khi mở dialog
        setDataDialog(true);
    };
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
    useEffect(() => {
        const fetchData = async () => {
            let url = "";
            if (showUserTable === "hiện trạng lô rừng") {
                url = "http://localhost:8000/api/lorung/all";
            } else if (showUserTable === "cảnh báo cháy rừng") {
                url = "http://localhost:8000/api/lamnghiep";
            } else if (showUserTable === "biến động diện tích rừng") {
                url = "http://localhost:8000/api/geom";
            }

            try {
                const response = await axios.get(url);
                let rawData = response.data.data || response.data;
                if (url.includes("geom")) {
                    rawData = rawData.map((area) => ({
                        ...area,
                        coordinates: JSON.parse(area.geom).coordinates,
                    }));
                }

                setData(rawData);
                if (rawData.length > 0) {
                    const keys = Object.keys(rawData[0]).filter(
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
                    );
                    const columns = keys.map((key) => ({
                        field: key,
                        header: key.charAt(0).toUpperCase() + key.slice(1),
                    }));
                    setColumnName(columns);
                    setVisibleColumns(columns.slice(0, 10));
                }
            } catch (err) {
                console.error("Fetch error:", err);
            }
        };

        fetchData();
        setCurrentPage(1);
    }, [showUserTable]);

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

    useEffect(() => {
        // const timer = setTimeout(() => {
        setGlobalFilterValue(inputValue);
        setCurrentPage(1); // reset về trang 1 khi tìm kiếm
        // }, 0);
        // return () => clearTimeout(timer);
    }, [inputValue]);

    const filteredData = useMemo(() => {
        return data.filter((row) => {
            const matchesGlobal =
                !globalFilterValue ||
                Object.values(row).some(
                    (val) =>
                        val &&
                        val.toString().toLowerCase().includes(globalFilterValue)
                );

            const matchesColumnFilters = Object.entries(filters).every(
                ([field, value]) => {
                    if (!value) return true;
                    const cellValue = row[field];
                    return (
                        cellValue &&
                        cellValue
                            .toString()
                            .toLowerCase()
                            .includes(value.toLowerCase())
                    );
                }
            );

            return matchesGlobal && matchesColumnFilters;
        });
    }, [data, globalFilterValue, filters]);

    const handleSort = (field) => {
        setSortConfig((prev) => {
            if (prev.field === field) {
                // Toggle direction
                const nextDir =
                    prev.direction === "asc"
                        ? "desc"
                        : prev.direction === "desc"
                        ? null
                        : "asc";
                return { field: nextDir ? field : null, direction: nextDir };
            }
            return { field, direction: "asc" };
        });
    };
    const sortedData = useMemo(() => {
        if (!sortConfig.field || !sortConfig.direction) return filteredData;

        const sorted = [...filteredData].sort((a, b) => {
            const aVal = a[sortConfig.field];
            const bVal = b[sortConfig.field];
            if (aVal === null || aVal === undefined) return 1;
            if (bVal === null || bVal === undefined) return -1;
            if (typeof aVal === "number" && typeof bVal === "number") {
                return sortConfig.direction === "asc"
                    ? aVal - bVal
                    : bVal - aVal;
            }
            return sortConfig.direction === "asc"
                ? aVal.toString().localeCompare(bVal.toString())
                : bVal.toString().localeCompare(aVal.toString());
        });

        return sorted;
    }, [filteredData, sortConfig]);

    // 👇 Pagination logic
    const totalPages = Math.ceil(filteredData.length / rowsPerPage);
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * rowsPerPage;
        return sortedData.slice(start, start + rowsPerPage);
    }, [sortedData, currentPage]);
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const getPageNumbers = (currentPage, totalPages, maxButtons = 7) => {
        const pages = [];
        const half = Math.floor(maxButtons / 2);

        const showLeftDots = currentPage > half + 1;
        const showRightDots = currentPage < totalPages - half;

        if (totalPages <= maxButtons) {
            // Hiển thị tất cả trang nếu ít hơn maxButtons
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Luôn hiển thị trang đầu
            pages.push(1);

            if (showLeftDots && !showRightDots) {
                pages.push("left-dots");
                for (
                    let i = totalPages - (maxButtons - 3);
                    i < totalPages;
                    i++
                ) {
                    pages.push(i);
                }
            } else if (!showLeftDots && showRightDots) {
                for (let i = 2; i < maxButtons - 1; i++) {
                    pages.push(i);
                }
                pages.push("right-dots");
            } else if (showLeftDots && showRightDots) {
                pages.push("left-dots");
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i);
                }
                pages.push("right-dots");
            }

            // Luôn hiển thị trang cuối
            pages.push(totalPages);
        }

        return pages;
    };
    const toggleFilter = (field) => {
        setFilterVisible((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (showUserTable === "cảnh báo cháy rừng") {
            setTempValues((prev) => ({
                ...prev,
                [name]: value,
            }));
        } else if (showUserTable === "hiện trạng lô rừng") {
            // console.log(lorungTempValues, "lorungTempValues");
            setLorungTempValues((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("== BẮT ĐẦU SUBMIT ==");
        console.log("Giá trị table:", showUserTable);
        console.log("Giá trị updateOrInsert:", updateOrInsert);
        const finalValues = {
            ...lorungTempValues,
            ...lorungDraftValues,
        };

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
    const handleColumnFilterChange = (e, column) => {
        setFilters((prev) => ({
            ...prev,
            [column]: e.target.value,
        }));
    };
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

    //mở dialog xác nhận thật sự muốn xóa?
    const handleDeleteConfirm = (id) => {
        setDeleteDialog({ state: true, id });
    };
    // gọi api delete dòng dữ liệu được chọn
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

                setData((prev) => prev.filter((row) => row.id !== actualId));
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
    // console.log("Data:", data);
    // console.log("Column Name:", columnName);
    // console.log("Visible Columns:", visibleColumns);
    // console.log("Global Filter Value:", globalFilterValue);
    // console.log("Errors:", errors);
    // console.log("Is Valid:", isValid);
    // console.log("Input Value:", inputValue);
    // console.log("Current Page:", currentPage);
    // console.log("Sort Config:", sortConfig);
    // console.log("Filter Visible:", filterVisible);
    // console.log("Filters:", filters);
    // console.log("Temp Values:", tempValues);
    // console.log("Lorung Temp Values:", lorungTempValues);
    // console.log("Delete Dialog:", deleteDialog);
    // console.log("Update or Insert:", updateOrInsert);
    return (
        <div style={{ padding: "1rem" }}>
            <input
                id={1000}
                name="test"
                type="text"
                value={testInputPerformance}
                onChange={(e) => setTestInputPerformance(e.target.value)}
                placeholder="testing"
            />
            <h2>Bảng dữ liệu (tự tạo)</h2>
            <div
                style={{
                    marginBottom: "1rem",
                    display: "flex",
                    gap: "1rem",
                    flexWrap: "wrap",
                }}
            >
                <input
                    type="text"
                    placeholder="Tìm kiếm..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    style={{ padding: "0.5rem", width: "200px" }}
                />
                <MultiSelect
                    value={visibleColumns}
                    options={columnName}
                    onChange={(e) => setVisibleColumns(e.value)}
                    optionLabel="header"
                    placeholder="Chọn cột hiển thị"
                    display="chip"
                    style={{ minWidth: "200px" }}
                />
            </div>
            {/* <VirtualizedForm/> */}
            <DataDialog
                updateOrInsert={updateOrInsert}
                handleSubmit={handleSubmit}
                visibleColumns={visibleColumns}
                showUserTable={showUserTable}
                lorungTempValues={lorungTempValues}
                setLorungTempValues={setLorungTempValues}
                tempValues={tempValues}
                setTempValues={setTempValues}
                handleInputChange={handleInputChange}
                errors={errors}
                isValid={isValid}
                handleCloseDialog={handleCloseDialog}
                testInputPerformance={testInputPerformance}
                setTestInputPerformance={setTestInputPerformance}
                zoomMarker={zoomMarker}
            />
            <DataTable
                visibleColumns={visibleColumns}
                sortConfig={sortConfig}
                handleSort={handleSort}
                filterVisible={filterVisible}
                toggleFilter={toggleFilter}
                filters={filters}
                handleColumnFilterChange={handleColumnFilterChange}
                paginatedData={paginatedData}
                updatingData={updatingData}
                handleDeleteConfirm={handleDeleteConfirm}
            />

            <div style={{ marginTop: "1rem", textAlign: "center" }}>
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    style={{ marginRight: "10px" }}
                >
                    Prev
                </button>

                {getPageNumbers(currentPage, totalPages).map((item, idx) =>
                    typeof item === "string" ? (
                        <span key={`dots-${idx}`} style={{ margin: "0 3px" }}>
                            ...
                        </span>
                    ) : (
                        <button
                            key={`page-${item}`}
                            onClick={() => handlePageChange(item)}
                            style={{
                                margin: "0 3px",
                                fontWeight:
                                    currentPage === item ? "bold" : "normal",
                            }}
                        >
                            {item}
                        </button>
                    )
                )}

                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    style={{ marginLeft: "10px" }}
                >
                    Next
                </button>
            </div>
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
                            onClick={() => setDeleteDialog({ state: false })}
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

export default Test;
