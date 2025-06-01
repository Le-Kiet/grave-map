import { StrictMode, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import Header from '../component/Header.jsx';
import Footer from '../component/Footer.jsx';
import Sidebar from '../component/Sidebar';
import { useMediaQuery } from 'react-responsive';

import {
    BrowserRouter as Router,
    Route,
    Routes,
    useLocation,
} from 'react-router-dom';
import axios from 'axios';
import AdminPage from '../component/Pages/AdminPage.jsx';
import MapPage from '../component/Pages/MapPage.jsx';
import DataPage from '../component/Pages/DataPage.jsx';
import Login from '../component/Pages/Login.jsx'; // Import trang đăng nhập
import Test from '../component/Pages/Test.jsx';
import Demo from '../component/Pages/Demo.jsx';
import HomePage from '../component/Pages/HomePage.jsx';
import { BiBorderLeft } from 'react-icons/bi';
import History from '../component/Pages/History.jsx';
import GraveYard from '../component/Pages/GraveYard';
import Date from '../component/Pages/Date';
import Media from '../component/Pages/Media';
const Root = () => {
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

    const [districtArea, setDistrictArea] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [forestAreas, setForestAreas] = useState([]);
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const isLoginPage =
        location.pathname === '/login' || location.pathname === '/demo';
    const [user, setUser] = useState([]);
    const [showUserTable, setShowUserTable] = useState('cảnh báo cháy rừng');
    // console.log(process.memoryUsage(), "memory");
    if (window.performance && window.performance.memory) {
        console.log(window.performance.memory, 'memory');
    }
    // const [roleId, setRoleId] = useState(1);
    const [permissionsId, setPermissionsId] = useState([1, 2, 3, 4, 5, 6]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    'http://localhost:8000/api/admin/user'
                );
                setUser(response.data);
            } catch (err) {
                console.error('Failed to fetch data', err);
            }
        };
        fetchData();
    }, []);

    const handleCheckboxChange = (type) => {
        console.log(type, 'type');
        setShowUserTable(type);
    };

    return (
        <>
            {/* {!isLoginPage && <Header permissionsId={permissionsId} />} */}
            <div className="content-wrapper">
                {/* {!isLoginPage && (
                    <Sidebar
                        onItemChange={handleCheckboxChange}
                        type={location.pathname}
                        permissionsId={permissionsId}
                    />
                )} */}
                <div
                    style={
                        isMobile
                            ? {
                                  fontSize: '8px !important',
                                  borderLeft: '1px solid black',
                              }
                            : {
                                  marginBottom: '20px',
                                  borderLeft: '1px solid black',
                              }
                    }
                >
                    <Routes>
                        {/* <Route
                            path="/"
                            element={<MapPage showUserTable={showUserTable} />}
                        /> */}
                        {/* <Route
                            path="/data"
                            element={
                                <DataPage
                                    showUserTable={showUserTable}
                                    permissionsId={permissionsId}
                                />
                            }
                        />
                        <Route
                            path="/admin"
                            element={
                                <AdminPage
                                    user={user}
                                    showUserTable={showUserTable}
                                    // roleId={roleId}
                                    permissionsId={permissionsId}
                                />
                            }
                        /> */}
                        <Route
                            path="/login"
                            element={
                                <Login
                                    // setRoleId={setRoleId}
                                    setPermissionsId={setPermissionsId}
                                />
                            }
                        />{' '}
                        {/* <Route
                            path="/test"
                            element={
                                <Test
                                    // setRoleId={setRoleId}
                                    showUserTable={showUserTable}
                                    setPermissionsId={setPermissionsId}
                                />
                            }
                        />{' '} */}
                        <Route
                            path="/demo"
                            element={
                                <Demo
                                    // setRoleId={setRoleId}
                                    showUserTable={showUserTable}
                                    setPermissionsId={setPermissionsId}
                                />
                            }
                        />{' '}
                        <Route
                            path="/"
                            element={
                                <HomePage
                                    // setRoleId={setRoleId}
                                    permissionsId={permissionsId}
                                />
                            }
                        />{' '}
                        <Route path="/history" element={<History />} />
                        <Route
                            path="/graveyard"
                            element={
                                <GraveYard permissionsId={permissionsId} />
                            }
                        />
                        <Route
                            path="/map"
                            element={<Demo permissionsId={permissionsId} />}
                            showUserTable={showUserTable}
                        />
                        <Route
                            path="/date"
                            element={<Date permissionsId={permissionsId} />}
                        />
                        <Route path="/media" element={<Media />} />
                        {/* Trang đăng nhập */}
                    </Routes>
                </div>
            </div>
            {/* {!isLoginPage && <Footer />} */}
        </>
    );
};

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Router>
            <Root />
        </Router>
    </StrictMode>
);
