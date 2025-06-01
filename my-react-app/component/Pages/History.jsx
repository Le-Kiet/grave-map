// src/component/Pages/HomePage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css'; // chứa phần style
import { useMediaQuery } from 'react-responsive';

const History = () => {
    const navigate = useNavigate();
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
    return (
        <div className={isMobile ? 'home-container-mobile' : 'home-container'}>
            <h2 className="title">
                HỌ NGUYỄN HỮU
                <br />
                PHÁI NHẤT – CHI NHẤT
            </h2>

            <div className="button-wrapper">
                Nguyễn (chữ Hán: 阮) Là tên họ phổ biến nhất của người Việt,
                khoảng 40% dân số Việt Nam mang họ này. Họ Nguyễn cũng xuất hiện
                tại Trung Quốc dù ít phổ biến hơn. Có những dòng họ lớn có lịch
                sử lâu đời mang họ Nguyễn. Nhiều triều vua của Việt Nam mang họ
                này, như nhà Tây Sơn và nhà Nguyễn.
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

export default History;
