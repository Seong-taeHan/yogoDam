import './App.css';
import SearchFunc from './Component/SearchFunc';
import Home from './Component/Home';
import { Routes, Route, BrowserRouter } from "react-router-dom";
import LecipeList from './Component/LecipeList';
import Footer from './Component/FooterBar';
import LecipeDetail from './Component/LecipeDetail';
import LecipeWrite from './Component/LecipeWrite';
import Login from './Component/Login';
import JoinUser from './Component/JoinUser';

function App() {
  return (
    <div className="main-container">
      <div className='main-background'>
        <div className="left-section">
          <SearchFunc />
        </div>
        <div className="right-section">
          <div className='right-top-sf'>
            <SearchFunc></SearchFunc>
          </div>
          <div className="content-wrapper">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/lecipeList" element={<LecipeList />} />
              <Route path="/lecipeDetail/:id" element={<LecipeDetail />} />
              <Route path='/lecipeWrite' element={<LecipeWrite />} />
              <Route path="/login" element={<Login/>} />
              <Route path='/joinuser' element={<JoinUser/>} />
            </Routes>
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default App;
