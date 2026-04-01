import React, { useEffect, useState } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import "../UserCss/ActiveLoans.css";

function ActiveLoans() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const userName = localStorage.getItem("name") || "Customer";

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      const accountNumber = localStorage.getItem("accountNumber");

      if (!accountNumber) {
        setMessage("Account number not found. Please login again.");
        setLoading(false);
        return;
      }

      const res = await axios.get(
        `http://localhost:8080/api/user/get-user-loan/${accountNumber}`,
      );

      const { data, responseMessage } = res.data;

      if (data && data.length > 0) {
        setLoans(data);
      } else {
        setMessage(responseMessage || "No active loans found.");
      }
    } catch (err) {
      console.log(err);
      setMessage("Failed to fetch active loans.");
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    navigate("/user-dashboard");
  };

  const formatCurrency = (value) => {
    if (value === null || value === undefined) return "₹ 0.00";
    return `₹ ${Number(value).toFixed(2)}`;
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-IN");
  };

  const totalLoanAmount = loans.reduce(
    (sum, loan) => sum + Number(loan.loanAmount || 0),
    0,
  );

  const totalEmi = loans.reduce((sum, loan) => sum + Number(loan.emi || 0), 0);

  return (
    <div className="active-loans-page">
      <div className="active-loans-container">
        {/* Header */}
        <div className="active-loans-header">
          <div className="header-left">
            <div className="bank-badge">N</div>
            <div>
              <h1>Loan Management</h1>
              <p>
                Welcome back, <span>{userName}</span>
              </p>
            </div>
          </div>

          <div className="header-actions">
            <button className="back-btn" onClick={goBack}>
              Back to Dashboard
            </button>

            <NavLink to="/apply-loan" className="apply-btn">
              Apply New Loan
            </NavLink>
          </div>
        </div>

        {/* Summary Cards */}
        {!loading && !message && (
          <div className="loan-summary-grid">
            <div className="summary-card">
              <p className="summary-label">Active Loans</p>
              <h3>{loans.length}</h3>
            </div>

            <div className="summary-card">
              <p className="summary-label">Total Loan Amount</p>
              <h3>{formatCurrency(totalLoanAmount)}</h3>
            </div>

            <div className="summary-card">
              <p className="summary-label">Total EMI</p>
              <h3>{formatCurrency(totalEmi)}</h3>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="active-loans-card">
          <div className="section-top">
            <div>
              <h2>My Active Loans</h2>
              <p>
                Track your loan details, EMI schedule, and repayment status.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="state-box">Loading active loans...</div>
          ) : message ? (
            <div className="state-box error-box">{message}</div>
          ) : (
            <div className="table-wrapper">
              <table className="loan-table">
                <thead>
                  <tr>
                    <th>Loan Reference</th>
                    <th>Loan Amount</th>
                    <th>EMI</th>
                    <th>Duration</th>
                    <th>Interest</th>
                    <th>Remaining Amount</th>
                    <th>Next EMI Date</th>
                    <th>End Date</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {loans.map((loan, index) => (
                    <tr key={loan.loanRefrenceNumber || index}>
                      <td className="loan-ref">
                        {loan.loanRefrenceNumber || "-"}
                      </td>
                      <td>{formatCurrency(loan.loanAmount)}</td>
                      <td>{formatCurrency(loan.emi)}</td>
                      <td>{loan.duration ? `${loan.duration} months` : "-"}</td>
                      <td>{loan.intrestrate ? `${loan.intrestrate}%` : "-"}</td>
                      <td>{formatCurrency(loan.totalPayableAmount)}</td>
                      <td>{formatDate(loan.nextEmiDate)}</td>
                      <td>{formatDate(loan.endDate)}</td>
                      <td>
                        <NavLink
                          to={`/pay-emi/${loan.loanRefrenceNumber}/${loan.emi}`}
                          className="pay-btn"
                        >
                          Pay EMI
                        </NavLink>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ActiveLoans;
