import React, { useEffect, useState } from "react";

const Card = ({ title, amount }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1000; // animation time
    const increment = amount / (duration / 16);

    const counter = setInterval(() => {
      start += increment;
      if (start >= amount) {
        setDisplayValue(amount);
        clearInterval(counter);
      } else {
        setDisplayValue(start);
      }
    }, 16);

    return () => clearInterval(counter);
  }, [amount]);

  return (
    <div className="card">
      <h3>{title}</h3>
     <h2
  style={{
    color:
      title === "Income"
        ? "#10b981"
        : title === "Expense"
        ? "#ef4444"
        : "#6366f1"
  }}
>
  ₹{Math.round(displayValue).toLocaleString("en-IN")}
</h2>
    </div>
  );
};

export default Card;