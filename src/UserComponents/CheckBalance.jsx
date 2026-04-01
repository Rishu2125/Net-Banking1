import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../UserCss/CheckBalance.css";

function CheckBalance() {
  const [pin, setPin] = useState("");
  const [balanceData, setBalanceData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const userName = localStorage.getItem("name") || "Customer";
  const accountNumber = localStorage.getItem("accountNumber") || "";
  const navigate = useNavigate();
  const maskAccountNumber = (acc) => {
    if (!acc) return "XXXXXX4589";
    const value = String(acc);
    return value.length > 4 ? `XXXXXX${value.slice(-4)}` : value;
  };

  const handleCheckBalance = async () => {
    if (!pin || pin.length !== 4) {
      setError("Enter valid 4-digit PIN");
      return;
    }

    setLoading(true);
    setError("");
    setBalanceData(null);

    try {
      const res = await axios.post(
        "http://localhost:8080/api/user/check-balance",
        { accountNumber, pin },
      );

      if (res.data.responseCode === "66") {
        setBalanceData(res.data.data);
      } else {
        setError(res.data.responseMessage);
      }
    } catch {
      setError("Incorrect PIN or server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="balance-page">
      {/* ✅ FIXED TOPBAR */}
      <header className="balance-topbar">
        <h2>Neo Bank</h2>

        <div className="topbar-user">
          <span>{userName}</span>
          <small>{maskAccountNumber(accountNumber)}</small>
        </div>

        {/* ✅ BACK BUTTON */}
        <button
          className="back-btn"
          onClick={() => navigate("/user-dashboard")}
        >
          ← Dashboard
        </button>
      </header>

      {/* ✅ MAIN CONTENT */}
      <div className="balance-container">
        <div className="balance-card">
          <h2>Check Balance</h2>
          <p className="subtitle">
            Enter your transaction PIN to view account balance
          </p>

          {/* PIN INPUT */}
          <input
            type="password"
            placeholder="Enter 4-digit PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
            maxLength={4}
            className="pin-input"
          />

          <button
            className="primary-btn"
            onClick={handleCheckBalance}
            disabled={loading}
          >
            {loading ? "Verifying..." : "View Balance"}
          </button>

          {/* ERROR */}
          {error && <p className="error-text">{error}</p>}

          {/* RESULT */}
          {balanceData && (
            <div className="result-card">
              <h3>Available Balance</h3>
              <p className="balance-amount">₹ {balanceData.accountBalance}</p>

              <div className="details">
                <p>
                  <strong>Name:</strong> {balanceData.accountName}
                </p>
                <p>
                  <strong>Account:</strong>{" "}
                  {maskAccountNumber(balanceData.accountNumber)}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CheckBalance;
