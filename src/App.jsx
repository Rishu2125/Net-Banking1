import "./App.css";
import Register from "./UserComponents/Register";
import Login from "./UserComponents/Login";
import Home from "./AppComponent/Home";
import Profile from "./UserComponents/Profile";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserDashboard from "./UserComponents/UserDashboard";
import AdminDashboard from "./AdminComponents/AdminDashboard";
import CheckBalance from "./UserComponents/CheckBalance";
import Transfer from "./UserComponents/Transfer";
import Transactions from "./UserComponents/Transactions";
import ResetPin from "./UserComponents/ResetPin";
import FixedDeposit from "./UserComponents/FixedDeposit";
import FdwithDraw from "./UserComponents/FdwithDraw";
import Analytics from "./UserComponents/Analytics";

import ApplyLoan from "./UserComponents/ApplyLoan";
import Loans from "./AdminComponents/Loans";
import Users from "./AdminComponents/Users";
import UserBalance from "./AdminComponents/UserBalanceEnquiry";
import PendingLoans from "./AdminComponents/PendingLoans";
import AllLoans from "./AdminComponents/AllLoans";
import PayEmi from "./UserComponents/payEmi";
import ActiveLoans from "./UserComponents/ActiveLoans";
import UserTransactions from "./AdminComponents/UserTransactions";
import ProfileManagement from "./AdminComponents/ProfileManagement";
import FixedDepositPage from "./UserComponents/FixedDepositPage";

import UserFDList from "./UserComponents/UserFdList";

import LoanPage from "./UserComponents/LoanPage";
import UserLoanHistory from "./UserComponents/UserLoanHistory";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/check-balance" element={<CheckBalance />} />
        <Route path="/transfer" element={<Transfer />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/reset-pin" element={<ResetPin />} />
        <Route path="/create-fd" element={<FixedDeposit />} />
        <Route path="/withdraw-fd" element={<FdwithDraw />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/user-loan" element={<LoanPage />} />
        <Route path="/apply-loan" element={<ApplyLoan />} />
        <Route path="/loans" element={<Loans />} />
        <Route path="/all-users" element={<Users />} />
        <Route path="/user-balance" element={<UserBalance />} />
        <Route path="/pending-loans" element={<PendingLoans />} />
        <Route path="/all-loans" element={<AllLoans />} />
        <Route path="/pay-emi/:ref/:amount" element={<PayEmi />} />
        <Route path="/active-loans" element={<ActiveLoans />} />
        <Route path="/all-transactions" element={<UserTransactions />} />
        <Route path="/profile-management" element={<ProfileManagement />} />
        <Route path="/fixed-deposit-page" element={<FixedDepositPage />} />
        <Route path="/get-user-fd" element={<UserFDList />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        //==================================================================
        //user
        <Route path="/user-loan-history" element={<UserLoanHistory />} />
      </Routes>
    </Router>
  );
}

export default App;
