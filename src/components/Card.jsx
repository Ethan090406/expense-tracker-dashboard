import React, { useEffect, useState } from "react";

const Card = ({ title, amount }) => {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 800;
    const increment = amount / (duration / 16);

    const counter = setInterval(() => {
      start += increment;
      if (start >= amount) {
        setDisplay(amount);
        clearInterval(counter);
      } else {
        setDisplay(start);
      }
    }, 16);

    return () => clearInterval(counter);
  }, [amount]);

  const isExpense = title === "Expense";

  return (
    <div className="card">
      <h3>{title}</h3>
      <h2 style={{ color: isExpense ? "#ef4444" : "#10b981" }}>
        ₹{Math.round(display).toLocaleString("en-IN")}
      </h2>
    </div>
  );
};

export default Card;