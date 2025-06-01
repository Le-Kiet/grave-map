import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";

const MultiDataTable = () => {
    const [datasets, setDatasets] = useState({
        dataset1: { data: [], columns: [] },
        dataset2: { data: [], columns: [] },
        dataset3: { data: [], columns: [] },
    });
    const [currentData, setCurrentData] = useState([]);
    const [currentColumns, setCurrentColumns] = useState([]);
    const [currentDataset, setCurrentDataset] = useState("dataset1");
    const [dataDialog, setDataDialog] = useState(false);
    const [newData, setNewData] = useState({}); // Dữ liệu mới để thêm

    useEffect(() => {
        const fetchData = async () => {
            // Lấy dữ liệu và cấu trúc cột như đã mô tả trước
        };

        fetchData();
    }, []);

    const addData = async (dataset, newData) => {
        const response = await fetch(`/api/${dataset}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newData),
        });
        return response.json();
    };

    const handleAddData = async () => {
        const addedData = await addData(currentDataset, newData);
        setCurrentData((prev) => [...prev, addedData]);
        setDataDialog(false);
    };

    return (
        <div>
            <div className="dataset-selector">
                <Button onClick={() => handleDatasetChange("dataset1")}>
                    Tập dữ liệu 1
                </Button>
                <Button onClick={() => handleDatasetChange("dataset2")}>
                    Tập dữ liệu 2
                </Button>
                <Button onClick={() => handleDatasetChange("dataset3")}>
                    Tập dữ liệu 3
                </Button>
            </div>

            <DataTable
                value={currentData}
                paginator
                rows={10}
                header="Dữ liệu tỉnh"
                tableStyle={{ minWidth: "50rem" }}
            >
                {currentColumns.map((col) => (
                    <Column
                        key={col.field}
                        field={col.field}
                        header={col.header}
                    />
                ))}
            </DataTable>

            <Button label="Thêm dữ liệu" onClick={() => setDataDialog(true)} />

            <Dialog
                header="Thêm dữ liệu"
                visible={dataDialog}
                onHide={() => setDataDialog(false)}
            >
                {/* Form để nhập dữ liệu mới */}
                <Button label="Gửi" onClick={handleAddData} />
                <Button label="Đóng" onClick={() => setDataDialog(false)} />
            </Dialog>
        </div>
    );
};

export default MultiDataTable;
