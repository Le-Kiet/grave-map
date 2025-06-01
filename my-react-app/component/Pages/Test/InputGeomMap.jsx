import React from 'react';
import LeafletDrawMap from '../../LeafletDrawMap';
import './InputGeomMap.css';
const InputGeomMap = ({
    fatherDialog,
    fatherTable,
    father,
    setTempValues,
    zoomMarker,
    onGeometryChange,
}) => (
    <div
        className={`${fatherDialog}-map-container`}
        style={{
            width: '500px',
            padding: '1rem',
            borderLeft: '1px solid #ccc',
        }}
    >
        <h2>Bản đồ lấy tọa độ khu vực</h2>
        <LeafletDrawMap
            className={`${father}-map`}
            onGeometryChange={onGeometryChange}
            fatherTable={fatherTable}
            // onGeometryChange={(geom) => {
            //     if (isLorung) {
            //         setLorungTempValues((prev) => ({ ...prev, geom }));
            //     } else {
            //         setTempValues((prev) => ({ ...prev, geom }));
            //     }
            // }}
            zoomMarker={zoomMarker}
        />
    </div>
);

export default InputGeomMap;
