import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';
const LoginPage = ({ setPermissionsId }) => {
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // Gọi hàm useNavigate
    // const [roleId, setRoleId] = useState(5);
    const [userList, setUserList] = useState([]);
    const [role, setRole] = useState([]);
    const [rolePermission, setRolePermission] = useState([]);
    const handleGuestLogin = () => {
        const guestRoleId = 5;

        // Lọc quyền theo role_id 5
        const permissions = rolePermission
            .filter((rp) => rp.role_id === guestRoleId)
            .map((rp) => rp.permission_id);

        console.log('Permissions for Guest:', permissions); // In ra quyền của khách

        // Thiết lập quyền và chuyển trang
        setPermissionsId(permissions);
        navigate('/');
    };
    const handleLogin = (event) => {
        event.preventDefault();
        console.log(username, password);

        const matchedUser = userList.find(
            (item) => username === item.username && password === item.password
        );

        if (matchedUser) {
            const userRole = role.find((r) => r.id === matchedUser.role_id);
            const permissions = rolePermission
                .filter((rp) => rp.role_id === matchedUser.role_id)
                .map((rp) => rp.permission_id);

            const combined = {
                ...matchedUser,
                roleName: userRole?.name || null,
                permissions,
            };

            console.log('Combined User Info:', combined);
            setPermissionsId(permissions);
            // setRoleId(Number(matchedUser.role_id));
            navigate('/');
        } else {
            alert('Tên đăng nhập hoặc mật khẩu không đúng!');
        }
    };
    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const response = await axios.get(
    //                 "http://localhost:8000/api/admin/user"
    //             );
    //             setUserList(response.data);
    //         } catch (err) {
    //             console.error("Failed to fetch data", err);
    //         }
    //     };
    //     fetchData();
    // }, []);
    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const response = await axios.get(
    //                 "http://localhost:8000/api/admin/rolepermissions"
    //             );
    //             setRolePermission(response.data);
    //         } catch (err) {
    //             console.error("Failed to fetch data", err);
    //         }
    //     };
    //     fetchData();
    // }, []);
    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const response = await axios.get(
    //                 "http://localhost:8000/api/admin/permissions"
    //             );
    //             setRole(response.data);
    //         } catch (err) {
    //             console.error("Failed to fetch data", err);
    //         }
    //     };
    //     fetchData();
    // }, []);
    // const combinedData = () => {
    //     const userRole = role.find((r) => r.id === matchedUser.role_id);
    //     return {
    //         ...user,
    //         roleName: userRole ? userRole.name : null,
    //         // roleDescription: userRole ? userRole.description : null,
    //     };
    // };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userRes, rolePermRes, roleRes] = await Promise.all([
                    axios.get('http://localhost:8000/api/admin/user'),
                    axios.get(
                        'http://localhost:8000/api/admin/rolepermissions'
                    ),
                    axios.get('http://localhost:8000/api/admin/permissions'),
                ]);

                const users = userRes.data;
                const rolePermissions = rolePermRes.data;
                const roles = roleRes.data;

                setUserList(users);
                setRolePermission(rolePermissions);
                setRole(roles);
                console.log(users, 1);
                console.log(rolePermissions, 2);
                console.log(roles, 3);
                // Ví dụ matchedUser là user hiện tại
            } catch (err) {
                console.error('Failed to fetch data', err);
            }
        };

        fetchData();
    }, []);
    useEffect(() => {});
    return (
        <div className="login-page">
            <div class="logo-container">
                <img className="logo" src="../../assets/OIP.jpg" alt="Logo" />
            </div>
            <form onSubmit={handleLogin} className="login-form">
                <div className="input-group login-input">
                    <label htmlFor="username">Email</label>
                    <input
                        type="text"
                        id="username"
                        required
                        value={username}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="nhập email"
                    />
                </div>
                <div className="input-group login-input">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="nhập mật khẩu"
                    />
                </div>
                <div className="submit-button">
                    <button type="button" onClick={handleGuestLogin}>
                        <i>Sử dụng khách</i>
                    </button>
                    <button type="submit">Login</button>
                </div>
            </form>
        </div>
    );
};

export default LoginPage;
