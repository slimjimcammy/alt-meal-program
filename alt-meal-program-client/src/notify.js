import "./css/notify.css"

function Notify( { message } ) {
    return (
        <main id="notif">
            <form className="notify">
                <h1 className="title">{message}</h1>
            </form>
            <div className="blob" id="b1"></div>
            <div className="blob" id="b2"></div>
        </main>
    );
}

export default Notify;