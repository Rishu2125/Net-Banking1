import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../UserCss/Transfer.css";

function Transfer() {
  const [receiverAccountNumber, setReceiverAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState("");
  const [showPinPopup, setShowPinPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  const [status, setStatus] = useState(null); // success | failed | null
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const formatCurrency = (value) => {
    return Number(value || 0).toLocaleString("en-IN");
  };

  const openPinPopup = (e) => {
    e.preventDefault();

    if (!receiverAccountNumber || !amount) {
      setMessage("Please enter all details");
      setStatus("failed");
      return;
    }

    if (Number(amount) <= 0) {
      setMessage("Amount must be greater than 0");
      setStatus("failed");
      return;
    }

    setShowPinPopup(true);
  };

  const confirmTransfer = async () => {
    if (!pin) {
      setMessage("Please enter PIN");
      setStatus("failed");
      setShowPinPopup(false);
      return;
    }

    try {
      setLoading(true);

      const senderAccountNumber = localStorage.getItem("accountNumber");

      const res = await axios.patch("http://localhost:8080/api/user/transfer", {
        senderAccountNumber,
        receiverAccountNumber,
        amount: Number(amount),
        pin,
      });

      setMessage(res.data.responseMessage || "Transaction completed");

      if (res.data.responseCode === "013") {
        setStatus("success");
      } else {
        setStatus("failed");
      }

      setShowPinPopup(false);
    } catch (err) {
      setMessage(
        err.response?.data?.responseMessage || "Unable to process transaction",
      );
      setStatus("failed");
      setShowPinPopup(false);
    } finally {
      setLoading(false);
    }
  };

  const closeSuccessCard = () => {
    setStatus(null);
    setMessage("");
    setPin("");
    setAmount("");
    setReceiverAccountNumber("");
  };

  const closeFailureCard = () => {
    setStatus(null);
    setMessage("");
    setPin("");
  };

  return (
    <div className="transfer-page">
      {/* Top bar */}
      <div className="transfer-topbar">
        <div>
          <h2>NeoBank</h2>
          <p>Safe and secure fund transfer</p>
        </div>

        <button
          className="dashboard-btn"
          onClick={() => navigate("/user-dashboard")}
        >
          Back to Dashboard
        </button>
      </div>

      <div className="transfer-wrapper">
        {/* Left side info */}
        <div className="transfer-info-card">
          <h3>Fund Transfer</h3>
          <p>
            Transfer money securely to another account using PIN verification.
            Your banking experience is protected with secure transaction flow.
          </p>

          <div className="info-points">
            <div className="info-box">
              <h4>Instant Transfer</h4>
              <span>Send money quickly and securely</span>
            </div>

            <div className="info-box">
              <h4>PIN Protected</h4>
              <span>Transactions are verified before processing</span>
            </div>

            <div className="info-box">
              <h4>Trusted Banking</h4>
              <span>Designed for a modern net banking experience</span>
            </div>
          </div>
        </div>

        {/* Form card */}
        <div className="transfer-card">
          <div className="card-header">
            <h2>Money Transfer</h2>
            <p>Enter beneficiary details to continue</p>
          </div>

          <form onSubmit={openPinPopup} className="transfer-form">
            <div className="form-group">
              <label>Receiver Account Number</label>
              <input
                type="text"
                placeholder="Enter receiver account number"
                value={receiverAccountNumber}
                onChange={(e) => setReceiverAccountNumber(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Transfer Amount</label>
              <input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div className="transfer-note">
              <span>
                Please verify the account number carefully before proceeding.
              </span>
            </div>

            <button type="submit" className="transfer-btn">
              Proceed to Transfer
            </button>
          </form>
        </div>
      </div>

      {/* PIN Modal */}
      {showPinPopup && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirm Transfer</h3>
            <p className="modal-subtitle">
              Review the details before authorizing transaction
            </p>

            <div className="transfer-summary">
              <div className="summary-row">
                <span>Beneficiary Account</span>
                <strong>{receiverAccountNumber}</strong>
              </div>

              <div className="summary-row">
                <span>Transfer Amount</span>
                <strong>₹ {formatCurrency(amount)}</strong>
              </div>
            </div>

            <div className="form-group">
              <label>Enter Transaction PIN</label>
              <input
                type="password"
                placeholder="Enter PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
              />
            </div>

            <div className="modal-buttons">
              <button
                className="confirm-btn"
                onClick={confirmTransfer}
                disabled={loading}
              >
                {loading ? "Processing..." : "Confirm Transfer"}
              </button>

              <button
                className="cancel-btn"
                onClick={() => {
                  setShowPinPopup(false);
                  setPin("");
                }}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success / Failure Card */}
      {status && (
        <div className="status-overlay">
          <div className={`status-card ${status}`}>
            <div className="status-icon">
              {status === "success" ? "✔" : "✖"}
            </div>

            <h2>
              {status === "success"
                ? "Payment Successful"
                : "Unable to Process Transaction"}
            </h2>

            <p className="status-message">{message}</p>

            <div className="status-details">
              <span>₹ {formatCurrency(amount)}</span>
              <small>to {receiverAccountNumber}</small>
            </div>

            <div className="status-buttons">
              {status === "success" ? (
                <button onClick={closeSuccessCard}>Done</button>
              ) : (
                <>
                  <button className="retry-btn" onClick={closeFailureCard}>
                    Try Again
                  </button>

                  <button className="cancel-btn" onClick={closeFailureCard}>
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Transfer;
