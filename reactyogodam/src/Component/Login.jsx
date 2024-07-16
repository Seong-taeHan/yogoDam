import axios from 'axios';
import React, { useState } from 'react';
import '../css/login.css'; // CSS 파일 경로 확인 필요

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
        <div className='login_container'>

            <form onSubmit={handleSubmit}>
                <div className='btn_container'>
                <button type="button">◀</button>
                </div>
                <h2>요리 고민 상담</h2>
                <h1>요고담</h1>
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
                <button type="submit">로그인</button>
                <p>아직 회원이 아니신가요? <a href="/register">회원가입</a></p>
            </form>
        </div>
    );
};

export default Login;
