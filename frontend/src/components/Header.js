import { useContext } from "react";
import { Link } from "react-router-dom";

import { UserContextData  } from '../UserContext';

function Header () {

    function logout() {
      if (!confirm('Do you really want to logout?')) return; 
      setUser({});
    };

    const { user, setUser } = useContext(UserContextData);
    return (
        <header>
            <div className="navbar navbar-dark box-shadow bg-deel">
                <div className="container d-flex justify-content-between">
                  <Link to="/" className="navbar-brand d-flex align-items-center"><img height={100} src="img/deel.jpeg" alt="Del-task" /></Link>
                  <ul className="navbar-nav text-right  text-white">
                      <li className="nav-item active">
                        { user.firstName } { user.lastName }
                      </li>
                      <li className="nav-item text-muted">
                        { user.type }
                      </li>
                      <li className="nav-item text-muted">
                        <Link className="btn-danger p-1 rounded rounded-2" onClick={logout}>logout</Link>
                      </li>
                  </ul>
                </div>
            </div>
        </header>
    )
}

export default Header;
