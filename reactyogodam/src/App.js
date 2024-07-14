import logo from './logo.svg';
import './App.css';
import SearchFunc from './Component/SearchFunc';
import Home from './Component/Home';
import { Routes, Route, BrowserRouter } from "react-router-dom";
import LecipeList from './Component/LecipeList';
import Footer from './Component/FooterBar';
import LecipeDetail from './Component/LecipeDetail';

function App() {
  return (
    <div className="main-container">
        <div className="left-section">
          <SearchFunc />
        </div>
        <div className="right-section">
          <div>
            <SearchFunc></SearchFunc>
          </div>
          <div className="content-wrapper">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/lecipeList" element={<LecipeList />} />
              <Route path="/lecipeDetail/:id" element={<LecipeDetail />} />
            </Routes>
          </div>
          <Footer />
        </div>
    </div>
  );
}

export default App;
