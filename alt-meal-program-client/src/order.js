import "./css/order.css";

function Order({ num, order, onClick, dele }) {

    const setChecker = (onClick, order) => {
        if (order.rawDate === undefined &&
            order.rawTime === undefined) {
            onClick(
                num, "", order.hall,
                order.order, "", order.spec
            )
        }
        else if (order.rawTime === undefined) {
            onClick(
                num, order.rawDate, order.hall,
                order.order, "", order.spec
            )
        }
        else if (order.rawDate === undefined) {
            onClick(
                num, "", order.hall,
                order.order, order.rawTime, order.spec
            )
        }
        else {
            onClick(
                num, order.rawDate, order.hall,
                order.order, order.rawTime, order.spec
            )
        }
    }

    return (
        <div className="order-wrapper">
            <div className="my-orders" onClick={() => setChecker(onClick, order)}> 
                <h1 className="subtitle">Order #{num}</h1>
                <p className="order-p">Date: {order.date}</p>
                <p className="order-p">Pickup Time: {order.time}</p>
                <p className="order-p">Hall: {order.hall}</p>
                <h1 className="order-h">Order</h1>
                <p className="order-p">{order.order}</p>
                <h1 className="order-h">Instructions</h1>
                <p className="order-p">{order.spec}</p>
            </div>
            <button className="quit-button" onClick={() => dele(num)}>X</button>
        </div>
        
    );
}

export default Order;