import "./css/confirm.css"

function Confirm({ num, order }) {

    return (
        <div className="confirm-wrapper">
            <div className="my-confirms">
                <h1 className="subtitle">Order #{num}</h1>
                <p className="confirm-p">Date: {order.date}</p>
                <p className="confirm-p">Pickup Time: {order.time}</p>
                <p className="confirm-p">Hall: {order.hall}</p>
                <h1 className="confirm-h">Order</h1>
                <p className="confirm-p">Order: {order.order}</p>
                <h1 className="confirm-h">Instructions</h1>
                <p className="confirm-p">{order.spec}</p>
            </div>
        </div>
    );

}

export default Confirm;