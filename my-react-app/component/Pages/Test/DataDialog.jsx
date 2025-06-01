// components/DataDialog.jsx
import React, { useState, useCallback } from 'react';
import LeafletDrawMap from '../../LeafletDrawMap'; // Đảm bảo bạn đã có hoặc tạo sẵn component này
import InputField from './InputField.jsx';
import InputGeomMap from './InputGeomMap.jsx';
import { latLng } from 'leaflet';
import './DataDialog.css'; // Đảm bảo bạn đã có hoặc tạo sẵn file CSS này
import { useMediaQuery } from 'react-responsive';

const DataDialog = ({
    type, //need
    father, //need
    fatherTable,
    currentId,
    manualInput, //need
    updateOrInsert, //need
    isLorung,
    visibleColumns,
    noMapDialog, //maybe
    errors,
    handleCloseDialog,
    latitude,
    longtitude,
    zoomMarker,
    onGeometryChange,
    onSendData,
}) => {
    if (!updateOrInsert.state) return null;
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
    console.log(type, 'type in DataDialog');
    const [dialogInputLabel, setDialogInputLabel] = useState(
        type === 'anniversary'
            ? [
                  {
                      field: 'location_coordinates_latitude',
                      label: 'Kinh độ',
                  },
                  {
                      field: 'location_coordinates_longtitude',
                      label: 'Vĩ độ',
                  },
                  {
                      field: 'grave_coordinates_latitude',
                      label: 'Kinh độ',
                  },
                  {
                      field: 'grave_coordinates_longtitude',
                      label: 'Vĩ độ',
                  },
                  {
                      field: 'id',
                      label: 'id',
                  },
                  {
                      field: 'anni_date',
                      label: 'Ngày kỵ',
                  },
                  {
                      field: 'event_name',
                      label: 'Công việc',
                  },
                  {
                      field: 'location_name',
                      label: 'Địa điểm',
                  },
                  {
                      field: 'address',
                      label: 'Địa chỉ',
                  },

                  {
                      field: 'cccd',
                      label: 'CCCD',
                  },

                  {
                      field: 'note',
                      label: 'Ghi chú',
                  },
              ]
            : [
                  {
                      field: 'grave_coordinates_latitude',
                      label: 'Kinh độ',
                  },
                  {
                      field: 'grave_coordinates_longtitude',
                      label: 'Vĩ độ',
                  },
                  {
                      field: 'grave',
                      label: 'Bia mộ',
                  },
                  {
                      field: 'generation',
                      label: 'Đời thứ',
                  },
                  {
                      field: 'location',
                      label: 'Địa điểm',
                  },

                  {
                      field: 'note',
                      label: 'Ghi chú',
                  },
              ]
    );
    // console.log(currentId, 'currentId dialog');
    console.log(father, 'father dialog');

    const [fatherDialog, setFather] = useState('data-dialog');
    // const [currentId, setCurrentId] = useState(null);
    const initialTempValues = (
        type === 'anniversary'
            ? [
                  'location_coordinates_latitude',
                  'location_coordinates_longtitude',
                  'grave_coordinates_latitude',
                  'grave_coordinates_longtitude',
                  'id',
                  'anni_date',
                  'event_name',
                  'location_name',
                  'address',
                  'cccd',
                  'note',
              ]
            : [
                  'grave_coordinates_latitude',
                  'grave_coordinates_longtitude',
                  'grave',
                  'generation',
                  'location',
                  'note',
              ]
    ).reduce(
        (acc, field) => {
            acc[field] = ''; // hoặc [] nếu là field mảng, ví dụ 'img'
            return acc;
        },
        { img: [] }
    ); // thêm img nếu cần upload ảnh

    const [tempValues, setTempValues] = useState(initialTempValues);

    const headerMapping = {
        location_coordinates_latitude: 'Kinh độ địa điểm',
        location_coordinates_longtitude: 'Vĩ độ địa điểm',
        grave_coordinates_latitude: 'Kinh độ mộ',
        grave_coordinates_longtitude: 'Vĩ độ mộ',
        id: 'ID',
        anni_date: 'Ngày kỵ',
        event_name: 'Công việc',
        location_name: 'Tên địa điểm',
        address: 'Địa chỉ',
        note: 'Ghi chú',
        grave: 'Bia mộ',
        generation: 'Đời thứ',
        location: 'Địa điểm',
        img: 'Ảnh',
    };

    const fieldHints = {};
    const [test, setTest] = useState('');
    const [file, setFile] = useState();
    const handleChange = (e) => {
        console.log(e.target.files);
        setFile(URL.createObjectURL(e.target.files[0]));
    };
    // console.log(visibleColumns, "visibleColumns");
    // console.log(manualInput,'manualInput');
    const handleInputChange = ({ target: { name, value } }) => {
        if (name === 'img' && Array.isArray(value)) {
            const fileUrls = value.map((file) => ({
                file: file,
                preview: URL.createObjectURL(file),
            }));
            setTempValues((prev) => ({
                ...prev,
                [name]: fileUrls,
            }));
        } else {
            setTempValues((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };
    const handleUpdate = useCallback(
        (e) => {
            e.preventDefault();
            if (!currentId) {
                alert('Không tìm thấy ID để cập nhật');
                return;
            }
            const getEndpoint = () => {
                if (type === 'anniversary') return 'pass-away-anni';
                if (type === 'graveyard') return 'grave';
                return '';
            };
            const payload = {
                ...tempValues,
                grave_coordinates: [
                    parseFloat(tempValues.grave_coordinates_longtitude),
                    parseFloat(tempValues.grave_coordinates_latitude),
                ],
                location_coordinates: [
                    parseFloat(tempValues.longtitude),
                    parseFloat(tempValues.latitude),
                ],
                geom: {
                    type: 'Point',
                    coordinates: [
                        parseFloat(tempValues.grave_coordinates_longtitude),
                        parseFloat(tempValues.grave_coordinates_latitude),
                    ],
                },
                note: tempValues.note, // giờ là chuỗi
            };

            // Nếu có ảnh dạng FileList thì lấy preview
            if (Array.isArray(payload.img)) {
                payload.img = payload.img.map((image) => image.preview);
            }
            console.log(payload, 'payload', getEndpoint(), 'getEndpoint()');
            fetch(
                `http://localhost:8000/api/${getEndpoint()}/update/${currentId}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json', // đảm bảo nhận về JSON từ Laravel
                    },
                    body: JSON.stringify(payload),
                }
            )
                .then(async (res) => {
                    if (!res.ok) {
                        const errText = await res.text();
                        throw new Error(errText);
                    }
                    return res.json();
                })
                .then((data) => {
                    alert('Cập nhật thành công!');
                })
                .catch((err) => {
                    console.error('Lỗi khi cập nhật:', err);
                    alert('Lỗi khi cập nhật: ' + err.message);
                });
        },
        [tempValues, currentId]
    );

    // console.log(noMapDialog, 'noMapDialog');
    const handleSubmit = useCallback(
        (e) => {
            e.preventDefault();

            const payload = {
                ...tempValues,
                location_coordinates: [
                    parseFloat(tempValues.location_coordinates_longtitude),
                    parseFloat(tempValues.location_coordinates_latitude),
                ],
                grave_coordinates: [
                    parseFloat(tempValues.grave_coordinates_longtitude),
                    parseFloat(tempValues.grave_coordinates_latitude),
                ],
                geom: {
                    type: 'Point',
                    coordinates: [
                        parseFloat(tempValues.grave_coordinates_longtitude),
                        parseFloat(tempValues.grave_coordinates_latitude),
                    ],
                },
                note: tempValues.note, // giờ là chuỗi
            };

            if (Array.isArray(payload.img)) {
                payload.img = payload.img.map((image) => image.preview);
            }

            const getEndpoint = () => {
                if (type === 'anniversary') return 'pass-away-anni';
                if (type === 'graveyard') return 'grave';
                return '';
            };
            // console.log(payload, 'payload', getEndpoint(), 'getEndpoint()');
            if (updateOrInsert.type === 'insert') {
                fetch(`http://localhost:8000/api/${getEndpoint()}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json', // QUAN TRỌNG để Laravel trả về JSON
                    },
                    body: JSON.stringify(payload),
                })
                    .then(async (res) => {
                        if (!res.ok) {
                            const text = await res.text(); // để debug lỗi trả về là gì
                            throw new Error(text);
                        }
                        return res.json();
                    })
                    .then((data) => {
                        alert('Thêm thành công!');
                    })
                    .catch((err) => {
                        console.error('Lỗi:', err);
                        alert('Có lỗi xảy ra: ' + err.message);
                    });
            } else {
                handleUpdate(e);
            }

            handleCloseDialog();
        },
        [
            tempValues,
            latitude,
            longtitude,
            type,
            updateOrInsert,
            handleCloseDialog,
            handleUpdate,
        ]
    );

    // const handleSubmit = useCallback(
    //     (e) => {
    //         if (type === 'anniversary') {
    //             e.preventDefault();
    //             if (updateOrInsert.type === 'insert') {
    //                 const payload = {
    //                     ...tempValues,
    //                     longtitude,
    //                     latitude,
    //                 };
    //                 if (Array.isArray(payload.img)) {
    //                     payload.img = payload.img.map((image) => image.preview);
    //                 }
    //                 fetch('http://localhost:8000/api/pass-away-anni', {
    //                     method: 'POST',
    //                     headers: {
    //                         'Content-Type': 'application/json',
    //                     },
    //                     body: JSON.stringify(payload),
    //                 })
    //                     .then((res) => res.json())
    //                     .then((data) => {
    //                         alert('Thêm thành công!');
    //                         // setUpdateDataIfCRUDSuccess?.(prev => !prev);
    //                     })
    //                     .catch((err) => {
    //                         alert('Có lỗi xảy ra: ' + err.message);
    //                     });
    //                 handleCloseDialog();
    //             } else {
    //                 handleUpdate(e);
    //                 handleCloseDialog();
    //             }
    //         } else if (type === 'graveyard') {
    //             e.preventDefault();
    //             // Add your graveyard submit logic here if needed
    //             if (updateOrInsert.type === 'insert') {
    //                 const payload = {
    //                     ...tempValues,
    //                     longtitude,
    //                     latitude,
    //                 };
    //                 if (Array.isArray(payload.img)) {
    //                     payload.img = payload.img.map((image) => image.preview);
    //                 }
    //                 fetch('http://localhost:8000/api/grave', {
    //                     method: 'POST',
    //                     headers: {
    //                         'Content-Type': 'application/json',
    //                     },
    //                     body: JSON.stringify(payload),
    //                 })
    //                     .then((res) => res.json())
    //                     .then((data) => {
    //                         alert('Thêm thành công!');
    //                         // setUpdateDataIfCRUDSuccess?.(prev => !prev);
    //                     })
    //                     .catch((err) => {
    //                         alert('Có lỗi xảy ra: ' + err.message);
    //                     });
    //                 handleCloseDialog();
    //             } else {
    //                 handleUpdate(e);
    //                 handleCloseDialog();
    //             }
    //         }
    //     },
    //     [
    //         tempValues,
    //         latitude,
    //         longtitude,
    //         type,
    //         updateOrInsert,
    //         longtitude,
    //         latitude,
    //         handleCloseDialog,
    //         handleUpdate,
    //     ]
    // );
    // console.log('update', updateOrInsert.type, updateOrInsert.state);
    // const updatingData = useCallback(
    //     (id) => {
    //         const selectedRow = markerData.find((item) => item.id === id);
    //         if (!selectedRow) return;
    //         console.log(id, 'id');
    //         setCurrentId(id);
    //         setTempValues({
    //             ...selectedRow,
    //             latitude: selectedRow.latitude || latLng?.lat,
    //             longtitude: selectedRow.longtitude || latLng?.lng,
    //         });
    //         setNoMapDialog(true);
    //         const newUpdateObj = { state: true, type: 'update', id: id };
    //         setUpdateOrInsert(newUpdateObj);
    //         console.log('Dialog được mở', updateOrInsert.id, noMapDialog);
    //     },
    //     [markerData, latLng]
    // );
    return (
        <div
            style={
                isMobile
                    ? {
                          width: '100vw',
                          height: '100vh',
                          fontSize: '2px !important',
                          gap: '16px',
                          position: 'fixed',
                          top: 0,
                          left: 0,
                          background: 'rgba(0, 0, 0, 0.3)' /* nền tối nhẹ */,
                          justifyContent: 'center',
                          alignItems: 'center',
                          zIndex: 2000,
                          textAlign: 'left',
                      }
                    : {
                          display: 'flex',
                          gap: '16px',
                          position: 'fixed',
                          top: 0,
                          left: 0,
                          width: '100vw',
                          height: '100vh',
                          background: 'rgba(0, 0, 0, 0.3)' /* nền tối nhẹ */,
                          justifyContent: 'center',
                          alignItems: 'center',
                          zIndex: 2000,
                          textAlign: 'left',
                      }
            }
            className={`demo-container`}
        >
            <form
                onSubmit={handleSubmit}
                // className={`dialog ${father}-dialog`}
                className={`dialog demo-dialog ${
                    isMobile ? 'mobile-form' : ''
                }`}
            >
                <div className="dialog-content">
                    <h1 className={`demo`}>
                        {updateOrInsert.type === 'insert'
                            ? 'Thêm dữ liệu'
                            : 'Cập nhật dữ liệu'}
                    </h1>
                    <div
                        className={`dialog-content-input-container dialog-content-demo`}
                    >
                        {father === 'demo' && manualInput === false ? (
                            <div
                                style={{
                                    display: 'contents',
                                    fontWeight: '550',
                                }}
                            >
                                <div>
                                    {latitude && (
                                        <div>Giá trị kinh độ hiện tại:</div>
                                    )}
                                    {longtitude && <div>{longtitude}</div>}
                                </div>
                                <div>
                                    {longtitude && (
                                        <div>Giá trị vĩ độ hiện tại: </div>
                                    )}
                                    {longtitude && <div>{latitude}</div>}
                                </div>
                            </div>
                        ) : father === 'demo' && manualInput === true ? (
                            <></>
                        ) : (
                            <></>
                        )}

                        {dialogInputLabel
                            .filter((column) => column.field in headerMapping)
                            .map((column) => {
                                const sourceValues = isLorung
                                    ? lorungTempValues
                                    : tempValues;
                                if (!sourceValues) {
                                    console.warn(
                                        'Giá trị đang undefined cho field:',
                                        column.field
                                    );
                                    return null;
                                }

                                const value = sourceValues[column.field];
                                const label =
                                    headerMapping[column.field] ||
                                    column.label ||
                                    column.field;
                                const placeholder =
                                    fieldHints?.[column.field] || label;

                                if (
                                    !manualInput &&
                                    (column.field === 'latitude' ||
                                        column.field === 'longtitude')
                                ) {
                                    return null; // Bỏ qua nếu không cho nhập thủ công và là tọa độ
                                }

                                return (
                                    <div key={column.field}>
                                        <InputField
                                            field={column.field}
                                            label={label}
                                            value={value}
                                            placeholder={placeholder}
                                            onChange={(val) =>
                                                handleInputChange({
                                                    target: {
                                                        name: column.field,
                                                        value: val,
                                                    },
                                                })
                                            }
                                            error={errors?.[column.field]}
                                        />
                                    </div>
                                );
                            })}
                    </div>
                    {father !== null ? (
                        <div
                            style={{
                                marginTop: '10px',
                            }}
                        >
                            <label
                                htmlFor="images"
                                style={{
                                    fontSize: '14px',
                                    fontWeight: '550',
                                }}
                            >
                                Danh sách hình ảnh :
                            </label>
                            <input
                                type="file"
                                multiple
                                name="img" // Đặt name là "img" nếu trường trong database là "img"
                                onChange={(e) =>
                                    handleInputChange({
                                        target: {
                                            name: 'img', // Đảm bảo name là "img"
                                            value: Array.from(e.target.files), // Chuyển FileList thành mảng
                                        },
                                    })
                                }
                            />
                            {errors?.images && (
                                <div style={{ color: 'red' }}>
                                    {errors.images}
                                </div>
                            )}
                        </div>
                    ) : (
                        <></>
                    )}
                    <div className="demo">
                        <button
                            type="submit"
                            className="search-button"
                            // disabled={!isValid}
                            style={{ fontSize: '20px' }}
                        >
                            {updateOrInsert.type === 'insert'
                                ? 'Thêm'
                                : 'Cập nhật'}
                        </button>
                        <button
                            onClick={handleCloseDialog}
                            className="close-button"
                            style={{ fontSize: '20px' }}
                        >
                            Đóng
                        </button>
                    </div>
                </div>

                {noMapDialog === false ||
                (updateOrInsert.type === 'insert' &&
                    updateOrInsert.state === true) ? (
                    <></>
                ) : (
                    <div
                        style={{
                            width: '500px',
                            height: '500px',
                        }}
                    >
                        <InputGeomMap
                            fatherTable={fatherTable}
                            father={father}
                            fatherDialog={fatherDialog}
                            setTempValues={setTempValues}
                            zoomMarker={zoomMarker}
                            onGeometryChange={onGeometryChange}
                        />
                    </div>
                )}
            </form>
        </div>
    );
};

export default DataDialog;
