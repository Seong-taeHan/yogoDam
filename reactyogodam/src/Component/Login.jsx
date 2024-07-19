import axios from '../axios';
import React, { useState } from 'react';
import '../css/login.css'; // CSS 파일 경로 확인 필요
import { Link } from 'react-router-dom';

const Login = () => {
    const [user_id, setUser_id] = useState('');
    const [user_pw, setUser_pw] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/user/login', {
                user_id : user_id,
                user_pw : user_pw,
            });
            console.log(response);
            // console.log("tleh " + response.data.token);
            // // 토큰을 로컬 스토리지에 저장
            //localStorage.setItem('token', response.data.token);
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    return (
        <div className='login_container'>

            <form onSubmit={handleSubmit} method='post'>
                <div className='btn_container'>
                <button type="button">◀</button>
                </div>
                <h2>요리 고민 상담</h2>
                <h1>요고담</h1>
                <input
                    type="text"
                    placeholder="user_id"
                    onChange={(e) => setUser_id(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setUser_pw(e.target.value)}
                    required
                />
                <button type="submit">로그인</button>
                <p>아직 회원이 아니신가요? <Link to='/joinuser'>회원가입</Link></p>
            </form>
        </div>
    );
};

export default Login;
