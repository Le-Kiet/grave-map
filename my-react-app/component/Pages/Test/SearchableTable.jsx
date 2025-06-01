import React, {
    useState,
    useCallback,
    useEffect,
    useMemo,
    useRef,
} from 'react';
import DataTable from './DataTable';
import Fuse from 'fuse.js';
import DataDialog from './DataDialog';
import { useMediaQuery } from 'react-responsive';
import { IoIosAddCircleOutline } from 'react-icons/io';

const ToggleButtonGroup = ({ onToggle }) => {
    const [isToggled, setIsToggled] = useState(true);
    return (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
                onClick={() => {
                    onToggle(true);
                    setIsToggled(true); // Cập nhật trạng thái khi nút này được nhấn
                }}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: isToggled ? 'black' : 'transparent', // Thay đổi màu nền
                    color: isToggled ? 'white' : 'black', // Thay đổi màu chữ
                }}
            >
                <img
                    src="https://cdn-icons-png.flaticon.com/128/5546/5546021.png"
                    alt="Kỵ giỗ"
                    style={{
                        width: '20px',
                        height: '20px',
                        marginRight: '0.5rem',
                    }}
                />
                Bia mộ
            </button>

            <button
                onClick={() => {
                    onToggle(false);
                    setIsToggled(false); // Cập nhật trạng thái khi nút này được nhấn
                }}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: !isToggled ? 'black' : 'transparent', // Thay đổi màu nền
                    color: !isToggled ? 'white' : 'black', // Thay đổi màu chữ
                }}
            >
                <img
                    src="https://cdn-icons-png.flaticon.com/128/3657/3657120.png"
                    alt="Kỵ giỗ"
                    style={{
                        width: '20px',
                        height: '20px',
                        marginRight: '0.5rem',
                    }}
                />
                Kỵ giỗ
            </button>
        </div>
    );
};

