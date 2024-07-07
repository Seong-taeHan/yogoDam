import React from 'react'
import { useState } from 'react';
import '../css/footer.css'

const Footer = () => {
    const TabData = [
        { id: 0, button: '홈', content: '홈 화면 입니다.' },
        { id: 1, button: '레시피', content: '레시피 모음 화면 입니다.' },
        { id: 2, button: '로그인/MY', content: '로그인 or My 탭 입니다.' }
    ];

    const [activeTab, setActiveTab] = useState(0);

    return (
        <div>
            <div className="tab-content">
              {TabData.find((a) => a.id === activeTab)?.content}
            </div>
            <div className="footer-box">
                <div className="tab-box">
                    {TabData.map((tab) => (
                        <button
                            key={tab.id}
                            className={activeTab === tab.id ? "tab-button active" : "tab-button"}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.button}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Footer;