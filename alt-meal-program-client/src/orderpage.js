import React, {useState, useEffect } from "react";
import _, { set } from "lodash";
import "./css/orderpage.css";
import Order from "./order.js";
import { useNavigate } from "react-router-dom";
import Confirm from "./confirm.js";
import Prev from "./prev.js";
import axiosInstance from "./config.js";
import cta1 from "./images/orders.svg";
import plus from "./images/plus.svg";
import clock from "./images/Clock.svg";

function Orderpage() {

    const navigate = useNavigate();

    const [message_dew, setDew] = useState("");
    const [message_carm, setCarm] = useState("");
    const [showOrders, setShowOrders] = useState("hide-orders");
    const [showConfirm, setConfirm] = useState("hide-confirm");
    const [showHistory, setHistory] = useState("hide-history");
    const [showDew, setShowDew] = useState("hide-dew");
    const [showCarm, setShowCarm] = useState("hide-carm");
    const [showAMP, setShowAMP] = useState("hide-AMP");
 
    const [order_num, setNum] = useState(1);
    const [orders, setOrders] = useState([{ 
        num: order_num,
        rawTime: "",
        time: "",
        rawDate: "",
        date: "",
        hall: "",
        order: "",
        spec: ""
    }]);

    const [prevs, setPrevs] = useState([{
        num: order_num,
        rawTime: "",
        time: "",
        rawDate: "",
        date: "",
        hall: "",
        order: "",
        spec: ""
    }]);

    const [time_reg, setTime] = useState("");
    const [hall_reg, setHall] = useState("DEFAULT");
    const [date_reg, setDate] = useState("");
    const [order_reg, setOrder] = useState("");
    const [spec_reg, setSpec] = useState("");

    useEffect(() => {
        const user = localStorage.getItem("authenticated");
        if (!user || user === 'undefined') {
            navigate("/login");
        }
    }, []);

    const save = (e) => {

        e.preventDefault();

        const transformedTime = transform(time_reg);
        const convertedDate = convertDate(date_reg);

        const order = {
            num: order_num,
            rawTime: time_reg,
            time: transformedTime,
            rawDate: date_reg,
            date: convertedDate,
            hall: hall_reg,
            order: order_reg,
            spec: spec_reg
        };

        let old = orders;
        
        if (order.time === "" || order.hall === "" || order.date === "" || order.order === "" || order.spec === "") {
            alert("There are blank fields you must fill out.");
            return false;
        }

        if (!(_.isEqual(old[order_num - 1], order))) {
            old[order_num - 1].num = order.num;
            old[order_num - 1].rawTime = order.rawTime;
            old[order_num - 1].time = order.time;
            old[order_num - 1].rawDate = order.rawDate;
            old[order_num - 1].date = order.date;
            old[order_num - 1].hall = order.hall;
            old[order_num - 1].order = order.order;
            old[order_num - 1].spec = order.spec;
        }

        setOrders([...old]);

        setTime("");
        setHall("DEFAULT");
        setDate("");
        setOrder("");
        setSpec("");

        alert("Order saved. You can view it in the menu in the top left of the form.");

        return true;
    }

    const del = (num) => {
        if (orders.length > 1) {
            setNum(orders.length - 1);
            setOrders([
                ...orders.slice(0, num - 1),
                ...orders.slice(num, orders.length)
            ]);
        }
        else {
            let old = orders;
            old[0].rawDate = "";
            old[0].date = "";
            old[0].rawTime = "";
            old[0].time = "";
            old[0].hall = "";
            old[0].order = "";
            old[0].spec = "";
            setOrders([...old]);
        }
    }

    const addOrder = (e) => {
        e.preventDefault();

        if (orders.length >= 3) {
            alert("Limit of 3 orders per form.");
            return false;
        }

        setNum(orders.length + 1);
        setOrders([...orders, {
            num: order_num,
            time: "",
            hall: "",
            order: "",
            spec: ""
        }]);

        setTime("");
        setHall("DEFAULT");
        setDate("");
        setOrder("");
        setSpec("");

    }

    const setChoice = (number, date, hall, order, time, instructions) => {
        setNum(number);
        setDate(date);
        setHall(hall);
        setOrder(order);
        setTime(time)
        setSpec(instructions);
    }

    const setForm = (emptyDate, hall, order, time, instructions) => {
        setDate(emptyDate);
        setHall(hall);
        setOrder(order);
        setTime(time)
        setSpec(instructions);
    }

    const transform = (str_time) => {
        if (str_time === "") {
            return "";
        }

        let morning = true;

        const splitTime = str_time.split(":");
        
        for (const element in splitTime) {
            parseInt(element);
        }

        if (splitTime[0] > 12) {
            splitTime[0] -= 12;
            morning = false;
        }
        else if (splitTime[0] == 12) {
            morning = false;
        }
        else if (splitTime[0] == 0) {
            splitTime[0] = 12;
        }
        
        if (morning) {
            return splitTime[0].toString() + ":" + splitTime[1].toString() + " AM";
        }
        else {
            return splitTime[0].toString() + ":" + splitTime[1].toString() + " PM";
        }
    }

    const months = {
        "01": "Jan",
        "02": "Feb",
        "03": "Mar",
        "04": "Apr",
        "05": "May",
        "06": "Jun",
        "07": "Jul",
        "08": "Aug",
        "09": "Sep",
        "10": "Oct",
        "11": "Nov",
        "12": "Dec"
    }

    const convertDate = (str_date) => {
        if (str_date !== "") {
            const splitDate = str_date.split("-");

            return `${months[splitDate[1]]} ${splitDate[2]}, ${splitDate[0]}`;
        }
        return "";
    }

    const composeAndSend = (e) => {
        e.preventDefault();
        let dew_message = "";
        let carm_message = "";

        for (var i = 0; i < orders.length; i++) {
            if (orders[i].time === "" || orders[i].hall === "" || 
                orders[i].date === "" || orders[i].order === "" || 
                orders[i].spec === "") {
                alert("One or more orders are not filled out.");
                return false;
            }
        }

        for (var i = 0; i < orders.length; i++) {
            if (orders[i].hall === "Dewick") {
                dew_message +=
                `Date: ${orders[i].date}\nTiming: ${orders[i].time}\nOrder: ${orders[i].order}\nSpecial Instructions: ${orders[i].order}\n\n`;
            }
            else {
                carm_message += 
                `Date: ${orders[i].date}\nTiming: ${orders[i].time}\nOrder: ${orders[i].order}\nSpecial Instructions: ${orders[i].order}\n\n`;
            }
        }

        setConfirm("show-confirm");
        setDew(dew_message);
        setCarm(carm_message);
    }

    const handleSubmit = () => {

        const o_account = JSON.parse(localStorage.getItem("user"));
        
        axiosInstance.post("/send", {
            d_message: message_dew,
            c_message: message_carm,
            account: o_account[0]
        })
        .then((response) => {
            console.log(response.data);
            alert("Emails successfully sent!");
        })
        .catch((error) => {
            console.log(error);
            alert("There was an error sending the emails.")
        });

        const user = JSON.parse(localStorage.getItem("user"))[0];

        axiosInstance.post("/save", {
            orders: orders,
            UserID: user.UserID
        })
        .then((response) => {
            console.log("Orders saved.");
        })
        .catch((error) => {
            console.log("Error saving order: ", error);
        });
    }

    const leave = (e) => {
        e.preventDefault();
        setConfirm("hide-confirm");
    }

    const openView = (e) => {
        e.preventDefault();

        if (showOrders === "show-orders") {
            setShowOrders("hide-orders");
        }
        else {
            setShowOrders("show-orders");
            if (showHistory === "show-history") {
                setHistory("hide-history");
            }
        }
    }

    const openHistory = (e) => {
        e.preventDefault();

        const userID = JSON.parse(localStorage.getItem("user"))[0].UserID;
        let prevOrders = [];

        if (prevs.length === 1) {
            axiosInstance.post("/retrieve", {
                id: userID
            })
            .then((response) => {
                prevOrders = response.data;

                setPrevs(prevOrders);
            })
            .catch((error) => {
                console.log("Error retrieving orders: ", error);
                alert("Error fetching order history.");
            })
        }

        if (showHistory === "show-history") {
            setHistory("hide-history");
        }
        else {
            setHistory("show-history");
            if (showOrders === "show-orders") {
                setShowOrders("hide-orders");
            }
        }
        
    }

    const toggleDew = (e) => {
        e.preventDefault();

        setShowDew("show-dew");
    }

    const hideDew = (e) => {
        e.preventDefault();

        setShowDew("hide-dew");
    }

    const toggleCarm = (e) => {
        e.preventDefault();

        setShowCarm("show-carm")
    }

    const hideCarm = (e) => {
        e.preventDefault();

        setShowCarm("hide-carm");
    }

    const toggleAMP = (e) => {
        e.preventDefault();

        setShowAMP("show-AMP");
    }

    const hideAMP = (e) => {
        e.preventDefault();

        setShowAMP("hide-AMP");
    }

    return (
        <main id="orderform">
            <form className="order" autoComplete="off">
                <h1 className="title">Order #{order_num}</h1>
                {/* <p> Order up to three orders at a time!</p> */}
                <h1 className="subtitle">Menus</h1>
                <div className="selectors" id="first">
                    <button className="menu-item" onClick={toggleDew}><p>Dewick</p></button>
                    <button className="menu-item" onClick={toggleCarm}><p>Carmichael</p></button>
                    <button className="menu-item" onClick={toggleAMP}><p>AMP</p></button>
                </div>
                <h1 className="subtitle">When?</h1>
                <div className="selectors" id="middle">
                    <input type="date" onChange={(e) => setDate(e.target.value)} value={date_reg} />
                    <input type="time" onChange={(e) => setTime(e.target.value)} value={time_reg} />
                </div>
                <h1 className="subtitle">Where?</h1>
                <div className="selectors">
                    <select name="hall" value="DEFAULT" onChange={(e) => {
                        setHall(e.target.value);
                    }} value={hall_reg}>
                        <option value="DEFAULT" disabled>Select</option>
                        <option value="Dewick">Dewick</option>
                        <option value="Carmichael">Carmichael</option>
                    </select>
                </div>
                <h1 className="subtitle">What?</h1>
                <div className="selectors" id="last">
                    <label htmlFor="order">Order</label>
                    <textarea name="order" rows={2} onChange={(e) => setOrder(e.target.value)} value={order_reg} />
                    <label htmlFor="spec">Special Instructions</label>
                    <textarea name="spec" rows={2} onChange={(e) => setSpec(e.target.value)} value={spec_reg} />
                </div>
                <div className="selectors">
                    <button className="submission" onClick={save}>Save</button>
                    <button className="submission" onClick={composeAndSend}>Submit</button>
                </div>
                <div className="cta1">
                    <button className="cta" onClick={openView}>
                        <img src={cta1} className="icon" />
                    </button>
                    <div id="cta1-label"><p>{orders.length}</p></div>
                </div>
                <div className="cta2">
                    <button className="cta" id="add" onClick={addOrder}>
                        <img src={plus} />
                    </button>
                </div>
                <div className="cta3">
                    <button className="cta" id="clock" onClick={openHistory}>
                        <img src={clock} />
                    </button>
                </div>
            </form>
            <div className={showOrders}>
                <h1 className="title">Your Orders</h1>
                {orders.map((o, i) => ( <Order num={i + 1} order={o} key={i} onClick={setChoice} dele={del}/> ))}
            </div>
            <form className={showConfirm}>
                <h1 className="title">Your Orders</h1>
                {orders.map((o, i) => ( <Confirm num={i + 1} order={o} key={i} /> ))}
                <div className="selectors">
                    <button className="submission" onClick={leave}>Leave</button>
                    <button className="submission" onClick={handleSubmit}>Confirm</button>
                </div>
            </form>
            <div className={showHistory}>
                <h1 className="title">Order History</h1>
                <h1 className="subtitle">Click to load onto form</h1>
                {prevs.map((o, i) => ( < Prev order={o} key={i} onClick={setForm}/>))}
            </div>
            <div className={showDew}>
                <h1 className="title">Dewick Menu</h1>
                <button className="quit-button" id="dew-quit" onClick={hideDew}>X</button>
                <iframe src="https://menus.tufts.edu/FoodPro%203.1.NET/shortmenu.aspx?sName=TUFTS+DINING&locationNum=11&locationName=Dewick-MacPhie+Dining+Center&naFlag=1" />
            </div>
            <div className={showCarm}>
                <h1 className="title">Carmichael Menu</h1>
                <button className="quit-button" id="carm-quit" onClick={hideCarm}>X</button>
                <iframe src="https://menus.tufts.edu/FoodPro%203.1.NET/shortmenu.aspx?sName=TUFTS+DINING&locationNum=09&locationName=Carmichael+Dining+Center&naFlag=1"/>
            </div>
            <div className={showAMP}>
                <h1 className="title">AMP Menu</h1>
                <h1 className="subtitle">Coming soon!</h1>
                <button className="quit-button" id="amp-quit" onClick={hideAMP}>X</button>
            </div>
            <div className="blob" id="b1"></div>
            <div className="blob" id="b2"></div>
        </main>
    );

}

export default Orderpage;