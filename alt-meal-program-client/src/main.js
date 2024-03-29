import { BrowserRouter, Routes, Route } from "react-router-dom";
import Administrator from "./administrator.js";
import Log from "./log.js";
import Orderpage from "./orderpage.js";
import Home from "./home.js";
import ChangePassword from "./newpass.js";
import "./style.css";

function Main() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/order" element={<Orderpage />} />
                <Route path="/login" element={<Log />} />
                <Route path="/admin" element={<Administrator />} />
                <Route path="/changepassword" element={<ChangePassword />} />
            </Routes>
        </BrowserRouter>
    );
}

export default Main;