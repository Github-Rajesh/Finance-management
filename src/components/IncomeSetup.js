import React, { useState } from 'react';
import './IncomeSetup.css';

function IncomeSetup({ onSubmit }) {
  const [numPeople, setNumPeople] = useState('');
  const [incomes, setIncomes] = useState([{ name: '', amount: '' }]);

  const handleNumPeopleChange = (e) => {
    const value = e.target.value;
    setNumPeople(value);
    
    const count = parseInt(value) || 0;
    if (count > 0) {
      const newIncomes = [];
      for (let i = 0; i < count; i++) {
        if (incomes[i]) {
          newIncomes.push(incomes[i]);
        } else {
          newIncomes.push({ name: '', amount: '' });
        }
      }
      setIncomes(newIncomes);
    } else {
      setIncomes([{ name: '', amount: '' }]);
    }
  };

  const handleIncomeChange = (index, field, value) => {
    const newIncomes = [...incomes];
    newIncomes[index] = { ...newIncomes[index], [field]: value };
    setIncomes(newIncomes);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const peopleCount = parseInt(numPeople) || 0;
    
    if (peopleCount <= 0) {
      alert('Please enter a valid number of people.');
      return;
    }

    const totalIncome = incomes.reduce((sum, income) => {
      return sum + (parseFloat(income.amount) || 0);
    }, 0);

    if (totalIncome <= 0) {
      alert('Please enter at least one valid income amount.');
      return;
    }

    onSubmit({
      numPeople: peopleCount,
      incomes: incomes.map(inc => ({
        name: inc.name || `Person ${incomes.indexOf(inc) + 1}`,
        amount: parseFloat(inc.amount) || 0
      })),
      totalIncome
    });
  };

  const totalIncome = incomes.reduce((sum, income) => sum + (parseFloat(income.amount) || 0), 0);
  const validIncomes = incomes.filter(inc => parseFloat(inc.amount) > 0);

  // Calculate pie chart data
  const pieData = validIncomes.map((income, index) => {
    const amount = parseFloat(income.amount) || 0;
    const percentage = totalIncome > 0 ? (amount / totalIncome) * 100 : 0;
    return {
      name: income.name || `Person ${index + 1}`,
      amount,
      percentage,
      color: `hsl(${(index * 360) / Math.max(validIncomes.length, 1)}, 70%, 60%)`
    };
  });

  // Calculate pie chart paths
  const radius = 120;
  const centerX = 150;
  const centerY = 150;
  let currentAngle = -90; // Start from top

  const piePaths = pieData.map((item, index) => {
    const angle = (item.percentage / 100) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    
    const x1 = centerX + radius * Math.cos((startAngle * Math.PI) / 180);
    const y1 = centerY + radius * Math.sin((startAngle * Math.PI) / 180);
    const x2 = centerX + radius * Math.cos((endAngle * Math.PI) / 180);
    const y2 = centerY + radius * Math.sin((endAngle * Math.PI) / 180);
    
    const largeArcFlag = angle > 180 ? 1 : 0;
    
    const pathData = [
      `M ${centerX} ${centerY}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      'Z'
    ].join(' ');
    
    currentAngle = endAngle;
    
    return {
      ...item,
      path: pathData,
      index
    };
  });

  return (
    <div className="income-setup">
      <div className="income-container">
        <div className="income-form-section">
          <div className="card">
            <h2>Set Up Income</h2>
            <p className="subtitle">Enter the number of people contributing to the household income</p>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="numPeople">Number of People:</label>
                <input
                  type="number"
                  id="numPeople"
                  min="1"
                  max="10"
                  value={numPeople}
                  onChange={handleNumPeopleChange}
                  placeholder="Enter number"
                  required
                />
              </div>

              <div className="incomes-list">
                <h3>Income Details</h3>
                {incomes.map((income, index) => (
                  <div key={index} className="income-item">
                    <div className="form-group">
                      <label htmlFor={`name-${index}`}>Name:</label>
                      <input
                        type="text"
                        id={`name-${index}`}
                        value={income.name}
                        onChange={(e) => handleIncomeChange(index, 'name', e.target.value)}
                        placeholder="Enter name"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor={`amount-${index}`}>Monthly Income (₹):</label>
                      <input
                        type="number"
                        id={`amount-${index}`}
                        min="0"
                        step="0.01"
                        value={income.amount}
                        onChange={(e) => handleIncomeChange(index, 'amount', e.target.value)}
                        placeholder="0.00"
                        required
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="total-income">
                <strong>Total Monthly Income: ₹{totalIncome.toFixed(2)}</strong>
              </div>

              <button type="submit" className="submit-btn">
                Continue to Budget Setup
              </button>
            </form>
          </div>
        </div>

        <div className="income-chart-section">
          <div className="chart-card">
            <h3>Income Distribution</h3>
            {totalIncome > 0 ? (
              <div className="pie-chart-container">
                <svg width="300" height="300" viewBox="0 0 300 300" className="pie-chart">
                  {piePaths.map((item, index) => (
                    <g key={index}>
                      <path
                        d={item.path}
                        fill={item.color}
                        stroke="#fff"
                        strokeWidth="2"
                        className="pie-segment"
                        style={{ cursor: 'pointer' }}
                        onMouseEnter={(e) => {
                          e.target.style.opacity = '0.8';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.opacity = '1';
                        }}
                      />
                    </g>
                  ))}
                  <circle cx={centerX} cy={centerY} r="60" fill="white" />
                  <text x={centerX} y={centerY - 10} textAnchor="middle" className="chart-total-label">
                    Total
                  </text>
                  <text x={centerX} y={centerY + 15} textAnchor="middle" className="chart-total-amount">
                    ₹{totalIncome.toFixed(0)}
                  </text>
                </svg>
                <div className="chart-legend">
                  {pieData.map((item, index) => (
                    <div key={index} className="legend-item">
                      <div 
                        className="legend-color" 
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <div className="legend-text">
                        <span className="legend-name">{item.name}</span>
                        <span className="legend-amount">₹{item.amount.toFixed(2)} ({item.percentage.toFixed(1)}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="chart-placeholder">
                <p>Enter income details to see the distribution chart</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default IncomeSetup;
