import React, {
    useMemo,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';
import { MdGpsFixed, MdGpsNotFixed } from 'react-icons/md';
import { TbGpsFilled, TbGps } from 'react-icons/tb';
import { FaRoute, FaSlash } from 'react-icons/fa';
import { FaHouse } from 'react-icons/fa6';
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import mapImg from '../assets/map.jpg';
import OIPImg from '../assets/OIP.jpg';
import thuyLoiImg from '../assets/thuy-loi.jpg';
import './LeafletDrawMap.css';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import { useMediaQuery } from 'react-responsive';
import { TbGrave } from 'react-icons/tb';
const ImageGallery = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [parsedImages, setParsedImages] = useState([]);

    useEffect(() => {
        // Kiểm tra nếu images là chuỗi JSON và chuyển nó thành mảng
        if (typeof images === 'string') {
            try {
                const parsed = JSON.parse(images);
                if (Array.isArray(parsed)) {
                    setParsedImages(parsed);
                } else {
                    console.error('images không phải là mảng sau khi parse');
                }
            } catch (error) {
                console.error('Lỗi khi parse chuỗi JSON', error);
            }
        } else if (Array.isArray(images)) {
            setParsedImages(images); // Nếu images đã là mảng, không cần parse
        } else {
            console.error(
                'images không phải là chuỗi hoặc mảng hợp lệ',
                images
            );
        }
    }, [images]); // Chạy khi images thay đổi

    const handlePrev = () => {
        setCurrentIndex(
            (prev) => (prev - 1 + parsedImages.length) % parsedImages.length
        );
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % parsedImages.length);
    };

    const handleDotClick = (index) => {
        setCurrentIndex(index);
    };

    // Kiểm tra xem parsedImages có phải là mảng không trước khi render
    if (!Array.isArray(parsedImages) || parsedImages.length === 0) {
        return null;
    }

    return (
        <div
            style={{ textAlign: 'center' }}
            className="image-gallery-container"
        >
            <div style={{ position: 'relative' }} className="image-wrapper">
                <img
                    src={parsedImages[currentIndex]}
                    alt={`Image ${currentIndex + 1}`}
                    style={{
                        width: '100%',
                        height: '250px',
                        objectFit: 'cover',
                        borderRadius: '10px',
                    }}
                    className="gallery-image"
                />
                <button
                    onClick={handlePrev}
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '10px',
                        background: 'rgba(0, 0, 0, 0.5)',
                        color: 'white',
                        border: 'none',
                        padding: '5px',
                        borderRadius: '50%',
                        cursor: 'pointer',
                    }}
                    className="nav-button prev"
                >
                    ←
                </button>
                <button
                    onClick={handleNext}
                    className="nav-button next"
                    style={{
                        position: 'absolute',
                        top: '50%',
                        right: '10px',
                        background: 'rgba(0, 0, 0, 0.5)',
                        color: 'white',
                        border: 'none',
                        padding: '5px',
                        borderRadius: '50%',
                        cursor: 'pointer',
                    }}
                >
                    →
                </button>
            </div>
            <div style={{ marginTop: '10px' }}>
                {parsedImages.map((image, index) => (
                    <span
                        key={index}
                        onClick={() => handleDotClick(index)}
                        style={{
                            cursor: 'pointer',
                            margin: '0 5px',
                            fontSize: '24px',
                            fontWeight:
                                index === currentIndex ? 'bold' : 'normal',
                            color: index === currentIndex ? '#007bff' : '#ccc',
                        }}
                    >
                        ●
                    </span>
                ))}
            </div>
        </div>
    );
};

