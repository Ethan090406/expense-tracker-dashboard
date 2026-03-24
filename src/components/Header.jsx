import React from 'react';

const Header = ({ darkMode, setDarkMode }) => {
  return (
    <header>
      <h1>Smart Expense Dashboard</h1>
      <button
        onClick={() => setDarkMode(!darkMode)}
        style={{
          padding: '8px 16px',
          borderRadius: '6px',
          border: 'none',
          cursor: 'pointer',
          backgroundColor: darkMode ? '#f4f4f9' : '#4f46e5',
          color: darkMode ? '#1f1f1f' : '#fff',
          transition: 'all 0.3s',
        }}
      >
        {darkMode ? 'Light Mode' : 'Dark Mode'}
      </button>
    </header>
  );
};

export default Header;