// src/component/Pages/HomePage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css'; // chứa phần style
import { useMediaQuery } from 'react-responsive';
const HomePage = ({ permissionsId }) => {
    const navigate = useNavigate();
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
    console.log(permissionsId, 'permissionsId in HomePage');
    const [isLandscape, setIsLandscape] = useState(false);
    const [isMobileLandscape, setIsMobileLandscape] = useState(false);
    useEffect(() => {
        const checkMobileLandscape = () => {
            const isLandscape = window.innerWidth > window.innerHeight;
            const isMobileDevice = /Mobi|Android/i.test(navigator.userAgent);
            setIsMobileLandscape(isLandscape && isMobileDevice);
        };

        checkMobileLandscape();
        window.addEventListener('resize', checkMobileLandscape);

        return () => {
            window.removeEventListener('resize', checkMobileLandscape);
        };
    }, []);

    const containerClass = isMobile
        ? 'home-container-mobile'
        : 'home-container';
    const buttonWrapperClass = isMobile
        ? 'button-wrapper-mobile'
        : 'button-wrapper';
    const buttonGroupClass = isMobile
        ? 'button-group-mobile'
        : 'button-group-desktop';
    const headerButtonClass = isMobile
        ? 'header-button-mobile'
        : 'header-button-desktop';

    return (
        <div
            className={`${containerClass} ${
                isMobileLandscape ? 'landscape' : ''
            }`}
        >
            <h2 className="title">
                HỌ NGUYỄN HỮU
                <br />
                PHÁI NHẤT – CHI NHẤT
            </h2>

            <div
                className={`${buttonWrapperClass} ${
                    isMobileLandscape ? 'landscape' : ''
                }`}
            >
                <div>
                    <button
                        onClick={() => navigate('/history')}
                        style={
                            isMobile || isMobileLandscape
                                ? { fontSize: '12px' }
                                : { marginBottom: '20px' }
                        }
                    >
                        Lịch sử Họ Nguyễn Hữu
                    </button>
                    <div
                        className={
                            isMobile || isMobileLandscape
                                ? 'column-buttons'
                                : 'row-buttons'
                        }
                    >
                        <button
                            onClick={() =>
                                navigate('/graveyard', {
                                    state: { permissionsId },
                                })
                            }
                        >
                            Danh mục Phần mộ
                        </button>
                        <button
                            onClick={() =>
                                navigate('/demo', { state: { permissionsId } })
                            }
                        >
                            Bản đồ vị trí Phần mộ
                        </button>
                        <button
                            onClick={() =>
                                navigate('/date', {
                                    state: { permissionsId },
                                })
                            }
                        >
                            Các ngày Chạp – Giỗ
                        </button>
                        <button onClick={() => navigate('/media')}>
                            Danh mục hình ảnh, video
                        </button>
                    </div>
                </div>
                <div>
                    <button
                        onClick={() => navigate('/login')}
                        className="logout-button"
                    >
                        Đăng xuất
                    </button>
                </div>
            </div>
            <footer
                className="footer"
                style={{
                    position: 'relative',
                    bottom: '0',
                    padding: '4px',
                    width: '100%',
                    textAlign: 'center',
                }}
            >
                © 2025 Phái Nhất, Chi Nhất, Họ Nguyễn Hữu.
            </footer>
        </div>
    );
};

export default HomePage;
