import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import LeafletDrawMap from '../LeafletDrawMap';
import DataDialog from './Test/DataDialog';
import DataTable from './Test/DataTable';
import { FaTable, FaPen } from 'react-icons/fa';
import SearchableTable from './Test/SearchableTable';
import { useLocation } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
const Demo = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const permissionsId = location.state?.permissionsId;
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
    const [latLng, setLatLng] = useState(null);
    const [father, setFather] = useState('demo');
    const [dialog, setDialog] = useState({ state: false, id: null });
    const [openDataTable, setOpenDataTable] = useState(false);
    const [filterColumns, setFilterColumns] = useState(false);
    const [manualInput, setManualInput] = useState(true);
    const [updateOrInsert, setUpdateOrInsert] = useState({
        state: false,
        type: 'insert',
        id: null,
    });
    const [noMapDialog, setNoMapDialog] = useState(false);
    const [tempValues, setTempValues] = useState({
        latitude: '',
        longtitude: '',
        hoten: '',
        sodt: '',
        diachi: '',
        gioitinh: '',
        cccd: '',
        img: [],
    });
    const [visibleColumns, setVisibleColumns] = useState(
        Object.keys(tempValues).map((key) => ({
            field: key,
            header: key.charAt(0).toUpperCase() + key.slice(1),
        }))
    );
    const [updateDataIfCRUDSuccess, setUpdateDataIfCRUDSuccess] =
        useState(false);
    // const [visibleColumns, setVisibleColumns] = useState(
    //     Object.keys(tempValues)
    // );
    const [filters, setFilters] = useState({});
    const [currentId, setCurrentId] = useState(null);
    const [sortConfig, setSortConfig] = useState({
        field: null,
        direction: null,
    });
    const [deleteDialog, setDeleteDialog] = useState({
        state: false,
        id: null,
    });
    const [source, setSource] = useState('');
    // const [latLng, setLatLng] = useState(null)
    // const filteredData = useMemo(() => {
    //     return markerData.filter((row) => {
    //         const matchesGlobal =
    //             !globalFilterValue ||
    //             Object.values(row).some(
    //                 (val) =>
    //                     val &&
    //                     val.toString().toLowerCase().includes(globalFilterValue)
    //             );

    //         // const matchesColumnFilters = Object.entries(filters).every(
    //         //     ([field, value]) => {
    //         //         if (!value) return true;
    //         //         const cellValue = row[field];
    //         //         return (
    //         //             cellValue &&
    //         //             cellValue
    //         //                 .toString()
    //         //                 .toLowerCase()
    //         //                 .includes(value.toLowerCase())
    //         //         );
    //         //     }
    //         // );

    //         return matchesGlobal /* && matchesColumnFilters */;
    //     });
    // }, [markerData, filters]);

    const handleGeometryChange = useCallback(
        (geom) => {
            if (geom?.type === 'Point') {
                const [lng, lat] = geom.coordinates;
                setLatLng({ lat, lng });

                // Cập nhật trực tiếp vào tempValues để luôn đồng bộ
                setTempValues((prevValues) => ({
                    ...prevValues,
                    latitude: lat,
                    longtitude: lng,
                }));
                console.log('Dialog được ddongs', updateOrInsert, noMapDialog);
                if (updateOrInsert.id) {
                    setNoMapDialog(true);
                    setDialog({ type: 'update', state: true, id: null });
                    console.log(1);
                } else if (updateOrInsert.id === null) {
                    setUpdateOrInsert({ state: true, type: 'insert' });
                    setNoMapDialog(false);
                    console.log(2);
                }
            }
        },
        [updateOrInsert, noMapDialog]
    );
    const handleCloseDialog = () => {
        setUpdateOrInsert({
            state: false,
            type: 'insert',
            id: null,
        });
        setTempValues({});
        console.log('Dialog được ddongs', updateOrInsert, noMapDialog);
        setManualInput(false);
    };
    //api grave
    const [graveMarkerData, setGraveMarkerData] = useState([]);
    const [anniversaryData, setAnniversaryData] = useState([]);
    const [markerData, setMarkerData] = useState([]);

    // Fetch grave data
    useEffect(() => {
        const fetchGraveData = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/grave');
                if (!response.ok)
                    throw new Error('Network response was not ok');
                const data = await response.json();
                setGraveMarkerData(data);
            } catch (error) {
                console.error('Fetch grave data error:', error);
            }
        };
        fetchGraveData();
    }, []);

    // Fetch anniversary data
    useEffect(() => {
        const fetchAnniversaryData = async () => {
            try {
                const response = await fetch(
                    'http://localhost:8000/api/pass-away-anni'
                );
                if (!response.ok)
                    throw new Error('Network response was not ok');
                const data = await response.json();
                setAnniversaryData(data);
            } catch (error) {
                console.error('Fetch anniversary data error:', error);
            }
        };
        fetchAnniversaryData();
    }, []);

    // Merge when both have data
    useEffect(() => {
        if (graveMarkerData.length > 0 || anniversaryData.length > 0) {
            const merged = [
                ...graveMarkerData.map((item) => ({ ...item, type: 'grave' })),
                ...anniversaryData.map((item) => ({
                    ...item,
                    type: 'anniversary',
                })),
            ];
            setMarkerData(merged);
        }
    }, [graveMarkerData, anniversaryData]);

    //api demo
    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const response = await fetch('http://localhost:8000/api/demo');
    //             if (!response.ok) {
    //                 throw new Error('Network response was not ok');
    //             }
    //             const data = await response.json();
    //             console.log('Response Data:', data);
    //             setMarkerData(data);
    //             console.log('Marker Data:', markerData);
    //         } catch (error) {
    //             console.error('Fetch error:', error);
    //         }
    //     };
    //     fetchData();
    // }, [updateDataIfCRUDSuccess]);

    const handleDelete = useCallback((id) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa không?')) return;
        fetch(`http://localhost:8000/api/demo/delete/${id[1]}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((res) => res.json())
            .then((data) => {
                console.log('Success:', data);
                alert('Xóa thành công!');
                setUpdateDataIfCRUDSuccess(!updateDataIfCRUDSuccess);
                setDeleteDialog({ state: false, id: null });
            })
            .catch((err) => {
                console.error('Error:', err);
            });
    }, []);
    // const handleDeleteConfirm = (id) => {
    //     setDeleteDialog({ state: true, id });
    // };
    const handleSubmit = useCallback(
        (e) => {
            e.preventDefault();
            if (updateOrInsert.type === 'insert') {
                let payload = {
                    ...tempValues,
                    longtitude: latLng?.lng,
                    latitude: latLng?.lat,
                };

                // Kiểm tra trường img và xử lý nếu cần
                if (Array.isArray(payload.img)) {
                    payload.img = payload.img.map((image) => image.preview); // Chỉ lấy URL từ preview
                }

                console.log('Payload gửi lên:', payload);

                fetch('http://localhost:8000/api/demo', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                })
                    .then((res) => res.json())
                    .then((data) => {
                        console.log('Success:', data);
                        alert('Thêm thành công!');
                        setDialog({ state: false, id: null });
                        setUpdateDataIfCRUDSuccess(!updateDataIfCRUDSuccess);
                        setUpdateOrInsert({ state: false, type: 'insert' });
                    })
                    .catch((err) => {
                        console.error('Error:', err);
                        alert('Có lỗi xảy ra: ' + err.message);
                    });
            } else {
                handleUpdate(e);
            }
        },
        [tempValues, latLng, updateOrInsert]
    );

    const handleUpdate = useCallback(
        (e) => {
            e.preventDefault();

            const payload = {
                ...tempValues,
                longtitude: tempValues.longtitude,
                latitude: tempValues.latitude,
            };

            if (Array.isArray(payload.img)) {
                payload.img = payload.img.map((image) => image.preview); // Chỉ lấy URL từ preview
            }

            console.log('Payload:', payload);

            fetch(`http://localhost:8000/api/demo/update/${currentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            })
                .then((res) => res.json())
                .then((data) => {
                    console.log('Success:', data);
                    alert('Cập nhật thành công!');
                    setDialog({ state: false, id: null }); // Đóng dialog
                    setUpdateDataIfCRUDSuccess(!updateDataIfCRUDSuccess);
                })
                .catch((err) => {
                    console.error('Error:', err);
                });
        },
        [tempValues, currentId, updateDataIfCRUDSuccess]
    );
    const { latitude, longtitude } = location.state || {};

    useEffect(() => {
        if (latitude && longtitude) {
            console.log('Đã nhận dữ liệu từ GraveYard:', latitude, longtitude);
            setLatLng({ lat: Number(latitude), lng: Number(longtitude) });
        }
    }, [latitude, longtitude]);
    const handleRowClick = useCallback(
        (id) => {
            console.log('Row clicked 123');
            const marker = markerData.find((m) => m.id === id);
            if (latitude && longtitude) {
                console.log(1);
                setLatLng({ lat: Number(latitude), lng: Number(longtitude) });
            } else if (marker) {
                console.log(2);
                setLatLng({ lat: marker.latitude, lng: marker.longtitude });
            }
            console.log(marker, 'marker');
            console.log(latLng, 'latLng');
            console.log(latitude, 'latitude', longtitude, 'longtitude');
        },
        [markerData, latitude, longtitude, latLng]
    );
    const [type, setType] = useState('graveyard');
    const updatingData = useCallback(
        (id) => {
            const selectedRow = markerData.find((item) => item.id === id);
            if (!selectedRow) return;
            setType(selectedRow.type);
            setCurrentId(id);
            setTempValues({
                ...selectedRow,
                latitude: selectedRow.latitude || latLng?.lat,
                longtitude: selectedRow.longtitude || latLng?.lng,
            });
            setNoMapDialog(true);
            const newUpdateObj = { state: true, type: 'update', id: id };
            setUpdateOrInsert(newUpdateObj);
        },
        [markerData, latLng]
    );
    useEffect(() => {
        if (updateOrInsert?.id) {
            // console.log(
            //     'Dialog được mở đúng lúc:',
            //     updateOrInsert.id,
            //     noMapDialog
            // );
        }
    }, [updateOrInsert]);
    const handleDeleteConfirm = useCallback((id) => {
        setDeleteDialog({ state: true, id });
    }, []);

    const [searchQuery, setSearchQuery] = useState('');
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };
    // const handleColumnFilterChange = useCallback((e, field) => {
    //     const value = e.target.value;
    //     setFilters((prevFilters) => ({
    //         ...prevFilters,
    //         [field]: value,
    //     }));
    // }, []);

    // const getProcessedData = useMemo(() => {
    //     // Bước 1: Tìm kiếm toàn bộ (searchQuery)
    //     let processedData = markerData;
    //     if (searchQuery) {
    //         const options = {
    //             keys: ["hoten", "diachi", "sodt"],
    //             threshold: 0.4,
    //             distance: 100,
    //         };
    //         const fuse = new Fuse(processedData, options);
    //         processedData = fuse.search(searchQuery).map((res) => res.item);
    //     }

    //     // Bước 2: Lọc theo cột (filters)
    //     processedData = processedData.filter((row) => {
    //         return Object.entries(filters).every(([field, value]) => {
    //             if (!value) return true;
    //             const cellValue = row[field];
    //             return (
    //                 cellValue &&
    //                 cellValue
    //                     .toString()
    //                     .toLowerCase()
    //                     .includes(value.toLowerCase())
    //             );
    //         });
    //     });

    //     // Bước 3: Sắp xếp (sortConfig)
    //     if (sortConfig.field) {
    //         processedData.sort((a, b) => {
    //             const aVal = a[sortConfig.field];
    //             const bVal = b[sortConfig.field];

    //             if (aVal == null) return 1;
    //             if (bVal == null) return -1;

    //             if (typeof aVal === "number" && typeof bVal === "number") {
    //                 return sortConfig.direction === "asc"
    //                     ? aVal - bVal
    //                     : bVal - aVal;
    //             }

    //             return sortConfig.direction === "asc"
    //                 ? aVal.toString().localeCompare(bVal.toString())
    //                 : bVal.toString().localeCompare(aVal.toString());
    //         });
    //     }

    //     return processedData;
    // }, [markerData, searchQuery, filters, sortConfig]);
    const handleOpenManualDialog = () => {
        setManualInput(true);
        setUpdateOrInsert({ state: true, type: 'insert' });
    };
    //     const handleCloseDialog = () => {
    //     setManualInput(false); //
    // };
    const handleDataFromChild = (data, source) => {
        console.log('Dữ liệu:', data);
        console.log('Nguồn từ component:', source); // ghi lại tên component con
    };
    // console.log('render');
    const validMarkers = markerData.filter((marker) => {
        const lat = marker.latitude ?? marker.grave_lat;
        const lng = marker.longtitude ?? marker.grave_lng;
        return lat !== null && lng !== null;
    });

    return (
        <div
            style={
                isMobile
                    ? {
                          width: '100vw',
                          height: '100vh',
                          fontSize: '12px',
                      }
                    : {
                          width: '100%',
                          height: '100%',
                          // position relative for the container
                      }
            }
            className="demo-container"
        >
            <LeafletDrawMap
                father={father}
                onGeometryChange={handleGeometryChange}
                markerData={validMarkers}
                zoomMarker={latLng}
                style={{ height: '100%', width: '100%' }} // Full screen map
                permissionsId={permissionsId}
            />
            <button
                onClick={() => setOpenDataTable(!openDataTable)}
                style={{
                    position: 'absolute',
                    top: '5px',
                    right: '20px',
                    zIndex: 1000, // Ensure the button is above the map
                    backgroundColor: 'white',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                    padding: '10px',
                    width: '40px',
                }}
            >
                <FaTable />
            </button>
            {permissionsId.includes(1) ? (
                <button
                    onClick={() => handleOpenManualDialog()}
                    style={{
                        position: 'absolute',
                        top: '155px',
                        right: '20px',
                        zIndex: 1000, // Ensure the button is above the map
                        backgroundColor: 'white',
                        border: '1px solid #ccc',
                        borderRadius: '5px',
                        padding: '10px',
                        width: '40px',
                    }}
                >
                    <FaPen />
                </button>
            ) : (
                <></>
            )}

            {openDataTable && (
                <div
                    className={`datatable-container ${
                        openDataTable ? 'open' : ''
                    }`}
                    style={{ zIndex: '1000 !important' }}
                >
                    {/* fixing */}

                    <SearchableTable
                        paginatedData={markerData}
                        permissionsId={permissionsId}
                        father="demo"
                        currentId={currentId}
                        filters={filters}
                        updatingData={updatingData}
                        handleDeleteConfirm={handleDeleteConfirm}
                        onRowClick={handleRowClick}
                    />
                </div>
            )}

            <div>
                <DataDialog
                    type={type}
                    currentId={currentId}
                    // type="graveyard"
                    manualInput={manualInput}
                    father={father}
                    updateOrInsert={updateOrInsert}
                    noMapDialog={noMapDialog}
                    // visibleColumns={visibleColumns}
                    latitude={latLng?.lat}
                    longtitude={latLng?.lng}
                    handleSubmit={handleSubmit}
                    onGeometryChange={handleGeometryChange}
                    handleCloseDialog={handleCloseDialog}
                    onSendData={(data) =>
                        handleDataFromChild(data, 'ComponentCon')
                    }
                />
            </div>
            <button
                className="button-format"
                onClick={() => navigate('/')}
                style={{
                    position: 'absolute',
                    bottom: '32px',
                    right: '0px',
                    zIndex: 900,
                }}
            >
                Quay lại trang chủ
            </button>
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
            <style jsx>{`
                .demo-container {
                    height: 100vh !important;
                    width: 100vw !important;
                    overflow: hidden;
                }
                .leaflet-container {
                    height: 100%;
                    width: 100%;
                }
                .toggle-table-btn {
                    position: absolute;
                    bottom: 20px;
                    left: 20px;
                    background-color: white;
                    border: 1px solid #ccc;
                    padding: 10px;
                    border-radius: 5px;
                    cursor: pointer;
                    z-index: 1000;
                }
                .datatable-container {
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    max-height: 50vh;
                    transform: translateY(100%);
                    transition: transform 0.3s ease-in-out;
                    background: rgba(255, 255, 255, 0.9);
                    overflow: auto;
                    z-index: 1000;
                }
                .datatable-container.open {
                    transform: translateY(0);
                }
            `}</style>
        </div>
    );
};

export default Demo;
