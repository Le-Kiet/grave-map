import axios from "axios";
import { useEffect, useState } from "react";

const useFetchData = () => {
    const [data, setData] = useState({
        forestAreas: [],
        districtArea: [],
        filteredData: [],
        // lorungData: [],
        user: [],
        nguongoc: [],
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [forestRes, geomRes, nguongocRes, userRes, filterRes] =
                    await Promise.all([
                        axios.get("http://localhost:8000/api/lamnghiep"), // dữ liệu lâm nghiệp
                        axios.get("http://localhost:8000/api/geom"), // ranh giới huyện
                        axios.get("http://localhost:8000/api/nguongoc"), // nguồn gốc rừng
                        axios.get("http://localhost:8000/api/admin/user"), // danh sách user
                        axios.get("http://localhost:8000/api/lorung"), // danh sách user
                    ]);

                setData({
                    forestAreas: forestRes.data,
                    districtArea: geomRes.data,
                    nguongoc: nguongocRes.data,
                    // lorungData: lorungRes.data,
                    user: userRes.data,
                    filteredData: filterRes.data, // mặc định filtered bằng tất cả
                });
            } catch (error) {
                console.error("Fetch error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAll();
    }, []);

    return {
        forestAreas: Array.isArray(data.forestAreas) ? data.forestAreas : [],
        districtArea: Array.isArray(data.districtArea) ? data.districtArea : [],
        user: Array.isArray(data.user) ? data.user : [],
        nguongoc: Array.isArray(data.nguongoc) ? data.nguongoc : [],
        // lorungData: Array.isArray(data.lorungData) ? data.lorungData : [],
        filteredData: Array.isArray(data.filteredData) ? data.filteredData : [],
        loading,
    };
};

export default useFetchData;
