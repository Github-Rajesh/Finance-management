import React, { useState } from 'react';
import './BudgetInput.css';

const BUDGET_CATEGORIES = [
  { id: 'rent_family', name: 'Rent & Family', hasSubcategories: true },
  { id: 'debts', name: 'Debts', hasSubcategories: true },
  { id: 'groceries', name: 'Groceries', hasSubcategories: false },
  { id: 'savings', name: 'Savings', hasSubcategories: false },
  { id: 'investments', name: 'Investments', hasSubcategories: true },
  { id: 'planned_purchases', name: 'Planned Purchases', hasSubcategories: true }
];

function BudgetInput({ incomeData, onSubmit, onBack }) {
  const [budgets, setBudgets] = useState(() => {
    const categories = {};
    BUDGET_CATEGORIES.forEach(cat => {
      categories[cat.id] = {
        main: '',
        subcategories: {}
      };
    });
    return categories;
  });

  const [expandedCategories, setExpandedCategories] = useState({});

  const handleMainCategoryChange = (categoryId, value) => {
    setBudgets(prev => ({
      ...prev,
      [categoryId]: {
        ...prev[categoryId],
        main: value
      }
    }));
  };

  const handleSubcategoryChange = (categoryId, subcategoryId, value) => {
    setBudgets(prev => ({
      ...prev,
      [categoryId]: {
        ...prev[categoryId],
        subcategories: {
          ...prev[categoryId].subcategories,
          [subcategoryId]: value
        }
      }
    }));
  };

  const addSubcategory = (categoryId) => {
    const subcategoryId = `sub_${Date.now()}`;
    setBudgets(prev => ({
      ...prev,
      [categoryId]: {
        ...prev[categoryId],
        subcategories: {
          ...prev[categoryId].subcategories,
          [subcategoryId]: { name: '', amount: '' }
        }
      }
    }));
  };

  const removeSubcategory = (categoryId, subcategoryId) => {
    setBudgets(prev => {
      const newSubcategories = { ...prev[categoryId].subcategories };
      delete newSubcategories[subcategoryId];
      return {
        ...prev,
        [categoryId]: {
          ...prev[categoryId],
          subcategories: newSubcategories
        }
      };
    });
  };

  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const budgetData = {};
    let totalSpent = 0;

    BUDGET_CATEGORIES.forEach(cat => {
      const mainSpent = parseFloat(budgets[cat.id]?.main || 0);
      const subcategories = budgets[cat.id]?.subcategories || {};
      
      const subcategoryData = {};
      let subcategoryTotal = 0;
      
      Object.entries(subcategories).forEach(([subId, subData]) => {
        const amount = typeof subData === 'object' ? parseFloat(subData.amount || 0) : parseFloat(subData || 0);
        const name = typeof subData === 'object' ? (subData.name || '') : '';
        subcategoryData[subId] = { name, amount };
        subcategoryTotal += amount;
      });
      
      // For categories with subcategories, only count subcategories (main is 0)
      // For categories without subcategories, count main
      const categoryTotal = cat.hasSubcategories ? subcategoryTotal : mainSpent;
      totalSpent += categoryTotal;
      
      budgetData[cat.id] = {
        name: cat.name,
        main: mainSpent,
        subcategories: subcategoryData,
        total: categoryTotal
      };
    });

    onSubmit({
      categories: budgetData,
      totalSpent,
      totalIncome: incomeData.totalIncome,
      remaining: incomeData.totalIncome - totalSpent
    });
  };

  const totalSpent = Object.entries(budgets).reduce((sum, [catId, cat]) => {
    const category = BUDGET_CATEGORIES.find(c => c.id === catId);
    if (!category) return sum;
    
    const main = parseFloat(cat.main || 0);
    const subs = Object.values(cat.subcategories || {}).reduce((subSum, sub) => {
      const amount = typeof sub === 'object' ? parseFloat(sub.amount || 0) : parseFloat(sub || 0);
      return subSum + amount;
    }, 0);
    
    // For categories with subcategories, only count subcategories
    // For categories without subcategories, count main
    return sum + (category.hasSubcategories ? subs : main);
  }, 0);

  return (
    <div className="budget-input">
      <div className="card">
        <div className="header-section">
          <h2>Set Up Your Budget</h2>
          <p className="subtitle">Enter your spent amounts for each category</p>
          <div className="income-summary">
            <span>Total Monthly Income: <strong>₹{incomeData.totalIncome.toFixed(2)}</strong></span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="categories-list">
            {BUDGET_CATEGORIES.map(category => {
              const isExpanded = expandedCategories[category.id];
              const categoryData = budgets[category.id] || { main: '', subcategories: {} };
              const subcategories = categoryData.subcategories || {};
              const subcategoryEntries = Object.entries(subcategories);
              
              return (
                <div key={category.id} className="category-row">
                  <div className="category-main">
                    <div className="category-header">
                      <span className="category-name">{category.name}</span>
                      {category.hasSubcategories && (
                        <button
                          type="button"
                          className="expand-btn"
                          onClick={() => toggleCategory(category.id)}
                        >
                          {isExpanded ? '−' : '+'}
                        </button>
                      )}
                    </div>
                    {!category.hasSubcategories && (
                      <div className="category-input-wrapper">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={categoryData.main || ''}
                          onChange={(e) => handleMainCategoryChange(category.id, e.target.value)}
                          placeholder="0.00"
                          className="spent-input"
                        />
                        <span className="currency-label">₹</span>
                      </div>
                    )}
                    {category.hasSubcategories && (
                      <div className="category-total-display">
                        <span className="total-label">Total:</span>
                        <span className="total-amount">
                          ₹{Object.values(subcategories).reduce((sum, sub) => {
                            const amount = typeof sub === 'object' ? parseFloat(sub.amount || 0) : parseFloat(sub || 0);
                            return sum + amount;
                          }, 0).toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>

                  {category.hasSubcategories && isExpanded && (
                    <div className="subcategories-section">
                      <div className="subcategories-header">
                        <span>Subcategories</span>
                        <button
                          type="button"
                          className="add-subcategory-btn"
                          onClick={() => addSubcategory(category.id)}
                        >
                          + Add Subcategory
                        </button>
                      </div>
                      {subcategoryEntries.map(([subId, subData]) => {
                        const subName = typeof subData === 'object' ? (subData.name || '') : '';
                        const subAmount = typeof subData === 'object' ? (subData.amount || '') : (subData || '');
                        
                        return (
                          <div key={subId} className="subcategory-row">
                            <input
                              type="text"
                              placeholder="Subcategory name"
                              value={subName}
                              onChange={(e) => {
                                const currentAmount = typeof subData === 'object' ? (subData.amount || '') : (subData || '');
                                handleSubcategoryChange(category.id, subId, { name: e.target.value, amount: currentAmount });
                              }}
                              className="subcategory-name-input"
                            />
                            <div className="category-input-wrapper">
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={subAmount}
                                onChange={(e) => {
                                  const currentName = typeof subData === 'object' ? (subData.name || '') : '';
                                  handleSubcategoryChange(category.id, subId, { name: currentName, amount: e.target.value });
                                }}
                                placeholder="0.00"
                                className="spent-input"
                              />
                              <span className="currency-label">₹</span>
                            </div>
                            <button
                              type="button"
                              className="remove-subcategory-btn"
                              onClick={() => removeSubcategory(category.id, subId)}
                            >
                              ×
                            </button>
                          </div>
                        );
                      })}
                      {subcategoryEntries.length === 0 && (
                        <p className="no-subcategories">No subcategories added yet. Click "+ Add Subcategory" to add one.</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="summary-section">
            <div className="summary-card">
              <div className="summary-item">
                <span>Total Spent</span>
                <strong>₹{totalSpent.toFixed(2)}</strong>
              </div>
              <div className="summary-item highlight">
                <span>Remaining</span>
                <strong>₹{(incomeData.totalIncome - totalSpent).toFixed(2)}</strong>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="back-btn" onClick={onBack}>
              Back
            </button>
            <button type="submit" className="submit-btn">
              View Dashboard
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BudgetInput;
