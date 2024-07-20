import React from 'react'
import { useState, useRef } from 'react'
import axios from '../axios';


const JoinUser = () => {
  const [user_name, setUser_name] = useState('');
  const [user_id, setUser_id] = useState('');
  const [user_pw, setUser_pw] = useState('');
  const [nick_name, setNick_name] = useState('');
  const [user_email, setUser_email] = useState('');
  const [user_phone, setUser_phon] = useState(0);


  const handleSubmit = async (e) => {
      e.preventDefault();
      try {
          const joinRes = await axios.post('/user/join', {
              user_name : user_name,
              user_id : user_id,
              user_pw : user_pw,
              nick_name : nick_name,
              user_email : user_email,
              user_phone : user_phone
          });
          console.log(joinRes);
      } catch (error) {
          console.error('Join failed:', error);
      }
  };

  const idCheck = async () => {
    e.preventDefault();
    try {
        const idCheckRes = await axios.post('/user/idCheck', {
            user_id : user_id
        });
        console.log(idCheckRes);
    } catch(error) {
        console.error('중복검사 실패', error);
    }
  }
  return (
    <div>
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
          <button type='button' onClick={idCheck}>중복체크</button>
          <p>비밀번호</p>
          <input
              type="password"
              placeholder="Password"
              onChange={(e) => setUser_pw(e.target.value)}
              required
          />
          <p>비밀번호 확인</p>
          <input
              type="password"
              placeholder="Password_check"
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
              onChange={(e) => setUser_phon(e.target.value)}
              required
          />
          <button type="submit">가입하기</button>
      </form>
    </div>
  )
}

export default JoinUser