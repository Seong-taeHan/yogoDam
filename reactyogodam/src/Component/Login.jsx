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
        <div class="container">
        <header>
            <a href="#" class="back-button"></a>
        </header>
        <main>
            <a class="bannerImg"></a>
            <form>
                <div class="input-group">
                    <label for="email">이메일을 입력해 주세요</label>
                    <input type="email" id="email" placeholder="이메일을 입력해 주세요"/>
                </div>
                <div class="input-group">
                    <label for="password">비밀번호를 입력해 주세요</label>
                    <input
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setUser_pw(e.target.value)}
                    required/>
                </div>
                <button type="submit" class="login-button">로그인</button>
            </form>
            <p class="signup-text">아직 회원이 아니신가요?<Link to='/joinuser'>회원가입</Link></p>
        </main>
    </div>

    );
};

export default Login;


