import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../UserCss/UserLoanHistory.css";

function UserLoanHistory() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const accountNumber = localStorage.getItem("accountNumber");
  const userName = localStorage.getItem("name") || "Customer";

  const goBack = () => {
    navigate("/user-dashboard");
  };

  useEffect(() => {
    const fetchLoanHistory = async () => {
      if (!accountNumber) {
        setMessage("Account number not found. Please login again.");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(
          `http://localhost:8080/api/user/get-loan-history/${accountNumber}`,
        );

        const { responseCode, responseMessage, data } = res.data;

        if (data && data.length > 0) {
          setLoans(data);
        } else {
          setMessage(responseMessage || "No loan history found.");
        }
      } catch (error) {
        console.error(error);
        setMessage("Failed to fetch loan history.");
      } finally {
        setLoading(false);
      }
    };

    fetchLoanHistory();
  }, [accountNumber]);

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return "₹ 0.00";
    return `₹ ${Number(amount).toFixed(2)}`;
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-IN");
  };

  return (
    <div className="loan-history-page">
      <div className="loan-history-container">
        <div className="loan-history-header">
          <div>
            <h1>User Loan History</h1>
            <p>
              Welcome, <span>{userName}</span>
            </p>
          </div>

          <button className="back-btn" onClick={goBack}>
            Back to Dashboard
          </button>
        </div>

        {loading ? (
          <div className="loan-state-card">Loading loan history...</div>
        ) : message ? (
          <div className="loan-state-card error-message">{message}</div>
        ) : (
          <div className="loan-table-wrapper">
            <table className="loan-history-table">
              <thead>
                <tr>
                  <th>Loan Ref No.</th>
                  <th>Loan Amount</th>
                  <th>Interest Rate</th>
                  <th>Duration</th>
                  <th>EMI</th>
                  <th>Approved Date</th>
                  <th>End Date</th>

                  <th>Total Paid</th>
                  <th>Total Payable</th>
                </tr>
              </thead>

              <tbody>
                {loans.map((loan, index) => (
                  <tr key={loan.loanRefrenceNumber || index}>
                    <td className="loan-ref">
                      {loan.loanRefrenceNumber || "-"}
                    </td>
                    <td>{formatCurrency(loan.loanAmount)}</td>
                    <td>{loan.intrestrate ? `${loan.intrestrate}%` : "-"}</td>
                    <td>{loan.duration ? `${loan.duration} months` : "-"}</td>
                    <td>{formatCurrency(loan.emi)}</td>
                    <td>{formatDate(loan.approvedDate)}</td>
                    <td>{formatDate(loan.endDate)}</td>

                    <td>{formatCurrency(loan.totalPaidAmount)}</td>
                    <td>{formatCurrency(loan.totalPayableAmount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserLoanHistory;
