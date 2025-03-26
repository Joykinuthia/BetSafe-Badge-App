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
})