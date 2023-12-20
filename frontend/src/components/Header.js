
import { Link } from "react-router-dom";

function Header () {
    return (
        <header>
            <div className="navbar navbar-dark bg-dark box-shadow">
                <div className="container d-flex justify-content-between">
                <Link to="/" className="navbar-brand d-flex align-items-center"><strong>Number8 Real Estate</strong></Link>
                </div>
            </div>
        </header>
    )
}

export default Header;