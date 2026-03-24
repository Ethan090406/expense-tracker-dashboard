import React, { useState, useEffect, useContext } from "react";
import Header from "../components/Header";
import Card from "../components/Card";
import Charts from "../components/Charts";
import Transactions from "../components/Transactions";
import AddTransactionForm from "../components/AddTransactionForm";
import { AuthContext } from "../context/AuthContext";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);

  const [darkMode, setDarkMode] = useState(false);

  // 🔥 NEW: Month Filter State
  const [selectedMonth, setSelectedMonth] = useState("All");

  const months = [
    "All",
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec"
  ];

  /* ================= LOAD DATA ================= */
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem(`transactions_${user?.email}`);
    return saved
      ? JSON.parse(saved)
      : [
          {
            title: "Groceries",
            amount: -200,
            category: "Food",
            date: "2026-01-10"
          },
          {
            title: "Salary",
            amount: 3000,
            category: "Income",
            date: "2026-02-15"
          },
          {
            title: "Rent",
            amount: -1000,
            category: "Housing",
            date: "2026-03-05"
          }
        ];
  });

  /* ================= SAVE DATA ================= */
  useEffect(() => {
    if (user?.email) {
      localStorage.setItem(
        `transactions_${user.email}`,
        JSON.stringify(transactions)
      );
    }
  }, [transactions, user]);

  /* ================= ACTIONS ================= */
  const addTransaction = (t) => {
    setTransactions((prev) => [t, ...prev]);
  };

  const deleteTransaction = (index) => {
    setTransactions((prev) => prev.filter((_, i) => i !== index));
  };

  /* ================= FILTER LOGIC (🔥 MAIN FEATURE) ================= */

  const filteredTransactions =
    selectedMonth === "All"
      ? transactions
      : transactions.filter((t) => {
          const month = new Date(t.date).toLocaleString("default", {
            month: "short"
          });
          return month === selectedMonth;
        });

  /* ================= CALCULATIONS ================= */

  const income = filteredTransactions
    .filter((t) => t.amount > 0)
    .reduce((acc, t) => acc + t.amount, 0);

  const expense = filteredTransactions
    .filter((t) => t.amount < 0)
    .reduce((acc, t) => acc + Math.abs(t.amount), 0);

  const balance = income - expense;
  

  /* ================= MONTHLY DATA ================= */

  const monthlyData = Array(12).fill(0);
  const monthlyIncome = Array(12).fill(0);
  const monthlyExpense = Array(12).fill(0);

  filteredTransactions.forEach((t) => {
    const month = new Date(t.date).getMonth();

    if (t.amount > 0) {
      monthlyIncome[month] += t.amount;
    } else {
      monthlyExpense[month] += Math.abs(t.amount);
    }

    monthlyData[month] += Math.abs(t.amount);
  });

  /* ================= CATEGORY DATA ================= */

  const categoryData = {};

  filteredTransactions.forEach((t) => {
    if (t.amount < 0) {
      categoryData[t.category] =
        (categoryData[t.category] || 0) + Math.abs(t.amount);
    }
  });

  /* ================= REAL-TIME AUTO DATA ================= */

  useEffect(() => {
    const interval = setInterval(() => {
      const randomMonth = Math.floor(Math.random() * 12);

      const randomTx = {
        title: "Auto Tx",
        amount:
          Math.random() > 0.5
            ? 500 + Math.random() * 1000
            : -(200 + Math.random() * 800),
        category: ["Food", "Shopping", "Travel", "Bills"][
          Math.floor(Math.random() * 4)
        ],
        date: new Date(
          2026,
          randomMonth,
          Math.floor(Math.random() * 28) + 1
        ).toISOString()
      };

      setTransactions((prev) => [randomTx, ...prev]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  /* ================= UI ================= */

  return (
    <div className={`container ${darkMode ? "dark" : ""}`}>

      {/* HEADER */}
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />

      {/* USER BAR */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "15px"
        }}
      >
        <span>👋 {user?.email}</span>
        <button onClick={logout}>Logout</button>
      </div>

     <div className="filter-container">
  <label className="filter-label">📅 Filter by Month</label>

  <div className="custom-select-wrapper">
    <select
      value={selectedMonth}
      onChange={(e) => setSelectedMonth(e.target.value)}
      className="custom-select"
    >
      {months.map((m) => (
        <option key={m} value={m}>
          {m === "All" ? "All Months" : m}
        </option>
      ))}
    </select>

    <span className="select-arrow">▼</span>
  </div>
</div>

      {/* CARDS */}
      <div className="cards">
        <Card title="Income" amount={income} />
        <Card title="Expense" amount={expense} />
        <Card title="Balance" amount={balance} />
      </div>

      {/* MAIN CONTENT */}
      <div className="main-content">

        {/* CHARTS */}
        <Charts
          monthlyData={monthlyData}
          monthlyIncome={monthlyIncome}
          monthlyExpense={monthlyExpense}
          categoryData={categoryData}
        />

        {/* RIGHT SIDE */}
        <div>
          <AddTransactionForm addTransaction={addTransaction} />
          <Transactions
            transactions={filteredTransactions} // 🔥 important
            deleteTransaction={deleteTransaction}
          />
        </div>

      </div>
    </div>
  );
};

export default Dashboard;