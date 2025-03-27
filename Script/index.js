document.addEventListener("DOMContentLoaded", () => {
    // Using a single user endpoint; 
  const BASE_URL = "http://localhost:3000/users/1";

  // Get references to HTML elements
  const incomeInput = document.getElementById("income");
  const expenditureNameInput = document.getElementById("expenditure-name");
  const expenditureAmountInput = document.getElementById("expenditure-amount");
  const totalIncomeDisplay = document.getElementById("totalIncome");
  const totalExpenditureDisplay = document.getElementById("totalExpenditure");
  const summaryDiv = document.getElementById("summary");
  const alertBox = document.getElementById("alertBox");
  const badgeSection = document.getElementById("badge-section");

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
