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

      // Update income and store in db.json
    setIncomeBtn.addEventListener('click', function () {
        const incomeValue = Number(incomeInput.value);
        if (isNaN(incomeValue) || incomeValue <= 0) {
          alert("Please enter a valid income.");
          return;
        }
        currentIncome = incomeValue;
        totalIncomeEl.textContent = currentIncome;
        fetch('http://localhost:3000/income/1', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id: 1, amount: currentIncome })
        })
          .then(response => response.json())
          .then(data => {
            console.log("Income updated:", data);
          })
          .catch(err => console.error('Error updating income:', err));
      });

      // Toggle custom category input when "other" is selected
    budgetTypeSelect.addEventListener('change', function () {
        if (this.value === 'other') {
          customBudgetDiv.style.display = 'block';
        } else {
          customBudgetDiv.style.display = 'none';
        }
      });

       // Handle budget form submission
    budgetForm.addEventListener('submit', function (e) {
        e.preventDefault();
        errorMessageDiv.textContent = '';
    
        let category = budgetTypeSelect.value;
        if (category === 'other') {
          category = customBudgetInput.value.trim();
          if (category === '') {
            errorMessageDiv.textContent = 'Please enter a custom category.';
            return;
          }
        }
    
        const amount = Number(amountInput.value);
        const date = dateInput.value;
    
        if (isNaN(amount) || amount <= 0) {
          errorMessageDiv.textContent = 'Please enter a valid amount.';
          return;
        }
        if (!date) {
          errorMessageDiv.textContent = 'Please select a date.';
          return;
        }

         // Special check for gambling category
      if (category.toLowerCase() === 'gambling') {
        const maxAllowed = currentIncome * 0.015;
        if (amount > maxAllowed) {
          errorMessageDiv.textContent = Gambling expense exceeds 1.5% of your income (${maxAllowed.toFixed(2)}).;
          return;
        }
      }
  
      const newBudget = {
        category: category,
        amount: amount,
        date: date
      };

      // Save new budget item in db.json
      fetch('http://localhost:3000/budgets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newBudget)
      })
        .then(response => response.json())
        .then(data => {
          console.log("Budget added:", data);
          loadBudgets();
          budgetForm.reset();
          customBudgetDiv.style.display = 'none';
        })
        .catch(err => console.error('Error adding budget:', err));
    });

      // Edit budget item functionality
      budgetTableBody.addEventListener('click', function (e) {
        if (e.target && e.target.classList.contains('edit-btn')) {
          const budgetId = e.target.getAttribute('data-id');
          fetch(http://localhost:3000/budgets/${budgetId})
            .then(response => response.json())
            .then(budget => {
              const newCategory = prompt("Edit Category:", budget.category);
              if (newCategory === null) return; // cancel edit
              const newAmount = prompt("Edit Amount:", budget.amount);
              if (newAmount === null) return;
              const newDate = prompt("Edit Date (YYYY-MM-DD):", budget.date);
              if (newDate === null) return;

                // Check for gambling expense condition if needed
            if (newCategory.toLowerCase() === 'gambling') {
                const maxAllowed = currentIncome * 0.015;
                if (Number(newAmount) > maxAllowed) {
                  alert(Gambling expense exceeds 1.5% of your income (${maxAllowed.toFixed(2)}). Edit canceled.);
                  return;
                }
              }

              const updatedBudget = {
                ...budget,
                category: newCategory,
                amount: Number(newAmount),
                date: newDate
              };
    
              fetch(http://localhost:3000/budgets/${budgetId}, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedBudget)
              })
                .then(response => response.json())
                .then(data => {
                  console.log("Budget updated:", data);
                  loadBudgets();
                })
                .catch(err => console.error('Error updating budget:', err));
            })
            .catch(err => console.error('Error fetching budget for edit:', err));
        }
      });
    });
