document.addEventListener('DOMContentLoaded', function () {
    const incomeInput = document.getElementById('income-input');
    const setIncomeBtn = document.getElementById('set-income-btn');
    const totalIncomeEl = document.getElementById('total-income');
    const budgetForm = document.getElementById('budget-form');
    const budgetTypeSelect = document.getElementById('budget-type');
    const customBudgetDiv = document.getElementById('custom-budget-name');
    const customBudgetInput = document.getElementById('custom-budget-input');
    const amountInput = document.getElementById('amount');
    const dateInput = document.getElementById('budget-date');
    const errorMessageDiv = document.getElementById('error-message');
    const totalExpensesEl = document.getElementById('total-expenses');
    const comparisonMessageEl = document.getElementById('comparison-message');
    const budgetTableBody = document.querySelector('#budget-table tbody');

  let currentUser = null;

  // Load income from db.json via JSON server
  fetch('http://localhost:3000/income/1')
  .then(response => response.json())
  .then(data => {
    currentIncome = data.amount;
    totalIncomeEl.textContent = currentIncome;
  })
  .catch(err => console.error('Error fetching income:', err));