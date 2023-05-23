import React, { useState, useEffect } from "react";
import axiosInstance from "./config.js";
import "./css/administrator.css";
import { useNavigate } from "react-router-dom";

function Administrator() {

    const navigate = useNavigate();

    const [name_reg, setName] = useState("");
    const [id_reg, setID] = useState("");
    const [email_reg, setEmail] = useState("");
    const [password_reg, setPassword] = useState("");
    const [allergies_reg, setAllergies] = useState("");

    const [id_del, setDelID] = useState("");

    useEffect(() => {
        const admin = sessionStorage.getItem("admin-present");
        if (admin !== "true" || admin === "undefined") {
            navigate("/order");
        }
        else {
            console.log("Admin Authenticated");
        }
    }, []);

    const addUser = (e) => {

        axiosInstance.post("/add", {
            name: name_reg,
            id: id_reg,
            email: email_reg,
            password: password_reg,
            allergies: allergies_reg
        })
        .then((response) => {
            alert(response.data);
        })
        .catch((error) => {
            console.log(error);
        });
    }

    const deleteUser = (e) => {

        axiosInstance.post("/delete", {
            id: id_del
        })
        .then((response) => {
            console.log(response.data);
        })
        .catch((error) => {
            console.log(error);
        });
    }

    return (
        <main id="admin">
            <form className="admin" autoComplete="off">
                <h1 className="title">Admin Page</h1>
                <h1 className="subtitle">Add</h1>
                <div className="form-item">
                    <label htmlFor="name">Name</label>
                    <input name="name" type="text" onChange={(e) => {
                        setName(e.target.value);
                    }} required />
                </div>
                <div className="form-item">
                    <label htmlFor="id">Tufts ID</label>
                    <input name="id" type="text" onChange={(e) => {
                        setID(e.target.value);
                    }} required />
                </div>
                <div className="form-item">
                    <label htmlFor="email">Email</label>
                    <input name="email" type="text" onChange={(e) => {
                        setEmail(e.target.value);
                    }} required />
                </div>
                <div className="form-item">
                <label htmlFor="password">Password</label>
                    <input name="password" type="password" onChange={(e) => {
                        setPassword(e.target.value);
                    }} required />
                </div>
                <div className="form-item">
                    <label htmlFor="allergies">Allergies</label>
                    <input name="allergies" type="text" onChange={(e) => {
                        setAllergies(e.target.value);
                    }} required />
                </div>
                <button onClick={addUser} type="submit">Add</button>
            </form>
            <form className="admin">
                <h1 className="subtitle">Delete</h1>
                <div className="form-item">
                    <label htmlFor="del-id">Tufts ID</label>
                    <input name="del-id" type="text" onChange={(e) => {
                        setDelID(e.target.value);
                    }} required />
                </div>
                <button onClick={deleteUser} type="submit">Delete</button>
            </form>
            <div className="blob" id="b1"></div>
            <div className="blob" id="b2"></div>
        </main>
    );
}

export default Administrator;