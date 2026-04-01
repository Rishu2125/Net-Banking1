import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../UserCss/UserLoan.css";

function LoanPage() {
  const navigate = useNavigate();
  const navigateToActiveLoans = () => {
    navigate("/active-loans");
  };
  const navigateToLoanHistory = () => {
    navigate("/user-loan-history");
  };

  return (
    <div className="loan-page">
      {/* Top Navbar */}
      <div className="loan-navbar">
        <div className="nav-left">
          <h2>NeoBank</h2>
        </div>

        <div className="nav-center">
          <span>Loan Accounts</span>
        </div>

        <div className="nav-right">
          <NavLink to="/apply-loan" className="apply-btn">
            Apply Loan
          </NavLink>

          <button
            className="back-btn"
            onClick={() => navigate("/user-dashboard")}
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="loan-content">
        <div className="loan-header">
          <h2>Loan Accounts</h2>
          <p>Manage your active and closed loan accounts</p>
        </div>

        {/* Summary Cards */}
        <div className="loan-summary">
          <div className="summary-card" onClick={navigateToActiveLoans}>
            <h3>Active Loans</h3>
            <p>View all running loan accounts and repayment details</p>
          </div>

          <div className="summary-card " onClick={navigateToLoanHistory}>
            <h3>Loan History</h3>
            <p>Check closed and fully paid loan accounts</p>
          </div>

          <div className="summary-card">
            <h3>Quick Access</h3>
            <p>Apply for a new loan or monitor existing ones easily</p>
          </div>
        </div>

        {/* Tabs */}
      </div>
    </div>
  );
}

export default LoanPage;
