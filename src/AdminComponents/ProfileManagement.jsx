import React, { useState } from "react";
import axios from "axios";
import {
  Search,
  RotateCcw,
  Save,
  UserRound,
  Phone,
  MapPin,
  ShieldCheck,
  Mail,
  CreditCard,
} from "lucide-react";
import "../AdminCss/ProfileManagement.css";

function ProfileManagement() {
  const [searchValue, setSearchValue] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    emailId: "",
    state: "",
    address: "",
    city: "",
    gender: "",
    panNumber: "",
    phoneNumber: "",
    alternatePhoneNumber: "",
  });

  const [accountNumber, setAccountNumber] = useState("");
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchValue.trim()) {
      setError("Please enter account number");
      setMessage("");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");
      setSearched(false);

      const res = await axios.get(
        `http://localhost:8080/admin/get-user/${searchValue}`,
      );

      const user = res.data.data;

      setAccountNumber(user.accountNumber || searchValue);

      setFormData({
        firstName: user.firstName || "",
        middleName: user.middleName || "",
        lastName: user.lastName || "",
        emailId: user.emailId || "",
        state: user.state || "",
        address: user.address || "",
        city: user.city || "",
        gender: user.gender || "",
        panNumber: user.panNumber || "",
        phoneNumber: user.phoneNumber || "",
        alternatePhoneNumber: user.alternatePhoneNumber || "",
      });

      setSearched(true);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "User not found");
      setMessage("");
      setSearched(false);
      setAccountNumber("");
    } finally {
      setLoading(false);
    }
  };

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateHandler = async (e) => {
    e.preventDefault();

    if (!accountNumber) {
      setError("Search a user first");
      setMessage("");
      return;
    }

    try {
      setUpdating(true);
      setError("");
      setMessage("");

      const res = await axios.patch(
        `http://localhost:8080/admin/update-user/${accountNumber}`,
        formData,
      );

      setMessage(res.data.message || "User profile updated successfully");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to update user");
      setMessage("");
    } finally {
      setUpdating(false);
    }
  };

  const resetForm = () => {
    setSearchValue("");
    setAccountNumber("");
    setSearched(false);
    setMessage("");
    setError("");
    setFormData({
      firstName: "",
      middleName: "",
      lastName: "",
      emailId: "",
      state: "",
      address: "",
      city: "",
      gender: "",
      panNumber: "",
      phoneNumber: "",
      alternatePhoneNumber: "",
    });
  };

  const fullName =
    `${formData.firstName} ${formData.middleName} ${formData.lastName}`
      .replace(/\s+/g, " ")
      .trim() || "Customer Name";

  return (
    <div className="profile-page">
      <div className="profile-shell">
        <header className="bank-topbar">
          <div>
            <h1>NeoBank Admin Portal</h1>
            <p>Customer Profile Management</p>
          </div>
          <div className="topbar-badge">Secure Admin Access</div>
        </header>

        <section className="search-card">
          <div className="section-heading">
            <div className="section-icon">
              <Search size={18} />
            </div>
            <div>
              <h2>Search Customer</h2>
              <p>Find account holder by account number and manage details</p>
            </div>
          </div>

          <form className="search-form" onSubmit={handleSearch}>
            <div className="search-input-wrap">
              <label>Account Number</label>
              <input
                type="text"
                placeholder="Enter customer account number"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>

            <div className="search-actions">
              <button type="submit" className="primary-btn" disabled={loading}>
                <Search size={16} />
                {loading ? "Searching..." : "Search"}
              </button>

              <button
                type="button"
                className="secondary-btn"
                onClick={resetForm}
              >
                <RotateCcw size={16} />
                Clear
              </button>
            </div>
          </form>
        </section>

        {message && <div className="alert success-alert">{message}</div>}
        {error && <div className="alert error-alert">{error}</div>}

        {searched && (
          <form onSubmit={updateHandler} className="customer-layout">
            <section className="customer-summary">
              <div className="customer-avatar">
                {formData.firstName?.charAt(0)?.toUpperCase() || "C"}
              </div>

              <div className="customer-main">
                <h2>{fullName}</h2>
                <div className="customer-meta">
                  <span>
                    <CreditCard size={15} />
                    A/C: {accountNumber}
                  </span>
                  <span>
                    <Mail size={15} />
                    {formData.emailId || "No email"}
                  </span>
                  <span>
                    <Phone size={15} />
                    {formData.phoneNumber || "No phone"}
                  </span>
                </div>
              </div>

              <div className="customer-status">
                <span className="status-pill">Active Profile</span>
              </div>
            </section>

            <div className="details-grid">
              <section className="details-card">
                <div className="card-title">
                  <UserRound size={18} />
                  <h3>Personal Information</h3>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={changeHandler}
                    />
                  </div>

                  <div className="form-group">
                    <label>Middle Name</label>
                    <input
                      type="text"
                      name="middleName"
                      value={formData.middleName}
                      onChange={changeHandler}
                    />
                  </div>

                  <div className="form-group">
                    <label>Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={changeHandler}
                    />
                  </div>

                  <div className="form-group">
                    <label>Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={changeHandler}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>PAN Number</label>
                    <input
                      type="text"
                      name="panNumber"
                      value={formData.panNumber}
                      readOnly
                      className="readonly-field"
                    />
                  </div>
                </div>
              </section>

              <section className="details-card">
                <div className="card-title">
                  <Phone size={18} />
                  <h3>Contact Information</h3>
                </div>

                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>Email Address</label>
                    <input
                      type="email"
                      name="emailId"
                      value={formData.emailId}
                      onChange={changeHandler}
                    />
                  </div>

                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="text"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={changeHandler}
                    />
                  </div>

                  <div className="form-group">
                    <label>Alternate Phone</label>
                    <input
                      type="text"
                      name="alternatePhoneNumber"
                      value={formData.alternatePhoneNumber}
                      onChange={changeHandler}
                    />
                  </div>
                </div>
              </section>

              <section className="details-card full-card">
                <div className="card-title">
                  <MapPin size={18} />
                  <h3>Address Details</h3>
                </div>

                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>Residential Address</label>
                    <textarea
                      name="address"
                      rows="4"
                      value={formData.address}
                      onChange={changeHandler}
                    />
                  </div>

                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={changeHandler}
                    />
                  </div>

                  <div className="form-group">
                    <label>State</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={changeHandler}
                    />
                  </div>
                </div>
              </section>

              <section className="details-card full-card">
                <div className="card-title">
                  <ShieldCheck size={18} />
                  <h3>Security Notice</h3>
                </div>

                <div className="info-note">
                  PAN number and account number are treated as sensitive fields.
                  Profile updates should be audited at the backend for admin
                  actions.
                </div>
              </section>
            </div>

            <div className="action-bar">
              <button
                type="button"
                className="secondary-btn"
                onClick={resetForm}
              >
                <RotateCcw size={16} />
                Reset
              </button>

              <button type="submit" className="primary-btn" disabled={updating}>
                <Save size={16} />
                {updating ? "Updating..." : "Save Changes"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ProfileManagement;
