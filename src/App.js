import React, { useState } from 'react';
import './App.css';
import IncomeSetup from './components/IncomeSetup';
import BudgetInput from './components/BudgetInput';
import Dashboard from './components/Dashboard';

function App() {
  const [step, setStep] = useState('income'); // 'income', 'budget', 'dashboard'
  const [incomeData, setIncomeData] = useState(null);
  const [budgetData, setBudgetData] = useState(null);

  // Removed localStorage loading - always start fresh

  const handleIncomeSubmit = (data) => {
    setIncomeData(data);
    localStorage.setItem('budgetIncomeData', JSON.stringify(data));
    setStep('budget');
  };

  const handleBudgetSubmit = (data) => {
    setBudgetData(data);
    localStorage.setItem('budgetData', JSON.stringify(data));
    setStep('dashboard');
  };

  const handleReset = () => {
    localStorage.removeItem('budgetIncomeData');
    localStorage.removeItem('budgetData');
    setIncomeData(null);
    setBudgetData(null);
    setStep('income');
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>💰 Budget Planner</h1>
        {step !== 'income' && (
          <button className="reset-btn" onClick={handleReset}>
            Reset
          </button>
        )}
      </header>

      <main className="app-main">
        {step === 'income' && (
          <IncomeSetup onSubmit={handleIncomeSubmit} />
        )}
        {step === 'budget' && incomeData && (
          <BudgetInput 
            incomeData={incomeData} 
            onSubmit={handleBudgetSubmit}
            onBack={() => setStep('income')}
          />
        )}
        {step === 'dashboard' && incomeData && budgetData && (
          <Dashboard 
            incomeData={incomeData} 
            budgetData={budgetData}
            onEdit={() => setStep('budget')}
          />
        )}
      </main>
    </div>
  );
}

export default App;

