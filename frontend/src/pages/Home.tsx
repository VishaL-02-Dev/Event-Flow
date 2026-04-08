import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token"); // remove JWT
    navigate("/login"); // redirect to login
  };

  return (
    <div>
      <h1>Home</h1>

      {token ? (
        <>
          <p>You are logged in ✅</p>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <p>Please login ❌</p>
      )}
    </div>
  );
}