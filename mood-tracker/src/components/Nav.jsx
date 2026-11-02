import { Link, useNavigate } from "react-router-dom";

export default function Nav() {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav>
      <Link className="brand" to="/">Wellspeak</Link>
      <div>
        <Link to="/dashboard">Insights</Link>
        <Link to="/history">History</Link>
        <Link to="/counsellors">Counsellors</Link>
        <button className="link-btn" onClick={logout}>Log out</button>
      </div>
    </nav>
  );
}
