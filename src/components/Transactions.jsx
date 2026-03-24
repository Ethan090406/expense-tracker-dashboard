import React from 'react';

const Transactions = ({ transactions, deleteTransaction }) => {
  return (
    <div className="transactions">
      <h3>Transactions</h3>
      {transactions.map((t, index) => (
        <div key={index} className="transaction-card">
          <p>{t.title} - ₹{t.amount}</p>
          <button onClick={() => deleteTransaction(index)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default Transactions;