import logo from "./images/Home_light.svg";
import register from "./images/user-plus.svg";
import login from "./images/login.svg";
import order from "./images/order.svg";

import "./css/home.css"

import { useNavigate } from "react-router-dom";

function Home() {

    const navigate = useNavigate();

    return (
        <main id="home">
            <nav className="navbar">
                <a className="logo-container" href="https://dining.tufts.edu/">
                    <img src={logo} />
                </a>
                <div className="navbar-right">
                    <a href="#about">About</a>
                    <button onClick={() => {navigate("/login")}}>Sign in</button>
                </div> 
            </nav>
            <section className="hero">
                <p>Food Equity Service</p>
                <h1 className="h1-gradient">Alternative Meal Program</h1>
            </section>
            <section className="about" id="about">
                <blockquote><span>The Alternative Meal Program</span> is a meal plan that facilitates food equity among Tufts University students with dietary restrictions.</blockquote>
                <div className="steps">
                    <div className="step-item">
                        <img src={register} />
                        <div className="step-desc">
                            <h1>Register</h1>
                            <p>Email <span>cameron.yuen@tufts.edu</span> if you believe you're elligible for registration!</p>
                        </div>
                    </div>
                    <div className="step-item">
                        <img src={login} />
                        <div className="step-desc">
                            <h1>Login</h1>
                            <p>Log into your account with your dietary restrictions, and personal information saved!</p>
                        </div>
                    </div>
                    <div className="step-item">
                        <img src={order} />
                        <div className="step-desc">
                            <h1>Order</h1>
                            <p>Browse the menus, and order meals specially taillored to your dietary needs!</p>
                        </div>
                    </div>
                </div>
            </section>
            <div className="blob" id="b1"></div>
            <div className="blob" id="b2"></div>
        </main>
    );
}

export default Home;