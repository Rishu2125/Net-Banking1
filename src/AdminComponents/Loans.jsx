import React from "react";
import { NavLink } from "react-router-dom";
import { FileText, Clock3, ArrowRight } from "lucide-react";
import "../AdminCss/Loans.css";

function Loans() {
  return (
    <div className="loans-page">
      <div className="loans-topbar">
        <div>
          <p className="loans-breadcrumb">Admin / Loans</p>
          <h1>Loan Management</h1>
          <p className="loans-subtitle">
            Monitor loan applications, approvals, and portfolio activity.
          </p>
        </div>

        <div className="portfolio-summary">
          <span className="summary-label">Portfolio Status</span>
          <h3>Stable</h3>
          <p>Track pending reviews and approved lending activity</p>
        </div>
      </div>

      <div className="loan-overview-grid">
        <div className="overview-card">
          <span className="overview-label">Loan Services</span>
          <h3>Administration Center</h3>
          <p>
            Access loan records, review pending applications, and manage
            customer lending workflows securely.
          </p>
        </div>

        <div className="mini-stat-card">
          <span className="mini-stat-title">Approval Workflow</span>
          <strong>Active</strong>
          <p>Pending applications require timely review</p>
        </div>

        <div className="mini-stat-card">
          <span className="mini-stat-title">Operations</span>
          <strong>2 Modules</strong>
          <p>Loans overview and approval management</p>
        </div>
      </div>

      <div className="loan-section">
        <div className="section-header">
          <div>
            <h2>Loan Services</h2>
            <p>Select a module to continue</p>
          </div>
        </div>

        <div className="loan-card-grid">
          <NavLink to="/all-loans" className="bank-loan-card">
            <div className="bank-card-top">
              <div className="bank-card-icon primary-icon">
                <FileText size={22} />
              </div>
              <span className="bank-card-badge">Portfolio</span>
            </div>

            <div className="bank-card-body">
              <h3>All Loans</h3>
              <p>
                View the complete list of customer loans, statuses, and lending
                records across the platform.
              </p>
            </div>

            <div className="bank-card-footer">
              <span>Open module</span>
              <ArrowRight size={18} />
            </div>
          </NavLink>

          <NavLink to="/pending-loans" className="bank-loan-card">
            <div className="bank-card-top">
              <div className="bank-card-icon warning-icon">
                <Clock3 size={22} />
              </div>
              <span className="bank-card-badge pending">Review</span>
            </div>

            <div className="bank-card-body">
              <h3>Pending Loans</h3>
              <p>
                Review newly submitted applications, verify details, and take
                approval or rejection actions.
              </p>
            </div>

            <div className="bank-card-footer">
              <span>Open module</span>
              <ArrowRight size={18} />
            </div>
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default Loans;
