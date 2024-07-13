import logo from './logo.svg';
import './App.css';
import SearchFunc from './Component/SearchFunc';
import Footer from './Component/Footer';
import Home from './Component/Home';
import { Routes, Route, BrowserRouter } from "react-router-dom";
import LecipeList from './Component/LecipeList';

function App() {
  return (
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.js</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>
    <div>
      <SearchFunc></SearchFunc>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/lecipeList" element={<LecipeList></LecipeList>}/>
      </Routes>
      <Footer></Footer>
    </div>
  );
}

export default App;
