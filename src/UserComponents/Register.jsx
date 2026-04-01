import React, { useState } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import "../UserCss/Register.css";

function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    emailId: "",
    password: "",
    confirmPassword: "",
    aadhaarNumber: "",
    panNumber: "",
    state: "",
    city: "",
    gender: "",
    address: "",
    phoneNumber: "",
    alternatePhoneNumber: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return false;
    }

    if (!/^\d{12}$/.test(formData.aadhaarNumber)) {
      alert("Aadhaar number must be exactly 12 digits");
      return false;
    }

    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNumber)) {
      alert("Invalid PAN format. Example: ABCDE1234F");
      return false;
    }

    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(
        formData.password,
      )
    ) {
      alert(
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character",
      );
      return false;
    }

    if (!/^\d{10}$/.test(formData.phoneNumber)) {
      alert("Phone number must be exactly 10 digits");
      return false;
    }

    if (
      formData.alternatePhoneNumber &&
      !/^\d{10}$/.test(formData.alternatePhoneNumber)
    ) {
      alert("Alternate phone number must be exactly 10 digits");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      const payload = {
        ...formData,
        panNumber: formData.panNumber.toUpperCase(),
      };

      const res = await axios.post(
        "http://localhost:8080/api/user/register",
        payload,
      );

      alert(res.data.responseMessage || "Registration successful");
      navigate("/");
    } catch (error) {
      alert("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      {/* Top Navbar */}
      <header className="register-topbar">
        <div className="register-brand">
          <div className="brand-icon">N</div>
          <div>
            <h1>Neo Bank</h1>
            <p>Secure Digital Banking</p>
          </div>
        </div>

        <div className="topbar-actions">
          <span className="ssl-badge">🔒 RBI-grade secure onboarding</span>
        </div>
      </header>

      {/* Main Layout */}
      <div className="register-main">
        {/* Left Panel */}
        <div className="register-left">
          <div className="info-card">
            <span className="info-tag">Open Savings Account</span>
            <h2>Start your banking journey in minutes.</h2>
            <p>
              Create your Neo Bank account with a secure digital onboarding
              experience. Manage transactions, cards, loans, and profile
              services from one place.
            </p>

            <div className="benefit-list">
              <div className="benefit-item">
                <span>✔</span>
                <div>
                  <h4>Instant Account Access</h4>
                  <p>Get started with digital banking services quickly.</p>
                </div>
              </div>

              <div className="benefit-item">
                <span>✔</span>
                <div>
                  <h4>Protected KYC Details</h4>
                  <p>Your Aadhaar, PAN, and contact data stay secured.</p>
                </div>
              </div>

              <div className="benefit-item">
                <span>✔</span>
                <div>
                  <h4>Unified Banking Dashboard</h4>
                  <p>Track balances, payments, loans, and transactions.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="register-right">
          <div className="register-card">
            <div className="register-card-header">
              <h3>Create Net Banking Account</h3>
              <p>Please fill in your details to continue</p>
            </div>

            <form onSubmit={handleSubmit} className="register-form">
              <div className="section-title">Personal Information</div>

              <div className="form-row three-col">
                <div className="input-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="Enter first name"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="input-group">
                  <label>Middle Name</label>
                  <input
                    type="text"
                    name="middleName"
                    placeholder="Enter middle name"
                    value={formData.middleName}
                    onChange={handleChange}
                  />
                </div>

                <div className="input-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Enter last name"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="input-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="emailId"
                    placeholder="Enter registered email"
                    value={formData.emailId}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="section-title">Security Credentials</div>

              <div className="form-row two-col">
                <div className="input-group">
                  <label>Password</label>
                  <div className="password-field">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Create password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <div className="input-group">
                  <label>Confirm Password</label>
                  <div className="password-field">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Confirm password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>
              </div>

              <div className="section-title">KYC & Contact Details</div>

              <div className="form-row two-col">
                <div className="input-group">
                  <label>Aadhaar Number</label>
                  <input
                    type="text"
                    name="aadhaarNumber"
                    placeholder="Enter 12-digit Aadhaar"
                    value={formData.aadhaarNumber}
                    onChange={handleChange}
                    maxLength="12"
                    required
                  />
                </div>

                <div className="input-group">
                  <label>PAN Number</label>
                  <input
                    type="text"
                    name="panNumber"
                    placeholder="Enter PAN number"
                    value={formData.panNumber}
                    onChange={handleChange}
                    style={{ textTransform: "uppercase" }}
                    maxLength="10"
                    required
                  />
                </div>
              </div>

              <div className="form-row two-col">
                <div className="input-group">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    name="phoneNumber"
                    placeholder="Enter phone number"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    maxLength="10"
                    required
                  />
                </div>

                <div className="input-group">
                  <label>Alternate Phone Number</label>
                  <input
                    type="text"
                    name="alternatePhoneNumber"
                    placeholder="Enter alternate number"
                    value={formData.alternatePhoneNumber}
                    onChange={handleChange}
                    maxLength="10"
                  />
                </div>
              </div>

              <div className="form-row two-col">
                <div className="input-group">
                  <label>State</label>
                  <input
                    type="text"
                    name="state"
                    placeholder="Enter state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="input-group">
                  <label>City</label>
                  <input
                    type="text"
                    name="city"
                    placeholder="Enter city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row two-col">
                <div className="input-group">
                  <label>Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="input-group">
                  <label>Full Address</label>
                  <textarea
                    name="address"
                    placeholder="Enter your full address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="register-btn" disabled={loading}>
                {loading ? "Creating Account..." : "Open Account Securely"}
              </button>

              <p className="login-link-text">
                Already registered? <NavLink to="/login">Login here</NavLink>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
