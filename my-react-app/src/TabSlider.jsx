import React from "react";
import { Link, useLocation } from "react-router-dom";
import { AppBar, Tabs, Tab } from "@mui/material";
import "./TabSlider.css";

const TabSlider = () => {
    const location = useLocation();

    // Determine the value for Tabs based on the path
    const getTabValue = () => {
        switch (location.pathname) {
            case "/":
                return 0; // Map
            case "/data":
                return 1; // Data
            case "/stats":
                return 2; // Stats
            case "/admin":
                return 3; // Admin
            case "/login":
                return 4; // Login
            default:
                return 0; // Default
        }
    };

    const tabValue = getTabValue();
    console.log("Current Path:", location.pathname, "Tab Value:", tabValue); // Debugging line

    return (
        <AppBar position="static" className="slider-bar">
            <Tabs value={tabValue}>
                <Tab
                    label="Bản đồ"
                    component={Link}
                    to="/"
                    className={location.pathname === "/" ? "active" : ""}
                />
                <Tab
                    label="Dữ liệu"
                    component={Link}
                    to="/data"
                    className={location.pathname === "/data" ? "active" : ""}
                />
                <Tab
                    label="Thống kê"
                    component={Link}
                    to="/stats"
                    className={location.pathname === "/stats" ? "active" : ""}
                />
                <Tab
                    label="Quản trị"
                    component={Link}
                    to="/admin"
                    className={location.pathname === "/admin" ? "active" : ""}
                />
            </Tabs>
        </AppBar>
    );
};

export default TabSlider;
