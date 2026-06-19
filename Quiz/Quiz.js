var questions = [];
var selectedTopic = "";
var currentIndex = 0;
var answers = [];

function get(id) { return document.getElementById(id); }
function hide(id) { get(id).className = "hidden"; }
function show(id) { get(id).className = ""; }

function startTopic(topic) {
    selectedTopic = topic;
    questions = questionSets[topic];
    currentIndex = 0;
    answers = [];

    for (var i = 0; i < questions.length; i++) {
        answers[i] = -1;
    }

    get("selectedTopicText").textContent = topicNames[topic];
    get("selectedTopicText").className = "topic-name";
    get("scoreBox").className = "score-box";
    hide("entryScreen");
    hide("resultScreen");
    show("quizScreen");
    showQuestion();
}

function showQuestion() {
    var q = questions[currentIndex];
    var percent = ((currentIndex + 1) / questions.length) * 100;

    get("questionCount").textContent = "Question " + (currentIndex + 1) + " of " + questions.length;
    get("progressFill").style.width = percent + "%";
    get("questionText").textContent = q.question;
    get("optionsBox").innerHTML = "";
    hide("feedbackBox");

    for (var i = 0; i < q.options.length; i++) {
        makeOption(q.options[i], i);
    }

    if (answers[currentIndex] !== -1) {
        showAnswer();
    }

    get("prevButton").disabled = currentIndex === 0;
    get("nextButton").textContent = "Next";
    if (currentIndex === questions.length - 1) {
        get("nextButton").textContent = "Show Result";
    }
    updateScore();
}

function makeOption(text, index) {
    var btn = document.createElement("button");
    btn.className = "option-button";
    btn.textContent = text;
    btn.setAttribute("data-index", index);
    btn.onclick = selectAnswer;
    get("optionsBox").appendChild(btn);
}

function selectAnswer() {
    answers[currentIndex] = Number(this.getAttribute("data-index"));
    showAnswer();
    updateScore();
}

function showAnswer() {
    var q = questions[currentIndex];
    var chosen = answers[currentIndex];
    var buttons = get("optionsBox").getElementsByTagName("button");

    for (var i = 0; i < buttons.length; i++) {
        buttons[i].disabled = true;
        if (i === q.answer) {
            buttons[i].className = "option-button correct";
        }
    }

    if (chosen === q.answer) {
        get("feedbackTitle").textContent = "Correct!";
        get("feedbackText").textContent = "Your answer: " + q.options[chosen];
    } else {
        buttons[chosen].className = "option-button wrong";
        get("feedbackTitle").textContent = "Wrong answer";
        get("feedbackText").textContent = "Your answer: " + q.options[chosen] + ". Correct answer: " + q.options[q.answer];
    }

    get("explanationText").textContent = "Explanation: " + q.explanation;
    get("feedbackBox").className = "feedback";
}

function nextQuestion() {
    if (currentIndex < questions.length - 1) {
        currentIndex++;
        showQuestion();
    } else {
        showResult();
    }
}

function previousQuestion() {
    if (currentIndex > 0) {
        currentIndex--;
        showQuestion();
    }
}

function countCorrect() {
    var correct = 0;
    for (var i = 0; i < questions.length; i++) {
        if (answers[i] === questions[i].answer) {
            correct++;
        }
    }
    return correct;
}

function countSkipped() {
    var skipped = 0;
    for (var i = 0; i < answers.length; i++) {
        if (answers[i] === -1) {
            skipped++;
        }
    }
    return skipped;
}

function updateScore() {
    get("scoreText").textContent = countCorrect();
}

function showResult() {
    var correct = countCorrect();
    var skipped = countSkipped();
    var wrong = questions.length - correct - skipped;
    var percent = Math.round((correct / questions.length) * 100);

    hide("quizScreen");
    show("resultScreen");
    get("finalScore").textContent = correct + " / " + questions.length + " (" + percent + "%)";
    get("finalMessage").textContent = "Correct, wrong, and skipped questions are shown below.";
    get("resultSummary").innerHTML = "";
    addSummary("Correct: " + correct);
    addSummary("Wrong: " + wrong);
    addSummary("Skipped: " + skipped);
    showReview();
}

function addSummary(text) {
    var item = document.createElement("div");
    item.className = "summary-item";
    item.textContent = text;
    get("resultSummary").appendChild(item);
}

function showReview() {
    get("reviewBox").innerHTML = "";
    for (var i = 0; i < questions.length; i++) {
        addReviewCard(i);
    }
}

function addReviewCard(index) {
    var q = questions[index];
    var chosen = answers[index];
    var card = document.createElement("div");
    card.className = "review-card";

    if (chosen === -1) {
        card.className = "review-card review-skipped";
    } else if (chosen !== q.answer) {
        card.className = "review-card review-wrong";
    }

    addLine(card, getStatus(chosen, q.answer), true);
    addLine(card, (index + 1) + ". " + q.question, false);
    addLine(card, "Your answer: " + getAnswerText(q, chosen), false);
    addLine(card, "Correct answer: " + q.options[q.answer], false);
    addLine(card, "Explanation: " + q.explanation, false);
    get("reviewBox").appendChild(card);
}

function addLine(card, text, bold) {
    var p = document.createElement("p");
    p.textContent = text;
    if (bold) {
        p.style.fontWeight = "bold";
    }
    card.appendChild(p);
}

function getStatus(chosen, correct) {
    if (chosen === -1) {
        return "Skipped";
    }
    if (chosen === correct) {
        return "Correct";
    }
    return "Wrong";
}

function getAnswerText(q, chosen) {
    if (chosen === -1) {
        return "Skipped";
    }
    return q.options[chosen];
}

function showEntry() {
    hide("quizScreen");
    hide("resultScreen");
    hide("scoreBox");
    show("entryScreen");
    get("selectedTopicText").className = "topic-name hidden";
}

function toggleTheme() {
    if (document.body.className === "dark-theme") {
        document.body.className = "";
        get("themeIcon").className = "bi bi-moon";
    } else {
        document.body.className = "dark-theme";
        get("themeIcon").className = "bi bi-moon-fill";
    }
}

var topicButtons = document.getElementsByClassName("topic-button");

for (var i = 0; i < topicButtons.length; i++) {
    topicButtons[i].onclick = function () {
        startTopic(this.getAttribute("data-topic"));
    };
}

get("prevButton").onclick = previousQuestion;
get("nextButton").onclick = nextQuestion;
get("backButton").onclick = showEntry;
get("restartButton").onclick = function () { startTopic(selectedTopic); };
get("topicButton").onclick = showEntry;
get("themeToggle").onclick = toggleTheme;

showEntry();
