import React from 'react';
import { Routes, Route, BrowserRouter, useLocation, useNavigate } from "react-router-dom";
import './App.css';
import SearchFunc from './Component/SearchFunc';
import Home from './Component/Home';
import LecipeList from './Component/LecipeList';
import Footer from './Component/FooterBar';
import LecipeDetail from './Component/LecipeDetail';
import LecipeWrite from './Component/LecipeWrite';
import Login from './Component/Login';
import JoinUser from './Component/JoinUser';
import UserInfo from './Component/UserInfo'
import Category from './Component/Category';
import Favorite from './Component/Favorite';
import PlusIconButton from './Component/LecipeDetailButton';

function App() {
  const location = useLocation();
  const showSearchBar = !['/login', '/favorites', '/joinuser'].includes(location.pathname);

  const PrivateRoute = ({ element: Element }) => {
    const token = localStorage.getItem('token');
    return token ? <Element /> : <Navigate to="/login" />;
  };

  return (
    <div className="main-container">
      <div className='main-background'>
        <div className="left-section">
          <SearchFunc />
        </div>
        <div className="right-section">
          {showSearchBar && (
            <div className='right-top-sf'>
              <SearchFunc />
            </div>
          )}
          <div className="content-wrapper">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/lecipeList" element={<LecipeList />} />
              <Route path="/lecipeDetail/:id" element={<LecipeDetail />} />
              <Route path='/lecipeWrite' element={<LecipeWrite />} />
              <Route path="/login" element={<Login />} />
              <Route path='/userinfo' element={<UserInfo />}></Route>
              <Route path='/joinuser' element={<JoinUser />} />
              <Route path='/category' element={<Category />} />
              <Route path='/favorites' element={<Favorite />} />
            </Routes>
          </div>
          <PlusIconButton />
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default App;
