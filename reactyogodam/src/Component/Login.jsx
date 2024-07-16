import React from 'react';
import { useState } from 'react';
import axios from 'axios';

const Login = () => {
    const [user_id, setUser_id] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        console.log('방가');
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:4000/api/login', {
                user_id,
                password,
            });
            console.log("tleh " + response.data.token);
            // 토큰을 로컬 스토리지에 저장
            localStorage.setItem('token', response.data.token);
        } catch (error) {
            console.log('api')
            console.error('Login failed:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="user_id"
                value={user_id}
                onChange={(e) => setUser_id(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button type="submit">Login</button>
        </form>
    );
};

export default Login;