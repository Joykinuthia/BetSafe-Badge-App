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

  // Fetch user data; 
  async function fetchUserData() {
    try {
      const response = await fetch(BASE_URL);
      if (response.ok) {
        currentUser = await response.json();
      } else {
        // If not found, initialize default user data and create a new user record.
        currentUser = { income: 0, expenses: [] };
        await createUser();
      }
      render();
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  // Create a new user entry on the server
  async function createUser() {
    try {
      const response = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentUser)
      });
      if (response.ok) {
        const newUser = await response.json();
        currentUser.id = newUser.id;
      }
    } catch (error) {
      console.error("Error creating user:", error);
    }
  }

  // Update the UI summary with current income and total expenditure.
  function render() {
    totalIncomeDisplay.textContent = currentUser.income;
    const totalExpenditure = currentUser.expenses.reduce((sum, expense) => sum + expense.amount, 0);
    totalExpenditureDisplay.textContent = totalExpenditure;
