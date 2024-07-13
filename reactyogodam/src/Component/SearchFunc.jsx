import React from 'react'
import { useRef } from 'react'
import { useNavigate } from 'react-router-dom';

const SearchFunc = () => {
  const inputRef = useRef();
  const navigate = useNavigate();

  const searcher = (e) => {
      if (e.key === 'Enter') {
          const query = inputRef.current.value.trim();
          if (query) {
              navigate(`/lecipeList?search=${encodeURIComponent(query)}`);
          }
          inputRef.current.value = ''; // 검색 후 입력 필드 비우기
      }
  };

  return (
      <div>
          <input type='text' ref={inputRef} onKeyDown={searcher} placeholder='검색어를 입력하세요'/>
      </div>
  );
};

export default SearchFunc;