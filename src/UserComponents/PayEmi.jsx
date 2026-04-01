import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../UserCss/PayEmi.css";

function PayEmi() {
  const { ref } = useParams();
  const navigate = useNavigate();

  const [loanDetails, setLoanDetails] = useState(null);
  const [pin, setPin] = useState("");
  const [showPinModal, setShowPinModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pinLoading, setPinLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const userName = localStorage.getItem("name") || "Customer";
  const accountNumber = localStorage.getItem("accountNumber") || "";

  useEffect(() => {
    fetchLoanDetails();
  }, []);

  const fetchLoanDetails = async () => {
    try {
      setLoading(true);
      setMessage("");

      const res = await axios.get(
        `http://localhost:8080/api/user/get-loan/${ref}`,
      );
      setLoanDetails(res.data.data);
    } catch (err) {
      console.error(err);
      setMessage("Unable to fetch loan details.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const showSuccess = (text) => {
    setMessage(text);
    setMessageType("success");
  };

  const showError = (text) => {
    setMessage(text);
    setMessageType("error");
  };

  const openPinModal = () => {
    setPin("");
    setShowPinModal(true);
  };

  const closePinModal = () => {
    setPin("");
    setShowPinModal(false);
  };

  const validatePin = async () => {
    try {
      if (!pin.trim()) {
        showError("Please enter your transaction PIN.");
        return;
      }

      const emailId = localStorage.getItem("emailId");
      if (!emailId) {
        showError("User session not found. Please login again.");
        return;
      }

      setPinLoading(true);
      setMessage("");

      const res = await axios.post(
        "http://localhost:8080/api/user/validate-pin",
        { pin, emailId },
        { headers: { "Content-Type": "application/json" } },
      );

      const code = Number(res.data.responseCode);
      const responseMessage = res.data.responseMessage;

      if (code === 88) {
        closePinModal();
        await payEmiHandler();
      } else if (code === 63) {
        showError("Invalid PIN. Please try again.");
      } else {
        showError(responseMessage || "Unexpected response from server.");
      }
    } catch (err) {
      console.error("PIN validation error:", err);
      showError(err.response?.data?.responseMessage || "Error validating PIN.");
    } finally {
      setPinLoading(false);
    }
  };

  const payEmiHandler = async () => {
    try {
      setLoading(true);
      setMessage("");

      const res = await axios.put(
        `http://localhost:8080/api/user/pay-emi/${ref}`,
      );
      showSuccess(res.data.responseMessage || "EMI paid successfully.");

      setTimeout(() => {
        navigate("/user-loan");
      }, 1200);
    } catch (err) {
      console.error(err);
      showError(err.response?.data?.responseMessage || "EMI payment failed.");
    } finally {
      setLoading(false);
    }
  };

  const maskAccountNumber = (acc) => {
    if (!acc) return "XXXXXX4589";
    const value = String(acc);
    if (value.length <= 4) return value;
    return `XXXXXX${value.slice(-4)}`;
  };

  if (loading && !loanDetails) {
    return (
      <div className="payemi-page">
        <div className="payemi-loading-wrapper">
          <div className="payemi-loader"></div>
          <p>Loading your loan details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="payemi-page">
      <header className="payemi-topbar">
        <div className="payemi-brand">
          <div className="payemi-logo">N</div>
          <div>
            <h2>NeoBank</h2>
            <p>Secure Loan Services</p>
          </div>
        </div>

        <button
          className="payemi-back-btn"
          onClick={() => navigate("/user-loan")}
        >
          Back to Loans
        </button>
      </header>

      <main className="payemi-main">
        <section className="payemi-hero-card">
          <div className="payemi-hero-left">
            <p className="payemi-section-tag">LOAN EMI PAYMENT</p>
            <h1>Pay your EMI securely</h1>
            <p className="payemi-subtext">
              Review your loan installment details and authorize the payment
              using your transaction PIN.
            </p>

            <div className="payemi-user-strip">
              <div className="payemi-user-box">
                <span>Account Holder</span>
                <strong>{userName}</strong>
              </div>
              <div className="payemi-user-box">
                <span>Account Number</span>
                <strong>{maskAccountNumber(accountNumber)}</strong>
              </div>
            </div>
          </div>

          <div className="payemi-hero-right">
            <div className="payemi-summary-badge">
              <span>Due EMI</span>
              <h2>₹{loanDetails?.emi}</h2>
            </div>
          </div>
        </section>

        <section className="payemi-grid">
          <div className="payemi-info-card">
            <div className="card-head">
              <h3>Loan Details</h3>
              <p>Verify all details before proceeding.</p>
            </div>

            <div className="detail-list">
              <div className="detail-row">
                <span>Loan Reference</span>
                <strong>{loanDetails?.loanRefrenceNumber}</strong>
              </div>
              <div className="detail-row">
                <span>EMI Amount</span>
                <strong>₹{loanDetails?.emi}</strong>
              </div>
              <div className="detail-row">
                <span>Status</span>
                <strong className="status-pill">Active</strong>
              </div>
            </div>
          </div>

          <div className="payemi-action-card">
            <div className="card-head">
              <h3>Payment Authorization</h3>
              <p>Proceed with secure transaction PIN validation.</p>
            </div>

            <div className="payment-box">
              <div className="payment-amount-label">Amount to be debited</div>
              <div className="payment-amount">₹{loanDetails?.emi}</div>
              <div className="payment-note">
                This EMI amount will be debited from your registered bank
                account.
              </div>
            </div>

            {message && (
              <div className={`payemi-message ${messageType}`}>{message}</div>
            )}

            <button
              className="payemi-primary-btn"
              onClick={openPinModal}
              disabled={loading}
            >
              {loading ? "Processing..." : "Confirm & Pay EMI"}
            </button>
          </div>
        </section>
      </main>

      {showPinModal && (
        <div className="pin-modal-overlay">
          <div className="pin-modal">
            <div className="pin-modal-header">
              <h3>Transaction Verification</h3>
              <p>Enter your secure transaction PIN to complete EMI payment.</p>
            </div>

            <div className="pin-loan-summary">
              <div>
                <span>Loan Ref</span>
                <strong>{loanDetails?.loanRefrenceNumber}</strong>
              </div>
              <div>
                <span>Amount</span>
                <strong>₹{loanDetails?.emi}</strong>
              </div>
            </div>

            <label className="pin-label">Transaction PIN</label>
            <input
              type="password"
              placeholder="Enter your PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="pin-input"
              maxLength={4}
            />

            <div className="pin-modal-buttons">
              <button
                className="payemi-primary-btn"
                onClick={validatePin}
                disabled={pinLoading}
              >
                {pinLoading ? "Verifying..." : "Submit PIN"}
              </button>

              <button
                className="payemi-secondary-btn"
                onClick={closePinModal}
                disabled={pinLoading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PayEmi;
