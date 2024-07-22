import axios from '../axios';
import React, { useState } from 'react';
import '../css/login.css'; // CSS 파일 경로 확인 필요
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
    const [user_id, setUser_id] = useState('');
    const [user_pw, setUser_pw] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/user/login', {
                user_id: user_id,
                user_pw: user_pw,
            });
            console.log(response);
            localStorage.setItem('token', response.data.token);
            navigate('/');
        } catch (error) {
            console.error('Login failed:', error);
            if (error.response && error.response.status === 401) {
                setErrorMessage('아이디 또는 비밀번호가 잘못되었습니다.');
            } else {
                setErrorMessage('로그인 중 오류가 발생했습니다. 다시 시도해 주세요.');
            }
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
                {errorMessage && <p className="error">{errorMessage}</p>}
                <p>아직 회원이 아니신가요? <Link to='/joinuser'>회원가입</Link></p>
            </form>
        </div>
    );
};

export default Login;
