import React from 'react';
import './Dashboard.css';
import jsPDF from 'jspdf';

function Dashboard({ incomeData, budgetData, onEdit }) {
  const categories = Object.values(budgetData.categories);
  const totalIncome = incomeData.totalIncome;
  const totalSpent = budgetData.totalSpent;
  const remaining = totalIncome - totalSpent;
  const budgetUtilization = totalIncome > 0 ? (totalSpent / totalIncome) * 100 : 0;

  const downloadPDF = () => {
    const doc = new jsPDF();
    let yPos = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const tableWidth = pageWidth - (2 * margin);
    const col1Width = tableWidth * 0.35; // Category
    const col2Width = tableWidth * 0.40; // Details
    const col3Width = tableWidth * 0.25; // Amount

    // Title
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text('Budget Management Report', margin, yPos);
    yPos += 15;

    // Date
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    const currentDate = new Date().toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    doc.text(`Generated on: ${currentDate}`, margin, yPos);
    yPos += 15;

    // Income Section
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Income', margin, yPos);
    yPos += 10;

    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.setFillColor(245, 247, 250);
    doc.rect(margin, yPos - 5, tableWidth, 8, 'F');
    
    doc.text('Category', margin + 5, yPos);
    doc.text('Details', margin + col1Width + 5, yPos);
    doc.text('Amount (₹)', margin + col1Width + col2Width + 5, yPos);
    yPos += 8;

    doc.setFont(undefined, 'normal');
    incomeData.incomes.forEach(income => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      doc.text('Income', margin + 5, yPos);
      doc.text(income.name || 'Monthly salary', margin + col1Width + 5, yPos);
      doc.text(income.amount.toFixed(2), margin + col1Width + col2Width + 5, yPos, { align: 'right' });
      yPos += 8;
    });
    yPos += 5;

    // Fixed Expenses Section
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Fixed Expenses', margin, yPos);
    yPos += 10;

    // Table Header
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.setFillColor(245, 247, 250);
    doc.rect(margin, yPos - 5, tableWidth, 8, 'F');
    doc.text('Category', margin + 5, yPos);
    doc.text('Details', margin + col1Width + 5, yPos);
    doc.text('Amount (₹)', margin + col1Width + col2Width + 5, yPos);
    yPos += 8;

    doc.setFont(undefined, 'normal');
    let totalFixedExpenses = 0;

    categories.forEach(category => {
      const categorySpent = category.total || 0;
      const hasSubcategories = category.subcategories && Object.keys(category.subcategories).length > 0;
      
      if (categorySpent > 0) {
        if (hasSubcategories) {
          // Category with subcategories
          Object.entries(category.subcategories).forEach(([subId, subData], subIndex) => {
            if (yPos > 270) {
              doc.addPage();
              yPos = 20;
            }
            const amount = subData.amount || 0;
            if (amount > 0) {
              doc.text(subIndex === 0 ? category.name : '', margin + 5, yPos);
              doc.text(subData.name || 'Unnamed', margin + col1Width + 5, yPos);
              doc.text(amount.toFixed(2), margin + col1Width + col2Width + 5, yPos, { align: 'right' });
              totalFixedExpenses += amount;
              yPos += 8;
            }
          });
        } else {
          // Category without subcategories
          if (yPos > 270) {
            doc.addPage();
            yPos = 20;
          }
          doc.text(category.name, margin + 5, yPos);
          doc.text('Monthly expense', margin + col1Width + 5, yPos);
          doc.text(categorySpent.toFixed(2), margin + col1Width + col2Width + 5, yPos, { align: 'right' });
          totalFixedExpenses += categorySpent;
          yPos += 8;
        }
      }
    });

    // Total Fixed Expenses
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
    }
    yPos += 5;
    doc.setFont(undefined, 'bold');
    doc.setFillColor(59, 130, 246);
    doc.setTextColor(255, 255, 255);
    doc.rect(margin, yPos - 5, tableWidth, 8, 'F');
    doc.text('Total Fixed Expenses', margin + 5, yPos);
    doc.text('', margin + col1Width + 5, yPos);
    doc.text(totalFixedExpenses.toFixed(2), margin + col1Width + col2Width + 5, yPos, { align: 'right' });
    doc.setTextColor(0, 0, 0);
    yPos += 12;

    // Remaining After Fixed Expenses
    const remainingAfterFixed = totalIncome - totalFixedExpenses;
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
    }
    doc.setFont(undefined, 'bold');
    doc.text('Remaining After Fixed Expenses', margin + 5, yPos);
    doc.text('', margin + col1Width + 5, yPos);
    doc.text(remainingAfterFixed.toFixed(2), margin + col1Width + col2Width + 5, yPos, { align: 'right' });
    yPos += 15;

    // Planned Purchases (if exists)
    const plannedPurchasesCategory = categories.find(cat => cat.name === 'Planned Purchases');
    if (plannedPurchasesCategory && plannedPurchasesCategory.total > 0) {
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text('Planned Purchases', margin, yPos);
      yPos += 10;

      doc.setFontSize(10);
      doc.setFont(undefined, 'bold');
      doc.setFillColor(245, 247, 250);
      doc.rect(margin, yPos - 5, tableWidth, 8, 'F');
      doc.text('Category', margin + 5, yPos);
      doc.text('Details', margin + col1Width + 5, yPos);
      doc.text('Amount (₹)', margin + col1Width + col2Width + 5, yPos);
      yPos += 8;

      doc.setFont(undefined, 'normal');
      let totalPlanned = 0;
      if (plannedPurchasesCategory.subcategories) {
        Object.entries(plannedPurchasesCategory.subcategories).forEach(([subId, subData], subIndex) => {
          if (yPos > 270) {
            doc.addPage();
            yPos = 20;
          }
          const amount = subData.amount || 0;
          if (amount > 0) {
            doc.text(subIndex === 0 ? 'Planned Purchases' : '', margin + 5, yPos);
            doc.text(subData.name || 'Unnamed', margin + col1Width + 5, yPos);
            doc.text(amount.toFixed(2), margin + col1Width + col2Width + 5, yPos, { align: 'right' });
            totalPlanned += amount;
            yPos += 8;
          }
        });
      }

      // Total Planned Purchases
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      yPos += 5;
      doc.setFont(undefined, 'bold');
      doc.setFillColor(59, 130, 246);
      doc.setTextColor(255, 255, 255);
      doc.rect(margin, yPos - 5, tableWidth, 8, 'F');
      doc.text('Total Planned Purchases', margin + 5, yPos);
      doc.text('', margin + col1Width + 5, yPos);
      doc.text(totalPlanned.toFixed(2), margin + col1Width + col2Width + 5, yPos, { align: 'right' });
      doc.setTextColor(0, 0, 0);
      yPos += 12;
    }

    // Final Balance
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
    }
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.setFillColor(16, 185, 129);
    doc.setTextColor(255, 255, 255);
    doc.rect(margin, yPos - 5, tableWidth, 10, 'F');
    doc.text('Final Balance', margin + 5, yPos + 3);
    doc.text('', margin + col1Width + 5, yPos + 3);
    doc.text(remaining.toFixed(2), margin + col1Width + col2Width + 5, yPos + 3, { align: 'right' });
    doc.setTextColor(0, 0, 0);

    // Save PDF
    const fileName = `Budget_Report_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Budget Dashboard</h2>
        <div className="dashboard-actions">
          <button className="download-btn" onClick={downloadPDF}>
            📥 Download PDF
          </button>
          <button className="edit-btn" onClick={onEdit}>
            Edit Budget
          </button>
        </div>
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
