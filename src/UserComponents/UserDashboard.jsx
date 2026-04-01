import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../UserCss/UserDashboard.css";
import { FiLogOut } from "react-icons/fi";

function UserDashboard() {
  const Navigate = useNavigate();
  const logout = () => {
    localStorage.clear();
    Navigate("/");
  };

  const userName = localStorage.getItem("name") || "Customer";
  const accountNumber = localStorage.getItem("accountNumber") || "XXXXXX4589";
  const toprofilePage = () => {
    Navigate("/profile");
  };

  return (
    <div className="user-dashboard">
      {/* Sidebar */}
      <aside className="user-sidebar">
        <div className="brand-section">
          <div className="brand-logo">N</div>
          <div>
            <h2>Neo Bank</h2>
            <p>Personal Banking</p>
          </div>
        </div>

        <nav className="sidebar-menu">
          <NavLink to="/check-balance" className="menu-item">
            Balance
          </NavLink>
          <NavLink to="/transfer" className="menu-item">
            Transfer Money
          </NavLink>
          <NavLink to="/transactions" className="menu-item">
            Transactions
          </NavLink>
          <NavLink to="/reset-pin" className="menu-item">
            Reset Pin
          </NavLink>
          <NavLink to="/fixed-deposit-page" className="menu-item">
            Fixed Deposit
          </NavLink>
          <NavLink to="/analytics" className="menu-item">
            Analytics
          </NavLink>
          <NavLink to="/user-loan" className="menu-item">
            Loans
          </NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="dashboard-right">
        {/* Topbar */}
        <header className="dashboard-topbar">
          <div>
            <h1>User Dashboard</h1>
            <p>Manage your account and banking services securely</p>
          </div>

          <div className="topbar-actions">
            <div className="user-chip" onClick={toprofilePage}>
              <span className="user-avatar">
                {userName.charAt(0).toUpperCase()}
              </span>
              <div>
                <h4>{userName}</h4>
                <p style={{ color: "black" }}>{accountNumber}</p>
              </div>
            </div>

            {/* <button className="logout-btn" onClick={logout}>
              <FiLogOut className="logout-icon" />
              Logout
            </button> */}
            <button
              onClick={logout}
              style={{
                background: "red",
                color: "white",
                padding: "12px 20px",
                border: "none",
                borderRadius: "10px",
                fontSize: "16px",
                fontWeight: "600",
              }}
            >
              Logout
            </button>
          </div>
        </header>

        {/* Welcome Banner */}
        <section className="welcome-banner">
          <div>
            <h2>Welcome back, {userName}</h2>
            <p>
              Access your account, transfer funds, manage deposits, and track
              your banking activity from one secure place.
            </p>
          </div>
        </section>

        {/* Quick Services */}
        <section className="services-section">
          <div className="section-title">
            <h2>Quick Services</h2>
            <p>Choose a banking service</p>
          </div>

          <div className="service-grid">
            <NavLink to="/check-balance" className="service-card">
              <h3>Check Balance</h3>
              <p>View account balance and account details instantly.</p>
            </NavLink>

            <NavLink to="/transfer" className="service-card">
              <h3>Transfer Money</h3>
              <p>Send money securely to another bank account.</p>
            </NavLink>

            <NavLink to="/transactions" className="service-card">
              <h3>Transactions</h3>
              <p>View and track your recent transaction history.</p>
            </NavLink>

            <NavLink to="/fixed-deposit-page" className="service-card">
              <h3>Fixed Deposit</h3>
              <p>Create and manage your deposits with ease.</p>
            </NavLink>

            <NavLink to="/analytics" className="service-card">
              <h3>Analytics</h3>
              <p>Monitor spending and financial activity trends.</p>
            </NavLink>

            <NavLink to="/user-loan" className="service-card">
              <h3>Loans</h3>
              <p>View loan details and manage your repayments.</p>
            </NavLink>
          </div>
        </section>
      </div>
    </div>
  );
}

export default UserDashboard;
