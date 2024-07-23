import React, { useState, useEffect, useCallback } from 'react';
import axios from '../axios';
import '../css/JoinUser.css'; // CSS 파일 경로 확인 필요


const JoinUser = () => {
  const [user_name, setUser_name] = useState('');
  const [user_id, setUser_id] = useState('');
  const [user_pw, setUser_pw] = useState('');
  const [nick_name, setNick_name] = useState('');
  const [user_email, setUser_email] = useState('');
  const [user_phone, setUser_phone] = useState('');
  const [idCheckMsg, setIdCheckMsg] = useState('');
  const [isIdValid, setIsIdValid] = useState(false);

  // 디바운스 함수
  const debounce = (func, delay) => {
    let debounceTimer;
    return function(...args) {
      const context = this;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
  };

  const checkId = useCallback(debounce(async () => {
    try {
      const idCheckRes = await axios.post('/user/idCheck', {
        user_id: user_id,
      });
      if (idCheckRes.data.available) {
        setIdCheckMsg('사용 가능한 ID입니다.');
        setIsIdValid(true);
      } else {
        setIdCheckMsg('ID가 이미 존재합니다.');
        setIsIdValid(false);
      }
    } catch (error) {
      console.error('ID 중복 검사 실패', error);
      setIdCheckMsg('ID 중복 검사 오류');
      setIsIdValid(false);
    }
  }, 500), [user_id]);

  useEffect(() => {
    if (user_id) {
      checkId();
    } else {
      setIdCheckMsg('');
      setIsIdValid(false);
    }
  }, [user_id, checkId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isIdValid) {
      alert('유효한 사용자 ID를 사용하세요.');
      return;
    }
    try {
      const joinRes = await axios.post('/user/join', {
        user_name: user_name,
        user_id: user_id,
        user_pw: user_pw,
        nick_name: nick_name,
        user_email: user_email,
        user_phone: user_phone,
      });
      console.log(joinRes);
    } catch (error) {
      console.error('가입 실패:', error);
    }
  };

  return (
    <div className='joinUser_container'>
      <form onSubmit={handleSubmit}>
        <p>이름</p>
        <input
          type="text"
          placeholder="user_name"
          onChange={(e) => setUser_name(e.target.value)}
          required
        />
        <p>아이디</p>
        <input
          type="text"
          placeholder="user_id"
          onChange={(e) => setUser_id(e.target.value)}
          required
        />
        <p>{idCheckMsg}</p>
        <p>비밀번호</p>
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setUser_pw(e.target.value)}
          required
        />
        <p>닉네임</p>
        <input
          type="text"
          placeholder="nick_name"
          onChange={(e) => setNick_name(e.target.value)}
          required
        />
        <p>이메일</p>
        <input
          type="email"
          placeholder="e-mail"
          onChange={(e) => setUser_email(e.target.value)}
          required
        />
        <p>전화번호</p>
        <input
          type="tel"
          placeholder="tel"
          onChange={(e) => setUser_phone(e.target.value)}
          required
        />
        <button type="submit">가입하기</button>
      </form>
    </div>
  );
};

export default JoinUser;