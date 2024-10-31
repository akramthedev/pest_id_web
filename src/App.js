import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import './App.css';
import Home from "./Screens/Home/Home";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
