import React, { useState, useEffect } from "react";
import DataTableComponent from "./DataTableComponent.jsx";
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { TabView, TabPanel } from "primereact/tabview";
import { InputSwitch } from "primereact/inputswitch";
// component cho việc tạo lịch chọn ngày
import DatePicker from "react-datepicker";
import { FaCalendarAlt } from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";
import "./AdminPage.css"; // Import CSS file for styling
const AdminPage = ({ user, showUserTable, permissionsId }) => {
    const [historyData, setHistoryData] = useState([]); //dữ liệu ban đầu của api lịch sử thay đổi của cảnh báo cháy rừng
    const [lorunghistoryData, setLorunghistoryData] = useState([]); // dữ liệu ban đầu của api lịch sử thay đổi của hiện trạng lô rừng
    const [pendingApprovals, setPendingApprovals] = useState([]); //biến phê duyệt dữ liệu
    const [selectedRows, setSelectedRows] = useState([]);
    const [rowClick, setRowClick] = useState(true);
    //start các biến kết hợp để lấy dữ liệu cho phân quyền trong checkbox role
    const [permissions, setPermission] = useState([]); //dữ liệu ban đầu của quyền hạn
    const [rolePermissions, setRolePermission] = useState([]); // dữ liệu ban đầu của quan hệ quyền hạn và chức vụ
    const [roles, setRole] = useState([]); // dữ liệu ban đầu của chức vụ
    //end các biến kết hợp để lấy dữ liệu cho phân quyền trong checkbox role

    const [activeTab, setActiveTab] = useState("cảnh báo cháy rừng"); // biến tab để thay đổi trang lịch sử của cảnh báo cháy và hiện trạng lô rừng
    const [selectedDate, setSelectedDate] = useState(null); // Chọn ngày để filter lịch sử các thay đổi trong ngày

    //start các biến kết hợp để tìm kiếm lịch sử trong 1 khoảng ngày
    const [tempRange, setTempRange] = useState([null, null]);
    const [dateRange, setDateRange] = useState([
        new Date(new Date().setDate(new Date().getDate() - 1)).getTime(),
        new Date().getTime(),
    ]);
    const [startDate, endDate] = dateRange;
    //end các biến kết hợp để tìm kiếm lịch sử trong 1 khoảng ngày

    const [actionFilter, setActionFilter] = useState("all"); // biến để lọc thao tác thêm xóa sửa trong lịch sử

    //api lịch sử,chức vụ, phân quyền, quan hệ phân quyền và chức vụ
    useEffect(() => {
        const fetchAllData = async () => {
            if (
                showUserTable === "phê duyệt cập nhật dữ liệu" &&
                activeTab === "cảnh báo cháy rừng"
            ) {
                console.log("getting pending approvals");
                axios
                    .get("http://localhost:8000/api/approval/pending")
                    .then((res) => setPendingApprovals(res.data))
                    .catch((err) =>
                        console.error("Failed to fetch pending approvals:", err)
                    );
                console.log(pendingApprovals, "pendingApproval");
            } else if (
                showUserTable === "phê duyệt cập nhật dữ liệu" &&
                activeTab === "hiện trạng lô rừng"
            ) {
                console.log("getting pending approvals");
                axios
                    .get("http://localhost:8000/api/approval/pending_lorung")
                    .then((res) => setPendingApprovals(res.data))
                    .catch((err) =>
                        console.error("Failed to fetch pending approvals:", err)
                    );
                console.log(pendingApprovals, "pendingApproval");
            }
            try {
                const [
                    historyRes,
                    lorunghistoryRes,
                    rolesRes,
                    permissionsRes,
                    rolePermissionsRes,
                ] = await Promise.all([
                    axios.get("http://localhost:8000/api/final_history"),
                    axios.get("http://localhost:8000/api/lorung_final_history"),
                    axios.get("http://localhost:8000/api/admin/roles"),
                    axios.get("http://localhost:8000/api/admin/permissions"),
                    axios.get(
                        "http://localhost:8000/api/admin/rolepermissions"
                    ),
                ]);

                setHistoryData(historyRes.data);
                console.log(historyRes.data, "historyfetch");
                setLorunghistoryData(lorunghistoryRes.data);
                setRole(rolesRes.data);
                setPermission(permissionsRes.data);
                setRolePermission(rolePermissionsRes.data);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
        };

        fetchAllData();
    }, [showUserTable && activeTab]); // Chạy lại khi showUserTable hoặc activeTab thay đổi
    //start các hàm phê duyệt, từ chối thay đổi dữ liệu
    const handleApprove = async (id) => {
        if (activeTab === "cảnh báo cháy rừng")
            try {
                await axios.post(
                    `http://localhost:8000/api/approval/approve/${id}`
                );
                setPendingApprovals((prev) =>
                    prev.filter((item) => item.id !== id)
                );
            } catch (error) {
                console.error("Approval failed:", error);
            }
        else if (activeTab === "hiện trạng lô rừng") {
            try {
                await axios.post(
                    `http://localhost:8000/api/approval/approve_lorung/${id}`
                );
                setPendingApprovals((prev) =>
                    prev.filter((item) => item.id !== id)
                );
            } catch (error) {
                console.error("Approval failed:", error);
            }
        }
    };

    const handleReject = async (id) => {
        if (activeTab === "cảnh báo cháy rừng")
            try {
                await axios.post(
                    `http://localhost:8000/api/approval/reject/${id}`
                );
                setPendingApprovals((prev) =>
                    prev.filter((item) => item.id !== id)
                );
            } catch (error) {
                console.error("Rejection failed:", error);
            }
        else if (activeTab === "hiện trạng lô rừng") {
            try {
                await axios.post(
                    `http://localhost:8000/api/approval/reject_lorung/${id}`
                );
                setPendingApprovals((prev) =>
                    prev.filter((item) => item.id !== id)
                );
            } catch (error) {
                console.error("Approval failed:", error);
            }
        }
    };
    const handleBulkApprove = async () => {
        for (const row of selectedRows) {
            await handleApprove(row.id);
        }
        setSelectedRows([]);
    };

    const handleBulkReject = async () => {
        for (const row of selectedRows) {
            await handleReject(row.id);
        }
        setSelectedRows([]);
    };
    const vietnameseFieldNames = {
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

    const renderApprovalTable = () => {
        const sourceData =
            activeTab === "cảnh báo cháy rừng"
                ? groupedData
                : groupedLorungData;

        const filteredGroup = filterByDateRange(sourceData);
        return (
            <div>
                <div
                    style={{
                        marginBottom: "10px",
                        display: "flex",
                        gap: "10px",
                    }}
                >
                    <button
                        disabled={selectedRows.length === 0}
                        onClick={() => handleBulkApprove()}
                        style={{
                            backgroundColor: "green",
                            color: "white",
                            padding: "8px 15px",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                        }}
                    >
                        Duyệt tất cả đã chọn
                    </button>
                    <button
                        disabled={selectedRows.length === 0}
                        onClick={() => handleBulkReject()}
                        style={{
                            backgroundColor: "red",
                            color: "white",
                            padding: "8px 15px",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                        }}
                    >
                        Từ chối tất cả đã chọn
                    </button>
                </div>
                <div className="flex justify-content-center align-items-center mb-4 gap-2">
                    <InputSwitch
                        inputId="input-rowclick"
                        checked={rowClick}
                        onChange={(e) => setRowClick(e.value)}
                    />
                    <label htmlFor="input-rowclick">Row Click</label>
                </div>
                <DataTable
                    value={pendingApprovals}
                    selection={selectedRows}
                    onSelectionChange={(e) => setSelectedRows(e.value)}
                    dataKey="id"
                    emptyMessage="Không có bản ghi chờ duyệt"
                    className="admin-table"
                >
                    <Column
                        dataKey="id"
                        selectionMode={rowClick ? null : "multiple"} // bật checkbox khi rowClick tắt
                        headerStyle={{ width: "3em", zIndex: 1 }}
                        // onClick={() => setSelectedRows(true)}
                        style={{ zIndex: 1 }}
                        bodyStyle={{ pointerEvents: "auto" }}
                    />
                    <Column field="id" header="ID" />
                    <Column field="action" header="Tác vụ" />
                    <Column
                        field="data"
                        header="Dữ liệu"
                        body={(rowData) => {
                            try {
                                const parsed = JSON.parse(rowData.data);

                                // Ưu tiên hiển thị tentinh thay vì matinh, tenhuyen thay vì mahuyen...
                                const skipIfHasAlternative = {
                                    matinh: "tentinh",
                                    mahuyen: "tenhuyen",
                                    maxa: "tenxa",
                                };

                                const displayed = [];

                                return Object.entries(parsed)
                                    .map(([key, value]) => {
                                        // Bỏ qua field nếu đã có field thay thế
                                        if (
                                            skipIfHasAlternative[key] &&
                                            parsed[skipIfHasAlternative[key]]
                                        ) {
                                            return null;
                                        }

                                        // Bỏ qua nếu value null/undefined hoặc là geojson
                                        if (value === null || key === "geom") {
                                            return null;
                                        }

                                        displayed.push(
                                            <div key={key}>
                                                <strong>
                                                    {vietnameseFieldNames[
                                                        key
                                                    ] || key}
                                                    :
                                                </strong>{" "}
                                                {value.toString()}
                                            </div>
                                        );
                                        return null;
                                    })
                                    .concat(displayed); // return danh sách đã xử lý
                            } catch {
                                return rowData.data;
                            }
                        }}
                    />
                    <Column field="created_at" header="Thời gian" />
                    <Column
                        header="Thao tác"
                        body={(rowData) => (
                            <div style={{ display: "flex", gap: "10px" }}>
                                <button
                                    onClick={() => handleApprove(rowData.id)}
                                    style={{
                                        backgroundColor: "green",
                                        color: "white",
                                        padding: "5px 10px",
                                    }}
                                >
                                    Duyệt
                                </button>
                                <button
                                    onClick={() => handleReject(rowData.id)}
                                    style={{
                                        backgroundColor: "red",
                                        color: "white",
                                        padding: "5px 10px",
                                    }}
                                >
                                    Từ chối
                                </button>
                            </div>
                        )}
                    />
                </DataTable>
            </div>
        );
    };

    //end các hàm phê duyệt, từ chối thay đổi dữ liệu

    const groupedData = historyData.reduce((acc, item) => {
        const date = new Date(item.created_at).toDateString(); // Lấy ngày từ created_at
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(item);
        return acc;
    }, {});
    const groupedLorungData = lorunghistoryData.reduce((acc, item) => {
        const date = new Date(item.created_at).toDateString(); // Lấy ngày từ created_at
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(item);
        return acc;
    }, {});
    const combinedData = user.map((user) => {
        const userRole = roles.find((r) => r.id === user.role_id);
        return {
            ...user,
            roleName: userRole ? userRole.name : null,
            // roleDescription: userRole ? userRole.description : null,
        };
    });

    const PermissionsManager = roles.map((role) => {
        const assignedPermissions = rolePermissions
            .filter((rp) => rp.role_id === role.id)
            .map((rp) => {
                const permission = permissions.find(
                    (p) => p.id === rp.permission_id
                );
                // console.log(permission.description, "permission");
                return permission
                    ? {
                          id: permission.id,
                          name: permission.name,
                          description: permission.description,
                      }
                    : null;
            })
            .filter(Boolean); // Loại bỏ các giá trị null

        return {
            ...role,
            permissions: assignedPermissions,
        };
    });
    // các hàm để filter lịch sử thay đổi theo ngày
    const handleDateChange = (date) => {
        setSelectedDate(date);
        // filteredDate();
    };
    const filterByDateRange = (dataGroup) => {
        if (!startDate || !endDate) return dataGroup;

        return Object.fromEntries(
            Object.entries(dataGroup).filter(([dateStr]) => {
                const date = new Date(dateStr);
                return date >= startDate && date <= endDate;
            })
        );
    };
    const renderHistoryTable = (activeTab) => {
        const sourceData =
            activeTab === "cảnh báo cháy rừng"
                ? groupedData
                : groupedLorungData;

        const filteredGroup = filterByDateRange(sourceData);

        return Object.entries(filteredGroup).map(([date, dataList]) => {
            const filteredByAction =
                actionFilter === "all"
                    ? dataList
                    : dataList.filter((item) => item.action === actionFilter);
            if (!filteredByAction || filteredByAction.length === 0) return null;
            if (!dataList || dataList.length === 0) return null;

            const allKeys = new Set();

            const parsedDataList = filteredByAction.map((item) => {
                try {
                    const parsed = JSON.parse(item.data);
                    Object.keys(parsed).forEach((key) => {
                        if (key !== "action") allKeys.add(key);
                    });
                    return {
                        ...parsed,
                        action: item.action,
                        created_at: item.created_at,
                    };
                } catch (err) {
                    console.error("Lỗi parse JSON:", item.data, err);
                    return {
                        action: item.action,
                        created_at: item.created_at,
                    };
                }
            });
            console.log(parsedDataList, "parsedDataList");
            return (
                <div
                    key={date}
                    className="data-table-container"
                    style={{ maxWidth: "100%" }}
                >
                    <h3>{date}</h3>
                    <DataTable
                        value={parsedDataList}
                        emptyMessage="Không có dữ liệu để hiển thị"
                        className="admin-table"
                    >
                        <Column field="action" header="Action" />

                        {parsedDataList.length > 0 &&
                            Object.keys(parsedDataList[0]).map((key) => (
                                <Column
                                    key={key}
                                    field={key}
                                    header={
                                        vietnameseFieldNames[key] ||
                                        key.charAt(0).toUpperCase() +
                                            key.slice(1)
                                    }
                                />
                            ))}

                        <Column field="created_at" header="Thời gian tạo" />
                    </DataTable>
                </div>
            );
        });
    };

    return (
        <div style={{ paddingTop: "10px", width: "90%" }}>
            <div style={{ display: "flex", width: "100%" }}>
                {showUserTable === "user" && permissionsId.includes(1) ? (
                    <DataTableComponent DataAPI={combinedData} type="user" />
                ) : showUserTable === "role" &&
                  [2, 3].some((id) => permissionsId.includes(id)) ? (
                    <DataTableComponent
                        DataAPI={PermissionsManager}
                        type="role"
                    />
                ) : showUserTable === "lịch sử" ? (
                    <div
                        style={{
                            paddingLeft: "40px",
                            paddingRight: "20px",
                            width: "100%",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                marginBottom: "20px",
                                gap: "10px",
                                paddingLeft: "40px",
                            }}
                        >
                            <button
                                onClick={() =>
                                    setActiveTab("cảnh báo cháy rừng")
                                }
                                style={{
                                    padding: "10px 20px",
                                    border: "none",
                                    borderRadius: "5px",
                                    background:
                                        activeTab === "cảnh báo cháy rừng"
                                            ? "#007bff"
                                            : "#e0e0e0",
                                    color:
                                        activeTab === "cảnh báo cháy rừng"
                                            ? "#fff"
                                            : "#000",
                                    cursor: "pointer",
                                }}
                            >
                                Cảnh báo cháy rừng
                            </button>
                            <button
                                onClick={() =>
                                    setActiveTab("hiện trạng lô rừng")
                                }
                                style={{
                                    padding: "10px 20px",
                                    border: "none",
                                    borderRadius: "5px",
                                    background:
                                        activeTab === "hiện trạng lô rừng"
                                            ? "#007bff"
                                            : "#e0e0e0",
                                    color:
                                        activeTab === "hiện trạng lô rừng"
                                            ? "#fff"
                                            : "#000",
                                    cursor: "pointer",
                                }}
                            >
                                Hiện trạng lô rừng
                            </button>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                            }}
                        >
                            <h3>History Data</h3>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                }}
                            >
                                <label>Lọc theo ngày: </label>
                                <FaCalendarAlt size={20} color="#555" />
                                <DatePicker
                                    selectsRange
                                    startDate={tempRange[0]}
                                    endDate={tempRange[1]}
                                    onChange={(update) => {
                                        setTempRange(update);
                                        if (update[0] && update[1]) {
                                            setDateRange([
                                                update[0].getTime(),
                                                update[1].getTime(),
                                            ]);
                                        }
                                    }}
                                    dateFormat="dd/MM/yyyy"
                                    placeholderText="Chọn khoảng ngày"
                                    className="custom-datepicker"
                                />
                                <label>Lọc theo tác vụ: </label>
                                <select
                                    value={actionFilter}
                                    onChange={(e) =>
                                        setActionFilter(e.target.value)
                                    }
                                    style={{
                                        padding: "6px",
                                        borderRadius: "4px",
                                        border: "1px solid #ccc",
                                    }}
                                >
                                    <option value="all">Tất cả</option>
                                    <option value="create">Tạo mới</option>
                                    <option value="update">Chỉnh sửa</option>
                                    <option value="delete">Xóa</option>
                                </select>
                            </div>
                        </div>
                        <div style={{ transition: "all 0.5s ease-in-out" }}>
                            {renderHistoryTable(activeTab)}
                        </div>
                    </div>
                ) : showUserTable === "phê duyệt cập nhật dữ liệu" ? (
                    <div
                        style={{
                            paddingLeft: "40px",
                            paddingRight: "20px",
                            width: "100%",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                marginBottom: "20px",
                                gap: "10px",
                                paddingLeft: "40px",
                            }}
                        >
                            <button
                                onClick={() =>
                                    setActiveTab("cảnh báo cháy rừng")
                                }
                                style={{
                                    padding: "10px 20px",
                                    border: "none",
                                    borderRadius: "5px",
                                    background:
                                        activeTab === "cảnh báo cháy rừng"
                                            ? "#007bff"
                                            : "#e0e0e0",
                                    color:
                                        activeTab === "cảnh báo cháy rừng"
                                            ? "#fff"
                                            : "#000",
                                    cursor: "pointer",
                                }}
                            >
                                Cảnh báo cháy rừng
                            </button>
                            <button
                                onClick={() =>
                                    setActiveTab("hiện trạng lô rừng")
                                }
                                style={{
                                    padding: "10px 20px",
                                    border: "none",
                                    borderRadius: "5px",
                                    background:
                                        activeTab === "hiện trạng lô rừng"
                                            ? "#007bff"
                                            : "#e0e0e0",
                                    color:
                                        activeTab === "hiện trạng lô rừng"
                                            ? "#fff"
                                            : "#000",
                                    cursor: "pointer",
                                }}
                            >
                                Hiện trạng lô rừng
                            </button>
                        </div>
                        {renderApprovalTable(activeTab)}
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default AdminPage;
