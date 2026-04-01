import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import axios from "axios";
import "../UserCss/Login.css";

function Login() {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!emailId || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post("http://localhost:8080/api/user/login", {
        emailId,
        password,
      });

      const { responseCode, responseMessage, data } = res.data;
      console.log(data);

      if (responseCode === "143") {
        const role = data.role;

        localStorage.setItem("role", role);
        localStorage.setItem("emailId", data.emailId);
        localStorage.setItem("accountNumber", data.accountNumber);
        localStorage.setItem("aadhaarNumber", data.aadhaarNumber);
        localStorage.setItem("name", data.fullName);

        if (role === "ROLE_USER") {
          navigate("/user-dashboard");
        } else {
          navigate("/admin-dashboard");
        }
      } else {
        alert(responseMessage);
      }
    } catch (error) {
      alert("Invalid Credentials or Server Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Top Navbar */}
      <header className="topbar">
        <div className="brand">
          <div className="brand-icon">N</div>
          <div>
            <h1>Neo Bank</h1>
            <p>Trusted Digital Banking</p>
          </div>
        </div>

        <div className="topbar-right">
          <span className="secure-badge">🔒 256-bit SSL Secured</span>
        </div>
      </header>

      {/* Main Section */}
      <div className="login-main">
        {/* Left Side */}
        <div className="login-left">
          <div className="welcome-card">
            <p className="tag">Net Banking Portal</p>
            <h2>Bank smarter, safer, and faster.</h2>
            <p className="subtext">
              Access your accounts, manage loans, transfer funds, and monitor
              transactions with secure banking services.
            </p>

            <div className="feature-list">
              <div className="feature-item">
                <span>✔</span>
                <p>Secure login with encrypted access</p>
              </div>
              <div className="feature-item">
                <span>✔</span>
                <p>24/7 account and transaction monitoring</p>
              </div>
              <div className="feature-item">
                <span>✔</span>
                <p>Instant access to loans and profile services</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="login-right">
          <div className="login-card">
            <div className="login-card-header">
              <h3>Login to Net Banking</h3>
              <p>Enter your credentials to continue</p>
            </div>

            <form onSubmit={handleLogin} className="login-form">
              <div className="input-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={emailId}
                  onChange={(e) => setEmailId(e.target.value)}
                  placeholder="Enter your registered email"
                />
              </div>

              <div className="input-group">
                <label>Password</label>
                <div className="password-box">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div className="login-options">
                <label className="remember-me">
                  <input type="checkbox" />
                  Remember me
                </label>
                <NavLink to="/forgot-password" className="forgot-link">
                  Forgot Password?
                </NavLink>
              </div>

              <button className="login-btn" type="submit" disabled={loading}>
                {loading ? "Logging in..." : "Login Securely"}
              </button>

              <p className="register-text">
                New user? <NavLink to="/register">Open an Account</NavLink>
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="login-footer">
        <p>© 2026 Neo Bank. All rights reserved.</p>
        <div className="footer-links">
          <span>Privacy</span>
          <span>Security</span>
          <span>Terms & Conditions</span>
        </div>
      </footer>
    </div>
  );
}

export default Login;
