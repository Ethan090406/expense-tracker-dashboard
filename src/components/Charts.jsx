import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  BarElement
} from 'chart.js';
import { Pie, Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  BarElement
);

const Charts = ({ monthlyData, monthlyIncome, monthlyExpense, categoryData }) => {

  const { pieData, lineData, barData, insight, months } = useMemo(() => {

    const months = [
      'Jan','Feb','Mar','Apr','May','Jun',
      'Jul','Aug','Sep','Oct','Nov','Dec'
    ];

    /* ================= PIE ================= */
    const pieData = {
      labels: Object.keys(categoryData),
      datasets: [
        {
          data: Object.values(categoryData),
          backgroundColor: [
            '#6366f1',
            '#f97316',
            '#10b981',
            '#facc15',
            '#ef4444'
          ],
          borderWidth: 0
        }
      ]
    };

    /* ================= LINE (EXPENSE TREND) ================= */
    const lineData = {
      labels: months,
      datasets: [
        {
          label: "Expenses",
          data: monthlyExpense,
          borderColor: "#ef4444",
          backgroundColor: "rgba(239,68,68,0.2)",
          borderWidth: 3,
          tension: 0.4,
          pointRadius: 2,
          fill: true
        }
      ]
    };

    /* ================= BAR (INCOME vs EXPENSE PER MONTH) ================= */
    const barData = {
      labels: months,
      datasets: [
        {
          label: "Income",
          data: monthlyIncome,
          backgroundColor: "#10b981",
          borderRadius: 6
        },
        {
          label: "Expense",
          data: monthlyExpense,
          backgroundColor: "#ef4444",
          borderRadius: 6
        }
      ]
    };

    /* ================= INSIGHTS ================= */
    const values = monthlyExpense.filter(v => v > 0);

    let insight = "Waiting for more activity...";

    if (values.length >= 2) {
      const last = values[values.length - 1];
      const prev = values[values.length - 2];

      if (prev !== 0) {
        const change = ((last - prev) / prev) * 100;

        insight =
          change > 0
            ? `📈 Spending increased by ${change.toFixed(1)}% recently`
            : `📉 Spending decreased by ${Math.abs(change).toFixed(1)}% recently`;
      }
    }

    return { pieData, lineData, barData, insight, months };

  }, [monthlyData, monthlyIncome, monthlyExpense, categoryData]);

  /* ================= OPTIONS ================= */

  const commonOptions = {
    maintainAspectRatio: false,
    responsive: true,
    animation: {
      duration: 800
    },
    plugins: {
      legend: {
        labels: {
          color: "#e5e7eb"
        }
      },
      tooltip: {
        backgroundColor: "#111827",
        titleColor: "#fff",
        bodyColor: "#e5e7eb",
        borderColor: "#374151",
        borderWidth: 1
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#9ca3af" }
      },
      y: {
        beginAtZero: true,
        grid: { color: "rgba(255,255,255,0.05)" },
        ticks: { color: "#9ca3af" }
      }
    }
  };

  return (
    <div className="dashboard">

      <div className="charts-grid">

        {/* LEFT */}
        <div className="left-charts">

          {/* LINE */}
          <div className="card">
            <h3>Spending Trend</h3>
            <div className="chart-container">
              <Line
                data={lineData}
                options={{
                  ...commonOptions,
                  plugins: { legend: { display: false } }
                }}
              />
            </div>
          </div>

          {/* BAR */}
          <div className="card">
            <h3>Monthly Income vs Expense</h3>
            <div className="chart-container">
              <Bar data={barData} options={commonOptions} />
            </div>
          </div>

        </div>

        {/* RIGHT */}
        <div className="card pie-card">
          <h3>Spending Categories</h3>
          <div className="chart-container">
            <Pie
              data={pieData}
              options={{
                maintainAspectRatio: false,
                animation: { duration: 800 },
                plugins: {
                  legend: {
                    labels: { color: "#e5e7eb" }
                  }
                }
              }}
            />
          </div>
        </div>

      </div>

      {/* INSIGHT */}
      <div className="card insight-card" style={{ marginTop: "20px" }}>
        <h3>Insights</h3>
        <p>{insight}</p>
      </div>

    </div>
  );
};

export default Charts;