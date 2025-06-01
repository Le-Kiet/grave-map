import { useRef, useEffect, useState } from "react";
import { Marker, Popup } from "react-leaflet";
const CustomMarker = ({ isActive, data, map }) => {
    const [refReady, setRefReady] = useState(false);
    let popupRef = useRef();

    useEffect(() => {
        if (refReady && isActive) {
            popupRef.openOn(map);
        }
    }, [isActive, refReady, map]);

    return (
        <Marker position={data.position}>
            <Popup
                ref={(r) => {
                    popupRef = r;
                    setRefReady(true);
                }}
            >
                Yupperz
            </Popup>
        </Marker>
    );
};
export default CustomMarker;
