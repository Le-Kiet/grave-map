import { useState } from "react";
import "./Header.css";
import { IoMenu, IoArrowDownOutline } from "react-icons/io5";
import React from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { AppBar, Tabs, Tab } from "@mui/material";
function Header({ permissionsId }) {
    const location = useLocation();
    const currentPath = location.pathname;
    const tabValue =
        currentPath === "/"
            ? 0
            : currentPath === "/data"
            ? 1
            : currentPath === "/admin"
            ? 2
            : currentPath === "/test"
            ? 3
            : currentPath === "/demo"
            ? 4
            : false; // Nếu không khớp tab nào

    return (
        <>
            <div className="header">
                <div className="user">
                    <IoMenu />{" "}
                    <div className="avatar">
                        <img src="./../assets/OIP.jpg" alt="" />
                    </div>
                    Cơ sở dữ liệu rừng Đăk Lăk
                </div>
                <AppBar
                    className="header-slider"
                    position="static"
                    style={{
                        backgroundColor: "white",
                        justifyContent: "center",
                        width: "400px",
                    }}
                >
                    <Tabs value={tabValue}>
                        <Tab key={1} label="Bản đồ" component={Link} to="/" />
                        <Tab
                            key={2}
                            label="Dữ liệu"
                            component={Link}
                            to="/data"
                        />

                        {permissionsId.includes(4) ? (
                            <Tab
                                key={3}
                                label="Quản trị"
                                component={Link}
                                to="/admin"
                            />
                        ) : (
                            <div></div>
                        )}
                        <Tab key={4} label="Test" component={Link} to="/test" />
                        <Tab key={5} label="Demo" component={Link} to="/demo" />
                    </Tabs>
                </AppBar>
                <div className="admin">
                    <div>Quản trị viên</div>
                    <Link
                        to="/login"
                        style={{ display: "flex", alignItems: "center" }}
                    >
                        <IoArrowDownOutline />
                        Login
                    </Link>
                </div>
            </div>
        </>
    );
}

export default Header;
