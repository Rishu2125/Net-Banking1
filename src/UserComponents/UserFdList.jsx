import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../UserCss/UserFD.css";

function UserFDList() {
  const [fds, setFds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const accountNumber = localStorage.getItem("accountNumber");
  const userName = localStorage.getItem("name") || "Customer";

  const goBack = () => {
    navigate("/user-dashboard");
  };

  useEffect(() => {
    const fetchFD = async () => {
      if (!accountNumber) {
        setMessage("Account number not found. Please login again.");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(
          `http://localhost:8080/fd/get-user-fd/${accountNumber}`,
        );

        const { responseCode, responseMessage, data } = res.data;

        if (responseCode === "527" || (data && data.length > 0)) {
          setFds(data || []);
          if (!data || data.length === 0) {
            setMessage(responseMessage || "No fixed deposits found.");
          }
        } else {
          setMessage(responseMessage || "No fixed deposits found.");
        }
      } catch (err) {
        setMessage("Failed to fetch FD details");
      } finally {
        setLoading(false);
      }
    };

    fetchFD();
  }, [accountNumber]);

  const formatAmount = (amount) => {
    if (amount === null || amount === undefined) return "0";
    return Number(amount).toLocaleString("en-IN");
  };

  const getStatusClass = (status) => {
    if (!status) return "status-badge";

    const value = status.toString().trim().toLowerCase();

    if (value === "active") return "status-badge active";
    if (value === "inactive") return "status-badge inactive";
    if (value === "closed") return "status-badge closed";
    if (value === "matured") return "status-badge matured";
    if (value === "pending") return "status-badge pending";

    return "status-badge";
  };

  const activeDeposits = fds.filter(
    (fd) => fd.status?.toString().trim().toLowerCase() === "active",
  ).length;

  const totalInvested = fds.reduce(
    (sum, fd) => sum + Number(fd.amount || 0),
    0,
  );

  return (
    <div className="user-fd-page">
      <div className="user-fd-overlay">
        <div className="user-fd-wrapper">
          <div className="user-fd-topbar">
            <div className="fd-title-section">
              <p className="fd-small-label">Fixed Deposit Services</p>
              <h1>Your Fixed Deposits</h1>
              <p className="fd-subtitle">
                Welcome back, <span>{userName}</span>
              </p>
            </div>

            <button className="back-dashboard-btn" onClick={goBack}>
              ← Back to Dashboard
            </button>
          </div>

          <div className="fd-summary-cards">
            <div className="fd-card">
              <p>Total FDs</p>
              <h2>{fds.length}</h2>
            </div>

            <div className="fd-card">
              <p>Total Invested</p>
              <h2>₹ {formatAmount(totalInvested)}</h2>
            </div>

            <div className="fd-card">
              <p>Active Deposits</p>
              <h2>{activeDeposits}</h2>
            </div>
          </div>

          <div className="fd-table-card">
            {loading && (
              <div className="fd-state-box">
                <p className="fd-loading">
                  Loading your fixed deposit details...
                </p>
              </div>
            )}

            {!loading && message && fds.length === 0 && (
              <div className="fd-state-box">
                <p className="fd-message">{message}</p>
              </div>
            )}

            {!loading && fds.length > 0 && (
              <>
                <div className="fd-table-header">
                  <h3>FD Account Details</h3>
                  <p>Track your deposits, rates and duration</p>
                </div>

                <div className="fd-table-responsive">
                  <table className="fd-table">
                    <thead>
                      <tr>
                        <th>Reference Number</th>
                        <th>Amount</th>
                        <th>Interest Rate</th>
                        <th>Duration</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fds.map((fd, index) => (
                        <tr key={fd.refrenceNumber || index}>
                          <td>{fd.refrenceNumber || "N/A"}</td>
                          <td>₹ {formatAmount(fd.amount)}</td>
                          <td>{fd.intrestRate || 0}%</td>
                          <td>{fd.duration || 0} months</td>
                          <td>
                            <span className={getStatusClass(fd.status)}>
                              {fd.status || "Unknown"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserFDList;
