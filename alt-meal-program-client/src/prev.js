import "./css/prev.css";

function Prev( { order, onClick } ) {
    return (
        <div className="prev-container">
            <button className="my-prevs" onClick={() => onClick(
                "", order.OrderHall, order.OrderOrder, 
                order.OrderRawTime, order.OrderInstructions)}>
                <p className="order-date">From {order.OrderDate} @{order.OrderTime}</p>
                <h1 className="prev-h">Hall</h1>
                <p className="prev-p">{order.OrderHall}</p>
                <h1 className="prev-h">Order</h1>
                <p className="prev-p">{order.OrderOrder}</p>
                <h1 className="prev-h">Special Instructions</h1>
                <p className="prev-p">{order.OrderInstructions}</p>
            </button>
        </div>
    );
}

export default Prev;