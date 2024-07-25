import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../css/footer.css';

const FooterBar = () => {

    const [activeTab, setActiveTab] = useState(0);
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const TabData = [
        { id: 0, button: '카테고리', content: '카테고리탭 입니다.', path: '/category' },
        { id: 1, button: '추천AI', content: '추천AI탭 입니다.', path: '/recomAi' },
        { id: 2, button: '홈', content: '홈 화면 입니다.', path: '/' },
        { id: 3, button: '찜목록', content: '찜 목록 화면 입니다.', path: '/favorites' },
        isLoggedIn
            ? { id: 4, button: '내 정보', content: '내 정보 탭 입니다.', path: '/userinfo' }
            : { id: 4, button: '로그인', content: '로그인 탭 입니다.', path: '/login' },
        { id: 5, button: '레시피', content: '레시피탭 입니다.', path: '/LecipeList' },
    ];

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);

        const currentPath = location.pathname;
        const tab = TabData.find(tab => tab.path === currentPath);
        if (tab) {
            setActiveTab(tab.id);
        }
    }, [location.pathname, isLoggedIn]);

    const handleTabClick = (tab) => {
        setActiveTab(tab.id);
        navigate(tab.path);
    };

    return (
        <div className="footer-container">
            {/* <div className="tab-content">
                {TabData.find((a) => a.id === activeTab)?.content}
            </div> */}
            <div className="footer-box">
                <div className="tab-box">
                    {TabData.map((tab) => (
                        <button
                            key={tab.id}
                            className={activeTab === tab.id ? "tab-button active" : "tab-button"}
                            onClick={() => handleTabClick(tab)}
                        >
                            {tab.button}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FooterBar;