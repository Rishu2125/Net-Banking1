import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "../AdminCss/AllLoans.css";

function AllLoans() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8080/admin/get-all-loans");
      setLoans(res.data?.data || []);
    } catch (err) {
      console.log(err);
      setLoans([]);
    } finally {
      setLoading(false);
    }
  };

  const approveLoan = async (ref) => {
    try {
      await axios.post(`http://localhost:8080/admin/approve-loan/${ref}`);
      fetchLoans();
    } catch (err) {
      console.log(err);
    }
  };

  const stats = useMemo(() => {
    const total = loans.length;
    const pending = loans.filter((loan) => loan.status === "PENDING").length;
    const approved = loans.filter((loan) => loan.status === "APPROVED").length;

    const totalAmount = loans.reduce(
      (sum, loan) => sum + Number(loan.loanAmount || 0),
      0,
    );

    return { total, pending, approved, totalAmount };
  }, [loans]);

  const formatCurrency = (amount) => {
    return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
  };

  return (
    <div className="all-loans-page">
      <div className="all-loans-header">
        <div>
          <p className="page-path">Admin / Loans / All Loans</p>
          <h1>Loan Portfolio</h1>
          <p className="page-subtitle">
            View, monitor, and manage all customer loan accounts from a single
            dashboard.
          </p>
        </div>

        <div className="header-chip">
          <span>Live Portfolio</span>
        </div>
      </div>

      <div className="loan-stats-grid">
        <div className="loan-stat-card">
          <p>Total Loans</p>
          <h3>{stats.total}</h3>
        </div>

        <div className="loan-stat-card">
          <p>Pending Approval</p>
          <h3>{stats.pending}</h3>
        </div>

        <div className="loan-stat-card">
          <p>Approved Loans</p>
          <h3>{stats.approved}</h3>
        </div>

        <div className="loan-stat-card amount-card">
          <p>Total Portfolio Amount</p>
          <h3>{formatCurrency(stats.totalAmount)}</h3>
        </div>
      </div>

      <div className="loan-table-section">
        <div className="section-top">
          <div>
            <h2>All Loan Records</h2>
            <p>Detailed list of all customer loan applications and statuses</p>
          </div>
        </div>

        <div className="loan-table-wrapper">
          {loading ? (
            <div className="table-message">Loading loans...</div>
          ) : loans.length === 0 ? (
            <div className="table-message">No loan records found.</div>
          ) : (
            <table className="bank-loan-table">
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
                      <span
                        className={`status-badge ${String(
                          loan.status || "",
                        ).toLowerCase()}`}
                      >
                        {loan.status}
                      </span>
                    </td>

                    <td>{loan.approvedDate || "-"}</td>

                    <td>{loan.nextEmiDate || "-"}</td>

                    <td>{loan.endDate || "-"}</td>

                    <td>
                      {loan.status === "PENDING" ? (
                        <button
                          className="approve-btn"
                          onClick={() => approveLoan(loan.loanRefrenceNumber)}
                        >
                          Approve
                        </button>
                      ) : (
                        <span className="done-text">Completed</span>
                      )}
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

export default AllLoans;
