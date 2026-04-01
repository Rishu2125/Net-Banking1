import React from "react";
import { NavLink } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-blue-900 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              N
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-wide">
                Neo Bank
              </h1>
              <p className="text-xs text-slate-500">
                Personal Internet Banking
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <NavLink
              to="/login"
              className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition"
            >
              Login
            </NavLink>

            <NavLink
              to="/register"
              className="px-5 py-2.5 rounded-lg bg-blue-900 text-white font-medium hover:bg-blue-800 transition shadow-sm"
            >
              Register
            </NavLink>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
          {/* Left Section */}
          <div className="bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900 text-white p-10 md:p-14 flex flex-col justify-center">
            <p className="text-sm uppercase tracking-[0.25em] text-blue-200 mb-4">
              Secure Banking
            </p>

            <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              Banking made simple,
              <span className="block text-blue-200">safe and reliable.</span>
            </h2>

            <p className="text-blue-100 text-base leading-7 max-w-lg mb-8">
              Access your account securely, manage your finances, and enjoy a
              smooth digital banking experience with Neo Bank.
            </p>

            <div className="grid grid-cols-2 gap-4 max-w-md">
              <div className="bg-white/10 border border-white/10 rounded-2xl p-4">
                <p className="text-2xl font-bold">24×7</p>
                <p className="text-sm text-blue-100 mt-1">Online Access</p>
              </div>
              <div className="bg-white/10 border border-white/10 rounded-2xl p-4">
                <p className="text-2xl font-bold">Safe</p>
                <p className="text-sm text-blue-100 mt-1">Secure Login</p>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="p-10 md:p-14 flex flex-col justify-center bg-slate-50">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
              <p className="text-sm font-medium text-blue-900 mb-2">
                Welcome to Neo Bank
              </p>

              <h3 className="text-3xl font-bold text-slate-900 mb-3">
                Personal Net Banking
              </h3>

              <p className="text-slate-600 leading-7 mb-8">
                Login to continue banking securely or register to open your new
                account online.
              </p>

              <div className="flex flex-col gap-4">
                <NavLink
                  to="/login"
                  className="w-full text-center px-6 py-4 rounded-xl bg-blue-900 text-white font-semibold text-lg hover:bg-blue-800 transition shadow-md"
                >
                  Login to Account
                </NavLink>

                <NavLink
                  to="/register"
                  className="w-full text-center px-6 py-4 rounded-xl border border-slate-300 text-slate-800 font-semibold text-lg hover:bg-slate-50 transition"
                >
                  Open New Account
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 text-center py-4 text-sm text-slate-500">
        © 2026 Neo Bank. All rights reserved.
      </footer>
    </div>
  );
}

export default Home;
