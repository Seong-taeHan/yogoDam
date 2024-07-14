import logo from './logo.svg';
import './App.css';
import SearchFunc from './Component/SearchFunc';
import Home from './Component/Home';
import { Routes, Route, BrowserRouter } from "react-router-dom";
import LecipeList from './Component/LecipeList';
import Footer from './Component/FooterBar';

function App() {
  return (
    <div className="main-container">
        <div className="left-section">
          <SearchFunc />
        </div>
        <div className="right-section">
          <div className="content-wrapper">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/lecipeList" element={<LecipeList />} />
            </Routes>
          </div>
          <Footer />
        </div>
    </div>
  );
}

export default App;
