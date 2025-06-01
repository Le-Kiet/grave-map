import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { IoPencilOutline } from "react-icons/io5";
import { IoTrash } from "react-icons/io5";
import { FaGripLinesVertical } from "react-icons/fa";
import { IoIosAddCircleOutline } from "react-icons/io";
import "./DataPage.css";
import * as XLSX from "xlsx";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
const DataTableComponent = ({ DataAPI, loading, type }) => {
    const [rolePermissionDialog, setRolePermissionDialog] = useState([
        { status: false, type: "edit" },
    ]);
    const [roleId, setRoleId] = useState();
    const [permissions, setPermission] = useState([]);
    const [selectedPermissionsID, setSelectedPermissionsID] = useState();
    const [deleteData, setDeleteData] = useState();
    const [dataOrImport, setDataOrImport] = useState(true);
    const [tempValues, setTempValues] = useState({
        role: "",
        guard_name: "",
        username: "",
        password: "",
        email: "",
    });
    const [fileName, setFileName] = useState("");
    const [fileData, setFileData] = useState([]);
    const [tempExcelValues, setTempExcelValues] = useState([]);
    const [errors, setErrors] = useState({});
    const [dataDialog, setDataDialog] = useState({
        state: false,
        id: null,
        type: "user",
    });
    // console.log(dataDialog, "dataDialog");
    const [openImportData, setOpenImportData] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState({
        state: false,
        id: null,
    });
    const [updateOrInsert, setUpdateOrInsert] = useState({
        state: false,
        id: null,
    });

    const [isValid, setIsValid] = useState(false);
    // const [dataExcel, setDataExcel] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:8000/api/admin/permissions"
                );
                setPermission(response.data);
            } catch (err) {
                console.error("Failed to fetch data", err);
            }
        };
        fetchData();
    }, []);
    // useEffect(() => {
    //     tempExcelValues.forEach((item) => {
    //         const excelDate = item.ngay;
    //         const jsDate = new Date((excelDate - 25569) * 86400 * 1000);

    //         const formattedDate = jsDate
    //             .toISOString()
    //             .slice(0, 19)
    //             .replace("T", " ");

    //         item.ngay = formattedDate;
    //     });
    // }, [tempExcelValues]); // Theo dõi sự thay đổi của tempExcelValues

    useEffect(() => {
        validateForm();
    }, [tempValues]);

    const validateForm = () => {
        const newErrors = {};
        if (dataDialog.type === "user") {
            if (!tempValues.role)
                newErrors.role = "Dữ liệu không được phép bỏ trống";
            if (!tempValues.guard_name)
                newErrors.guard_name = "Dữ liệu không được phép bỏ trống";
        }
        if (dataDialog.type === "user") {
            if (!tempValues.name) {
                newErrors.name = "Dữ liệu không được phép bỏ trống";
            }
            if (!tempValues.password) {
                newErrors.password = "Dữ liệu không được phép bỏ trống";
            }
            if (!tempValues.email) {
                newErrors.email = "Dữ liệu không được phép bỏ trống";
            }
        }
        // Kiểm tra cho loại "data"
        // if (dataDialog.type === "data") {
        //     if (!tempValues.tentinh) {
        //         newErrors.tentinh = "Dữ liệu không được phép bỏ trống";
        //     }
        //     if (!tempValues.tenhuyen) {
        //         newErrors.tenhuyen = "Dữ liệu không được phép bỏ trống";
        //     }
        //     if (!tempValues.capdubao) {
        //         newErrors.capdubao = "Dữ liệu không được phép bỏ trống";
        //     }
        //     if (tempValues.nhietdo && isNaN(tempValues.nhietdo)) {
        //         newErrors.nhietdo = "Nhiệt độ phải là số";
        //     }
        //     if (tempValues.doam && isNaN(tempValues.doam)) {
        //         newErrors.doam = "Độ ẩm phải là số";
        //     }
        //     if (tempValues.luongmua && isNaN(tempValues.luongmua)) {
        //         newErrors.luongmua = "Lượng mưa phải là số";
        //     }
        // }

        setErrors(newErrors);
        setIsValid(Object.keys(newErrors).length === 0); // Nếu không có lỗi thì form hợp lệ
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(tempValues);
        if (dataDialog.type === "role") {
            try {
                const body = JSON.stringify({
                    name: tempValues.role,
                    guard_name: tempValues.guard_name,
                });

                console.log("Body:", body);
                const response = await fetch(
                    "http://localhost:8000/api/admin/roles",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            name: tempValues.role,
                            guard_name: tempValues.guard_name,
                        }),
                    }
                );

                if (!response.ok) {
                    const errorData = await response.text(); // Lấy phản hồi dưới dạng text
                    console.error("Error details:", errorData);
                    throw new Error("Network response was not ok");
                }

                const dataa = await response.json(); // Chỉ gọi khi chắc chắn phản hồi là JSON
                console.log("Success:", dataa);
                setDataDialog(false, null);
            } catch (error) {
                console.error("Error:", error);
            }
        }
        if (dataDialog.type === "data") {
            try {
                const response = await fetch(
                    "http://localhost:8000/api/lamnghiep",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(tempValues),
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

                // setData((prev) => [...prev, dataa]); // Giả định rằng API trả về mục mới được thêm vào
                // console.log(data, "newInsertData");
                setDataDialog(false, null);
            } catch (error) {
                console.error("Error:", error);
            }
        }
        if (dataDialog.type === "user") {
            try {
                const response = await fetch(
                    "http://localhost:8000/api/admin/user",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            username: tempValues.username,
                            email: tempValues.email,
                            password: tempValues.password,
                        }),
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

                // setData((prev) => [...prev, dataa]); // Giả định rằng API trả về mục mới được thêm vào
                // console.log(data, "newInsertData");
                setDataDialog(false, null);
            } catch (error) {
                console.error("Error:", error);
            }
        }
    };

    const [currentId, setCurrentId] = useState(null);

    const updatingData = (id) => {
        setUpdateOrInsert({ state: true, id });
        setCurrentId(id);
        setDataDialog({ state: true, id: id, type: "edit" });
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(
                `http://localhost:8000/api/lamnghiep/${id}`,
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

            // Cập nhật districtArea để loại bỏ mục đã xóa
            // setData((prev) => prev.filter((row) => row.id !== id));
            console.log("Success: Item deleted");
            setDeleteDialog({ state: false });
        } catch (error) {
            console.error("Error:", error);
        }
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        console.log(e, "target");
        console.log(name, value, "target");
        setTempValues((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleDeleteConfirm = async (id) => {
        try {
            const response = await fetch(
                `http://localhost:8000/api/admin/roles/${id}`,
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

            // Cập nhật districtArea để loại bỏ mục đã xóa
            console.log("Success: Item deleted");
            setDeleteDialog({ state: false });
        } catch (error) {
            console.error("Error:", error);
        }
        setRolePermissionDialog({ state: false, type: "delete" });
    };
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        tentinh: {
            operator: FilterOperator.AND,
            constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        tenhuyen: {
            operator: FilterOperator.AND,
            constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        nhietdo: {
            operator: FilterOperator.AND,
            constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
        },
        doam: {
            operator: FilterOperator.AND,
            constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
        },
        luongmua: {
            operator: FilterOperator.AND,
            constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
        },
        capdubao: {
            operator: FilterOperator.AND,
            constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
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
    //lấy Id của dòng dữ liệu click vào:
    const [roleName, setRowName] = useState("");
    const handleRowClick = (rowData) => {
        setRowName(rowData.name);
        setRoleId(rowData.id); // Giả sử id là role_id
        const permissionIds = rowData.permissions.map(
            (permission) => permission.id
        ); // Lấy permission_id từ permissions
        setSelectedPermissionsID(permissionIds);

        // console.log("Permission IDs:", selectedPermissionsID);
    };

    const renderHeader = () => {
        switch (type) {
            case "user":
                return (
                    <div className="table-header">
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <div className="m-0" style={{ fontWeight: "bold" }}>
                                Dữ liệu người dùng
                            </div>
                            <div className="add-icon">
                                <IoIosAddCircleOutline
                                    onClick={() =>
                                        setDataDialog({
                                            state: true,
                                            id: null,
                                            type: "user",
                                        })
                                    }
                                    style={{ height: "2em", width: "auto" }}
                                    className="add-icon"
                                />
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
            case "role":
                return (
                    <div className="table-header">
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <div className="m-0" style={{ fontWeight: "bold" }}>
                                Dữ liệu phân quyền
                            </div>
                            <div className="add-icon">
                                <IoIosAddCircleOutline
                                    onClick={() =>
                                        setDataDialog({
                                            state: true,
                                            id: null,
                                            type: "role",
                                        })
                                    }
                                    style={{ height: "2em", width: "auto" }}
                                    className="add-icon"
                                />
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
            default:
                return null; // Hoặc có thể trả về một tiêu đề mặc định
        }
    };
    const renderColumns = () => {
        switch (type) {
            case "user": {
                return (
                    <>
                        <DataTable
                            value={DataAPI}
                            showGridlines
                            size={size}
                            paginator
                            stripedRows
                            rows={10}
                            header={renderHeader}
                            tableStyle={{ minWidth: "50rem" }}
                            filters={filters}
                        >
                            <Column
                                field="username"
                                sortable
                                filter
                                header="Tên người dùng"
                                filterPlaceholder="Tìm kiếm tên người dùng"
                            />
                            <Column field="email" sortable header="Email" />
                            <Column
                                field="roleName"
                                sortable
                                filter
                                header="Chức vụ"
                                filterPlaceholder="Tìm kiếm chức vụ"
                            />
                            <Column
                                body={(DataAPI) => (
                                    <div className="icon-column">
                                        <IoPencilOutline
                                            className="update-icon"
                                            onClick={() =>
                                                updatingData(DataAPI.id)
                                            }
                                        />
                                        <FaGripLinesVertical />
                                        <IoTrash
                                            className="delete-icon"
                                            onClick={() =>
                                                handleDeleteConfirm(DataAPI.id)
                                            }
                                        />
                                    </div>
                                )}
                                header="Tùy chọn"
                            />
                        </DataTable>
                    </>
                );
            }
            case "role":
                // const updatingData = (id) => {
                //     setRolePermissionDialog([true,"edit"]);
                //     setCurrentId(id);
                // };
                const handleUpdateAPI = async (id) => {
                    setRolePermissionDialog([true, "edit"]);
                };
                const handlePermissionUpdate = (permissionId, roleId) => {
                    updatePermission(permissionId, roleId); // Gọi hàm updatePermission từ props
                };

                const updatePermission = async (permissionId, roleId) => {
                    try {
                        const response = await axios.put(
                            `http://localhost:8000/api/admin/rolepermissions/${roleId}`,
                            {
                                role_id: roleId,
                                permission_id: permissionId,
                            }
                        );
                    } catch (error) {
                        console.error("Failed to update permission", error);
                    }
                };
                const handleDeleteAPI = async (id) => {
                    setRolePermissionDialog([true, "delete"]);
                    handleRowClick(id);
                    // return;
                    try {
                        const response = await fetch(
                            `http://localhost:8000/api/admin/rolepermissions/${id}`,
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

                        setDeleteData((prev) =>
                            prev.filter((row) => row.id !== id)
                        );
                        setDeleteDialog({ state: false });
                    } catch (error) {
                        console.error("Error:", error);
                    }
                };
                return (
                    <>
                        {rolePermissionDialog[0] === true &&
                            rolePermissionDialog[1] === "edit" && (
                                <div className="dialog">
                                    <div className="dialog-content">
                                        {updateOrInsert ? (
                                            <div>
                                                <h1>
                                                    Cập nhật quyền hạn cho chức
                                                    vụ
                                                    {roleName}
                                                </h1>
                                                <i>Click để toggle quyền hạn</i>
                                            </div>
                                        ) : (
                                            <h1>Thêm chức vụ mới</h1>
                                        )}
                                        <div
                                            className="legend"
                                            style={{ marginTop: "12px" }}
                                        >
                                            <div className="legend-item">
                                                <span className="active-indicator"></span>
                                                <span>Đã cấp quyên</span>{" "}
                                            </div>
                                            <div className="legend-item">
                                                <span className="inactive-indicator"></span>
                                                <span>Chưa cấp quyền</span>{" "}
                                            </div>
                                        </div>
                                        <div className="update-role-dialog-container">
                                            {/* flag */}
                                            <div className="role-container">
                                                {permissions.map((item) => (
                                                    <button
                                                        key={item.id}
                                                        className={
                                                            selectedPermissionsID.includes(
                                                                item.id
                                                            )
                                                                ? "active-permission"
                                                                : "none"
                                                        }
                                                        onClick={() =>
                                                            updatePermission(
                                                                item.id,
                                                                roleId
                                                            )
                                                        }
                                                        // onClick={()=>handleUpdateAPI(item.id)}
                                                    >
                                                        {item.name}
                                                    </button>
                                                ))}
                                            </div>
                                            <div>
                                                <button
                                                    onClick={() =>
                                                        setRolePermissionDialog(
                                                            [false, "delete"]
                                                        )
                                                    }
                                                    className="close-button"
                                                >
                                                    Đóng
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        {rolePermissionDialog[0] === true &&
                            rolePermissionDialog[1] === "delete" && (
                                <div className="dialog">
                                    <div className="dialog-content">
                                        <h1>
                                            Bạn có muốn xóa bỏ chức vụ
                                            {roleName}
                                        </h1>

                                        <div
                                            className="legend"
                                            style={{ marginTop: "12px" }}
                                        ></div>
                                        <div className="update-role-dialog-container">
                                            <div>
                                                <button
                                                    onClick={() =>
                                                        handleDeleteConfirm(
                                                            roleId
                                                        )
                                                    }
                                                    className="add-button"
                                                >
                                                    Xóa
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        setRolePermissionDialog(
                                                            [false, "delete"]
                                                        )
                                                    }
                                                    className="close-button"
                                                >
                                                    Hủy
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        <DataTable
                            value={DataAPI}
                            showGridlines
                            size={size}
                            paginator
                            stripedRows
                            rows={10}
                            header={renderHeader}
                            tableStyle={{ minWidth: "50rem" }}
                            filters={filters}
                            onRowClick={(e) => handleRowClick(e.data)} // Thêm sự kiện onRowClick
                        >
                            <Column
                                field="name"
                                sortable
                                filter
                                header="Tên chức vụ"
                                filterPlaceholder="Tìm kiếm tên người dùng"
                            />
                            <Column
                                field="permissions"
                                body={(rowData) => {
                                    return rowData.permissions
                                        .map((permission) => permission.name)
                                        .join(", ");
                                }}
                                sortable
                                header="Quyền hạn"
                            />
                            <Column
                                body={(DataAPI) => (
                                    <div className="icon-column">
                                        <IoPencilOutline
                                            className="update-icon"
                                            onClick={() =>
                                                setRolePermissionDialog([
                                                    true,
                                                    "edit",
                                                ])
                                            }
                                        />
                                        <FaGripLinesVertical />
                                        <IoTrash
                                            className="delete-icon"
                                            onClick={() =>
                                                setRolePermissionDialog([
                                                    true,
                                                    "delete",
                                                ])
                                            }
                                        />
                                    </div>
                                )}
                                header="Tùy chọn"
                            />
                        </DataTable>
                    </>
                );
            case "stats":
                return (
                    <>
                        <Column field="statistic" sortable header="Thống kê" />
                        <Column field="value" sortable header="Giá trị" />
                    </>
                );
            default:
                return null;
        }
    };

    const [sizeOptions] = useState([
        { label: "Small", value: "small" },
        { label: "Normal", value: "normal" },
        { label: "Large", value: "large" },
    ]);
    const [size, setSize] = useState(sizeOptions[1].value);
    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div style={{ paddingLeft: "40px", paddingRight: "20px" }}>
            {renderColumns()}
            {dataDialog.state && (
                <form onSubmit={handleSubmit} className="dialog">
                    <div className="dialog-content">
                        truy cập được user
                        {dataDialog.id === null ? (
                            <div>
                                <h1>Thêm dữ liệu</h1>
                            </div>
                        ) : (
                            <div>
                                <h1>Cập nhật dữ liệu</h1>
                            </div>
                        )}
                        {dataDialog.type === "user" ? (
                            <div className="input-container">
                                <div className="input-group">
                                    <label htmlFor="name">
                                        Tên người dùng{" "}
                                        <span className="important">*</span>
                                    </label>
                                    <input
                                        id="tentinh"
                                        name="name"
                                        type="text"
                                        value={tempValues.name}
                                        onChange={handleInputChange}
                                        placeholder="Tên người dùng"
                                    />
                                    {errors.name && (
                                        <div className="error">
                                            {errors.name}
                                        </div>
                                    )}
                                </div>
                                <div className="input-group">
                                    <label htmlFor="email">
                                        Email{" "}
                                        <span className="important">*</span>
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="text"
                                        value={tempValues.email}
                                        onChange={handleInputChange}
                                        placeholder="email"
                                    />
                                    {errors.email && (
                                        <div className="error">
                                            {errors.email}
                                        </div>
                                    )}
                                </div>
                                <div className="input-group">
                                    <label htmlFor="password">
                                        Password{" "}
                                        <span className="important">*</span>
                                    </label>
                                    <input
                                        id="password"
                                        name="password"
                                        type="text"
                                        value={tempValues.password}
                                        onChange={handleInputChange}
                                        placeholder="Password"
                                    />
                                    {errors.password && (
                                        <p className="error">
                                            {errors.password}
                                        </p>
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
                                    onClick={() =>
                                        setDataDialog({
                                            state: false,
                                            id: null,
                                            type: "edit",
                                        })
                                    }
                                    className="close-button"
                                >
                                    Đóng
                                </button>
                            </div>
                        ) : (
                            <div className="input-container">
                                <div className="input-group">
                                    <label htmlFor="role">
                                        Tên chức vụ
                                        <span className="important">*</span>
                                    </label>
                                    <input
                                        id="role"
                                        name="role"
                                        type="text"
                                        value={tempValues.role}
                                        onChange={handleInputChange}
                                        placeholder="Tên chức vụ"
                                    />
                                    {errors.role && (
                                        <div className="error">
                                            {errors.role}
                                        </div>
                                    )}
                                </div>
                                <div className="input-group">
                                    <label htmlFor="guard_name">
                                        Tên guard_name
                                        <span className="important">*</span>
                                    </label>
                                    <input
                                        id="guard_name"
                                        name="guard_name"
                                        type="text"
                                        value={tempValues.guard_name}
                                        onChange={handleInputChange}
                                        placeholder="Tên chức vụ"
                                    />
                                    {errors.guard_name && (
                                        <div className="error">
                                            {errors.guard_name}
                                        </div>
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
                                    onClick={() =>
                                        setDataDialog({
                                            state: false,
                                            id: null,
                                            type: "edit",
                                        })
                                    }
                                    className="close-button"
                                >
                                    Đóng
                                </button>
                            </div>
                        )}
                    </div>
                </form>
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
};
export default DataTableComponent;
