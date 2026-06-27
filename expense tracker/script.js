let users = JSON.parse(localStorage.getItem("users")) || [];
let count = users.length > 0
    ? Math.max(...users.map(user => user.userId)) + 1
    : 1;
let income = 0;
let expense = 0;
let balance = 0;
let existing_ID = null;

document.querySelector("#btnn").addEventListener('click', function (e) {
    e.preventDefault();
    const { value: Description } = document.querySelector("#description");
    const { value: Amount } = document.querySelector("#amount");
    const { value: Type } = document.querySelector("#TransactionType");

    if (!Description || !Amount) {
        alert("Please fill all fields");
        return;
    }

    let newUser = {
        userId: count,
        Description: Description,
        Type: Type,
        Amount: Amount,
        Date: new Date().toDateString()
    };
    users = [...users, newUser];
    count++;

    clearForm();
    render();
});

function render() {
    income = 0;
    expense = 0;
    balance = 0;
    let tbody = document.querySelector("tbody");
    tbody.innerHTML = "";

    users.forEach(function (user) {
        let tr = document.createElement("tr");
        if (user.Type === "Expense") {
            expense += Number(user.Amount);
            tr.innerHTML = `<td>${user.Description}</td>
                            <td>Expense</td>
                            <td>- ₹${user.Amount}</td>
                            <td>${user.Date}</td>`;
        } else {
            income += Number(user.Amount);
            tr.innerHTML = `<td>${user.Description}</td>
                            <td>Income</td>
                            <td>+ ₹${user.Amount}</td>
                            <td>${user.Date}</td>`;
        }
        tbody.append(tr);
    });

    balance = income - expense;
    calculating();
}

function clearForm() {
    document.querySelector("#description").value = "";
    document.querySelector("#amount").value = "";
    document.querySelector("#TransactionType").selectedIndex = 0;
}

function calculating() {
    document.querySelector("#income").innerHTML = `₹${income}`;
    document.querySelector("#expense").innerHTML = `₹${expense}`;
    document.querySelector("#balance").innerHTML = `₹${balance}`;
}

render();