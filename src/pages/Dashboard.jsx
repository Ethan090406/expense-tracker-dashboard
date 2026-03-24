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
            date: "2026-03-01"
          },
          {
            title: "Salary",
            amount: 3000,
            category: "Income",
            date: "2026-03-01"
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

  /* ================= CALCULATIONS ================= */
  const income = transactions
    .filter((t) => t.amount > 0)
    .reduce((acc, t) => acc + t.amount, 0);

  const expense = transactions
    .filter((t) => t.amount < 0)
    .reduce((acc, t) => acc + Math.abs(t.amount), 0);

  const balance = income - expense;

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

      {/* CARDS */}
      <div className="cards">
        <Card title="Income" amount={income} />
        <Card title="Expense" amount={expense} />
        <Card title="Balance" amount={balance} />
      </div>

      {/* MAIN CONTENT */}
      <div className="main-content">

        {/* CHARTS */}
        <Charts transactions={transactions} />

        {/* RIGHT SIDE */}
        <div>
          <AddTransactionForm addTransaction={addTransaction} />
          <Transactions
            transactions={transactions}
            deleteTransaction={deleteTransaction}
          />
        </div>

      </div>
    </div>
  );
};

export default Dashboard;