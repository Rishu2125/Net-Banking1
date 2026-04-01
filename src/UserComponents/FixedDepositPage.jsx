import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../UserCss/FixedDepositPage.css";

function FixedDepositPage() {
  const navigate = useNavigate();
  return (
    <div className="fd-page">
      <div className="fd-container">
        {/* Header */}
        <div className="fd-header">
          <div className="fd-header-top">
            <h1>Fixed Deposits</h1>

            {/* Back Button */}
            <button
              className="back-btn"
              onClick={() => navigate("/user-dashboard")}
            >
              ← Back to Dashboard
            </button>
          </div>

          <p>Manage your deposits securely and grow your savings.</p>
        </div>

        {/* Cards */}
        <div className="fd-grid">
          <NavLink to="/create-fd" className="fd-card">
            <h2>Open FD</h2>
            <p>Create a new fixed deposit with attractive interest rates.</p>
            <span>Proceed →</span>
          </NavLink>

          <NavLink to="/withdraw-fd" className="fd-card">
            <h2>Withdraw FD</h2>
            <p>Prematurely withdraw your FD easily and securely.</p>
            <span>Proceed →</span>
          </NavLink>

          <NavLink to="/get-user-fd" className="fd-card">
            <h2>Your FDs</h2>
            <p>View all your active deposits and maturity details.</p>
            <span>Proceed →</span>
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default FixedDepositPage;