const RoutingControl = ({ waypoints, gpsLocation, gpsEnabled }) => {
    const map = useMap();
    const routingControlRef = useRef(null);
    const [showInstructions, setShowInstructions] = useState(true);

    useEffect(() => {
        if (!map || waypoints.length < 2) return;

        // Xóa routing cũ nếu tồn tại
        if (routingControlRef.current) {
            map.removeControl(routingControlRef.current);
        }

        const routePoints =
            gpsEnabled && gpsLocation
                ? [
                      L.latLng(gpsLocation.lat, gpsLocation.lng),
                      L.latLng(waypoints[1].lat, waypoints[1].lng),
                  ]
                : [
                      L.latLng(waypoints[0].lat, waypoints[0].lng),
                      L.latLng(waypoints[1].lat, waypoints[1].lng),
                  ];

        routingControlRef.current = L.Routing.control({
            waypoints: routePoints,
            routeWhileDragging: false,
            show: showInstructions, // <- hiển thị hoặc ẩn bảng chỉ dẫn
            addWaypoints: false,
            collapsible: false,
            lineOptions: {
                styles: [{ color: '#007bff', weight: 4 }],
            },
            createMarker: () => null, // Không tạo marker mặc định
        }).addTo(map);

        return () => {
            if (routingControlRef.current) {
                map.removeControl(routingControlRef.current);
            }
        };
    }, [map, waypoints, gpsLocation, gpsEnabled, showInstructions]);

    return (
        <button
            style={{
                position: 'absolute',
                zIndex: 1000,
                right: '20px',
                top: '160px',
                padding: '10px',
                width: '100px',
                background: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
            }}
            onClick={() => setShowInstructions((prev) => !prev)}
        >
            {showInstructions ? 'Ẩn chỉ dẫn' : 'Hiện chỉ dẫn'}
        </button>
    );
};

const DrawControl = ({ onGeometryChange, father, fatherTable }) => {
    const map = useMap();
    const drawnItems = useRef(new L.FeatureGroup());
    const handlePrevImage = () => {
        setCurrentImageIndex(
            (currentImageIndex - 1 + images.length) % images.length
        );
    };
    useEffect(() => {
        map.addLayer(drawnItems.current);

        const drawControl = new L.Control.Draw({
            draw: {
                polygon: false,
                polyline: false,
                rectangle: false,
                marker: true,
                circle: false,
                circlemarker: false,
            },
            // edit: {
            //     featureGroup: drawnItems.current,
            // },
        });

        map.addControl(drawControl);

        map.on('draw:created', (e) => {
            const layer = e.layer;
            drawnItems.current.addLayer(layer);
            const geojson = layer.toGeoJSON();

            onGeometryChange?.(geojson.geometry, 'father', fatherTable);
        });

        return () => {
            map.removeControl(drawControl);
            map.off('draw:created');
        };
    }, [map, onGeometryChange]);

    return null;
};

