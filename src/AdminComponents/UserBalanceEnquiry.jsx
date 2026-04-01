import React, { useState } from "react";
import axios from "axios";
import {
  Wallet,
  Search,
  Landmark,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import "../AdminCss/UserBalanceEnquiry.css";

function UserBalanceEnquiry() {
  const [accountNumber, setAccountNumber] = useState("");
  const [balance, setBalance] = useState(null);
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCheckBalance = async () => {
    if (!accountNumber.trim()) {
      setStatus("Please enter account number");
      setStatusType("error");
      setBalance(null);
      return;
    }

    setLoading(true);
    setBalance(null);
    setStatus("");
    setStatusType("");

    try {
      const res = (
        await axios.get(
          `http://localhost:8080/admin/check-user-balance/${accountNumber}`,
        )
      ).data;

      if (res.responseCode === "66") {
        setBalance(res.data.accountBalance);
        setStatus("Balance fetched successfully");
        setStatusType("success");
      } else if (res.responseCode === "003") {
        setStatus("Account does not exist");
        setStatusType("error");
      } else {
        setStatus("Unknown response code");
        setStatusType("warning");
      }
    } catch (err) {
      console.error(err);
      setStatus("Server error");
      setStatusType("error");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="balance-page">
      <div className="balance-card">
        <div className="balance-header">
          <div className="balance-icon-wrap">
            <Wallet size={30} />
          </div>
          <div>
            <h2>User Balance Enquiry</h2>
            <p>Check customer account balance securely</p>
          </div>
        </div>

        <div className="balance-form">
          <label>Account Number</label>
          <div className="input-group">
            <span className="input-icon">
              <Landmark size={18} />
            </span>
            <input
              type="text"
              placeholder="Enter account number"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
            />
          </div>

          <button
            className="check-btn"
            onClick={handleCheckBalance}
            disabled={loading}
          >
            <Search size={18} />
            <span>{loading ? "Checking..." : "Check Balance"}</span>
          </button>
        </div>

        {status && (
          <div className={`status-message ${statusType}`}>
            {statusType === "success" ? (
              <CheckCircle2 size={18} />
            ) : (
              <AlertCircle size={18} />
            )}
            <span>{status}</span>
          </div>
        )}

        {balance !== null && (
          <div className="balance-result">
            <p className="balance-label">Available Balance</p>
            <h1>{formatCurrency(balance)}</h1>
            <span className="balance-subtext">Live account balance</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserBalanceEnquiry;
