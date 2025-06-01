import React from "react";
import { Route, Routes } from "react-router-dom";
import MapPage from "../component/Pages/MapPage.jsx";
import DataPage from "../component/Pages/DataPage.jsx";
import StatsPage from "../component/Pages/StatsPage.jsx";
import AdminPage from "../component/Pages/AdminPage.jsx";
import Login from "../component/Pages/Login.jsx"; // Import the new Login component
import TabSlider from "./TabSlider";
import Test from "../component/Pages/Test.jsx";
import Demo from "../component/Pages/Demo.jsx";
import "./App.css";
import { Outlet } from "react-router-dom";
const App = () => {
    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<MapPage />} />
                <Route path="/data" element={<DataPage />} />
                <Route path="/stats" element={<StatsPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/test" element={<Test />} />
                {/* <Route path="/demo" element={<Demo />} /> */}
                {/* <Route path="/login" element={<Login />} />{" "} */}
                <Route path="/login" element={<Login />}>
                    <Route index element={<Login />} />
                </Route>
                <Route path="/demo" element={<Demo />}>
                    <Route index element={<Demo />} />
                </Route>
            </Routes>
        </div>
    );
};

export default App;
