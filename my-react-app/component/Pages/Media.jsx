// src/component/Pages/HomePage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css'; // chứa phần style

const Media = () => {
    const navigate = useNavigate();

    return (
        <div className="home-container">
            <h2 className="title">
                HỌ NGUYỄN HỮU
                <br />
                PHÁI NHẤT – CHI NHẤT
            </h2>

            <div className="button-wrapper">
                <video width="400" controls>
                    <source
                        src="https://www.w3schools.com/html/mov_bbb.mp4"
                        type="video/mp4"
                    />
                    Trình duyệt của bạn không hỗ trợ video.
                </video>
            </div>

            <button
                className="button-format"
                onClick={() => navigate('/')}
                style={{ position: 'absolute', bottom: '40px', right: '0px' }}
            >
                Quay lại trang chủ
            </button>
            <footer className="footer">
                © 2025 Phái Nhất, Chi Nhất, Họ Nguyễn Hữu.
            </footer>
        </div>
    );
};

export default Media;
