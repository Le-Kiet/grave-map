import React, { useRef, useState, useEffect } from "react";
import {
    MapContainer,
    Popup,
    TileLayer,
    Polyline,
    Polygon,
} from "react-leaflet";
import { IoArrowDownCircleOutline } from "react-icons/io5";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import "./Map.css";
const Map = ({
    id,
    tableStatus,
    handleTableStatus,
    mixedData,
    selectedItems,
    selectedOption,
    showUserTable,
}) => {
    const [getData, setData] = useState(false);
    const latitude = 12.4;
    const longitude = 108;
    const [forestAreas, setForestAreas] = useState([]);
    const [khuVucRung, setKhuVucRung] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [color, setColor] = useState("green");
    const [highlightColor, setHighlightColor] = useState("yellow");
    const [zoomedAreaId, setZoomedAreaId] = useState(null);
    useEffect(() => {
        if (selectedItems) {
            setData(true);
        }
    }, [selectedItems]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:8000/api/geom"
                );
                const areas = response.data.map((area) => {
                    const geom = JSON.parse(area.geom);
                    return { ...area, coordinates: geom.coordinates };
                });

                setForestAreas(areas);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:8000/api/lorung/all"
                );
                const areas = response.data.map((area) => {
                    const geom = JSON.parse(area.geom);
                    return { ...area, coordinates: geom.coordinates };
                });
                setKhuVucRung(areas);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);
    const mapRef = useRef();

    useEffect(() => {
        if (selectedId) {
            const area = khuVucRung.find((item) => item.id === selectedId); // Sử dụng selectedId
            if (area && mapRef.current) {
                const bounds = L.latLngBounds(
                    area.coordinates[0].map((coord) => [coord[1], coord[0]])
                );
                mapRef.current.fitBounds(bounds);
            }
        }
    }, [selectedId, khuVucRung]);
    useEffect(() => {
        if (showUserTable === "cảnh báo cháy rừng" && mapRef.current) {
            const allCoords = [];

            mixedData.forEach((area) => {
                if (Array.isArray(area.coordinates)) {
                    // Một số area.coordinates là [[[lat, lng], ...]]
                    area.coordinates[0].forEach((point) => {
                        allCoords.push([point[1], point[0]]); // ⚡ Lưu ý: Leaflet dùng [lat, lng] (latitude trước), GeoJSON thì ngược lại [lng, lat]
                    });
                }
            });

            if (allCoords.length > 0) {
                mapRef.current.fitBounds(allCoords);
            }
        }
    }, [showUserTable, mixedData]);
    useEffect(() => {
        if (showUserTable === "hiện trạng lô rừng" && mapRef.current) {
            const allCoords = [];

            khuVucRung.forEach((area) => {
                if (Array.isArray(area.coordinates)) {
                    // Một số area.coordinates là [[[lat, lng], ...]]
                    area.coordinates[0].forEach((point) => {
                        allCoords.push([point[1], point[0]]); // ⚡ Lưu ý: Leaflet dùng [lat, lng] (latitude trước), GeoJSON thì ngược lại [lng, lat]
                    });
                }
            });

            if (allCoords.length > 0) {
                mapRef.current.fitBounds(allCoords);
            }
        }
    }, [showUserTable, khuVucRung]);
    useEffect(() => {
        if (selectedOption) {
            const areasInSociety = khuVucRung.filter(
                (item) => item.tenxa === selectedOption
            );
            if (areasInSociety.length > 0 && mapRef.current) {
                const bounds = L.latLngBounds(
                    areasInSociety.flatMap((area) =>
                        area.coordinates[0].map((coord) => [coord[1], coord[0]])
                    )
                );
                mapRef.current.fitBounds(bounds);

                // Lưu ID khu vực đã zoom
                setZoomedAreaId(areasInSociety.map((area) => area.id));
            }
        }
    }, [selectedOption, khuVucRung]);
    useEffect(() => {
        if (selectedOption) {
            console.log(selectedOption, "selectedOption");
            const areasInSociety = khuVucRung.filter((item) => {
                const isMatch = item.tenxa === selectedOption;
                return isMatch;
            });
            console.log(areasInSociety, "areasInSociety");
            if (areasInSociety.length > 0 && mapRef.current) {
                const bounds = L.latLngBounds(
                    areasInSociety.flatMap((area) =>
                        area.coordinates[0].map((coord) => [coord[1], coord[0]])
                    )
                );
                mapRef.current.fitBounds(bounds);
                console.log(true, "bounds");
            }
        }
    }, [selectedOption, khuVucRung]);
    useEffect(() => {
        if (id) {
            setSelectedId(id);
        }
    }, [id]);
    const getColor = (capdubao) => {
        switch (capdubao) {
            case "V":
                return "red";
            case "IV":
                return "orange";
            case "III":
                return "yellow";
            case "II":
                return "green";
            case "I":
                return "yellowgreen";
            default:
                return "white";
        }
    };

    console.log(mixedData.area, "mixedData");
    const position = [12.595380105615988, 108.05468229548627];

    return (
        <div>
            <MapContainer
                center={[latitude, longitude]}
                zoom={10}
                ref={mapRef}
                style={{ height: "55vh", width: "80vw" }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {showUserTable === "cảnh báo cháy rừng" ? (
                    mixedData.map((area, index) => {
                        if (
                            !area.coordinates ||
                            !Array.isArray(area.coordinates)
                        ) {
                            return null;
                        }
                        return (
                            <div>
                                <Polyline
                                    positions={area.coordinates[0]}
                                    color={getColor(area.capdubao)} // Gọi hàm để lấy màu sắc
                                    fillOpacity={1}
                                    zIndex={1000}
                                />
                                <Polygon
                                    positions={area.coordinates[0]}
                                    color={getColor(area.capdubao)} // Có thể sử dụng cùng màu
                                    fillOpacity={1}
                                    zIndex={1000}
                                />
                            </div>
                        );
                    })
                ) : (
                    <div></div>
                )}
                {/* {getData ? (
                    selectedItems &&
                    selectedItems.length > 0 &&
                    selectedItems[1].check ? (
                        mixedData.map((area, index) => {
                            if (
                                !area.coordinates ||
                                !Array.isArray(area.coordinates)
                            ) {
                                return null;
                            }
                            return (
                                <div key={index}>
                                    <Polyline
                                        positions={area.coordinates[0]}
                                        color={getColor(area.capdubao)} // Gọi hàm để lấy màu sắc
                                        fillOpacity={1}
                                        zIndex={100} // Đặt zIndex nếu cần
                                    />
                                    <Polygon
                                        positions={area.coordinates[0]}
                                        color={getColor(area.capdubao)} // Có thể sử dụng cùng màu
                                        fillOpacity={1}
                                        zIndex={100} // Polygon hiển thị trên Polyline
                                    />
                                </div>
                            );
                        })
                    ) : (
                        <div></div>
                    )
                ) : (
                    <div></div>
                )} */}
                {forestAreas.map((area, index) => {
                    if (!area.coordinates || !Array.isArray(area.coordinates)) {
                        return null;
                    }
                    return (
                        <div>
                            <Polyline
                                // key={index}
                                positions={area.coordinates[0]}
                                color="black"
                                fillOpacity={0.1}
                                zIndex={10}
                            />
                            <Polygon
                                key={index}
                                positions={area.coordinates[0]}
                                color="black"
                                fillOpacity={0.1}
                                zIndex={10}
                            />
                        </div>
                    );
                })}
                {showUserTable === "hiện trạng lô rừng" ? (
                    khuVucRung.map((area, index) => {
                        if (
                            !area.coordinates ||
                            !Array.isArray(area.coordinates)
                        ) {
                            return null;
                        }
                        const isSelected = area.id === selectedId;
                        const isZoomed =
                            zoomedAreaId && zoomedAreaId.includes(area.id); // Kiểm tra nếu khu vực được zoom

                        return (
                            <div key={index}>
                                <Polyline
                                    positions={area.coordinates[0]}
                                    color={
                                        area.id === id
                                            ? { color }
                                            : { highlightColor }
                                    }
                                    zIndex={1}
                                />
                                <Polygon
                                    key={index}
                                    positions={area.coordinates[0]}
                                    pathOptions={{
                                        color: isZoomed
                                            ? "green"
                                            : isSelected
                                            ? "green"
                                            : "yellow",
                                        fillOpacity: 0.4,
                                    }}
                                    eventHandlers={{
                                        click: () =>
                                            setSelectedId(
                                                isSelected ? null : area.id
                                            ), // Bỏ chọn nếu đã chọn
                                    }}
                                    zIndex={1}
                                >
                                    <Popup>
                                        <b>Chủ rừng: {area.churung}</b>
                                        <br />
                                        Địa danh: {area.diadanh}
                                        <br />
                                        Tên xã: {area.tenxa}
                                        <br />
                                        Mã tiểu khu: {area.matieukhu}
                                        <br />
                                        Số tờ: {area.soto}
                                        <br />
                                        Số thửa: {area.sothua} <br />
                                        Mã lô: {area.malo}
                                        <br />
                                        Mã lô cũ: {area.malocu}
                                    </Popup>
                                </Polygon>
                            </div>
                        );
                    })
                ) : (
                    <div></div>
                )}
                {showUserTable === "hiện trạng lô rừng" ? (
                    khuVucRung.map((area, index) => {
                        if (
                            !area.coordinates ||
                            !Array.isArray(area.coordinates)
                        ) {
                            return null;
                        }
                        const isSelected = area.id === selectedId;
                        const isZoomed =
                            zoomedAreaId && zoomedAreaId.includes(area.id); // Kiểm tra nếu khu vực được zoom

                        return (
                            <div key={index}>
                                <Polyline
                                    positions={area.coordinates[0]}
                                    color={
                                        area.id === id
                                            ? { color }
                                            : { highlightColor }
                                    }
                                    zIndex={1}
                                />
                                <Polygon
                                    key={index}
                                    positions={area.coordinates[0]}
                                    pathOptions={{
                                        color: isZoomed
                                            ? "green"
                                            : isSelected
                                            ? "green"
                                            : "yellow",
                                        fillOpacity: 0.4,
                                    }}
                                    eventHandlers={{
                                        click: () =>
                                            setSelectedId(
                                                isSelected ? null : area.id
                                            ), // Bỏ chọn nếu đã chọn
                                    }}
                                    zIndex={1}
                                >
                                    <Popup>
                                        <b>Chủ rừng: {area.churung}</b>
                                        <br />
                                        Địa danh: {area.diadanh}
                                        <br />
                                        Tên xã: {area.tenxa}
                                        <br />
                                        Mã tiểu khu: {area.matieukhu}
                                        <br />
                                        Số tờ: {area.soto}
                                        <br />
                                        Số thửa: {area.sothua} <br />
                                        Mã lô: {area.malo}
                                        <br />
                                        Mã lô cũ: {area.malocu}
                                    </Popup>
                                </Polygon>
                            </div>
                        );
                    })
                ) : (
                    <div></div>
                )}
            </MapContainer>
            {/* <div className="table-status-icon">
                <IoArrowDownCircleOutline onClick={handleTableStatus} />
            </div> */}
        </div>
    );
};

export default Map;
