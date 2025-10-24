// src/pages/LoginPage.jsx
import  { useState } from "react";
import { login } from "../../services/authServices";
import { useNavigate } from "react-router-dom";
import "./Auth.css"; // white-space theme CSS
import NavbarCom from "../../components/NavbarCom";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      await login(email, password);
      navigate("/"); // redirect to home/shop
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <NavbarCom/>
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login</h2>
        {error && <p className="auth-error">{error}</p>}
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          />
        <button onClick={handleLogin} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
        <p>
          Don't have an account?{" "}
          <span className="auth-link" onClick={() => navigate("/register")}>
            Register
          </span>
        </p>
      </div>
    </div>
    </>
  );
};

export default LoginPage;
