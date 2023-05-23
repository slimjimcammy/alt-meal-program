import "./css/newpass.css";
import { useState } from "react";
import axiosInstance from "./config.js";

function ChangePassword() {

    const [email, setEmail] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const promptChange = (e) => {
        e.preventDefault();
        var change = false;

        axiosInstance.post("/newpass", {
            username: email,
            currPassword: oldPassword,
        })
        .then((response) => {
            console.log(response.data);
            execute();
        })
        .catch((error) => {
            alert("Invalid Username or Password");
            console.log("Changing passwords failed: ", error);
        })

    }

    const execute = () => {
        axiosInstance.post("/execute", {
            username: email,
            newPassword: newPassword 
        })
        .then((response) => {
            alert(response.data);
            console.log(response.data);
        })
        .catch((error) => {
            alert("Invalid Username or Password");
            console.log("Changing passwords failed: ", error);
        });
    }

    return (
        <main id="change">
            <form className="change-pass">
                <h1 className="title">Change Password</h1>
                <div className="form-item">
                    <label htmlFor="email">Username</label>
                    <input name="email" type="text" autoComplete="off" onChange={(e) => {
                        setEmail(e.target.value);
                    }}/>
                </div>
                <div className="form-item">
                    <label htmlFor="old-password">Old Password</label>
                    <input name="old-password" type="password" autoComplete="off" onChange={(e) => {
                        setOldPassword(e.target.value);
                    }}/>
                </div>
                <div className="form-item">
                    <label htmlFor="new-password">New Password</label>
                    <input name="new-password" type="password" autoComplete="off" onChange={(e) => {
                        setNewPassword(e.target.value);
                    }}/>
                </div>
                <button onClick={promptChange}>Change Password</button>
            </form>
            <div className="blob" id="b1"></div>
            <div className="blob" id="b2"></div>
        </main>
    );
}

export default ChangePassword;