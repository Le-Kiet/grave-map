import { useState, useEffect } from "react";
import { IoMenu, IoArrowDownOutline } from "react-icons/io5";
import { FaRegCopyright } from "react-icons/fa";
import "./Footer.css";
import axios from "axios";
function Footer() {
    return (
        <>
            <div className="footer">
                <div>
                    <FaRegCopyright style={{ marginRight: "10px" }} /> 2024 IGEO
                    v1.0
                </div>
                <div>Cổng thông tin quản lý dữ liệu rừng tỉnh Đăk Lăk</div>
                <div></div>
            </div>
        </>
    );
}

export default Footer;
