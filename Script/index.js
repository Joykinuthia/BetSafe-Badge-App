document.addEventListener("DOMContentloaded", () =>{
    const BASE_URL = "http://localhost:3000/users";

    //Getting reference to HTML elements
    const userNameInput = document.getElementById("user-name");
    const incomeInput = document.getElementById("income");
    const expenditureNameInput = document.getElementById("exipenditure-name");
    const expenditureAmountInput = document.getElementById("expenditure-amount");
    const totalIncomeDisplay = document.getElementById("totalIncome");
    const totalExpenditureDisplay = document.getElementById("totalExpenditure");
    const summaryDiv = document.getElementById("summary");
    const alertBox = document.getElementById("alertBox");

    let users =[];

    //Fetching and displaying all users
    async function fetchUserData() {
        try {
            const response = await fetch(BASE_URL);
            users = await response.json();
            console.log("Fetched Users:", users);
            render(users);
        } catch(error) {
            console.error("Error fetching users:", error)
        }
    }
    //Render function to update UI
    function render(users) {
        summaryDiv.innerHTML = "";

        users.forEach(user => {
            const userElement = document.createElement("p");
            const totalExpenditure = user.expenses.reduce((sum,expense) => sum + expense.amount, 0);
            userElement.innerHTML = 
            <strong>${user.name}</strong> - Income:$${user.income}, Expenses: $${totalExpenditure}
            <button onclick="deleteUser(${user.id})">Delete</button>
            ;
            summaryDiv.appendChild(userElement);
        });
        totalIncomeDisplay.textContent = users.reduce((sum, user) =>
        sum + parseFloat(user.income),0);
        totalExpenditureDisplay.textContent = users
        .map(user => user.expenses.reduce((sum, expense) => sum + expense.amount, 0))
        .reduce((sum, expense) => sum + expense, 0);
    }
    //Adding new user(POST request)
    async function addUser() {
        const name = userNameInput.ariaValueMax;
        const income = parseFloat(incomeInput.value);

        if(!nan ||isNaN(income)) {
            alert("Please enter a valid name and income.");
            return;
        }

        const newUser = {name, income, expenses: []};

        try {
            const response = await fetch(BASE_URL, {
                method:"POST",
                headers:{"Content-Type": "application/json"},
                body: JSON.stringify(newUser)
            });

        if (response.ok) {
            const createdUser = await response.json();
            newUser.id = createdUser.id;
            users.push(newUser);
            render(users);
        } else {
            console.error("Failed to add user");
        }
        }
        //Adding expense to a user(PUT request)
        async function addExpense(userId) {
            const expenditureName = expenditureNameInput.value;
            const expenditureAmount = parseFloat(expenditureAmountInput.value);

            if(!expenditureName || isNaN(expenditureAmount)) {
                alert ("Please enter valid expense details.");
                return;
            }
            const user = users.find(u => u.id === userId);
            if(!user) return;
            user.expenses.push({name: expenditureName, amount: expenditureAmount });

            try {
                const response = await fetch(`${BASE_URL}/${userId}`, {
                    method: "PUT",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(user)
                });

                if(response.ok) {
                    render(users);
                }else {
                    console.error("Failed to update expenses");
                }
            }catch(error) {
                console.error("Error updating expenses:", error);
            }
            
        }
        //Deleting user(DELETE request)
        async function deleteUser(userId) {
            try {
                const response = await fetch(`${BASE_URL}/${userId}`, {
                    method:"DELETE"
                });

                if (response.ok) {
                    users = users.filter(user => user.id !== userId);
                    render(users);
                }else {
                    console.error("Failed to delete user");
                }
            }catch(error) {
                console.error("Error deleting user:", error);
            }
            
        }

        
    }
})