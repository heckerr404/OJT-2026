

// Load saved cards from localStorage, or start with an empty array
let cards = JSON.parse(localStorage.getItem("kanbanCards")) || [];

// Holds the id of the card currently being dragged
let dragId = null;

// Saves the current cards array to localStorage
function save() {
  localStorage.setItem("kanbanCards", JSON.stringify(cards));
}

// Reads the task input and adds a new card to the correct column
function addCard() {
  const input = document.getElementById("task-input");
  const col   = document.getElementById("col-select").value;
  const text  = input.value.trim();

  if (!text) return; // stop if the input field is empty

  cards.push({ id: Date.now(), text: text, col: col });
  save();
  renderKanban();
  input.value = "";
}

// Removes a card from the array by its id, then saves and re-renders
function deleteCard(id) {
  cards = cards.filter(function (c) { return c.id !== id; });
  save();
  renderKanban();
}

// Builds and displays all card elements for all three columns
function renderKanban() {
  const columns = ["todo", "inprogress", "done"];

  columns.forEach(function (col) {
    const colCards  = cards.filter(function (c) { return c.col === col; });
    const countEl   = document.getElementById("count-" + col);
    const container = document.getElementById("cards-" + col);

    // Update the card count badge
    countEl.textContent = colCards.length;

    // Clear old cards before rebuilding
    container.innerHTML = "";

    // Build a DOM element for each card using createElement + appendChild
    colCards.forEach(function (card) {
      const div = document.createElement("div");
      div.className = "card";
      div.draggable = true;

      const textSpan = document.createElement("span");
      textSpan.textContent = card.text;

      const delBtn = document.createElement("button");
      delBtn.className   = "del-btn";
      delBtn.textContent = "\u2715";
      delBtn.addEventListener("click", function () {
        deleteCard(card.id);
      });

      div.appendChild(textSpan);
      div.appendChild(delBtn);

      // Drag event listeners
      div.addEventListener("dragstart", function () {
        dragId = card.id;
        div.classList.add("dragging");
      });
      div.addEventListener("dragend", function () {
        div.classList.remove("dragging");
      });

      container.appendChild(div);
    });
  });
}

// Allows a column container to accept dropped cards
function allowDrop(e) {
  e.preventDefault();
}

// Moves the dragged card to the column it is dropped on
function drop(e, col) {
  e.preventDefault();
  const card = cards.find(function (c) { return c.id === dragId; });
  if (card) {
    card.col = col;
    save();
    renderKanban();
  }
  dragId = null;
}

// Set up Enter key shortcut and render existing cards when the page loads
document.addEventListener("DOMContentLoaded", function () {
  applyTheme();
  document.getElementById("task-input").addEventListener("keydown", function (e) {
    if (e.key === "Enter") addCard();
  });
  renderKanban();
});
