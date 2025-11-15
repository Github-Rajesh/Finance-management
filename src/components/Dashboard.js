import React from 'react';
import './Dashboard.css';

function Dashboard({ incomeData, budgetData, onEdit }) {
  const categories = Object.values(budgetData.categories);
  const totalIncome = incomeData.totalIncome;
  const totalSpent = budgetData.totalSpent;
  const remaining = totalIncome - totalSpent;
  const budgetUtilization = totalIncome > 0 ? (totalSpent / totalIncome) * 100 : 0;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Budget Dashboard</h2>
        <button className="edit-btn" onClick={onEdit}>
          Edit Budget
        </button>
      </div>

      {/* Overview Cards */}
      <div className="overview-cards">
        <div className="overview-card income">
          <div className="card-icon">💵</div>
          <div className="card-content">
            <h3>Total Income</h3>
            <p className="amount">₹{totalIncome.toFixed(2)}</p>
            <p className="subtext">{incomeData.numPeople} {incomeData.numPeople === 1 ? 'person' : 'people'}</p>
          </div>
        </div>

        <div className="overview-card spent">
          <div className="card-icon">💸</div>
          <div className="card-content">
            <h3>Total Spent</h3>
            <p className="amount">₹{totalSpent.toFixed(2)}</p>
            <p className="subtext">{budgetUtilization.toFixed(1)}% utilized</p>
          </div>
        </div>

        <div className="overview-card remaining">
          <div className="card-icon">💰</div>
          <div className="card-content">
            <h3>Remaining</h3>
            <p className={`amount ${remaining < 0 ? 'negative' : ''}`}>
              ₹{remaining.toFixed(2)}
            </p>
            <p className="subtext">{remaining >= 0 ? 'Available' : 'Over budget'}</p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-section">
        <h3>Overall Budget Utilization</h3>
        <div className="progress-bar-container">
          <div 
            className="progress-bar" 
            style={{ width: `${Math.min(budgetUtilization, 100)}%` }}
          >
            <span>{budgetUtilization.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="categories-section">
        <h3>Category Breakdown</h3>
        <div className="categories-grid">
          {categories.map((category, index) => {
            const categorySpent = category.total || 0;
            const percentage = totalIncome > 0 ? (categorySpent / totalIncome) * 100 : 0;
            const hasSubcategories = category.subcategories && Object.keys(category.subcategories).length > 0;

            return (
              <div key={index} className="category-dashboard-card">
                <div className="category-dashboard-header">
                  <div>
                    <h4>{category.name}</h4>
                  </div>
                </div>

                <div className="category-stats">
                  {!hasSubcategories && (
                    <div className="stat-item">
                      <span className="stat-label">Amount:</span>
                      <span className="stat-value">₹{category.main?.toFixed(2) || '0.00'}</span>
                    </div>
                  )}
                  {hasSubcategories && (
                    <div className="stat-item">
                      <span className="stat-label">Subcategories:</span>
                      <span className="stat-value">₹{categorySpent.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="stat-item highlight-stat">
                    <span className="stat-label">Total:</span>
                    <span className="stat-value">₹{categorySpent.toFixed(2)}</span>
                  </div>
                </div>

                {hasSubcategories && (
                  <div className="subcategories-list">
                    <h5>Subcategories:</h5>
                    {Object.entries(category.subcategories).map(([subId, subData]) => (
                      <div key={subId} className="subcategory-item">
                        <span className="subcategory-name">{subData.name || 'Unnamed'}</span>
                        <span className="subcategory-amount">₹{subData.amount?.toFixed(2) || '0.00'}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="category-progress">
                  <div className="progress-info">
                    <span>Spent: {percentage.toFixed(1)}% of income</span>
                  </div>
                  <div className="progress-bars">
                    <div 
                      className="progress-bar-spent" 
                      style={{ 
                        width: `${Math.min(percentage, 100)}%`,
                        backgroundColor: '#3b82f6'
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Income Breakdown */}
      <div className="income-breakdown">
        <h3>Income Sources</h3>
        <div className="income-list">
          {incomeData.incomes.map((income, index) => (
            <div key={index} className="income-item-dashboard">
              <span className="income-name">{income.name}</span>
              <span className="income-amount">₹{income.amount.toFixed(2)}</span>
              <span className="income-percentage">
                {((income.amount / totalIncome) * 100).toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
