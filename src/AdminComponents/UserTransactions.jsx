import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  ArrowDownLeft,
  ArrowUpRight,
  CircleAlert,
  CheckCircle2,
  Clock3,
  ReceiptText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import "../AdminCss/UserTransactions.css";

function UserTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTransactions(page);
  }, [page]);

  const fetchTransactions = async (pageNo) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:8080/admin/get-user-transaction?page=${pageNo}&size=${size}`,
      );

      setTransactions(res.data.data.content || []);
      setTotalPages(res.data.data.totalPages || 0);
      setError("");
    } catch (err) {
      setError("Failed to fetch transactions");
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTypeClass = (type) => {
    if (!type) return "";
    return type.toLowerCase() === "debit" ? "debit" : "credit";
  };

  const getStatusClass = (status) => {
    if (!status) return "pending";
    const value = status.toLowerCase();

    if (value === "success" || value === "completed") return "success";
    if (value === "failed" || value === "rejected") return "failed";
    return "pending";
  };

  const renderStatusIcon = (status) => {
    const value = status?.toLowerCase();

    if (value === "success" || value === "completed") {
      return <CheckCircle2 size={16} />;
    }
    if (value === "failed" || value === "rejected") {
      return <CircleAlert size={16} />;
    }
    return <Clock3 size={16} />;
  };

  return (
    <div className="transactions-page">
      <div className="transactions-card">
        <div className="transactions-header">
          <div className="transactions-title-wrap">
            <div className="transactions-icon-box">
              <ReceiptText size={28} />
            </div>
            <div>
              <h2>Transaction History</h2>
              <p>Review all customer transactions with status and details</p>
            </div>
          </div>
        </div>

        {error && <div className="transactions-error">{error}</div>}

        <div className="table-wrapper">
          <table className="transaction-table">
            <thead>
              <tr>
                <th>Txn ID</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Sender</th>
                <th>Receiver</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="empty-row">
                    Loading transactions...
                  </td>
                </tr>
              ) : transactions.length > 0 ? (
                transactions.map((txn) => (
                  <tr key={txn.transactionId}>
                    <td className="txn-id">{txn.transactionId}</td>

                    <td>
                      <span
                        className={`txn-type ${getTypeClass(
                          txn.transactionType,
                        )}`}
                      >
                        {txn.transactionType?.toLowerCase() === "debit" ? (
                          <ArrowUpRight size={16} />
                        ) : (
                          <ArrowDownLeft size={16} />
                        )}
                        {txn.transactionType?.toUpperCase()}
                      </span>
                    </td>

                    <td className="amount-cell">
                      {formatCurrency(txn.amount || 0)}
                    </td>

                    <td>{txn.senderAccountNumber || "-"}</td>
                    <td>{txn.receiverAccountNumber || "-"}</td>

                    <td>
                      <span
                        className={`status-badge ${getStatusClass(txn.status)}`}
                      >
                        {renderStatusIcon(txn.status)}
                        {txn.status || "Pending"}
                      </span>
                    </td>

                    <td>{txn.createdAt ? formatDate(txn.createdAt) : "-"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="empty-row">
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <button
            className="page-btn"
            disabled={page === 0}
            onClick={() => setPage(page - 1)}
          >
            <ChevronLeft size={18} />
            Prev
          </button>

          <div className="page-info">
            Page <span>{totalPages === 0 ? 0 : page + 1}</span> of{" "}
            <span>{totalPages}</span>
          </div>

          <button
            className="page-btn"
            disabled={page + 1 >= totalPages || totalPages === 0}
            onClick={() => setPage(page + 1)}
          >
            Next
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserTransactions;
