import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../UserCss/ApplyLoan.css";

function ApplyLoan() {
  const [duration, setDuration] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const [loantype, setLoanType] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const userName = localStorage.getItem("name") || "Customer";

  const applyLoan = async (e) => {
    e.preventDefault();
    setMessage("");

    const accountNumber = localStorage.getItem("accountNumber");

    if (!accountNumber) {
      setMessage("Account number not found. Please login again.");
      return;
    }

    if (!duration || !loanAmount || !loantype) {
      setMessage("Please fill all fields.");
      return;
    }

    const data = {
      accountNumber: accountNumber,
      duration: Number(duration),
      loanAmount: Number(loanAmount),
      loantype: loantype,
    };

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:8080/api/user/loan/create",
        data,
      );

      const { responseMessage } = res.data;
      setMessage(responseMessage || "Loan applied successfully.");

      setDuration("");
      setLoanAmount("");
      setLoanType("");
    } catch (err) {
      console.log(err);
      setMessage("Failed to apply for loan.");
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    navigate("/active-loans");
  };

  return (
    <div className="apply-loan-page">
      <div className="apply-loan-container">
        {/* Header */}
        <div className="apply-loan-header">
          <div className="header-left">
            <div className="bank-logo">N</div>
            <div>
              <h1>Loan Application</h1>
              <p>
                Apply for a new loan securely. Welcome, <span>{userName}</span>
              </p>
            </div>
          </div>

          <button className="back-btn" onClick={goBack}>
            Back to Loans
          </button>
        </div>

        {/* Layout */}
        <div className="apply-loan-grid">
          {/* Left Info Card */}
          <div className="info-card">
            <h2>Loan Services</h2>
            <p>
              Submit your loan request through our secure online banking portal.
              Choose the loan type, tenure, and amount based on your financial
              needs.
            </p>

            <div className="info-list">
              <div className="info-item">
                <span className="info-dot"></span>
                Fast application process
              </div>
              <div className="info-item">
                <span className="info-dot"></span>
                Transparent interest structure
              </div>
              <div className="info-item">
                <span className="info-dot"></span>
                Flexible repayment tenure
              </div>
              <div className="info-item">
                <span className="info-dot"></span>
                Secure digital tracking
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="form-card">
            <form className="loan-form" onSubmit={applyLoan}>
              <div className="form-top">
                <h2>Apply for Loan</h2>
                <p>Enter your loan details below to continue.</p>
              </div>

              {message && <div className="form-message">{message}</div>}

              <div className="form-group">
                <label>Loan Duration</label>
                <input
                  type="number"
                  placeholder="Enter duration in months"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Loan Amount</label>
                <input
                  type="number"
                  placeholder="Enter loan amount"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Loan Type</label>
                <select
                  value={loantype}
                  onChange={(e) => setLoanType(e.target.value)}
                >
                  <option value="">Select Loan Type</option>
                  <option value="home">HOME</option>
                  <option value="car">CAR</option>
                  <option value="personal">PERSONAL</option>
                  <option value="education">EDUCATION</option>
                  <option value="business">BUSINESS</option>
                </select>
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? "Submitting..." : "Apply Loan"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApplyLoan;
