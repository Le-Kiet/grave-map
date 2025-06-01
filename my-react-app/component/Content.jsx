import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { FaSearch } from "react-icons/fa";
import "./Content.css";
import Pagination from "./Pagintaion.jsx";
import Table from "./Table.jsx";
import axios from "axios";
import Map from "./Map.jsx";
import Statistic from "./Statistic.jsx";
import { BsFillFileBarGraphFill } from "react-icons/bs";

function Content({ data, selectedItems, showUserTable }) {
    const [filterStatus, setfilterStatus] = useState(false);

    const [selectedOption, setSelectedOption] = useState("");
    const [lorungData, setLorungData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [id, setId] = useState(0);
    const [tableStatus, setTableStatus] = useState(true);
    const [districtArea, setDistrictArea] = useState([]);
    const [showDialog, setShowDialog] = useState(false);
    //pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    //pagination
    const mapRef = useRef();
    const [forestAreas, setForestAreas] = useState([]);
    const [nguonGoc, setNguonGoc] = useState([]);
    const [switchTableStatistic, setSwitchTableStatistic] = useState(false);
    const [chartData, setChartData] = useState([]);
    const [searchValues, setSearchValues] = useState({
        tenxa: "",
        diadanh: "",
        nguongocrung: "",
        malo: "",
    });
    const provinces = [
        { value: "Xã Hòa Khánh", label: "Xã Hòa Khánh" },
        { value: "Phường Khánh Xuân", label: "Phường Khánh Xuân" },
        { value: "Xã Ea Kao", label: "Xã Ea Kao" },
        { value: "Tổ 5", label: "Tổ 5" },
        { value: "Xã Cư ÊBur", label: "Xã Cư ÊBur" },
        { value: "Phường Ea Tam", label: "Phường Ea Tam" },
        { value: "Phường Tân Thành", label: "Phường Tân Thành" },
        { value: "Tổ 9", label: "Tổ 9" },
        { value: "Phường Tân An", label: "Phường Tân An" },
    ];
    const [filteredData, setFilteredData] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:8000/api/lorung/all"
                );
                setFilteredData(response.data);
            } catch (err) {
                setError("Failed to fetch data");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:8000/api/lamnghiep"
                );

                setDistrictArea(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
        console.log(districtArea, "districtArea");
    }, []);

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
        const fetchDataNguonGoc = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:8000/api/nguongoc"
                );
                setNguonGoc(response.data);
            } catch (err) {
                setError("Failed to fetch data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        fetchDataNguonGoc();
    }, []);
    console.log(
        filteredData,
        "filteredData",
        districtArea,
        "districtArea",
        forestAreas,
        "forestAreas",
        nguonGoc,
        "nguonGoc"
    );
    const updatedData = filteredData.map((item) => {
        const match = nguonGoc.find((newItem) => newItem.id === item.mangr);
        return {
            ...item,
            nguongocrung: match ? match.ten : null,
        };
    });
    const handleClick = (id) => {
        console.log("Clicked row ID:", id);
        setId(id);
        handleAreaClick(id);
    };
    const handleAreaClick = (coordinates) => {
        // console.log(coordinates, "coordinates");
        const map = mapRef.current;
        if (map) {
            const bounds = L.latLngBounds(
                coordinates[0].map((coord) => [coord[1], coord[0]])
            );
            map.fitBounds(bounds);
        }
    };

    const handleChange = (event) => {
        const selectedValue = event.target.value;
        setSelectedOption(selectedValue);

        setSearchValues((prevValues) => ({
            ...prevValues,
            tenxa: selectedValue,
            diadanh: "",
            nguongocrung: "",
            malo: "",
        }));
        const searchedData = updatedData.filter((item) => {
            return (
                (selectedValue === "" || item.tenxa === selectedValue) &&
                searchValues.diadanh === "" &&
                searchValues.nguongocrung === "" &&
                searchValues.malo === ""
            );
        });
        setLorungData(searchedData);

        console.log(searchedData, "searchedData");
        setChartData(newData, "newData");
        setCurrentPage(1); // Đặt lại trang hiện tại
    };

    // Tính toán dữ liệu chỉ khi lorungData thay đổi
    const groupedData = useMemo(() => {
        const groupedData = lorungData.reduce((acc, item) => {
            if (!acc[item.tenxa]) {
                acc[item.tenxa] = {
                    name: item.tenxa,
                    totalSoto: 0,
                    totalSothua: 0,
                    totalDienTich: 0,
                };
            }
            acc[item.tenxa].totalSoto += item.soto;
            acc[item.tenxa].totalSothua += item.sothua;
            acc[item.tenxa].totalDienTich += item.dientich;
            return acc;
        }, {});

        return Object.values(groupedData);
    }, [lorungData]);

    const handleSearch = () => {
        setSearchValues(tempValues);
        console.log(filteredData, "filteredData");
        const searchedData = updatedData.filter((item) => {
            return (
                (tempValues.tenxa === "" || item.tenxa === tempValues.tenxa) &&
                (tempValues.diadanh === "" ||
                    item.diadanh === tempValues.diadanh) &&
                (tempValues.nguongocrung === "" ||
                    item.nguongocrung === tempValues.nguongocrung) &&
                (tempValues.malo === "" || item.malo === tempValues.malo)
            );
        });
        setCurrentPage(1);
        setLorungData(searchedData); // Cập nhật dữ liệu đã lọc
        setfilterStatus(true);
        console.log(searchedData, "searchedData");
        setShowDialog(false); // Đóng hộp thoại sau khi tìm kiếm
    };

    const handleOptionChange = (newOption) => {
        setSelectedOption(newOption);
        const selectedValue = newOption;

        setSearchValues((prevValues) => ({
            ...prevValues,
            tenxa: selectedValue,
            diadanh: "",
            nguongocrung: "",
            malo: "",
        }));
        const searchedData = updatedData.filter((item) => {
            return (
                (selectedValue === "" || item.tenxa === selectedValue) &&
                searchValues.diadanh === "" &&
                searchValues.nguongocrung === "" &&
                searchValues.malo === ""
            );
        });
        setLorungData(searchedData);

        console.log(searchedData, "searchedData");
        setChartData(newData, "newData");
        setCurrentPage(1); // Đặt lại trang hiện tại
    };
    const handleRefresh = () => {
        // Reset the search values
        setSearchValues({
            tenxa: "",
            diadanh: "",
            nguongocrung: "",
            malo: "",
        });
        console.log(searchValues, "onclick làm mới");
        const searchedData = updatedData.filter((item) => {
            return (
                searchValues.tenxa === "" &&
                searchValues.diadanh === "" &&
                searchValues.nguongocrung === "" &&
                searchValues.malo === ""
            );
        });
        setCurrentPage(1);
        setLorungData(updatedData);
        console.log(lorungData, "Làm mới");
    };

    const handleTableStatus = () => {
        setTableStatus(!tableStatus);
    };
    const mixedData = districtArea.map((item) => {
        let geom = null;
        const match = forestAreas.find(
            (newItem) =>
                newItem.tenhuyen.toLowerCase() === item.tenhuyen.toLowerCase()
        );

        if (match) {
            geom = JSON.parse(match.geom);
        }

        return {
            ...item,
            coordinates: geom ? geom.coordinates : null,
        };
    });
    const handleCloseDialog = () => {
        setSwitchTableStatistic(!switchTableStatistic);
    };
    const [tempValues, setTempValues] = useState({ ...searchValues });

    return (
        <div className="content-container">
            {showDialog && (
                <div className="dialog">
                    <div className="dialog-content">
                        <h1>Tìm kiếm</h1>
                        <div className="input-container">
                            <div className="input-group">
                                <label htmlFor="tenxa">Tên xã</label>
                                <input
                                    id="tenxa"
                                    type="text"
                                    value={tempValues.tenxa}
                                    onChange={(e) =>
                                        setTempValues({
                                            ...tempValues,
                                            tenxa: e.target.value,
                                        })
                                    }
                                    placeholder="Tên xã"
                                />
                            </div>
                            <div className="input-group">
                                <label htmlFor="diadanh">Địa danh</label>
                                <input
                                    id="diadanh"
                                    type="text"
                                    value={tempValues.diadanh}
                                    onChange={(e) =>
                                        setTempValues({
                                            ...tempValues,
                                            diadanh: e.target.value,
                                        })
                                    }
                                    placeholder="Địa danh"
                                />
                            </div>
                            <div className="input-group">
                                <label htmlFor="nguongocrung">
                                    Nguồn gốc rừng
                                </label>
                                <input
                                    id="nguongocrung"
                                    type="text"
                                    value={tempValues.nguongocrung}
                                    onChange={(e) =>
                                        setTempValues({
                                            ...tempValues,
                                            nguongocrung: e.target.value,
                                        })
                                    }
                                    placeholder="Nguồn gốc rừng"
                                />
                            </div>
                            <div className="input-group">
                                <label htmlFor="malo">Mã lô</label>
                                <input
                                    id="malo"
                                    type="text"
                                    value={tempValues.malo}
                                    onChange={(e) =>
                                        setTempValues({
                                            ...tempValues,
                                            malo: e.target.value,
                                        })
                                    }
                                    placeholder="Mã lô"
                                />
                            </div>
                        </div>
                        <button
                            onClick={handleSearch}
                            className="search-button"
                        >
                            Tìm kiếm
                        </button>
                        <button
                            onClick={() => setShowDialog(false)}
                            className="close-button"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            )}
            <div className="content">
                <Map
                    id={id}
                    tableStatus={tableStatus}
                    handleTableStatus={handleTableStatus}
                    mixedData={mixedData}
                    selectedItems={selectedItems}
                    selectedOption={selectedOption}
                    showUserTable={showUserTable}
                />
                {/* <img src="./../assets/map.jpg" alt="" /> */}
                <div className={tableStatus ? "" : "close-table"}>
                    <div className="table-header">
                        <button style={{ background: "#bbbbbb" }}>
                            Biểu đồ
                            <BsFillFileBarGraphFill
                                onClick={handleCloseDialog}
                                style={{
                                    cursor: "pointer",
                                    marginLeft: "10px",
                                }}
                            />
                        </button>
                        <div onClick={handleRefresh} className="button">
                            Làm mới
                        </div>
                        <div className="combobox">
                            <select
                                id="comboBox"
                                value={selectedOption}
                                onChange={handleChange}
                            >
                                <option value="">Tất cả các huyện, xã</option>
                                {provinces.map((province) => (
                                    <option
                                        key={province.value}
                                        value={province.value}
                                    >
                                        {province.label}
                                    </option>
                                ))}
                            </select>
                            <div
                                onClick={() => setShowDialog(true)}
                                className="button"
                            >
                                <FaSearch />
                            </div>
                        </div>
                    </div>
                    {switchTableStatistic ? (
                        <div>
                            <Statistic
                                data={data}
                                lorungData={lorungData}
                                selectedOption={selectedOption}
                                groupedData={groupedData}
                                onOptionChange={handleOptionChange}
                                handleCloseDialog={handleCloseDialog}
                            />
                        </div>
                    ) : (
                        <div></div>
                    )}

                    <Table
                        currentPage={currentPage}
                        itemsPerPage={itemsPerPage}
                        data={data}
                        handleClick={handleClick}
                        handleAreaClick={handleAreaClick}
                        selectedOption={selectedOption}
                        // searchValues={searchValues}
                        lorungData={lorungData}
                    />
                </div>
            </div>
            <div className="content-footer">
                {lorungData.length === 0 && filterStatus ? (
                    <div>Không có dữ liệu</div>
                ) : (
                    <div>
                        Hiển thị {currentPage * 10 - 9} đến{" "}
                        {filterStatus
                            ? Math.min(currentPage * 10, lorungData.length)
                            : Math.min(
                                  currentPage * 10,
                                  filteredData.length
                              )}{" "}
                        trong tổng số{" "}
                        {filterStatus ? lorungData.length : filteredData.length}{" "}
                        mục
                    </div>
                )}
                <div>
                    <Pagination
                        currentPage={currentPage}
                        selectedOption={selectedOption}
                        setCurrentPage={setCurrentPage}
                        lorungData={lorungData}
                        filteredData={filteredData}
                    />
                </div>
            </div>
        </div>
    );
}

export default Content;
