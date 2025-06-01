// components/DataTable.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoPencilOutline, IoTrash } from 'react-icons/io5';
import { useMemo } from 'react';
import Fuse from 'fuse.js'; // nếu dùng fuzzy search
import {
    FaGripLinesVertical,
    FaSort,
    FaSortAmountUp,
    FaSortAmountDown,
    FaFilter,
} from 'react-icons/fa';
import { Input } from '@mantine/core';
import { useMediaQuery } from 'react-responsive';
import '../HomePage.css'; // chứa phần style
const DataTable = ({
    visibleColumns,
    sortConfig,
    handleSort,
    filters,
    handleColumnFilterChange,
    paginatedData,
    searchQuery,
    updatingData,
    handleDeleteConfirm,
    onRowClick,
    permissionsId,
}) => {
    const navigate = useNavigate();
    const isMobile = useMediaQuery({ query: '(max-width: 1024px)' });
    const [isLandscape, setIsLandscape] = useState(false);
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
    const [filterVisible, setFilterVisible] = useState({});
    const [test, setTest] = useState('');
    // console.log(searchQuery, 'searchQuery');
    // console.log('rerendered at DataTable');
    // Hàm toggle hiển thị filter

    const debounceTimeouts = useRef({}); // Lưu timeout cho từng cột

    const toggleFilter = (field) => {
        setFilterVisible((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    const handleDebouncedFilterChange = (e, field) => {
        const value = e.target.value;

        // Clear timeout cũ nếu có
        if (debounceTimeouts.current[field]) {
            clearTimeout(debounceTimeouts.current[field]);
        }

        // Đặt timeout mới
        debounceTimeouts.current[field] = setTimeout(() => {
            handleColumnFilterChange(e, field);
        }, 300); // delay 300ms
    };
    // console.log(paginatedData, 'paginatedData');

    const [windowHeight, setWindowHeight] = useState(window.innerHeight);

    useEffect(() => {
        const handleResize = () => {
            setWindowHeight(window.innerHeight);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    // console.log('Chiều cao cửa sổ:', windowHeight);

    return (
        <div
            className={isMobile ? 'data-table-mobile' : 'data-table'}
            style={{
                ...(isMobile
                    ? windowHeight > 600
                        ? { height: '350px' }
                        : windowHeight > 550
                        ? { height: '320px' }
                        : windowHeight > 500
                        ? { height: '250px' }
                        : windowHeight > 450
                        ? { height: '200px' }
                        : windowHeight > 400
                        ? { height: '150px' }
                        : { textAlign: 'left', height: '150px' }
                    : {}),
                overflow: 'auto',
                margin: 'auto 10px',
                padding: 'auto 10px',
                justifyContent: 'center',
                display: 'flex',
                fontSize: isMobile ? '10px' : '16px',
            }}
        >
            <table
                style={
                    isMobileLandscape
                        ? {
                              borderCollapse: 'collapse',
                              width: 'max-content',
                              tableLayout: 'auto',
                              justifySelf: 'center',
                          }
                        : isMobile
                        ? { borderCollapse: 'collapse', width: 'max-content' }
                        : {}
                }
            >
                <thead>
                    <tr>
                        {permissionsId.includes(1) ? (
                            <th
                                style={{
                                    padding: '8px',
                                    backgroundColor: '#f0f0f0',
                                    position: 'sticky',
                                    width: '80px',
                                    top: 0,
                                    zIndex: 1,
                                }}
                            >
                                Tùy chọn
                            </th>
                        ) : (
                            <></>
                        )}

                        {visibleColumns.map((col) =>
                            col.field === 'img' ? null : (
                                <th
                                    key={col.field}
                                    style={{
                                        padding: '8px',
                                        backgroundColor: '#f0f0f0',
                                        position: 'sticky',
                                        top: 0,
                                        zIndex: 1,
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <span
                                            onClick={() =>
                                                handleSort(col.field)
                                            }
                                            style={{
                                                cursor: 'pointer',
                                                flex: 1,
                                            }}
                                        >
                                            {col.header}
                                            {sortConfig.field === col.field ? (
                                                sortConfig.direction ===
                                                'asc' ? (
                                                    <FaSortAmountUp
                                                        style={{
                                                            marginLeft: '5px',
                                                        }}
                                                    />
                                                ) : (
                                                    <FaSortAmountDown
                                                        style={{
                                                            marginLeft: '5px',
                                                        }}
                                                    />
                                                )
                                            ) : (
                                                <FaSort
                                                    style={{
                                                        marginLeft: '5px',
                                                    }}
                                                />
                                            )}
                                        </span>
                                        <FaFilter
                                            style={{
                                                cursor: 'pointer',
                                                marginLeft: '8px',
                                            }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleFilter(col.field);
                                            }}
                                        />
                                    </div>
                                    {filterVisible[col.field] && (
                                        <input
                                            type="text"
                                            placeholder="Lọc..."
                                            defaultValue={
                                                filters[col.field] || ''
                                            }
                                            onChange={(e) =>
                                                handleDebouncedFilterChange(
                                                    e,
                                                    col.field
                                                )
                                            }
                                            style={{
                                                marginTop: '5px',
                                                width: '100%',
                                                padding: '4px',
                                                boxSizing: 'border-box',
                                            }}
                                        />
                                    )}
                                </th>
                            )
                        )}
                    </tr>
                </thead>
                <tbody>
                    {paginatedData.length > 0 ? (
                        paginatedData.map((row, index) => (
                            <tr
                                key={index}
                                onClick={() => {
                                    navigate('/demo', {
                                        state: {
                                            latitude: row.latitude,
                                            longtitude: row.longtitude,
                                            permissionsId: permissionsId,
                                        }, // truyền dữ liệu sang trang /demo
                                    });
                                    onRowClick(row.id);
                                }}
                            >
                                {permissionsId.includes(1) ? (
                                    <td
                                        style={{
                                            border: '1px solid #ddd',
                                            padding: '8px',
                                            width: '120px',
                                        }}
                                    >
                                        <div
                                            className="icon-column"
                                            style={{
                                                display: 'flex',
                                                gap: '8px',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                justifyItems: 'center',
                                            }}
                                        >
                                            <IoPencilOutline
                                                className="update-icon"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    updatingData(row.id);
                                                }}
                                                style={{ cursor: 'pointer' }}
                                            />
                                            <FaGripLinesVertical />
                                            <IoTrash
                                                className="delete-icon"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteConfirm([
                                                        true,
                                                        row.id,
                                                    ]);
                                                }}
                                                style={{
                                                    cursor: 'pointer',
                                                    color: 'red',
                                                }}
                                            />
                                        </div>
                                    </td>
                                ) : (
                                    <></>
                                )}

                                {visibleColumns.map((col) =>
                                    col.field === 'img' ? null : (
                                        <td
                                            key={col.field}
                                            style={{
                                                border: '1px solid #ddd',
                                                padding: '8px',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                            }}
                                            onClick={() => onRowClick(row.id)}
                                        >
                                            {row[col.field]?.toString()}
                                        </td>
                                    )
                                )}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan={visibleColumns.length + 1}
                                style={{ textAlign: 'center' }}
                            >
                                Không có dữ liệu
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default React.memo(DataTable);

{
    /* <MultiSelect
value={visibleColumns}
options={columnName}
optionLabel="header"
onChange={onColumnToggle}
className="multiple-select"
style={{
    width: "100%",
    maxWidth: "20rem",
    marginBottom: "1rem",
}}
display="chip"
placeholder="Chọn cột hiển thị"
/> */
}