const SearchableTable = ({
    father,
    paginatedData,
    updatingData,
    handleDeleteConfirm,
    onRowClick,
    permissionsId,
}) => {
    const [fatherTable, setFather] = useState('table');
    const [updateOrInsert, setUpdateOrInsert] = useState({
        type: 'insert',
        id: null,
    });
    const [inputValue, setInputValue] = useState('');
    const [latLng, setLatLng] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortConfig, setSortConfig] = useState({
        field: null,
        direction: null,
    });
    const [markerData, setMarkerData] = useState([]);
    const [currentId, setCurrentId] = useState(null);
    const isMobile = useMediaQuery({ query: '(max-width: 1024px)' });
    const [isLandscape, setIsLandscape] = useState(false);
    useEffect(() => {
        const checkOrientation = () => {
            const landscape = window.matchMedia(
                '(orientation: landscape)'
            ).matches;
            setIsLandscape(landscape);
        };

        checkOrientation(); // lần đầu
        window.addEventListener('resize', checkOrientation);

        return () => {
            window.removeEventListener('resize', checkOrientation);
        };
    }, []);
    const [tempValues, setTempValues] = useState({
        // hoten: '',
        // sodt: '',
        // diachi: '',
        // gioitinh: '',
        // cccd: '',
        // img: [],
        grave: '',
        generation: '',
        location: '',
        anni_date: '',
        event_name: '',
        location_name: '',
        address: '',
        note: '',
    });
    const [filters, setFilters] = useState({});
    const toggleRef = useRef(true);
    useEffect(() => {
        if (father === 'demo') {
            const fetchData = async () => {
                try {
                    const response = await fetch(
                        'http://localhost:8000/api/grave'
                    );
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const data = await response.json();
                    console.log('Response Data:', data);
                    setMarkerData(data);
                    console.log('Marker Data:', markerData);
                } catch (error) {
                    console.error('Fetch error:', error);
                }
            };
            fetchData();
        }
    }, []);
    const headerMap = {
        grave: 'Tên Mộ',
        generation: 'Đời thứ',
        location: 'Địa điểm',
        anni_date: 'Ngày kỵ',
        event_name: 'Công việc',
        location_name: 'Địa điểm tổ chức',
        address: 'Địa chỉ',
        note: 'Ghi chú',
    };

    const [visibleColumns, setVisibleColumns] = useState(
        Object.keys(tempValues).map((key) => ({
            field: key,
            header: headerMap[key] || key,
        }))
    );
    // có thể tìm cách khác để khỏi re-render?

    const handleSearchChange = useCallback((e) => {
        setInputValue(e.target.value);
    }, []);
    const handleColumnFilterChange = useCallback((e, field) => {
        const value = e.target.value;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [field]: value,
        }));
    }, []);
    // const updatingData = useCallback(
    //     (id) => {
    //         const selectedRow = markerData.find((item) => item.id === id);
    //         if (!selectedRow) return;
    //         setCurrentId(id);
    //         setTempValues({
    //             ...selectedRow,
    //             latitude: selectedRow.latitude || latLng?.lat,
    //             longtitude: selectedRow.longtitude || latLng?.lng,
    //         });
    //         setUpdateOrInsert({ state: true, type: 'update', id });
    //     },
    //     [markerData, latLng]
    // );
    const [propsData, setPropsData] = useState([]);
    const [type, setType] = useState('grave');
    const [toggleData, setToggleData] = useState(false);
    const [immediateType, setImmediateType] = useState('grave');
    const handleToggle = useCallback(
        (val) => {
            if (father === 'demo') {
                toggleRef.current = val;
                const newType = val ? 'grave' : 'anniversary';

                const filtered = paginatedData.filter(
                    (item) => item.type === newType
                );

                const fieldsToShow = val
                    ? ['grave', 'generation', 'location', 'note']
                    : [
                          'anni_date',
                          'event_name',
                          'location_name',
                          'address',
                          'note',
                      ];

                const updatedVisibleColumns = fieldsToShow.map((key) => ({
                    field: key,
                    header: headerMap[key] || key,
                }));

                setVisibleColumns(updatedVisibleColumns);
                setPropsData(filtered);

                // Ghi nhận trạng thái mới nếu cần dùng sau
                setType(newType);
                setImmediateType(newType); // bạn có thể dùng biến tạm như immediateType nếu cần

                // Nếu bạn mở dialog hoặc cập nhật props ngay sau đây, hãy dùng newType thay vì state
                console.log('Đang dùng newType:', newType);
            }
        },
        [father, paginatedData]
    );

    useEffect(() => {
        console.log(type, 'type sau khi cập nhật');
        // hoặc thực hiện xử lý khác phụ thuộc vào type
    }, [type]);
    console.log(type, 'type sau khi cập nhật ngaofi useEffect');

    useEffect(() => {
        if (father === 'graveyard') {
            const graveFields = ['grave', 'generation', 'location', 'note'];

            setVisibleColumns(
                graveFields.map((item) => ({
                    field: item,
                    header: headerMap[item] || item,
                }))
            );
            setPropsData(paginatedData);
        } else if (father === 'anniversary') {
            const filtered = paginatedData.filter(
                (item) => item.type === 'anniversary'
            );
            const graveFields = [
                'anni_date',
                'event_name',
                'location_name',
                'address',
                'note',
            ];

            setVisibleColumns(
                graveFields.map((item) => ({
                    field: item,
                    header: headerMap[item] || item,
                }))
            );
            setPropsData(paginatedData);
            // setPropsData(filtered);
        }
    }, [toggleData, paginatedData]);

    const getProcessedData = useMemo(() => {
        if (!propsData) return [];
        // 👇 Lọc theo toggleData: true => 'grave', false => 'anniversary'
        console.log('propsData', propsData, toggleData);
        let dataToProcess = paginatedData;
        if (father === 'demo') {
            const targetType = toggleData ? 'grave' : 'anniversary';
            dataToProcess = propsData;
        }
        // console.log('dataToProcess', dataToProcess, toggleData, propsData);
        // console.log(searchQuery, 'searchQuery');
        // Bước 1: Tìm kiếm (searchQuery)
        if (searchQuery) {
            const options = {
                keys: ['grave', 'generation', 'location'],
                threshold: 0.4,
                distance: 100,
            };
            const fuse = new Fuse(dataToProcess, options);
            dataToProcess = fuse.search(searchQuery).map((res) => res.item);
        }

        // Bước 2: Lọc theo cột (filters)
        dataToProcess = dataToProcess.filter((row) => {
            return Object.entries(filters).every(([field, value]) => {
                if (!value) return true;
                const cellValue = row[field];
                return (
                    cellValue &&
                    cellValue
                        .toString()
                        .toLowerCase()
                        .includes(value.toLowerCase())
                );
            });
        });

        // Bước 3: Sắp xếp
        if (sortConfig.field) {
            dataToProcess.sort((a, b) => {
                const aVal = a[sortConfig.field];
                const bVal = b[sortConfig.field];

                if (aVal == null) return 1;
                if (bVal == null) return -1;

                if (typeof aVal === 'number' && typeof bVal === 'number') {
                    return sortConfig.direction === 'asc'
                        ? aVal - bVal
                        : bVal - aVal;
                }

                return sortConfig.direction === 'asc'
                    ? aVal.toString().localeCompare(bVal.toString())
                    : bVal.toString().localeCompare(aVal.toString());
            });
        }

        return dataToProcess;
    }, [propsData, toggleData, searchQuery, filters, sortConfig]);
    // console.log('getProcessedData', getProcessedData);
    const handleSort = useCallback((field) => {
        console.log('handleSort', field, sortConfig);
        setSortConfig((prev) => {
            if (prev.field === field) {
                return {
                    field,
                    direction: prev.direction === 'asc' ? 'desc' : 'asc',
                };
            }
            return { field, direction: 'asc' };
        });
        console.log('handleSort', field, sortConfig);
    }, []);
    // Debounce logic
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setSearchQuery(inputValue); // chỉ set khi người dùng dừng nhập 300ms
        }, 0); // 300ms delay

        return () => clearTimeout(timeoutId); // clear khi inputValue thay đổi
    }, [inputValue]);
    // console.log('re-redner searchable table');
    //paginatedData
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 10;
    const itemsPerPageGraveYard = 20;
    const handleCloseDialog = () => {
        setUpdateOrInsert({
            state: false,
            type: 'insert',
            id: null,
        });
        setTempValues({});
        console.log('Dialog được ddongs');
    };

    // Lọc dữ liệu theo tìm kiếm và bộ lọc cột
    const filteredData = useMemo(() => {
        return propsData.filter((row) => {
            const searchMatch = Object.values(row).some((value) =>
                value
                    ?.toString()
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
            );

            const filtersMatch = Object.entries(filters).every(([key, value]) =>
                row[key]?.toString().toLowerCase().includes(value.toLowerCase())
            );

            return searchMatch && filtersMatch;
        });
    }, [propsData, searchQuery, filters]);

    // const paginateData = useMemo(() => {
    //     if (father === 'graveyard') {
    //         const startIndex = (currentPage - 1) * itemsPerPageGraveYard;
    //         return getProcessedData.slice(
    //             startIndex,
    //             startIndex + itemsPerPageGraveYard
    //         );
    //     }
    //     const startIndex = (currentPage - 1) * itemsPerPage;
    //     return getProcessedData.slice(startIndex, startIndex + itemsPerPage);
    // }, [getProcessedData, currentPage]);

    const totalPages = useMemo(
        () =>
            father === 'graveyard'
                ? Math.ceil(filteredData.length / itemsPerPageGraveYard)
                : Math.ceil(filteredData.length / itemsPerPage),
        [filteredData.length, father]
    );

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
    const tableRef = useRef(null);
    const [tableWidth, setTableWidth] = useState(900);
    useEffect(() => {
        const updateWidth = () => {
            if (tableRef.current) {
                setTableWidth(tableRef.current.offsetWidth);
            }
        };

        updateWidth();
        window.addEventListener('resize', updateWidth);

        return () => {
            window.removeEventListener('resize', updateWidth);
        };
    }, [propsData, visibleColumns]);
    const [manualInput, setManualInput] = useState(true);

    const handleOpenManualDialog = () => {
        setManualInput(true);
        setUpdateOrInsert({ state: true, type: 'insert' });
    };
    return (
        <div
            style={{
                padding: '0 1rem 1rem 1rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center', // căn giữa theo chiều ngang
            }}
        >
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                    maxWidth: `${tableWidth}px`,
                    marginBottom: '1rem',
                    marginRight: '1.5rem',
                }}
            >
                <div>
                    <input
                        type="text"
                        placeholder="Tìm kiếm..."
                        value={inputValue}
                        onChange={handleSearchChange}
                        style={{
                            padding: '0.5rem',
                            width: '200px',
                            borderRadius: '4px',
                        }}
                    />
                    <IoIosAddCircleOutline
                        onClick={() => handleOpenManualDialog()}
                        style={{
                            height: '2em',
                            width: 'auto',
                            cursor: 'pointer',
                            fill: 'green',
                            alignSelf: 'center',
                        }}
                    />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {father === 'demo' && (
                        <ToggleButtonGroup
                            onToggle={handleToggle}
                            isToggled={toggleData}
                        />
                    )}
                </div>
            </div>

            {/* Bảng dữ liệu */}
            <div ref={tableRef}>
                <DataTable
                    paginatedData={getProcessedData}
                    visibleColumns={visibleColumns}
                    sortConfig={sortConfig}
                    handleSort={handleSort}
                    filters={filters}
                    searchQuery={searchQuery}
                    handleSearchChange={handleSearchChange}
                    handleColumnFilterChange={handleColumnFilterChange}
                    updatingData={updatingData}
                    handleDeleteConfirm={handleDeleteConfirm}
                    onRowClick={onRowClick}
                    permissionsId={permissionsId}
                />
            </div>
            {/* Pagination */}
            <div style={{ marginTop: '0px', textAlign: 'center' }}>
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    ← Trước
                </button>
                <span style={{ margin: '0 1rem' }}>
                    Trang {currentPage} / {totalPages}
                </span>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    Tiếp →
                </button>
            </div>
            {/* {(() => {
                const currentType = toggleRef.current ? 'grave' : 'anniversary';
                console.log('🔥 Type thực sự truyền đi:', currentType);
                return (
                    <DataDialog
                        type={currentType}
                        fatherTable={fatherTable}
                        updateOrInsert={updateOrInsert}
                        tempValues={tempValues}
                        setTempValues={setTempValues}
                        visibleColumns={visibleColumns}
                        latitude={latLng?.lat}
                        longtitude={latLng?.lng}
                        handleCloseDialog={handleCloseDialog}
                    />
                ); // Ensure this function returns a valid JSX element or null
            })()} */}

            <DataDialog
                type={type}
                fatherTable={fatherTable}
                updateOrInsert={updateOrInsert}
                tempValues={tempValues}
                setTempValues={setTempValues}
                visibleColumns={visibleColumns}
                latitude={latLng?.lat}
                longtitude={latLng?.lng}
                handleCloseDialog={handleCloseDialog}
            />
        </div>
    );
};

export default SearchableTable;
