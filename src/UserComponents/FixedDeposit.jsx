import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../UserCss/FixedDeposit.css";

function FixedDeposit() {
  const [amount, setAmount] = useState("");
  const [duration, setDuration] = useState("");
  const [pin, setPin] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const [showPinBox, setShowPinBox] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const goBack = () => {
    navigate("/user-dashboard"); // change route if needed
  };

  const handleCreateClick = () => {
    if (!amount || !duration) {
      alert("Enter amount and months");
      return;
    }

    setShowPinBox(true);
  };

  const createFd = async () => {
    const accountNumber = localStorage.getItem("accountNumber");

    if (!accountNumber) {
      alert("Account number not found. Please login again.");
      return;
    }

    if (!pin) {
      alert("Please enter PIN");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post("http://localhost:8080/fd/create", {
        amount,
        duration,
        pin,
        accountNumber,
      });

      console.log("FD response:", res.data);

      let message = "Your Fixed Deposit has been created successfully.";

      if (typeof res.data === "string") {
        message = res.data;
      } else if (res.data?.responseMessage) {
        message = res.data.responseMessage;
      } else if (res.data?.message) {
        message = res.data.message;
      }

      setShowPinBox(false);

      setTimeout(() => {
        setSuccessMsg(message);
        setShowSuccess(true);
      }, 200);

      setAmount("");
      setDuration("");
      setPin("");
    } catch (err) {
      console.log("FD error:", err);

      if (err.response) {
        alert(
          err.response.data?.responseMessage ||
            err.response.data?.message ||
            err.response.data ||
            "Transaction failed",
        );
      } else {
        alert("Server error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fd-page">
      <div className="fd-topbar">
        <button className="fd-back-btn" onClick={goBack}>
          ← Back to Dashboard
        </button>
      </div>

      <div className="fd-container">
        <div className="fd-card">
          <div className="fd-card-header">
            <h2>Create Fixed Deposit</h2>
            <p>Secure your savings with guaranteed returns</p>
          </div>

          <div className="fd-form-group">
            <label>Deposit Amount</label>
            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="fd-form-group">
            <label>Duration</label>
            <input
              type="number"
              placeholder="Enter duration in months"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </div>

          <button className="fd-create-btn" onClick={handleCreateClick}>
            Create FD
          </button>
        </div>
      </div>

      {showPinBox && (
        <div className="fd-modal-overlay">
          <div className="fd-modal">
            <h3>Verify Transaction</h3>
            <p>Please enter your secure PIN to continue</p>

            <input
              type="password"
              placeholder="Enter PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
            />

            <div className="fd-modal-actions">
              <button
                className="fd-cancel-btn"
                onClick={() => {
                  setShowPinBox(false);
                  setPin("");
                }}
              >
                Cancel
              </button>

              <button
                className="fd-confirm-btn"
                onClick={createFd}
                disabled={loading}
              >
                {loading ? "Processing..." : "Confirm FD"}
              </button>
            </div>
          </div>
        </div>
      )}
      {showSuccess && (
        <div className="fd-success-overlay">
          <div className="fd-success-box">
            <div className="success-icon">✓</div>
            <h3>FD Created Successfully</h3>
            <p>{successMsg}</p>

            <button
              className="fd-success-btn"
              onClick={() => setShowSuccess(false)}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default FixedDeposit;
