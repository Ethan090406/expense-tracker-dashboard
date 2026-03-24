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

const Charts = ({ transactions }) => {

  const { pieData, lineData, barData, insight } = useMemo(() => {

    const categories = {};
    const monthlyIncome = {};
    const monthlyExpense = {};

    transactions.forEach((t) => {
      const month = new Date(t.date).toLocaleString('default', {
        month: 'short'
      });

      if (t.amount < 0) {
        categories[t.category] =
          (categories[t.category] || 0) + Math.abs(t.amount);
      }

      if (t.amount > 0) {
        monthlyIncome[month] = (monthlyIncome[month] || 0) + t.amount;
      } else {
        monthlyExpense[month] =
          (monthlyExpense[month] || 0) + Math.abs(t.amount);
      }
    });

    const months = [
      'Jan','Feb','Mar','Apr','May','Jun',
      'Jul','Aug','Sep','Oct','Nov','Dec'
    ];

    /* ================= PIE ================= */
    const pieData = {
      labels: Object.keys(categories),
      datasets: [
        {
          data: Object.values(categories),
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

    /* ================= LINE ================= */
    const lineData = {
      labels: months,
      datasets: [
        {
          label: "Expenses",
          data: months.map(m => monthlyExpense[m] || 0),
          borderColor: "#ef4444",
          backgroundColor: "rgba(239,68,68,0.2)",
          borderWidth: 3,
          tension: 0.45,
          pointRadius: 3,
          pointBackgroundColor: "#ef4444",
          fill: true
        }
      ]
    };

    /* ================= BAR ================= */
    const barData = {
      labels: months,
      datasets: [
        {
          label: "Income",
          data: months.map(m => monthlyIncome[m] || 0),
          backgroundColor: "#10b981",
          borderRadius: 6
        },
        {
          label: "Expense",
          data: months.map(m => monthlyExpense[m] || 0),
          backgroundColor: "#ef4444",
          borderRadius: 6
        }
      ]
    };

    /* ================= INSIGHT ================= */
    const values = months.map(m => monthlyExpense[m] || 0).filter(v => v > 0);

    let insight = "Add more data to see insights";

    if (values.length >= 2) {
      const last = values[values.length - 1];
      const prev = values[values.length - 2];

      const change = ((last - prev) / prev) * 100;

      insight =
        change > 0
          ? `📈 Spending increased by ${change.toFixed(1)}% this month`
          : `📉 Spending decreased by ${Math.abs(change).toFixed(1)}% this month`;
    }

    return { pieData, lineData, barData, insight };

  }, [transactions]);

  /* ================= OPTIONS ================= */

  const commonOptions = {
    maintainAspectRatio: false,
    animation: {
      duration: 1500,
      easing: "easeInOutQuart"
    },
    plugins: {
      legend: {
        labels: {
          color: "#e5e7eb"
        }
      },
      tooltip: {
        backgroundColor: "#1f2937",
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
            <h3>Spending Overview</h3>
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
            <h3>Income vs Expense</h3>
            <div className="chart-container">
              <Bar data={barData} options={commonOptions} />
            </div>
          </div>

        </div>

        {/* RIGHT */}
        <div className="card pie-card">
          <h3>Category Breakdown</h3>
          <div className="chart-container">
            <Pie
              data={pieData}
              options={{
                maintainAspectRatio: false,
                animation: {
                  animateRotate: true,
                  duration: 1400
                },
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