const MarkerWithPopup = ({
    handleMarkerClick,
    marker,
    isStart,
    isEnd,
    routeEnabledRef,
    images,
    chosenMarker,
}) => {
    const [showImage, setShowImage] = useState(false);
    const anniIcon = L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/128/11057/11057332.png',
        color: 'red',
        backgroundColor: 'red',
        iconSize: [40, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
    });
    const defaultIcon = L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/128/3589/3589344.png',
        iconSize: [35, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
    });
    const chosenIcon = L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/128/3589/3589363.png',
        iconSize: [35, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        color: 'blue',
    });
    const startIcon = L.icon({
        iconUrl:
            'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        shadowUrl:
            'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
    });

    const endIcon = L.icon({
        iconUrl:
            'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        // iconUrl: "../assets/house-solid.svg",

        shadowUrl:
            'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
    });

    const toggleShowImage = (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();

        setShowImage((prev) => !prev);
    };
    return (
        <Marker
            position={[marker.latitude, marker.longtitude]}
            icon={
                isStart
                    ? startIcon
                    : isEnd
                    ? endIcon
                    : marker.type === 'anniversary'
                    ? anniIcon
                    : chosenMarker
                    ? chosenIcon
                    : defaultIcon
            }
            eventHandlers={{
                click: (e) => handleMarkerClick(marker, e),
                contextmenu: (e) => handleMarkerClick(marker, e),
            }}
        >
            <Popup
                closeOnClick={false}
                autoClose={false}
                style={{ width: '1000px' }}
            >
                <button
                    onClick={toggleShowImage}
                    style={{
                        marginBottom: '8px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        padding: '5px 10px',
                        cursor: 'pointer',
                    }}
                >
                    {showImage ? 'Hiển thị Thông tin' : 'Hiển thị Ảnh'}
                </button>
                {showImage ? (
                    <ImageGallery images={marker.img} />
                ) : (
                    <div>
                        {/* <h3>{marker.name}</h3>
                        <p>Vĩ độ: {marker.latitude}</p>
                        <p>Kinh độ: {marker.longtitude}</p>
                        <p>Địa chỉ: {marker.diachi}</p>
                        <p>Họ tên chủ sở hữu: {marker.hoten}</p>
                        <p>Điện thoại: {marker.sodt}</p>
                        <p>Căn cước công dân: {marker.cccd}</p>
                        <p>Giới tính: {marker.gioitinh || ''}</p> */}
                        <p>Vĩ độ: {marker.latitude}</p>
                        <p>Kinh độ: {marker.longtitude}</p>
                        <p>Địa điểm: {marker.location}</p>
                        <p>Phần mộ: {marker.grave}</p>
                        <p>Đời thứ: {marker.generation}</p>
                    </div>
                )}
            </Popup>
        </Marker>
    );
};
const GraveMarkerWithPopup = ({
    handleMarkerClick,
    marker,
    isStart,
    isEnd,
    routeEnabledRef,
    images,
}) => {
    const [showImage, setShowImage] = useState(false);
    const defaultIcon = L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/128/3600/3600228.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
    });

    const startIcon = L.icon({
        iconUrl:
            'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        shadowUrl:
            'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
    });

    const endIcon = L.icon({
        iconUrl:
            'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        // iconUrl: "../assets/house-solid.svg",

        shadowUrl:
            'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
    });

    const toggleShowImage = (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();

        setShowImage((prev) => !prev);
    };
    return (
        <Marker
            position={[marker.latitude, marker.longtitude]}
            icon={isStart ? startIcon : isEnd ? endIcon : defaultIcon}
            eventHandlers={{
                click: (e) => handleMarkerClick(marker, e),
                contextmenu: (e) => handleMarkerClick(marker, e),
            }}
        >
            <Popup
                closeOnClick={false}
                autoClose={false}
                style={{ width: '1000px' }}
            >
                <button
                    onClick={toggleShowImage}
                    style={{
                        marginBottom: '8px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        padding: '5px 10px',
                        cursor: 'pointer',
                    }}
                >
                    {showImage ? 'Hiển thị Thông tin' : 'Hiển thị Ảnh'}
                </button>
                {showImage ? (
                    <ImageGallery images={marker.img} />
                ) : (
                    <div>
                        {/* <h3>{marker.name}</h3> */}
                        <p>Vĩ độ: {marker.latitude}</p>
                        <p>Kinh độ: {marker.longtitude}</p>
                        <p>Địa điểm: {marker.location}</p>
                        <p>Phần mộ: {marker.grave}</p>
                        <p>Đời thứ: {marker.generation}</p>
                    </div>
                )}
            </Popup>
        </Marker>
    );
};

