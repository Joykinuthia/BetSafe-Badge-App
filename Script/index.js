document.addEventListener("DOMContentLoaded", () => {
    const BASE_URL = "http://localhost:3000/users"; // Reference to JSON Server
    const incomeInput = document.getElementById("income");
    const expenditureNameInput = document.getElementById("expenditure-name");
    const expenditureAmountInput = document.getElementById("expenditure-amount");
    const totalIncomeDisplay = document.getElementById("totalIncome");
    const totalExpenditureDisplay = document.getElementById("totalExpenditure");
    const alertBox = document.getElementById("alertBox");
    const badgeSection = document.getElementById("badge-section");

    let currentUser = null; // Store active user data

    // Fetch User Data
    function fetchUserData(userName) {
        fetch(BASE_URL)
            .then(response => response.json())
            .then(users => {
                currentUser = users.find(user => user.name === userName);
                if (currentUser) {
                    updateUI();
                } else {
                    alert("User not found! Please enter a valid username.");
                }
            })
            .catch(error => console.error("Error fetching user data:", error));
    }

    // Update UI with user data
    function updateUI() {
        if (currentUser) {
            totalIncomeDisplay.textContent = currentUser.income;
            const totalExpenditure = currentUser.expenses.reduce((sum, exp) => sum + exp.amount, 0);
            totalExpenditureDisplay.textContent = totalExpenditure;
            checkBettingLimit();
        }
    }

    // Set Income & Fetch User Data
    function setIncome() {
        const userName = document.getElementById("user-name").value.trim();
        if (userName) {
            fetchUserData(userName);
        } else {
            alert("Please enter a username.");
        }
    }

    // Validate and Add Expenditure
    function validateExpenditureAmount() {
        const name = expenditureNameInput.value.trim();
        const amount = parseFloat(expenditureAmountInput.value);

        if (!name || isNaN(amount) || amount <= 0) {
            alert("Please enter a valid expenditure name and amount.");
            return;
        }

        const newExpense = { name, amount };
        currentUser.expenses.push(newExpense);
        updateUserData();
    }

    // Update User Data (PUT Request)
    function updateUserData() {
        fetch(`${BASE_URL}/${currentUser.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(currentUser)
        })
        .then(response => response.json())
        .then(() => {
            updateUI();
        })
        .catch(error => console.error("Error updating data:", error));
    }

    // Delete Expense (DELETE Request)
    function deleteExpense(expenseName) {
        currentUser.expenses = currentUser.expenses.filter(exp => exp.name !== expenseName);
        updateUserData();
    }

    // Check Betting Limit and Apply Colors
    function checkBettingLimit() {
        const maxBettingLimit = currentUser.income * 0.02;
        const bettingExpense = currentUser.expenses.find(exp => exp.name.toLowerCase() === "betting");
        const bettingAmount = bettingExpense ? bettingExpense.amount : 0;

        if (bettingAmount > maxBettingLimit) {
            alertBox.style.color = "red";
            alertBox.textContent = "Warning: Betting exceeds the 2% cap!";
        } else {
            alertBox.style.color = "green";
            alertBox.textContent = "You're within the responsible betting limit.";
        }

        // Award Badge if user stays under limit
        if (bettingAmount <= maxBettingLimit) {
            awardBadge();
        }
    }

    // Award Badge for Responsible Gambling
    function awardBadge() {
        badgeSection.innerHTML = "<h2>Congratulations! You Earned a Responsible Budgeting Badge</h2>";
    }

    // Event Listeners
    document.querySelector("button[onclick='setIncome()']").addEventListener("click", setIncome);
    document.querySelector("button[onclick='validateExpenditureAmount()']").addEventListener("click", validateExpenditureAmount);
});