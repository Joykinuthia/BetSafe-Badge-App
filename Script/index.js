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

    let currentIncome = 0;

  // Load income from db.json via JSON server
  fetch('http://localhost:3000/income/1')
  .then(response => response.json())
  .then(data => {
    currentIncome = data.amount;
    totalIncomeEl.textContent = currentIncome;
  })
  .catch(err => console.error('Error fetching income:', err));

    // Function to load all budgets and update summary
    function loadBudgets() {
        fetch('http://localhost:3000/budgets')
          .then(response => response.json())
          .then(data => {
            budgetTableBody.innerHTML = '';
            let totalExpenses = 0;
            data.forEach(budget => {
              totalExpenses += Number(budget.amount);
              const tr = document.createElement('tr');
              tr.innerHTML = `
                <td>${budget.date}</td>
                <td>${budget.category}</td>
                <td>${budget.amount}</td>
                <td>
                  <button class="edit-btn" data-id="${budget.id}">Edit</button>
                </td>
              `;
              budgetTableBody.appendChild(tr);
            });
            totalExpensesEl.textContent = totalExpenses;
            if (totalExpenses > currentIncome) {
              comparisonMessageEl.textContent = "Your total budgets exceed your income!";
            } else {
              comparisonMessageEl.textContent = "Your total budgets are within your income.";
            }
          })
          .catch(err => console.error('Error fetching budgets:', err));
      }
    
      loadBudgets();