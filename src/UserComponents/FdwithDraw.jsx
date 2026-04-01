import "../UserCss/FdWithdraw.css";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function FdwithDraw() {
  const [refrenceNumber, setRefrenceNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpBox, setShowOtpBox] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const goBack = () => {
    navigate("/user-dashboard");
  };

  const withdrawFd = async () => {
    if (!refrenceNumber) {
      alert("Please enter reference number");
      return;
    }

    try {
      setLoading(true);
      const accountNumber = localStorage.getItem("accountNumber");

      const res = await axios.patch("http://localhost:8080/fd/withdraw-fd", {
        accountNumber,
        refrenceNumber,
        otp,
      });

      alert(res.data.responseMessage);

      if (res.data.responseCode === "OTP_SENT") {
        setShowOtpBox(true);
      }

      if (
        res.data.responseCode === "FD_WITHDRAW_SUCCESS" ||
        res.data.responseCode === "SUCCESS" ||
        res.data.responseCode === "200"
      ) {
        setRefrenceNumber("");
        setOtp("");
        setShowOtpBox(false);
      }
    } catch (err) {
      console.log(err);
      alert("Error while withdrawing FD");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fd-withdraw-page">
      <div className="fd-withdraw-overlay"></div>

      <div className="fd-withdraw-card">
        <div className="fd-withdraw-header">
          <div>
            <p className="fd-bank-label">Neo Bank</p>
            <h2 className="withdraw-title">Withdraw Fixed Deposit</h2>
            <p className="fd-subtitle">
              Securely close your fixed deposit using OTP verification
            </p>
          </div>

          <button className="back-dashboard-btn" onClick={goBack}>
            ← Back to Dashboard
          </button>
        </div>

        <div className="fd-info-box">
          <div className="fd-info-item">
            <span>Service</span>
            <strong>FD Withdrawal</strong>
          </div>
          <div className="fd-info-item">
            <span>Verification</span>
            <strong>Email / Mobile OTP</strong>
          </div>
          <div className="fd-info-item">
            <span>Status</span>
            <strong>{showOtpBox ? "OTP Sent" : "Awaiting Request"}</strong>
          </div>
        </div>

        <div className="withdraw-form">
          <label className="withdraw-label">FD Reference Number</label>
          <input
            className="withdraw-input"
            type="text"
            placeholder="Enter FD Reference Number"
            value={refrenceNumber}
            onChange={(e) => setRefrenceNumber(e.target.value)}
          />

          {showOtpBox && (
            <>
              <label className="withdraw-label">Enter OTP</label>
              <input
                className="withdraw-input"
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </>
          )}

          <button
            className="withdraw-btn"
            onClick={withdrawFd}
            disabled={loading}
          >
            {loading
              ? "Processing..."
              : showOtpBox
                ? "Confirm Withdrawal"
                : "Withdraw FD"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default FdwithDraw;
