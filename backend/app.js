const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const mysql = require("mysql2");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

const emailer = require("./email");

// app.use((req, res, next) => {
//     if (
//         req.headers["x-forwarded-proto"] !== "https" &&
//         req.hostname !== "localhost"
//     ) {
//         res.redirect(`https://${req.headers.host}${req.url}`);
//     } else {
//         next();
//     }
// });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// connect to MySQL database
const dbConfig = {
    host: "mysql",
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: "3306",
};

const db = mysql.createPool(dbConfig);

// ADMIN

// GET: display admin page
app.get("/admin", function (req, res) {
    res.redirect("/admin");
});

// POST: add student into database
app.post("/add", function (req, res) {
    const id = req.body.id;
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const allergies = req.body.allergies;

    const sql = `INSERT INTO users 
                 (UserID, UserName, UserEmail, 
                  UserPassword, UserAllergies, isAdmin) 
                 VALUES (?, ?, ?, ?, ?, ?)`;
    const info = [id, name, email, password, allergies, 0];

    db.query(sql, info, (error, result) => {
        if (error) {
            res.send(error);
        }
    });
});

// POST: delete student from database
app.post("/delete", function (req, res) {
    const del_id = req.body.id;

    const sql = `DELETE FROM users WHERE UserID= ?;`;

    db.query(sql, del_id, (error, result) => {
        if (error) {
            res.send("Could not delete.");
        }
    });
});

// LOGIN

// POST: validate user and log them in
app.post("/validate", function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    const sql = `SELECT * FROM users WHERE UserEmail= ? and UserPassword= ?;`;
    const values = [username, password];

    db.query(sql, values, (error, result) => {
        if (error) {
            res.status(400).send(error);
        } else {
            res.send(result);
        }
    });
});

// ORDERFORM

// POST: add final touches to message and send
app.post("/send", function (req, res) {
    const options = emailer.composeEmail(req);
    const dewickOrder = options.dewickItems;
    const carmOrder = options.carmItems;

    if (req.body.d_message !== "") {
        emailer.sendEmail(req, true, dewickOrder);
    }

    if (req.body.c_message !== "") {
        emailer.sendEmail(req, false, carmOrder);
    }
});

// SAVE ORDER

// POST: save order to database for order history
app.post("/save", function (req, res) {
    const orders = req.body.orders;
    const id = req.body.UserID;
    const sql = `INSERT INTO orderHistory 
                 (UserID, OrderDate, OrderTime, OrderOrder, 
                 OrderInstructions, OrderRawDate, OrderRawTime,
                 OrderHall) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    let values = [];

    for (var i = 0; i < orders.length; i++) {
        values = [
            id,
            orders[i].date,
            orders[i].time,
            orders[i].order,
            orders[i].spec,
            orders[i].rawDate,
            orders[i].rawTime,
            orders[i].hall,
        ];

        db.query(sql, values, (error, result) => {
            if (error) {
                console.log("Could not save orders to order history: ", error);
            } else {
                console.log("Orders saved successfully!");
            }
        });
    }
});

// RETRIEVE PREVIOUS ORDERS

// POST: fetch 3 orders from user
app.post("/retrieve", function (req, res) {
    const id = req.body.id;
    const sql = `SELECT * FROM orderHistory WHERE UserID= ?
                 ORDER BY OrderRawDate DESC, OrderRawTime DESC 
                 LIMIT 3`;

    db.query(sql, id, (error, result) => {
        if (error) {
            console.log("Couldn't fetch orders: ", error);
        } else {
            console.log("Succesfully fetched orders.");
            res.send(result);
        }
    });
});

// CHANGE PASSWORD

// POST: send an email to user prompting them to change their passwords
app.post("/change", function (req, res) {
    const emailService = process.env.AUTH_SERVICE;
    const from = process.env.AUTH_EMAIL;
    const authPass = process.env.AUTH_PASSWORD;

    const toEmail = req.body.email;

    const transporter = nodemailer.createTransport({
        service: emailService,
        auth: {
            user: from,
            pass: authPass,
        },
    });

    const emailContent = `
        <html>
            <body>
            <h1>Alternative Meal Program</h1>
            <p>Click the button below to change your password</p>
            <a href="https://alternativemealprogram.herokuapp.com/changepassword" target="_blank" style="display:inline-block; background-color:#007bff; color:#fff; padding:10px 20px; text-decoration:none;">Change</a>
            </body>
        </html>
    `;

    const craftMessage = {
        from: from,
        to: toEmail,
        subject: `Change AMP Password`,
        replyTo: from,
        html: emailContent,
    };

    transporter.sendMail(craftMessage, (error, info) => {
        if (error) {
            res.status(400).send("Invalid Email");
        } else {
            res.send("Check your email for the link to change your password");
        }
    });
});

// NEWPASS

// POST: change the password of the user
app.post("/newpass", function (req, res) {
    const username = req.body.username;
    const currPassword = req.body.currPassword;

    const sql = `SELECT * FROM users WHERE UserEmail= ? and UserPassword= ?`;
    const values = [username, currPassword];

    db.query(sql, values, (error, result) => {
        if (error) {
            "Failed to match in database: ", error;
        } else {
            if (result.length > 0) {
                res.send(true);
                console.log("Successful find.");
            } else {
                res.status(400).send(false);
                console.log("Couldn't find");
            }
        }
    });
});

// EXECUTE

// POST: execute the password change
app.post("/execute", function (req, res) {
    const newPassword = req.body.newPassword;
    const username = req.body.username;
    const sql = `UPDATE users
            SET UserPassword= ?
            WHERE UserEmail= ?`;
    const values = [newPassword, username];

    db.query(sql, values, (error, result) => {
        if (error) {
            res.send("Failed to update password.");
        } else {
            res.send("Succesfully changed password!");
        }
    });
});

// run server
let port = process.env.PORT || 8000;

app.listen(port, "0.0.0.0", function () {
    console.log("Server started at port 8000");
});

// tests

app.get("/test", function (req, res) {
    res.send("Test");
});
