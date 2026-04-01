import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../UserCss/Transactions.css";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [page, setPage] = useState(0);
  const [size] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [isFilterMode, setIsFilterMode] = useState(false);

  const navigate = useNavigate();

  const userName = localStorage.getItem("name") || "Customer";
  const accountNumber = localStorage.getItem("accountNumber") || "";

  const maskAccountNumber = (acc) => {
    if (!acc) return "XXXXXX4589";
    const value = String(acc);
    return value.length > 4 ? `XXXXXX${value.slice(-4)}` : value;
  };

  const formatDateTime = (dateValue) => {
    if (!dateValue) return "-";
    return new Date(dateValue).toLocaleString();
  };

  const fetchTransactions = async (currentPage = 0) => {
    if (!accountNumber) {
      setError("You are not logged in.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        "http://localhost:8080/bank-statement/view",
        {
          params: {
            accountNumber,
            page: currentPage,
            size: size,
          },
        },
      );

      const pageData = response?.data?.data;
      const content = pageData?.content || [];

      setTransactions(content);
      setFilteredTransactions(content);
      setPage(pageData?.number ?? currentPage);
      setTotalPages(pageData?.totalPages ?? 0);
      setTotalElements(pageData?.totalElements ?? 0);
      setIsFilterMode(false);
    } catch (err) {
      setError("Failed to load transactions.");
      setTransactions([]);
      setFilteredTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const downloadStatement = async () => {
    if (!accountNumber) {
      setError("You are not logged in.");
      return;
    }

    if (!startDate || !endDate) {
      setError("Please select start date and end date.");
      return;
    }

    if (startDate > endDate) {
      setError("Start date cannot be after end date.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        "http://localhost:8080/bank-statement/generate",
        {
          params: {
            accountNumber,
            startDate,
            endDate,
          },
        },
      );

      const data = response?.data?.data || [];
      const statementData = Array.isArray(data) ? data : [];

      setFilteredTransactions(statementData);
      setTotalElements(statementData.length);
      setTotalPages(1);
      setPage(0);
      setIsFilterMode(true);
    } catch (err) {
      setError("Failed to generate statement.");
      setFilteredTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setStartDate("");
    setEndDate("");
    setError("");
    fetchTransactions(0);
  };

  const handlePrevious = () => {
    if (page > 0) {
      fetchTransactions(page - 1);
    }
  };

  const handleNext = () => {
    if (page < totalPages - 1) {
      fetchTransactions(page + 1);
    }
  };

  useEffect(() => {
    fetchTransactions(0);
  }, [accountNumber]);

  return (
    <div className="transactions-page">
      <header className="transactions-topbar">
        <div>
          <h1>Transaction History</h1>
          <p>
            View account activity, filter statements, and track all transfers
          </p>
        </div>

        <div className="topbar-right">
          <div className="user-chip">
            <span className="user-avatar">
              {userName.charAt(0).toUpperCase()}
            </span>
            <div>
              <h4>{userName}</h4>
              <p>{maskAccountNumber(accountNumber)}</p>
            </div>
          </div>

          <button
            className="dashboard-btn"
            onClick={() => navigate("/user-dashboard")}
          >
            ← Dashboard
          </button>
        </div>
      </header>

      <section className="transaction-summary">
        <div className="summary-card">
          <span>Total Records</span>
          <strong>{totalElements}</strong>
        </div>

        <div className="summary-card">
          <span>Account Number</span>
          <strong>{maskAccountNumber(accountNumber)}</strong>
        </div>

        <div className="summary-card">
          <span>Statement Type</span>
          <strong>{isFilterMode ? "Filtered" : "Complete"}</strong>
        </div>
      </section>

      <section className="filter-card">
        <div className="filter-header">
          <h2>Generate Statement</h2>
          <p>Select a date range to view specific transactions</p>
        </div>

        <div className="date-filter">
          <div className="input-group">
            <label>Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <button className="primary-btn" onClick={downloadStatement}>
            Generate Statement
          </button>

          <button className="secondary-btn" onClick={resetFilters}>
            Reset
          </button>
        </div>

        {error && <p className="error-text">{error}</p>}
      </section>

      <section className="table-card">
        <div className="table-header">
          <h2>Transactions</h2>
          <p>Complete record of credits, debits, and transfer activity</p>
        </div>

        {loading ? (
          <div className="table-state">
            <p>Loading transactions...</p>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="table-state">
            <p>No transactions found.</p>
          </div>
        ) : (
          <>
            <div className="table-wrapper">
              <table className="transactions-table">
                <thead>
                  <tr>
                    <th>Transaction ID</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Sender</th>
                    <th>Receiver</th>
                    <th>Status</th>
                    <th>Date & Time</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredTransactions.map((t) => {
                    const isDebit = t.senderAccountNumber === accountNumber;

                    return (
                      <tr key={t.transactionId}>
                        <td className="transaction-id">{t.transactionId}</td>
                        <td>{t.transactionType || "-"}</td>

                        <td className={isDebit ? "debit" : "credit"}>
                          {isDebit ? "- ₹" : "+ ₹"}
                          {t.amount}
                        </td>

                        <td>{maskAccountNumber(t.senderAccountNumber)}</td>
                        <td>{maskAccountNumber(t.receiverAccountNumber)}</td>

                        <td>
                          <span
                            className={`status-badge ${
                              t.status?.toLowerCase() === "success"
                                ? "status-success"
                                : t.status?.toLowerCase() === "failed"
                                  ? "status-failed"
                                  : "status-pending"
                            }`}
                          >
                            {t.status || "Pending"}
                          </span>
                        </td>

                        <td>{formatDateTime(t.createdAt)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {!isFilterMode && totalPages > 0 && (
              <div className="pagination">
                <button
                  className="page-btn"
                  onClick={handlePrevious}
                  disabled={page === 0}
                >
                  Previous
                </button>

                <span className="page-info">
                  Page {page + 1} of {totalPages}
                </span>

                <button
                  className="page-btn"
                  onClick={handleNext}
                  disabled={page === totalPages - 1}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}

export default Transactions;
