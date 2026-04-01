import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../UserCss/ResetPin.css";

function ResetPin() {
  const [accountNumber, setAccountNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [newPin, setNewPin] = useState("");

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const userName = localStorage.getItem("name") || "Customer";

  useEffect(() => {
    const savedAccountNumber = localStorage.getItem("accountNumber") || "";
    setAccountNumber(savedAccountNumber);
  }, []);

  const goBack = () => {
    navigate("/user-dashboard");
  };

  const sendOtp = async () => {
    if (!accountNumber.trim()) {
      setMessage("Account number not found. Please login again.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const res = await axios.post("http://localhost:8080/api/user/sendOtp", {
        accountNumber,
      });

      setMessage(res.data.responseMessage || "OTP sent successfully.");
      setStep(2);
    } catch (e) {
      setMessage(e.response?.data?.responseMessage || "Error sending OTP.");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp.trim()) {
      setMessage("Please enter OTP.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const res = await axios.post("http://localhost:8080/api/user/verifyOtp", {
        accountNumber,
        otp,
      });

      setMessage(res.data.responseMessage || "OTP verified successfully.");
      setStep(3);
    } catch (e) {
      setMessage(e.response?.data?.responseMessage || "Invalid OTP.");
    } finally {
      setLoading(false);
    }
  };

  const resetPin = async () => {
    if (!newPin.trim()) {
      setMessage("Please enter new PIN.");
      return;
    }

    if (!/^\d{4}$/.test(newPin)) {
      setMessage("PIN must be exactly 4 digits.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const res = await axios.post("http://localhost:8080/api/user/resetPin", {
        accountNumber,
        newPin,
      });

      setMessage(res.data.responseMessage || "PIN reset successfully.");
      setStep(1);
      setOtp("");
      setNewPin("");
    } catch (e) {
      setMessage(e.response?.data?.responseMessage || "Error resetting PIN.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-page">
      <div className="reset-container">
        <div className="reset-header">
          <div className="header-left">
            <div className="bank-logo">N</div>
            <div>
              <h1>Secure PIN Reset</h1>
              <p>
                Protect your account access. Welcome, <span>{userName}</span>
              </p>
            </div>
          </div>

          <button className="back-btn" onClick={goBack}>
            Back to Dashboard
          </button>
        </div>

        <div className="reset-grid">
          <div className="reset-info-card">
            <h2>Security Verification</h2>
            <p>
              For your protection, PIN reset requires account verification, OTP
              authentication, and secure PIN update.
            </p>

            <div className="security-points">
              <div className="security-item">
                <span className="dot"></span>
                Account-based authentication
              </div>
              <div className="security-item">
                <span className="dot"></span>
                OTP verification on registered email
              </div>
              <div className="security-item">
                <span className="dot"></span>
                Safe and encrypted PIN reset flow
              </div>
              <div className="security-item">
                <span className="dot"></span>
                Secure access control for net banking
              </div>
            </div>
          </div>

          <div className="reset-card">
            <div className="reset-card-top">
              <h2>Reset Banking PIN</h2>
              <p>
                Complete all verification steps to update your PIN securely.
              </p>
            </div>

            <div className="stepper">
              <div className={`step-item ${step >= 1 ? "active" : ""}`}>
                <div className="step-circle">1</div>
                <span>Account</span>
              </div>

              <div className={`step-line ${step >= 2 ? "active" : ""}`}></div>

              <div className={`step-item ${step >= 2 ? "active" : ""}`}>
                <div className="step-circle">2</div>
                <span>OTP</span>
              </div>

              <div className={`step-line ${step >= 3 ? "active" : ""}`}></div>

              <div className={`step-item ${step >= 3 ? "active" : ""}`}>
                <div className="step-circle">3</div>
                <span>New PIN</span>
              </div>
            </div>

            {message && <div className="message-box">{message}</div>}

            {step === 1 && (
              <div className="form-section">
                <label>Account Number</label>
                <input
                  type="text"
                  value={accountNumber}
                  disabled
                  className="disabled-input"
                />

                <button
                  className="primary-btn"
                  onClick={sendOtp}
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send OTP"}
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="form-section">
                <label>One-Time Password</label>
                <input
                  type="text"
                  placeholder="Enter OTP sent to your email"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />

                <div className="action-row">
                  <button
                    className="secondary-btn"
                    onClick={() => setStep(1)}
                    disabled={loading}
                  >
                    Previous
                  </button>

                  <button
                    className="primary-btn"
                    onClick={verifyOtp}
                    disabled={loading}
                  >
                    {loading ? "Verifying..." : "Verify OTP"}
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="form-section">
                <label>New Transaction PIN</label>
                <input
                  type="password"
                  placeholder="Enter new 4-digit PIN"
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  maxLength={4}
                />

                <div className="action-row">
                  <button
                    className="secondary-btn"
                    onClick={() => setStep(2)}
                    disabled={loading}
                  >
                    Previous
                  </button>

                  <button
                    className="primary-btn"
                    onClick={resetPin}
                    disabled={loading}
                  >
                    {loading ? "Updating..." : "Reset PIN"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPin;
