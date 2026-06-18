// script.js - Kanban Task Board
// Uses only college syllabus topics: localStorage, JSON.parse/stringify,
// filter, find, forEach, createElement, appendChild, addEventListener,
// getElementById, classList

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

function renderKanban() {
  // Stub for now
}
