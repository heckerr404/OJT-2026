var topicNames = {
    html: "HTML Quiz",
    css: "CSS Quiz",
    javascript: "JavaScript Quiz",
    general: "General Questions Quiz"
};

var questionSets = {
    html: [
        { question: "Which tag creates the largest heading?", options: ["<heading>", "<h6>", "<h1>", "<head>"], answer: 2, explanation: "<h1> is the largest heading tag." },
        { question: "Which tag creates a paragraph?", options: ["<p>", "<para>", "<text>", "<pg>"], answer: 0, explanation: "<p> is used for paragraph text." },
        { question: "Which tag connects a CSS file?", options: ["<script>", "<link>", "<style>", "<css>"], answer: 1, explanation: "<link> connects an external CSS file." },
        { question: "Which attribute gives a unique name?", options: ["class", "id", "src", "href"], answer: 1, explanation: "id should be unique on the page." },
        { question: "Which tag adds an image?", options: ["<image>", "<img>", "<pic>", "<src>"], answer: 1, explanation: "<img> is used to show an image." },
        { question: "Which attribute gives the image path?", options: ["href", "path", "src", "link"], answer: 2, explanation: "src tells the browser where the image file is." },
        { question: "Which tag creates a button?", options: ["<button>", "<click>", "<btn>", "<input-button>"], answer: 0, explanation: "<button> creates a clickable button." },
        { question: "Which tag contains visible page content?", options: ["<head>", "<title>", "<body>", "<meta>"], answer: 2, explanation: "<body> contains what users see." },
        { question: "Which tag creates a numbered list?", options: ["<ul>", "<ol>", "<li>", "<list>"], answer: 1, explanation: "<ol> creates an ordered list." },
        { question: "Which tag connects JavaScript?", options: ["<js>", "<script>", "<link>", "<style>"], answer: 1, explanation: "<script> connects JavaScript to HTML." }
    ],
    css: [
        { question: "Which property changes text color?", options: ["font-style", "text-color", "color", "background-color"], answer: 2, explanation: "color changes text color." },
        { question: "Which property changes background color?", options: ["background-color", "text-color", "font-size", "border-color"], answer: 0, explanation: "background-color changes the background." },
        { question: "Which symbol selects an id?", options: [".", "#", "*", "$"], answer: 1, explanation: "# selects an id." },
        { question: "Which symbol selects a class?", options: [".", "#", "@", "/"], answer: 0, explanation: ". selects a class." },
        { question: "Which property changes text size?", options: ["font-size", "text-weight", "size", "font-color"], answer: 0, explanation: "font-size controls text size." },
        { question: "Which property adds inside space?", options: ["margin", "padding", "border", "height"], answer: 1, explanation: "padding adds space inside an element." },
        { question: "Which property adds outside space?", options: ["margin", "padding", "width", "display"], answer: 0, explanation: "margin adds outside space." },
        { question: "Which value hides an element?", options: ["display: hidden", "display: none", "display: off", "display: empty"], answer: 1, explanation: "display: none hides the element." },
        { question: "Which property rounds corners?", options: ["border-round", "corner-size", "border-radius", "radius-border"], answer: 2, explanation: "border-radius rounds corners." },
        { question: "Which property controls element width?", options: ["height", "width", "size", "length"], answer: 1, explanation: "width controls how wide an element is." }
    ],
    javascript: [
        { question: "Which keyword creates a basic variable?", options: ["var", "make", "newvar", "variable"], answer: 0, explanation: "var creates a variable." },
        { question: "What does score++ do?", options: ["Resets score", "Adds 1", "Subtracts 1", "Prints score"], answer: 1, explanation: "score++ increases score by 1." },
        { question: "Which method selects by id?", options: ["document.pick()", "document.getElementById()", "document.find()", "document.id()"], answer: 1, explanation: "getElementById finds one element by id." },
        { question: "Which event runs after a button click?", options: ["load", "submit", "click", "change"], answer: 2, explanation: "click runs when the user clicks." },
        { question: "What is an array used for?", options: ["Many values", "Only colors", "Deleting HTML", "Closing browser"], answer: 0, explanation: "An array stores many values." },
        { question: "Which property changes element text?", options: ["textContent", "textStyle", "innerColor", "valueText"], answer: 0, explanation: "textContent changes or reads text." },
        { question: "Which method creates an element?", options: ["document.new()", "document.createElement()", "document.makeTag()", "document.addHTML()"], answer: 1, explanation: "createElement creates a new HTML element." },
        { question: "Which method adds a child element?", options: ["appendChild()", "addText()", "pushHTML()", "insertPage()"], answer: 0, explanation: "appendChild adds one element inside another." },
        { question: "What does if do?", options: ["Repeats forever", "Checks a condition", "Creates a file", "Changes browser"], answer: 1, explanation: "if checks a condition before running code." },
        { question: "Which formula gives percentage?", options: ["score + total * 100", "Math.round((score / total) * 100)", "score / 100", "total - score"], answer: 1, explanation: "Divide score by total, multiply by 100, then round." }
    ],
    general: [
        { question: "What does a browser do with HTML?", options: ["Stores it only", "Shows it as a web page", "Deletes CSS", "Stops JavaScript"], answer: 1, explanation: "The browser reads HTML and shows a page." },
        { question: "What does CSS do?", options: ["Adds styling", "Stores passwords", "Runs the fan", "Creates internet"], answer: 0, explanation: "CSS controls colors, spacing, and layout." },
        { question: "What does JavaScript add?", options: ["Only images", "Interactivity", "Only headings", "Only links"], answer: 1, explanation: "JavaScript adds logic and interaction." },
        { question: "What does currentIndex track?", options: ["Current question", "Background color", "File name", "Browser size"], answer: 0, explanation: "currentIndex stores the current question number." },
        { question: "What does score track?", options: ["CSS files", "Correct answers", "Button colors", "Page width"], answer: 1, explanation: "score stores correct answers." },
        { question: "What happens after selecting an answer?", options: ["App checks it", "Page closes", "CSS is deleted", "Browser restarts"], answer: 0, explanation: "The app compares your choice with the correct answer." },
        { question: "What is RAM used for?", options: ["Temporary memory", "Paper storage", "Only colors", "HTML tags"], answer: 0, explanation: "RAM is temporary memory while programs run." },
        { question: "What is the CPU often called?", options: ["Keyboard", "Brain of computer", "Monitor", "Pointer"], answer: 1, explanation: "The CPU processes instructions." },
        { question: "What is code flow?", options: ["Order code runs", "Code color", "Download", "Image type"], answer: 0, explanation: "Code flow is the order in which code runs." },
        { question: "Why separate HTML, CSS, and JS?", options: ["Cleaner project", "Slower browser", "Hidden page", "No styling"], answer: 0, explanation: "Separate files keep the project easier to read." }
    ]
};
