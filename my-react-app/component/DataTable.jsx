import React, { useState, useEffect } from "react";
import "./DataTable.css";
import axios from "axios";
import { FaLessThanEqual } from "react-icons/fa6";

const DataTable = ({
    currentPage,
    itemsPerPage,
    handleClick,
    selectedOption,
    // searchValues,
    lorungData,
}) => {
    const [lorungData2, setLorungData2] = useState([]);
    const [nguonGoc, setNguonGoc] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dataCrawl, setDataCrawl] = useState(false);
    const [filteredGroupData, setFilteredGroupData] = useState([]); // State để lưu dữ liệu đã lọc

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:8000/api/lorung/all"
                );

                setLorungData2(response.data);
                console.log(lorungData2, "lorungData2");
            } catch (err) {
                setError("Failed to fetch data");
            } finally {
                setLoading(false);
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
    useEffect(() => {
        if (lorungData.length > 0) {
            setDataCrawl(true);
        } else {
            setDataCrawl(false);
        }
    }, [lorungData]);
    const totalPerPage = itemsPerPage || 10;
    const indexOfLastItem = currentPage * totalPerPage;
    const indexOfFirstItem = indexOfLastItem - totalPerPage;

    const updatedData = lorungData2.map((item) => {
        const match = nguonGoc.find((newItem) => newItem.id === item.mangr);
        return {
            ...item,
            nguongocrung: match ? match.ten : null,
        };
    });

    const filteredData = updatedData.filter(
        (item) => item.tenxa === selectedOption
    );

    const filteredItems = lorungData.slice(indexOfFirstItem, indexOfLastItem);
    // console.log(lorungData, "lorungData");
    const displayedItems = updatedData.slice(indexOfFirstItem, indexOfLastItem);

    const searchedData = filteredGroupData.slice(
        indexOfFirstItem,
        indexOfLastItem
    );
    // console.log(dataCrawl, "dataCrawl");
    // console.log(filteredGroupData);
    return (
        <div className="table-container">
            {loading ? (
                <p>Loading...</p>
            ) : !dataCrawl ? (
                <table>
                    <thead>
                        <tr className="datatable-header">
                            <th>Tên huyện</th>
                            <th>Tên xã</th>
                            <th>Mã tiểu khu</th>
                            <th>Mã thửa đất</th>
                            <th>Mã lô</th>
                            <th>Mã lô cũ</th>
                            <th>Mã khoanh</th>
                            <th>Số tờ</th>
                            <th>Số thửa</th>
                            <th>Địa danh</th>
                            <th>Diện tích</th>
                            <th>Nguồn gốc rừng</th>
                        </tr>
                    </thead>

                    <tbody>
                        {displayedItems.map((row) => (
                            <tr
                                key={row.id}
                                className="datatable-content"
                                onClick={() => handleClick(row.id)}
                            >
                                <td>{row.tenhuyen}</td>
                                <td>{row.tenxa}</td>
                                <td>{row.matieukhu}</td>
                                <td>{row.mathuadat}</td>
                                <td>{row.malo}</td>
                                <td>{row.malocu}</td>
                                <td>{row.makhoanh}</td>
                                <td>{row.soto}</td>
                                <td>{row.sothua}</td>
                                <td>{row.diadanh}</td>
                                <td>{row.dientich}</td>
                                <td>{row.nguongocrung}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <table>
                    <thead>
                        <tr className="datatable-header">
                            <th>Tên huyện</th>
                            <th>Tên xã</th>
                            <th>Mã tiểu khu</th>
                            <th>Mã thửa đất</th>
                            <th>Mã lô</th>
                            <th>Mã lô cũ</th>
                            <th>Mã khoanh</th>
                            <th>Số tờ</th>
                            <th>Số thửa</th>
                            <th>Địa danh</th>
                            <th>Diện tích</th>
                            <th>Nguồn gốc rừng</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dataCrawl
                            ? filteredItems.map((row) => (
                                  <tr
                                      key={row.id}
                                      className="datatable-content"
                                      onClick={() => handleClick(row.id)}
                                  >
                                      <td>{row.tenhuyen}</td>
                                      <td>{row.tenxa}</td>
                                      <td>{row.matieukhu}</td>
                                      <td>{row.mathuadat}</td>
                                      <td>{row.malo}</td>
                                      <td>{row.malocu}</td>
                                      <td>{row.makhoanh}</td>
                                      <td>{row.soto}</td>
                                      <td>{row.sothua}</td>
                                      <td>{row.diadanh}</td>
                                      <td>{row.dientich}</td>
                                      <td>{row.nguongocrung}</td>
                                  </tr>
                              ))
                            : displayedItems.map((row) => (
                                  <tr
                                      key={row.id}
                                      className="datatable-content"
                                      onClick={() => handleClick(row.id)}
                                  >
                                      <td>{row.tenhuyen}</td>
                                      <td>{row.tenxa}</td>
                                      <td>{row.matieukhu}</td>
                                      <td>{row.mathuadat}</td>
                                      <td>{row.malo}</td>
                                      <td>{row.malocu}</td>
                                      <td>{row.makhoanh}</td>
                                      <td>{row.soto}</td>
                                      <td>{row.sothua}</td>
                                      <td>{row.diadanh}</td>
                                      <td>{row.dientich}</td>
                                      <td>{row.nguongocrung}</td>
                                  </tr>
                              ))}
                    </tbody>
                    {/* <tbody>
                        {selectedOption
                            ? searchedData.map((row) => (
                                  <tr
                                      key={row.id}
                                      className="datatable-content"
                                      onClick={() => handleClick(row.id)}
                                  >
                                      <td>{row.tenhuyen}</td>
                                      <td>{row.tenxa}</td>
                                      <td>{row.matieukhu}</td>
                                      <td>{row.mathuadat}</td>
                                      <td>{row.malo}</td>
                                      <td>{row.malocu}</td>
                                      <td>{row.makhoanh}</td>
                                      <td>{row.soto}</td>
                                      <td>{row.sothua}</td>
                                      <td>{row.diadanh}</td>
                                      <td>{row.dientich}</td>
                                      <td>{row.nguongocrung}</td>
                                  </tr>
                              ))
                            : filteredItems.map((row) => (
                                  <tr
                                      key={row.id}
                                      className="datatable-content"
                                      onClick={() => handleClick(row.id)}
                                  >
                                      <td>{row.tenhuyen}</td>
                                      <td>{row.tenxa}</td>
                                      <td>{row.matieukhu}</td>
                                      <td>{row.mathuadat}</td>
                                      <td>{row.malo}</td>
                                      <td>{row.malocu}</td>
                                      <td>{row.makhoanh}</td>
                                      <td>{row.soto}</td>
                                      <td>{row.sothua}</td>
                                      <td>{row.diadanh}</td>
                                      <td>{row.dientich}</td>
                                      <td>{row.nguongocrung}</td>
                                  </tr>
                              ))}
                    </tbody> */}
                </table>
            )}
        </div>
    );
};

export default DataTable;
