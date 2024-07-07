import React from 'react'
import { useRef } from 'react'

const SearchFunc = () => {

    let inputRef = useRef();

    const searcher = (e) => {
        if(e.key === 'Enter'){
            console.log('검색용 함수 test')
        }
        //console.log('onKeyDonw 확인용', inputRef.current.value)
    }
  return (
    <div>
        <input type='text' ref={inputRef} onKeyDown={searcher}></input>
    </div>
  )
}

export default SearchFunc