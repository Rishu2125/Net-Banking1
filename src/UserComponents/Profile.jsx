import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../UserCss/Profile.css";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const emailId = localStorage.getItem("emailId");

      if (!emailId) {
        setError("Session expired. Please login again.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:8080/api/user/profile",
          {
            params: { emailId },
          },
        );

        setProfile(response?.data?.data || null);
      } catch (err) {
        setError("Unable to load profile details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const goBack = () => {
    navigate("/user-dashboard");
  };

  const getFullName = () => {
    if (!profile) return "Customer";
    return [profile.firstName, profile.middleName, profile.lastName]
      .filter(Boolean)
      .join(" ");
  };

  const maskAccountNumber = (accountNumber) => {
    if (!accountNumber) return "—";
    const acc = String(accountNumber);
    return acc.length > 4 ? `XXXXXX${acc.slice(-4)}` : acc;
  };

  const maskPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return "—";
    const phone = String(phoneNumber);
    return phone.length >= 10
      ? `${phone.slice(0, 2)}XXXXXX${phone.slice(-2)}`
      : phone;
  };

  if (loading) {
    return (
      <div className="profile-page-state">
        <div className="profile-loader-card">
          <div className="loader-spinner"></div>
          <h2>Loading Profile</h2>
          <p>Please wait while we fetch your account details.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-page-state">
        <div className="profile-error-card">
          <h2>Unable to Load Profile</h2>
          <p>{error}</p>
          <button onClick={() => navigate("/login")} className="primary-btn">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      {/* Top Header */}
      <header className="profile-topbar">
        <div>
          <h1>My Profile</h1>
          <p>View your personal details and account information securely</p>
        </div>

        <div className="topbar-right">
          <button className="secondary-btn" onClick={goBack}>
            Back to Dashboard
          </button>
        </div>
      </header>

      {/* Profile Summary */}
      <section className="profile-summary-card">
        <div className="summary-left">
          <div className="summary-avatar">
            {profile?.firstName?.charAt(0)?.toUpperCase() || "C"}
          </div>

          <div>
            <h2>{getFullName()}</h2>
            <p>{profile?.emailId || "—"}</p>
            <span className="profile-tag">Savings Account Holder</span>
          </div>
        </div>

        <div className="summary-right">
          <div className="summary-box">
            <span>Account Number</span>
            <strong>{maskAccountNumber(profile?.accountNumber)}</strong>
          </div>

          <div className="summary-box">
            <span>Registered Mobile</span>
            <strong>{maskPhoneNumber(profile?.phoneNumber)}</strong>
          </div>

          <div className="summary-box">
            <span>Branch Status</span>
            <strong>Active</strong>
          </div>
        </div>
      </section>

      {/* Main Profile Content */}
      <div className="profile-content-grid">
        {/* Personal Information */}
        <section className="profile-card">
          <div className="card-header">
            <h3>Personal Information</h3>
            <p>Your identity details as registered with the bank</p>
          </div>

          <div className="details-grid">
            <ProfileItem label="First Name" value={profile?.firstName} />
            <ProfileItem label="Middle Name" value={profile?.middleName} />
            <ProfileItem label="Last Name" value={profile?.lastName} />
            <ProfileItem label="Gender" value={profile?.gender} />
            <ProfileItem label="Email ID" value={profile?.emailId} />
            <ProfileItem
              label="Phone Number"
              value={maskPhoneNumber(profile?.phoneNumber)}
            />
            <ProfileItem
              label="Alternate Phone"
              value={maskPhoneNumber(profile?.alternatePhoneNumber)}
            />
          </div>
        </section>

        {/* Account Information */}
        <section className="profile-card">
          <div className="card-header">
            <h3>Account Information</h3>
            <p>Your account and service details</p>
          </div>

          <div className="details-grid">
            <ProfileItem
              label="Account Number"
              value={maskAccountNumber(profile?.accountNumber)}
            />
            <ProfileItem label="Customer Name" value={getFullName()} />
            <ProfileItem label="Account Type" value="Savings Account" />
            <ProfileItem label="KYC Status" value="Verified" />
            <ProfileItem label="Internet Banking" value="Enabled" />
            <ProfileItem label="Profile Status" value="Active" />
          </div>
        </section>

        {/* Address Details */}
        <section className="profile-card full-width">
          <div className="card-header">
            <h3>Communication Address</h3>
            <p>Your registered address for bank communication</p>
          </div>

          <div className="details-grid">
            <ProfileItem label="City" value={profile?.city} />
            <ProfileItem label="State" value={profile?.state} />
          </div>

          <div className="address-block">
            <label>Full Address</label>
            <p>{profile?.address || "—"}</p>
          </div>
        </section>

        {/* Service Actions */}
        <section className="profile-card full-width">
          <div className="card-header">
            <h3>Profile Services</h3>
            <p>Quick actions related to your profile and account</p>
          </div>

          <div className="action-grid">
            <button className="service-action primary-action">
              Update Contact Details
            </button>
            <button className="service-action">Request Address Change</button>
            <button className="service-action">Download KYC Copy</button>
            <button className="service-action">Update PAN / Aadhaar</button>
          </div>
        </section>
      </div>
    </div>
  );
}

function ProfileItem({ label, value }) {
  return (
    <div className="profile-item">
      <span className="profile-label">{label}</span>
      <p className="profile-value">{value || "—"}</p>
    </div>
  );
}

export default Profile;
