import React, { useState } from "react";
import axiosInstance from "./config.js";

import "./css/log.css";
import { useNavigate } from "react-router-dom";


function Log() {

    const navigate = useNavigate();
    const [att_username, setUsername] = useState("");
    const [att_password, setPassword] = useState("");

    const [showChange, setShowChange] = useState("hide-form");
    const [sendEmail, setSendEmail] = useState("");

    const toggleChange = (e) => {
        e.preventDefault();
        if (showChange !== "hide-form") {
            setShowChange("hide-form");
        }
        else {
            setShowChange("show-form");
        }
    }

    const sendEmailToBack = (e) => {
        e.preventDefault();
        axiosInstance.post("/change", {
            email: sendEmail
        })
        .then((response) => {
            alert(response.data);
        })
        .catch((error) => {
            alert(error.response.data);
        })

        setSendEmail("");
    }

    const validate = (e) => {
        e.preventDefault();

        axiosInstance.post("/validate", {
            username: att_username,
            password: att_password
        })
        .then((response) => {
            if (response.data.length !== 0) {
                sessionStorage.setItem("user", JSON.stringify(response.data));
                sessionStorage.setItem("authenticated", true);
                if (response.data[0].isAdmin) {
                    sessionStorage.setItem("admin-present", true);
                    navigate("/admin");
                }
                else {
                    sessionStorage.setItem("admin-present", false);
                    navigate("/order");
                }
            } 
            else {
                console.log(response.data);
                alert("Login failed.");
            }
        })
        .catch((error) => {
            console.log("Error: ", error);
        })
    }

    return (
        <main id="log">
            <form className="login">
                <h1 className="title">Login</h1>
                <div className="form-item">
                    <label htmlFor="username">Username</label>
                    <input name="username" type="text" autoComplete="off" onChange={(e) => {
                        setUsername(e.target.value);
                    }}/>
                </div>
                <div className="form-item">
                    <label htmlFor="password">Password</label>
                    <input name="password" type="password" autoComplete="off" onChange={(e) => {
                        setPassword(e.target.value);
                    }}/>
                </div>
                <a id="change" onClick={toggleChange}>Change Password</a>
                <button onClick={validate}>Login</button>
            </form>
            <form className={showChange}>
                <h1 className="title">Change Password</h1>
                <div className="form-item">
                    <label htmlFor="change-email">Email</label>
                    <input name="change-email" type="text" autoComplete="off" onChange={(e) => {
                        setSendEmail(e.target.value);
                    }}/>
                </div>
                <div className="selectors">
                    <button className="submission" onClick={sendEmailToBack}>Change</button>
                    <button className="submission" onClick={toggleChange}>Leave</button>
                </div>
            </form>
            <div className="blob" id="b1"></div>
            <div className="blob" id="b2"></div>
        </main>
    )
}

export default Log;