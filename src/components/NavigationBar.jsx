import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isAdmin = currentUser?.role === "admin";
  const isStaff = isAdmin || currentUser?.role === "librarian";

  return (
    <nav className="navbar">
      <h1 className="logo">Community Library</h1>
      {currentUser && (
        <div className="nav-links">
          <NavLink to="/" end>Dashboard</NavLink>
          {isStaff && <NavLink to="/books">Books</NavLink>}
          <NavLink to="/transactions">{isStaff ? "Transactions" : "Borrow"}</NavLink>
          {isStaff && <NavLink to="/users">Users</NavLink>}
          <span className="nav-user">{currentUser.name} ({currentUser.role})</span>
          <button className="btn btn-light" onClick={handleLogout}>Logout</button>
        </div>
      )}
    </nav>
  );
}