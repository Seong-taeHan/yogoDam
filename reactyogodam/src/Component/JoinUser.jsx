import React, { useState, useEffect, useCallback } from 'react';
import axios from '../axios';
import '../css/JoinUser.css'; // Make sure this path is correct
import { useNavigate } from 'react-router-dom';

const JoinUser = () => {
  const [user_name, setUser_name] = useState('');
  const [user_id, setUser_id] = useState('');
  const [user_pw, setUser_pw] = useState('');
  const [user_pw_confirm, setUser_pw_confirm] = useState(''); // Added state for password confirmation
  const [nick_name, setNick_name] = useState('');
  const [user_email, setUser_email] = useState('');
  const [user_birthday, setUser_birthday] = useState(''); // Changed to birthdate field
  const [user_gender, setUser_gender] = useState('');
  const [idCheckMsg, setIdCheckMsg] = useState('');
  const [isIdValid, setIsIdValid] = useState(false);
  const [page, setPage] = useState(1);

  const nav = useNavigate();

  // Debounce function
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
      const idCheckRes = await axios.post('/user/idCheck', { user_id });
      if (user_id == ''){
        setIdCheckMsg('');
        setIsIdValid(false);
      } else if (idCheckRes.data.available) {
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

  const validatePage = (page) => {
    const form = document.getElementById(`form-page-${page}`);
    if (form) {
      return form.checkValidity();
    }
    return false;
  };

  const handleNextPage = (e) => {
    e.preventDefault();
    if (!isIdValid) {
      alert('유효한 사용자 ID를 사용하세요.');
      return;
    }
    if (user_pw !== user_pw_confirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (validatePage(page)) {
      setPage((prev) => prev + 1);
    } else {
      // Trigger form validation
      document.getElementById(`form-page-${page}`).reportValidity();
    }
  };

  const handlePrevPage = (e) => {
    e.preventDefault();
    setPage((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isIdValid) {
      alert('유효한 사용자 ID를 사용하세요.');
      return;
    }
    try {
      const joinRes = await axios.post('/user/join', {
        user_name,
        user_id,
        user_pw,
        nick_name,
        user_email,
        user_birthday,
        user_gender
      });
      console.log(joinRes);
      nav('/loginComplete')
    } catch (error) {
      console.error('가입 실패:', error);
    }
  };

  return (
    <div className='joinUser_container'>
      <h1>가입하기</h1>
      {page === 1 && (
        <form id="form-page-1">
          <p>아이디</p>
          <input
            type="text"
            placeholder="사용할 아이디를 입력해 주세요"
            value={user_id}
            onChange={(e) => setUser_id(e.target.value)}
            required
          />
          {idCheckMsg && <p>{idCheckMsg}</p>}
          <p>닉네임</p>
          <input
            type="text"
            placeholder="사용할 닉네임을 입력해 주세요"
            value={nick_name}
            onChange={(e) => setNick_name(e.target.value)}
            required
          />
          <p>이메일</p>
          <input
            type="email"
            placeholder="이메일을 입력해 주세요"
            value={user_email}
            onChange={(e) => setUser_email(e.target.value)}
            required
          />
          <div className="pagination">
            <span className="dot active"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
          <button type="submit" onClick={handleNextPage}>다음</button>
        </form>
      )}
      {page === 2 && (
        <form id="form-page-2">
          <p>비밀번호</p>
          <input
            type="password"
            placeholder="비밀번호를 입력해 주세요"
            value={user_pw}
            onChange={(e) => setUser_pw(e.target.value)}
            required
          />
          <p>비밀번호 확인</p>
          <input
            type="password"
            placeholder="비밀번호를 입력해 주세요"
            value={user_pw_confirm}
            onChange={(e) => setUser_pw_confirm(e.target.value)}
            required
          />
          <p>생년월일</p>
          <input
            type="date"
            placeholder="생년월일을 입력해 주세요"
            value={user_birthday}
            onChange={(e) => setUser_birthday(e.target.value)}
            required
          />
          <div className="pagination">
            <span className="dot"></span>
            <span className="dot active"></span>
            <span className="dot"></span>
          </div>
          <button type="button" onClick={handlePrevPage}>이전</button>
          <button type="submit" onClick={handleNextPage}>다음</button>
        </form>
      )}
      {page === 3 && (
        <form id="form-page-3" onSubmit={handleSubmit}>
          <p>이름</p>
          <input
            type="text"
            placeholder="이름을 입력해 주세요"
            value={user_name}
            onChange={(e) => setUser_name(e.target.value)}
            required
          />
          <p>성별</p>
          <div className="gender-container">
          <button 
              type="button" 
              className={`gender-button ${user_gender === '남' ? 'active' : ''}`} 
              onClick={() => setUser_gender('남')}
            >
              남성
            </button>
            <button 
              type="button" 
              className={`gender-button ${user_gender === '여' ? 'active' : ''}`} 
              onClick={() => setUser_gender('여')}
            >
              여성
            </button>
          </div>
          <div className="pagination">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot active"></span>
          </div>
          <button type="button" onClick={handlePrevPage}>이전</button>
          <button type="submit">가입하기</button>
        </form>
      )}
      <p>이미 계정이 있으신가요? <a href="/login">로그인</a></p>
    </div>
  );
};

export default JoinUser;
