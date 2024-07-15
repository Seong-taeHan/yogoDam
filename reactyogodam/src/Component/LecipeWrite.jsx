import React from 'react'

const LecipeWrite = () => {

  return (
    <div>
      <h1>요리 제목 *필수</h1>
      <div>썸네일 이미지</div>
      <div>요리 소개</div>
      <div>카테고리1 : 요리종류</div>
      {/* 한식, 일식, 양식, 중식 */}
      <div>카테고리2 : 조리법</div>
      {/* 분식, 탕-찜, 볶음, 구이, 무침 */}
      <div>
        요리 정보
          <div>요리 시간</div>
      </div>
      <div>재료</div>
      <div>요리순서</div>
      <div></div>
      <div>저장</div>
    </div>
  )
}

export default LecipeWrite