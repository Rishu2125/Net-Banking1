import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../UserCss/Analytics.css";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function Analytics() {
  const [debit, setDebit] = useState(0);
  const [credit, setCredit] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const accountNumber = localStorage.getItem("accountNumber");

        if (!accountNumber) {
          setError("Account not found. Please login again.");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `http://localhost:8080/bank-statement/monthly-analytics/${accountNumber}`,
        );

        const analyticsData = response.data?.data;

        setDebit(analyticsData?.totalDebit || 0);
        setCredit(analyticsData?.totalCredit || 0);
      } catch (err) {
        console.error(err);
        setError(
          "Unable to fetch analytics right now. Please try again later.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatCurrency = (amount) => {
    return Number(amount || 0).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    });
  };

  const data = [
    { name: "Debit", value: debit },
    { name: "Credit", value: credit },
  ];

  const totalFlow = debit + credit;
  const netBalanceFlow = credit - debit;

  const COLORS = ["#e74c3c", "#2ecc71"];

  if (loading) {
    return (
      <div className="analytics-page">
        <div className="analytics-topbar">
          <div>
            <h2>Spending Analytics</h2>
            <p>Track your monthly debit and credit activity</p>
          </div>

          <button
            className="back-btn"
            onClick={() => navigate("/user-dashboard")}
          >
            ← Back to Dashboard
          </button>
        </div>

        <div className="analytics-loading">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="analytics-page">
      {/* Top Header */}
      <div className="analytics-topbar">
        <div>
          <h2>Spending Analytics</h2>
          <p>Track your monthly debit and credit activity</p>
        </div>

        <button
          className="back-btn"
          onClick={() => navigate("/user-dashboard")}
        >
          ← Back to Dashboard
        </button>
      </div>

      {error && <div className="analytics-error">{error}</div>}

      {/* Summary Cards */}
      <div className="analytics-cards">
        <div className="analytics-card debit-card">
          <span className="card-label">Total Debit</span>
          <h3>{formatCurrency(debit)}</h3>
          <p>Money spent this month</p>
        </div>

        <div className="analytics-card credit-card">
          <span className="card-label">Total Credit</span>
          <h3>{formatCurrency(credit)}</h3>
          <p>Money received this month</p>
        </div>

        <div className="analytics-card neutral-card">
          <span className="card-label">Net Flow</span>
          <h3>{formatCurrency(netBalanceFlow)}</h3>
          <p>
            {netBalanceFlow >= 0 ? "Positive cash flow" : "Negative cash flow"}
          </p>
        </div>
      </div>

      {/* Chart + Insights */}
      <div className="analytics-content">
        <div className="chart-section">
          <h3>Transaction Distribution</h3>

          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  outerRadius={110}
                  innerRadius={60}
                  dataKey="value"
                  paddingAngle={4}
                >
                  {data.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>

                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="insights-section">
          <h3>Monthly Insights</h3>

          <div className="insight-box">
            <p>
              <strong>Total Transaction Flow:</strong>{" "}
              {formatCurrency(totalFlow)}
            </p>
            <p>
              <strong>Debit Share:</strong>{" "}
              {totalFlow > 0 ? ((debit / totalFlow) * 100).toFixed(1) : 0}%
            </p>
            <p>
              <strong>Credit Share:</strong>{" "}
              {totalFlow > 0 ? ((credit / totalFlow) * 100).toFixed(1) : 0}%
            </p>
            <p>
              <strong>Status:</strong>{" "}
              {credit >= debit
                ? "Healthy monthly balance trend"
                : "Higher spending than income"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
