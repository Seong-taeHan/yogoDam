import React from 'react'
import { useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import '../css/serchBar.css';

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
      <div className='search-bar'>
          <input type='search' ref={inputRef} onKeyDown={searcher} placeholder='검색어를 입력하세요'/>
      </div>
  );
};

export default SearchFunc;