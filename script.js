const $viewScoresBtn = document.querySelector("#viewHighScores");
const $startBtn = document.querySelector("#start");
const $submitInits = document.querySelector("#enterInitials");
const $initialsInput = document.querySelector("#initalsInput");
const $backBtn = document.querySelector("#goBack");
const $clearBtn = document.querySelector("#clearScores");
const $startPage = document.querySelector("#quizStart");
const $quizPage = document.querySelector("#quiz");
const $endPage = document.querySelector("#quizEnd");
const $scoresPage = document.querySelector("#highScores");
const $timer = document.querySelector("#timer");
const $question = document.querySelector("#question");
const $choiceBtn = document.querySelectorAll(".choiceBtn");
const $scoreMsg = document.querySelector("#finalScore");
const $scoreList = document.querySelector("#scoreList");
const $correct = document.querySelector("#correct");
const $incorrect = document.querySelector("#incorrect");
var highScores = [];

var quizQuestions = [{
    'question': "Commonly used data types DO NOT include:",
    'answerRight': "alerts",
    'choices': ["strings", "booleans", "alerts", "numbers"]
},
{
    'question': "The condition in an if/else statement is enclosed within ____.",
    'answerRight': "parentheses",
    'choices': ["parentheses", "quotes", "curly braces", "square brackets"]
},
{
    'question': "A very useful tool during development and debugging for printing content to the debugger is:",
    'answerRight': "console.log",
    'choices': ["JavaScript", "console.log", "for loops", "terminal/bash"]
},
{
    'question': "Arrays in javascript can be used to store:",
    'answerRight': "all of the above",
    'choices': ["numbers and strings", "other arrays", "booleans", "all of the above"]
},
{
    'question': "String values must be stored within _____ when being assigned to variables.",
    'answerRight': "quotes",
    'choices': ["commas", "curly braces", "parentheses", "quotes"]
}
];

var secondsLeft = 60;
var questionIndex = 0;

function runTimer() {
    printQuestion(questionIndex);
    var timerInterval = setInterval(function () {
        secondsLeft--;
        $timer.textContent = "Time: " + secondsLeft;
        $startPage.classList.add("hide");
        $quizPage.classList.remove("hide");
        if (secondsLeft <= 0) {
            clearInterval(timerInterval);
            endQuiz(secondsLeft);
        } else if (questionIndex >= quizQuestions.length) {
            clearInterval(timerInterval);
            endQuiz(secondsLeft);
        }
    }, 1000);
};

function printQuestion(num) {
    $question.textContent = quizQuestions[num]['question'];
    var choices = quizQuestions[num]['choices'];
    console.log(choices);
    for (var i = 0; i < choices.length; i++) {
        var choiceText = document.getElementById("choice" + i);
        choiceText.textContent = choices[i];
    };
};

$choiceBtn.forEach(el => el.addEventListener('click', event => {
    var correct = quizQuestions[questionIndex]['answerRight'];
    console.log(correct);
    if (el.textContent == correct) {
        console.log('correct!');
        $incorrect.classList.add("hide");
        $correct.classList.remove("hide");
    } else if (el.textContent !== correct) {
        console.log('wrong!');
        $correct.classList.add("hide");
        $incorrect.classList.remove("hide");
        secondsLeft = secondsLeft - 10;
    }
    questionIndex++;
    if (questionIndex < quizQuestions.length) {
        printQuestion(questionIndex);
    }
}));

function init() {
    // Write code here to check if there are items in localStorage
    if (localStorage.length > 0) {
        highScores = [];
        for (var i = 0; i < localStorage.length; i++) {
            savedScore = JSON.parse(localStorage.getItem(parseInt(i)));
            console.log(savedScore);
            highScores.push(savedScore);
            highScores.sort(function (a, b) {
                return b.score - a.score;
            });
        }
    } else if (localStorage.length === 0) {
        highScores = [];
    }
};

function endQuiz(score) {
    $quizPage.classList.add("hide");
    $endPage.classList.remove("hide");
    $scoreMsg.textContent = `Your final score is ${score}.`
}

function renderScores() {
    init();
    // Clear scoreList element
    $scoreList.innerHTML = "";
    // Render a new li for each score
    for (let i = 0; i < highScores.length; i++) {
        const intitalsItem = JSON.stringify(highScores[i].initials).slice(1, -1);
        const scoreItem = `${highScores[i].score} - ${intitalsItem}`;
        var li = document.createElement("li");
        li.textContent = scoreItem;
        li.setAttribute("data-index", i);
        $scoreList.appendChild(li);
    }
};

$submitInits.addEventListener("submit", function (event) {
    event.preventDefault();
    var initials = $initialsInput.value.trim();
    // Return from function early if submitted text is blank
    if (initials === "") {
        return;
    }
    var key = localStorage.length
    // add initals and score to local storage
    localStorage.setItem(`${key}`, '{"initials": ' + JSON.stringify(initials) + ', "score": ' + JSON.stringify(secondsLeft) + '}');
    $initialsInput.value = "";
    $endPage.classList.add("hide");
    $scoresPage.classList.remove("hide");
    renderScores();
});

$viewScoresBtn.addEventListener("click", function () {
    $startPage.classList.add("hide");
    $scoresPage.classList.remove("hide");
    renderScores();
});

$backBtn.addEventListener("click", function () {
    $startPage.classList.remove("hide");
    $scoresPage.classList.add("hide");
    secondsLeft = 60;
    questionIndex = 0;
    $timer.textContent = "Time: " + secondsLeft;
});

$startBtn.addEventListener("click", runTimer);

$clearBtn.addEventListener("click", function () {
    localStorage.clear();
    renderScores();
});