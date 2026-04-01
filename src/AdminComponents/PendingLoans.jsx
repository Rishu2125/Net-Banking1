import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "../AdminCss/PendingLoans.css";

function PendingLoans() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approvingRef, setApprovingRef] = useState("");

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "http://localhost:8080/admin/all-pending-loans",
      );
      setLoans(res.data?.data || []);
    } catch (err) {
      console.log(err);
      setLoans([]);
    } finally {
      setLoading(false);
    }
  };

  const approveLoan = async (loanRef) => {
    try {
      setApprovingRef(loanRef);
      await axios.put(`http://localhost:8080/admin/approve-loan/${loanRef}`);
      setLoans((prev) =>
        prev.filter((loan) => loan.loanRefrenceNumber !== loanRef),
      );
    } catch (err) {
      console.error(err);
      alert("Failed to approve loan.");
    } finally {
      setApprovingRef("");
    }
  };

  const stats = useMemo(() => {
    const totalPending = loans.length;

    const totalPendingAmount = loans.reduce(
      (sum, loan) => sum + Number(loan.loanAmount || 0),
      0,
    );

    const avgEmi =
      totalPending > 0
        ? loans.reduce((sum, loan) => sum + Number(loan.emi || 0), 0) /
          totalPending
        : 0;

    return {
      totalPending,
      totalPendingAmount,
      avgEmi,
    };
  }, [loans]);

  const formatCurrency = (amount) => {
    return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
  };

  return (
    <div className="pending-loans-page">
      <div className="pending-header">
        <div>
          <p className="page-path">Admin / Loans / Pending Loans</p>
          <h1>Pending Loan Approvals</h1>
          <p className="page-subtitle">
            Review submitted applications, verify customer loan details, and
            approve eligible requests.
          </p>
        </div>

        <div className="header-status-card">
          <span className="status-label">Approval Queue</span>
          <h3>{stats.totalPending}</h3>
          <p>Applications awaiting action</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <p>Total Pending Loans</p>
          <h3>{stats.totalPending}</h3>
        </div>

        <div className="stat-card">
          <p>Total Pending Amount</p>
          <h3>{formatCurrency(stats.totalPendingAmount)}</h3>
        </div>

        <div className="stat-card">
          <p>Average EMI</p>
          <h3>{formatCurrency(stats.avgEmi.toFixed(0))}</h3>
        </div>
      </div>

      <div className="pending-table-section">
        <div className="section-top">
          <div>
            <h2>Applications Under Review</h2>
            <p>Approve loan requests from the pending review queue</p>
          </div>
        </div>

        <div className="pending-table-wrapper">
          {loading ? (
            <div className="table-message">Loading pending loans...</div>
          ) : loans.length === 0 ? (
            <div className="table-message empty-state">
              <div className="empty-icon">✓</div>
              <h3>No pending loans found</h3>
              <p>All loan applications have been reviewed.</p>
            </div>
          ) : (
            <table className="pending-loan-table">
              <thead>
                <tr>
                  <th>Ref No.</th>
                  <th>Customer</th>
                  <th>Email</th>
                  <th>Loan Type</th>
                  <th>Amount</th>
                  <th>Interest</th>
                  <th>Duration</th>
                  <th>EMI</th>
                  <th>Total Payable</th>
                  <th>Total Paid</th>
                  <th>Status</th>
                  <th>Approved Date</th>
                  <th>Next EMI</th>
                  <th>End Date</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {loans.map((loan) => (
                  <tr key={loan.loanId}>
                    <td className="ref-cell">{loan.loanRefrenceNumber}</td>

                    <td>
                      <div className="customer-cell">
                        <div className="customer-avatar">
                          {loan.user?.firstName?.charAt(0) || "U"}
                        </div>
                        <div>
                          <div className="customer-name">
                            {loan.user?.firstName} {loan.user?.lastName}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="email-cell">{loan.user?.emailId}</td>
                    <td>{loan.loanType}</td>
                    <td>{formatCurrency(loan.loanAmount)}</td>
                    <td>{loan.intrestrate}%</td>
                    <td>{loan.duration} M</td>
                    <td>{formatCurrency(loan.emi)}</td>
                    <td>{formatCurrency(loan.totalPayableAmount)}</td>
                    <td>{formatCurrency(loan.totalPaidAmount)}</td>

                    <td>
                      <span className="status-badge pending">
                        {loan.status}
                      </span>
                    </td>

                    <td>{loan.approvedDate || "-"}</td>
                    <td>{loan.nextEmiDate || "-"}</td>
                    <td>{loan.endDate || "-"}</td>

                    <td>
                      <button
                        className="approve-btn"
                        onClick={() => approveLoan(loan.loanRefrenceNumber)}
                        disabled={approvingRef === loan.loanRefrenceNumber}
                      >
                        {approvingRef === loan.loanRefrenceNumber
                          ? "Approving..."
                          : "Approve"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default PendingLoans;
