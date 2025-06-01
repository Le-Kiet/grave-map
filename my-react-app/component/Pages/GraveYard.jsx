// src/component/Pages/HomePage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './History.css'; // chứa phần style
import DataTable from './Test/DataTable';
import SearchableTable from './Test/SearchableTable';
import { useMediaQuery } from 'react-responsive';
import DataDialog from './Test/DataDialog';
const GraveYard = ({ permissionsId }) => {
    const [currentId, setCurrentId] = useState(null);
    const navigate = useNavigate();
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
    //if not good delete these lines
    const [filters, setFilters] = useState({});
    const [latLng, setLatLng] = useState(null);
    const [markerData, setMarkerData] = useState([]);
    const location = useLocation();
    const { latitude, longtitude } = location.state || {};
    const [isMobileLandscape, setIsMobileLandscape] = useState(false);
    useEffect(() => {
        const checkMobileLandscape = () => {
            const isLandscape = window.innerWidth > window.innerHeight;
            const isMobileDevice = /Mobi|Android/i.test(navigator.userAgent);
            setIsMobileLandscape(isLandscape && isMobileDevice);
        };

        checkMobileLandscape();
        window.addEventListener('resize', checkMobileLandscape);

        return () => {
            window.removeEventListener('resize', checkMobileLandscape);
        };
    }, []);

    useEffect(() => {
        console.log('Received lat/lng:', latitude, longtitude);
    }, [latitude, longtitude]);

    const [graveMarkerData, setGraveMarkerData] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/grave');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log('Response Data:', data);
                setGraveMarkerData(data);
                console.log('Marker Data:', markerData);
                console.log('Grave Marker Data:', graveMarkerData);
            } catch (error) {
                console.error('Fetch error:', error);
            }
        };
        fetchData();
    }, []);
    console.log(permissionsId, 'permissionsId in zxc');

    const handleRowClick = useCallback(
        (id) => {
            console.log('Row clicked 123');
            const marker = graveMarkerData.find((m) => m.id === id);
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
        [graveMarkerData, latitude, longtitude, latLng]
    );
    const [updateOrInsert, setUpdateOrInsert] = useState({
        state: false,
        type: 'insert',
        id: null,
    });
    const [noMapDialog, setNoMapDialog] = useState(true);
    const [tempValues, setTempValues] = useState({});
    const handleCloseDialog = () => {
        setUpdateOrInsert({
            state: false,
            type: 'insert',
            id: null,
        });
        setTempValues({});
        console.log('Dialog được ddongs', updateOrInsert, noMapDialog);
    };
    const [type, setType] = useState('graveyard');
    const updatingData = useCallback(
        (id) => {
            const selectedRow = graveMarkerData.find((item) => item.id === id);
            if (!selectedRow) return;
            console.log(id, 'id');
            setCurrentId(id);
            setType('graveyard');
            // setTempValues({
            //     ...selectedRow,
            //     latitude: selectedRow.latitude || latLng?.lat,
            //     longtitude: selectedRow.longtitude || latLng?.lng,
            // });
            setNoMapDialog(true);
            const newUpdateObj = { state: true, type: 'update', id: id };
            setUpdateOrInsert(newUpdateObj);
            // console.log('Dialog được mở', updateOrInsert.id, noMapDialog);
        },
        [graveMarkerData, latLng]
    );
    const handleDeleteConfirm = useCallback((id) => {
        setDeleteDialog({ state: true, id });
    }, []);
    const [deleteDialog, setDeleteDialog] = useState({
        state: false,
        id: null,
    });

    const handleDelete = useCallback((id) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa không?')) return;
        fetch(`http://localhost:8000/api/grave/delete/${id[1]}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((res) => res.json())
            .then((data) => {
                console.log('Success:', data);
                alert('Xóa thành công!');
                setDeleteDialog({ state: false, id: null });
            })
            .catch((err) => {
                console.error('Error:', err);
            });
    }, []);
    // console.log(graveMarkerData, 'graveMarkerData');
    //if not good delete these lines
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
    return (
        <div
            className="home-container"
            style={isMobile || isMobileLandscape ? { fontSize: '12px ' } : {}}
        >
            <div
                className={`${
                    isMobileLandscape ? 'table-container-landscape' : ''
                }`}
            >
                <h2 className="title">Bảng danh mục Phần mộ họ Nguyễn Hữu</h2>
                <div>
                    {/* {graveMarkerData.length > 0 ? ( */}
                    <SearchableTable
                        father="graveyard"
                        paginatedData={graveMarkerData}
                        filters={filters}
                        updateOrInsert={updateOrInsert}
                        currentId={currentId}
                        updatingData={updatingData}
                        handleDeleteConfirm={handleDeleteConfirm}
                        onRowClick={handleRowClick}
                        permissionsId={permissionsId}
                        onGeometryChange={handleGeometryChange}
                        handleCloseDialog={handleCloseDialog}
                    />
                    {/* ) : ( */}
                    {/* )} */}
                </div>
            </div>
            <div>
                <DataDialog
                    type={type}
                    father="graveyard"
                    paginatedData={graveMarkerData}
                    filters={filters}
                    updateOrInsert={updateOrInsert}
                    currentId={currentId}
                    updatingData={updatingData}
                    handleDeleteConfirm={handleDeleteConfirm}
                    onRowClick={handleRowClick}
                    permissionsId={permissionsId}
                    onGeometryChange={handleGeometryChange}
                    handleCloseDialog={handleCloseDialog}
                />
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
            <button
                className="button-format"
                onClick={() => navigate('/')}
                style={{
                    fontSize:
                        isMobile || isMobileLandscape ? '12px' : undefined,
                    position: 'absolute',
                    bottom: '32px',
                    right: '0px',
                }}
            >
                Quay lại trang chủ
            </button>
            <footer
                className="footer"
                style={{ position: 'fixed', bottom: '0' }}
            >
                © 2025 Phái Nhất, Chi Nhất, Họ Nguyễn Hữu.
            </footer>
        </div>
    );
};

export default GraveYard;