const RouteToggleButton = ({ routeEnabledRef, clearRoute }) => {
    const [localEnabled, setLocalEnabled] = useState(routeEnabledRef.current);
    const [clearEnabled, setClearEnabled] = useState(false); // Trạng thái bật/tắt xóa đường

    const toggleRoute = () => {
        routeEnabledRef.current = !routeEnabledRef.current;
        setLocalEnabled(routeEnabledRef.current); // Cập nhật để hiển thị UI
    };

    const toggleClearRoute = () => {
        clearRoute(); // Xóa đường nếu chức năng được bật
    };

    return (
        <div
            style={{
                marginBottom: '10px',
                textAlign: 'center',
                position: 'absolute',
                zIndex: '10000',
                left: '50%',
                display: 'flex',
                transform: 'translateX(-50%)',
            }}
        >
            <button
                onClick={toggleRoute}
                style={{
                    marginRight: '10px',
                    width: '80px', // Chiều rộng
                    height: '80px', // Chiều cao
                    backgroundColor: localEnabled ? '#6c757d' : '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                }}
            >
                {localEnabled && (
                    <FaSlash
                        style={{
                            position: 'absolute',
                            fontSize: '36px',
                            color: 'red',
                            transform: 'rotate(30deg)',
                            zIndex: 1,
                        }}
                    />
                )}
                <FaRoute
                    style={{
                        fontSize: '24px', // Kích thước icon chỉ đường
                        zIndex: 0,
                    }}
                />
            </button>

            <button
                onClick={toggleClearRoute}
                style={{
                    padding: '8px 12px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                }}
            >
                Xóa Đường Đi
            </button>
        </div>
    );
};

// const GPSMarker = ({ gpsLocationRef, homingGps }) => {
//     const map = useMap();
//     const gpsLocationRef = useRef(null);
//     const mapRef = useRef(null); // Tham chiếu đến map
//     const markerRef = useRef(null);
//     useEffect(() => {
//         if (mapRef.current && homingGps && gpsLocationRef.current) {
//             const { lat, lng } = gpsLocationRef.current;
//             const bounds = L.latLngBounds([lat, lng]);
//             mapRef.current.fitBounds(bounds);
//         }
//     }, [homingGps]);
//     useEffect(() => {
//         if (!navigator.geolocation) {
//             console.error("Trình duyệt của bạn không hỗ trợ GPS.");
//             return;
//         }

//         const updateGpsMarker = (position) => {
//             const { latitude, longitude } = position.coords;

//             // Cập nhật vị trí GPS vào ref
//             gpsLocationRef.current = { lat: latitude, lng: longitude };

//             if (markerRef.current) {
//                 markerRef.current.setLatLng([latitude, longitude]);
//             } else {
//                 markerRef.current = L.marker([latitude, longitude], {
//                     icon: L.divIcon({
//                         html: `
//                             <div class="gps-icon-google">
//                                 <div class="gps-icon-pulse"></div>
//                                 <div class="gps-icon-inner"></div>
//                                 <div class="gps-icon-inner-center"></div>
//                             </div>
//                         `,
//                         className: "gps-icon-wrapper",
//                         iconSize: [30, 30],
//                         iconAnchor: [15, 15],
//                     }),
//                 }).addTo(map);
//             }
//             if (homingGps === true)
//                 map.flyTo([latitude, longitude], map.getZoom());
//         };

//         const watchId = navigator.geolocation.watchPosition(
//             updateGpsMarker,
//             (error) => console.error("Lỗi lấy vị trí GPS:", error),
//             { enableHighAccuracy: true, timeout: 1, maximumAge: 0 }
//         );

//         return () => {
//             navigator.geolocation.clearWatch(watchId);
//             if (markerRef.current) {
//                 map.removeLayer(markerRef.current);
//             }
//         };
//     }, [map, gpsLocationRef]);

//     return null;
// };
const GPSMarker = ({ gpsLocationRef, homingGps }) => {
    const map = useMap();
    const markerRef = useRef(null);

    useEffect(() => {
        if (!navigator.geolocation) {
            console.error('Trình duyệt của bạn không hỗ trợ GPS.');
            return;
        }

        const updateGpsMarker = (position) => {
            const { latitude, longitude } = position.coords;
            gpsLocationRef.current = { lat: latitude, lng: longitude }; // Update ref

            if (markerRef.current) {
                markerRef.current.setLatLng([latitude, longitude]);
            } else {
                markerRef.current = L.marker([latitude, longitude], {
                    icon: L.divIcon({
                        html: `
                            <div class="gps-icon-google">
                                <div class="gps-icon-pulse"></div>
                                <div class="gps-icon-inner"></div>
                                <div class="gps-icon-inner-center"></div>
                            </div>
                        `,
                        className: 'gps-icon-wrapper',
                        iconSize: [30, 30],
                        iconAnchor: [15, 15],
                    }),
                }).addTo(map);
            }

            if (homingGps) {
                map.flyTo([latitude, longitude], map.getZoom());
            }
        };

        const watchId = navigator.geolocation.watchPosition(
            updateGpsMarker,
            (error) => console.error('Lỗi lấy vị trí GPS:', error),
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );

        return () => {
            navigator.geolocation.clearWatch(watchId);
            if (markerRef.current) {
                map.removeLayer(markerRef.current);
            }
        };
    }, [map, homingGps, gpsLocationRef]);

    return null;
};
const LeafletDrawMap = ({
    markerData = [],
    zoomMarker,
    father,
    fatherTable,
    onGeometryChange,
    permissionsId,
}) => {
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [waypoints, setWaypoints] = useState([]);
    const routeEnabledRef = useRef(false);
    const [showImage, setShowImage] = useState(false);
    const images = [mapImg, OIPImg, thuyLoiImg];
    const [popupState, setPopupState] = useState({});
    const [gpsEnabled, setGpsEnabled] = useState(false);
    const [gpsLocation, setGpsLocation] = useState(null);
    const [homingGps, setHomingGps] = useState(false);
    const gpsLocationRef = useRef(null);
    const mapRef = useRef(null);
    const [toggleImage, setToggleImage] = useState(false);
    const toggleShowImage = (markerId) => {
        setPopupState((prevState) => ({
            ...prevState,
            [markerId]: {
                ...prevState[markerId],
                showImage: !prevState[markerId]?.showImage,
            },
        }));
    };
    const handleMarkerClick = (marker, event) => {
        if (routeEnabledRef.current) {
            const newPoint = { lat: marker.latitude, lng: marker.longtitude };

            if (gpsEnabled) {
                setWaypoints([
                    [gpsLocationRef.current.lat, gpsLocationRef.current.lng] ||
                        null,
                    newPoint,
                ]);
            } else {
                if (event.type === 'click') {
                    setWaypoints([newPoint, waypoints[1] || null]);
                } else if (event.type === 'contextmenu') {
                    setWaypoints([waypoints[0] || null, newPoint]);
                }
            }
        } else {
            // Zoom vào vị trí marker
            mapRef.current.flyTo([marker.latitude, marker.longtitude], 15);
            setTimeout(() => {
                event.target.openPopup(); // Mở popup sau khi zoom
            }, 500);
        }
    };
    // const [graveMarkerData, setGraveMarkerData] = useState([]);
    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const response = await fetch('http://localhost:8000/api/grave');
    //             if (!response.ok) {
    //                 throw new Error('Network response was not ok');
    //             }
    //             const data = await response.json();
    //             console.log('Response Data:', data);
    //             setGraveMarkerData(data);
    //             console.log('Marker Data:', markerData);
    //             console.log('Grave Marker Data:', graveMarkerData);
    //         } catch (error) {
    //             console.error('Fetch error:', error);
    //         }
    //     };
    //     fetchData();
    // }, []);
    // useEffect(() => {
    //     console.log('Updated Grave Marker Data:', graveMarkerData);
    // }, []);
    // console.log(markerData, 'markerData');
    const clearRoute = useCallback(() => {
        setWaypoints([]);
    }, []);
    const renderMarkers = () => (
        <MarkerClusterGroup
            chunkedLoading={true}
            maxClusterRadius={0}
            eventHandlers={{
                clusterclick: (e) => {
                    const map = e.target._map;
                    map.setView(e.latlng, map.getZoom() + 2); // zoom sâu hơn
                },
            }}
        >
            {markerData.length > 0 &&
                markerData.map((marker) => {
                    const isStart =
                        waypoints[0]?.lat === marker.latitude &&
                        waypoints[0]?.lng === marker.longtitude;
                    const isEnd =
                        waypoints[1]?.lat === marker.latitude &&
                        waypoints[1]?.lng === marker.longtitude;
                    const chosenMarker =
                        zoomMarker &&
                        zoomMarker.lat === marker.latitude &&
                        zoomMarker.lng === marker.longtitude;
                    {
                        /* console.log(zoomMarker, 'zoomMarker'); */
                    }

                    return (
                        <MarkerWithPopup
                            chosenMarker={chosenMarker}
                            key={marker.id}
                            marker={marker}
                            isStart={isStart}
                            isEnd={isEnd}
                            routeEnabledRef={routeEnabledRef}
                            handleMarkerClick={handleMarkerClick}
                            images={images}
                        />
                    );
                })}
        </MarkerClusterGroup>
    );
    useEffect(() => {
        if (homingGps && gpsLocationRef.current) {
            const { lat, lng } = gpsLocationRef.current;
            const bounds = L.latLngBounds([lat, lng]);
            mapRef.current.fitBounds(bounds);
        }
    }, [homingGps === true]);
    return (
        <div
            className={`${father}-map-container`}
            // style={isMobile ? {} : { width: '2000px' }}
        >
            {father === 'demo' ? (
                <div>
                    <RouteToggleButton
                        routeEnabledRef={routeEnabledRef}
                        clearRoute={clearRoute}
                    />
                    <button
                        style={{
                            marginBottom: '10px',
                            position: 'absolute',
                            zIndex: 1000,
                            right: '20px',
                            top: '55px',
                            padding: '10px',
                            width: '40px',
                        }}
                        onClick={() => setGpsEnabled(!gpsEnabled)}
                    >
                        {gpsEnabled ? <MdGpsFixed /> : <MdGpsNotFixed />}
                    </button>
                    <button
                        style={{
                            marginBottom: '10px',
                            position: 'absolute',
                            zIndex: 1000,
                            right: '20px',
                            top: '105px',
                            padding: '10px',
                            width: '40px',
                        }}
                        onClick={() => setHomingGps(!homingGps)}
                    >
                        {homingGps ? <TbGpsFilled /> : <TbGps />}
                    </button>
                </div>
            ) : null}

            <MapContainer
                center={[16.4637, 107.5909]}
                zoom={10}
                // style={{ width: '1000px', height: '500px' }}
            >
                <MapZoomController zoomMarker={zoomMarker} />
                {/* <TileLayer url="https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.png" /> */}
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {/* {permissionsId.includes(1) ? (
                    <DrawControl
                        onGeometryChange={onGeometryChange}
                        father={father}
                        fatherTable={fatherTable}
                    />
                ) : (
                    <></>
                )} */}

                {waypoints.length === 2 && waypoints[0] && waypoints[1] && (
                    <RoutingControl
                        waypoints={waypoints}
                        gpsLocation={gpsLocationRef.current}
                        gpsEnabled={gpsEnabled}
                    />
                )}
                {renderMarkers()}
                {gpsEnabled && (
                    <GPSMarker
                        gpsLocationRef={gpsLocationRef}
                        homingGps={homingGps}
                    />
                )}
            </MapContainer>
        </div>
    );
};
const MapZoomController = ({ zoomMarker }) => {
    const map = useMap();

    useEffect(() => {
        if (zoomMarker) {
            if (zoomMarker.lat && zoomMarker.lng)
                map.flyTo([zoomMarker.lat, zoomMarker.lng], 18, {
                    animate: true,
                    duration: 1,
                });
            else alert('Địa điểm chưa được gán tọa độ');
        }
    }, [zoomMarker, map]);

    return null;
};

export default LeafletDrawMap;

// useEffect(() => {
//     if (!gpsEnabled) {
//         setGpsLocation(null);
//         gpsLocationRef.current = null;
//         return;
//     }

//     const watchId = navigator.geolocation.watchPosition(
//         (position) => {
//             gpsLocationRef.current = {
//                 lat: position.coords.latitude,
//                 lng: position.coords.longitude,
//             };
//             // setGpsLocation(gpsLocationRef.current);
//             console.log("GPS Updated:", gpsLocationRef.current);
//         },
//         (error) => {
//             console.error("Lỗi lấy vị trí GPS:", error);
//         },
//         {
//             enableHighAccuracy: true,
//             timeout: 5000,
//             maximumAge: 0,
//         }
//     );

//     return () => {
//         navigator.geolocation.clearWatch(watchId);
//         gpsLocationRef.current = null;
//         setGpsLocation(null);
//     };
// }, [gpsEnabled]);
