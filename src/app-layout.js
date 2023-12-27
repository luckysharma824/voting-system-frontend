import { Outlet, Link } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid" style={{backgroundColor: "#e3f2fd"}}>
        <ul className="navbar-nav">
          <li className="nav-item nav-link">
            <Link to="/">Home</Link>
          </li>
          <li className="nav-item nav-link">
            <Link to="/candidate">Candidates</Link>
          </li>
          <li className="nav-item nav-link">
            <Link to="/party">Parties</Link>
          </li>
          <li className="nav-item nav-link">
            <Link to="/election">Elections</Link>
          </li>
        </ul>
        </div>
      </nav>

      <Outlet />
    </>
  );
};

export default Layout;
