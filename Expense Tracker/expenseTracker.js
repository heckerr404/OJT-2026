let users =JSON.parse(localStorage.getItem("users")) || [];
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
    if(!Description || !Amount){
        alert("Please fill all fields");
        return;  
    }
    if (existing_ID != null) {
        users = users.map(function (user) {
            if (user.userId == existing_ID) {
                return {
                    ...user,
                    Description,
                    Amount,
                    Type
                };
            }
            return user;
        });
        existing_ID = null;
    }
    else {
        let newUser = {
            userId: count,
            Description: Description,
            Type: Type,
            Amount: Amount,
            Date: new Date().toDateString()
        };
        users = [...users, newUser];
        count++;
    }
    saveToLocalStorage();
    clearForm();
    render();
});
function render() {
    income = 0;
    expense = 0;
    balance = 0;
    let tbody = document.querySelector("tbody");
    tbody.innerHTML = "";
    let searchText = document
                        .querySelector("#searchBox")
                        .value
                        .toLowerCase();
    let filteredUsers = users;
    if(searchText){
        filteredUsers = users.filter(function(user){
            return user.Description
                .toLowerCase()
                .includes(searchText);
        });
    }
    filteredUsers.forEach(function (user) {
        let tr = document.createElement("tr");
        if(user.Type === "Expense"){
            expense += Number(user.Amount);
            tr.innerHTML = `
                <td style="
                    font-weight:700;
                    color:#0f172a;
                    font-size:16px;
                ">
                    ${user.Description}
                </td>

                <td style="text-align:center;">
                    <span style="
                        background:#dc3545;
                        color:white;
                        padding:6px 16px;
                        border-radius:12px;
                        font-weight:600;
                        font-size:15px;
                        display:inline-block;
                    ">
                        ${user.Type}
                    </span>
                </td>

                <td style="
                    text-align:center;
                    color:#dc3545;
                    font-weight:700;
                    font-size:20px;
                    letter-spacing:1px;
                ">
                    - ₹${user.Amount}
                </td>

                <td>${user.Date}</td>

                <td style="text-align:center;">
                    <button class="btn btn-primary btn-sm"
                            onclick="updateUser(${user.userId})">
                        <i class="fa-solid fa-pen"></i>
                    </button>

                    <button class="btn btn-danger btn-sm"
                            onclick="deleteUser(${user.userId})">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            `;
        }
        else{
            income += Number(user.Amount);
            tr.innerHTML = `
                <td style="
                    font-weight:700;
                    color:#0f172a;
                    font-size:16px;
                ">
                    ${user.Description}
                </td>
                <td style="text-align:center;">
                    <span style="
                        background:#198754;
                        color:white;
                        padding:6px 16px;
                        border-radius:12px;
                        font-weight:600;
                        font-size:15px;
                        display:inline-block;
                    ">
                        ${user.Type}
                    </span>
                </td>

                <td style="
                    text-align:center;
                    color:#198754;
                    font-weight:700;
                    font-size:20px;
                    letter-spacing:1px;
                ">
                    + ₹${user.Amount}
                </td>

                <td>${user.Date}</td>

                <td style="text-align:center;">
                    <button class="btn btn-primary btn-sm"
                            onclick="updateUser(${user.userId})">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="btn btn-danger btn-sm"
                            onclick="deleteUser(${user.userId})">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            `;
        }
        tbody.append(tr);
    });
    balance = income - expense;
    calculating();
    updateTransactionCount();
}
function clearForm() {
    document.querySelector("#description").value = "";
    document.querySelector("#amount").value = "";
    document.querySelector("#TransactionType").selectedIndex = 0;
}
function deleteUser(id) {
    users = users.filter(function (user) {
        return user.userId != id;
    });
    saveToLocalStorage();
    existing_ID = null;
    render();
}
function updateUser(id) {
    const selectedUser = users.find(function (user) {
        return user.userId == id;
    });
    document.querySelector("#description").value =
        selectedUser.Description;
    document.querySelector("#amount").value =
        selectedUser.Amount;
    document.querySelector("#TransactionType").value =
        selectedUser.Type;
    existing_ID = id;
}
function calculating(){
    let income1 = document.querySelector("#income");
    let expense1 = document.querySelector("#expense");
    let balance1 = document.querySelector("#balance");
    income1.innerHTML = `₹${income}`;
    expense1.innerHTML = `₹${expense}`;
    balance1.innerHTML = `₹${balance}`;
}
render();
function saveToLocalStorage(){
    localStorage.setItem(
        "users",
        JSON.stringify(users)
    );
}
function updateTransactionCount(){
    document.querySelector("#transactionCount").innerHTML = 
    `Total Transaction = ${users.length}`
}
document.querySelector("#searchBox")
.addEventListener("input", function(){
    render();
});