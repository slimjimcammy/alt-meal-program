const nodemailer = require("nodemailer");

const dotenv = require("dotenv");
dotenv.config();

const dewickEmail = "cameron.yuen@tufts.edu";
const carmEmail = "yuen.cameron@gmail.com";

function composeEmail(req) {
    const account = req.body.account;
    const message_fragment = 
    `Name: ${account.UserName}\nEmail: ${account.UserEmail}\nAllergies: ${account.UserAllergies}\n\nOrders:\n`;

    const dew_final_message = message_fragment + req.body.d_message;
    const carm_final_message = message_fragment + req.body.c_message;

    const options = {
        dewickItems: dew_final_message,
        carmItems: carm_final_message
    };

    return options;
}

async function sendEmail(req, isDew, message) {
    const name = req.body.account.UserName;
    const userEmail = req.body.account.UserEmail;

    const emailService = process.env.AUTH_SERVICE;
    const from = process.env.AUTH_EMAIL;
    const authPass = process.env.AUTH_PASSWORD;

    let currSendTo = "";
    if (isDew) {
        currSendTo = dewickEmail;
    }
    else {
        currSendTo = carmEmail;
    }

    const transporter = nodemailer.createTransport({
        service: emailService,
        auth: {
            user: from,
            pass: authPass
        }
    });

    const craftMessage = {
        from: from,
        to: currSendTo,
        subject: `${name} Alternative Meal Program Order`,
        replyTo: userEmail,
        text: message
    };

    transporter.sendMail(craftMessage, (error, info) => {
        if (error) {
            console.log("Failed to send email: ", error);
        }
        else {
            console.log("Email successfully sent!");
        }
    });

}

module.exports = {
    composeEmail,
    sendEmail
};