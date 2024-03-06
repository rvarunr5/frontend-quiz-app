import "../css/style.css";
import data from "../data/data.json" assert { type: "json" };
import FrontEndQuiz from "./FrontendQuiz";
import QuizData from "./QuizData";

const LETTERS = ["A", "B", "C", "D"];
const body = document.querySelector("body");
const themeToggle = document.querySelector("#toggle");
const lightThemeIcon = document.querySelector(".light-theme");
const darkThemeIcon = document.querySelector(".dark-theme");
const leftElement = document.querySelector(".left-content");
const rightElement = document.querySelector(".right");
const topicHeading = document.querySelector(".topic-heading");
const progress = document.querySelector(".progress");
const progressBar = document.querySelector(".progress-bar");

const CORRECT_ANSWER = "correct";
const WRONG_ANSWER = "incorrect";
function resetPage() {
  leftElement.innerHTML = "";
  rightElement.innerHTML = "";
}
// Convert back the text to HTML
function serializeText(option) {
  return option.replace("&lt;", /</g).replace("&gt;", />/g);
}

// If the text contains HTML, converts to string
function parseText(option) {
  return option.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function buildHomeScreen() {
  const frontendQuiz = new QuizData(data.quizzes);
  progressBar.style.display = "none";
  const topics = frontendQuiz.getTopics();

  leftElement.innerHTML += `<p class="heading">Welcome to the <strong>Frontend Quiz!</strong></p>`;
  leftElement.innerHTML += `<p class="helper"><em>Pick a subject to get started</em></p>`;
  rightElement.innerHTML += `<ul class='topics'></ul>`;
  const topicsElement = document.querySelector(".topics");
  topicsElement.innerHTML += topics
    .map((topic) => {
      return `<li class='topic item'>
      <img class='${topic.title.toLowerCase()} topic-icon' src=${
        topic.icon
      } alt="icon" />
      <span>${topic.title}</span>
    </li>`;
    })
    .join("");

  const topicElement = document.querySelectorAll(".topic");
  topicElement.forEach((tl) => {
    tl.addEventListener("click", (event) => {
      const topic = event.target.innerText;
      const { title, icon } = frontendQuiz.getIconAndTitle(topic);

      topicHeading.innerHTML += `<img src=${icon} alt="icon" class=${title.toLowerCase()} /><span>${title}</span>`;
      const data = frontendQuiz.getDataFromTopic(topic);
      startQuiz(data);
    });
  });
}

function loadQuestion(question, questionNumber, totalQuestions) {
  leftElement.innerHTML += `<p class='question-number'><em>Question ${
    questionNumber + 1
  } of ${totalQuestions}</em></p>`;
  leftElement.innerHTML += `<p class='question'>${parseText(question)}</p>`;
}

function loadOptionsWithSubmit(options) {
  rightElement.innerHTML += `<form id='quiz-form'></form>`;
  const formElement = document.querySelector("#quiz-form");

  formElement.innerHTML += options
    .map((option, index) => {
      return `<div class='option item'>
      <span class='letter'>${LETTERS[index]}</span>
      <span class='option-content'>${parseText(option)}</span>
    </div>`;
    })
    .join("");
  formElement.innerHTML += `<button class='submit-answer item'>Submit Answer</button>`;
}

function startQuiz(topic) {
  resetPage();

  const frontendQuiz = new FrontEndQuiz(topic[0].questions);
  progressBar.style.display = "inherit";
  progress.style.width = `${
    ((frontendQuiz.counter + 1) / frontendQuiz.totalQuestions()) * 100
  }%`;
  questionWithOptions(frontendQuiz);
}

function questionWithOptions(frontendQuiz) {
  const item = frontendQuiz.getNextQuestion();

  const { question, options, answer } = item;
  loadQuestion(
    question,
    frontendQuiz.getQuestionNumber(),
    frontendQuiz.totalQuestions()
  );
  loadOptionsWithSubmit(options);
  submitAnswer(frontendQuiz, answer);
}
function highlightSelected(element) {
  element.addEventListener("click", (event) => {
    const activeElement = document.querySelector(".active");
    if (activeElement && activeElement !== element) {
      activeElement.classList.remove("active");
    }
    element.classList.toggle("active");
  });
}
function addIconToOption(element, type) {
  const icon = type === "correct" ? "icon-correct" : "icon-wrong";
  console.log(`<img src='/assets/images/'+${icon}+'.svg'`);
  return (element.innerHTML += `<img src='/assets/images/icon-${type}.svg' alt='icon' />`);
}
function showCorrectAnswerIfWrong(answer) {
  const optionsElement = document.querySelectorAll(".option");
  optionsElement.forEach((optionElement) => {
    const text = optionElement.querySelector(".option-content").innerText;
    if (text === answer) {
      optionElement.classList.add("correct-answer");
      addIconToOption(optionElement, CORRECT_ANSWER);
    }
  });
}

function disableOptionsAfterSubmit() {
  const topicElement = document.querySelectorAll(".option");
  topicElement.forEach((topic) => {
    topic.classList.add("disable");
  });
}

function onAnswerSubmit(item, answer) {
  const selectedAnswer = document.querySelector(".active");
  if (selectedAnswer) {
    selectedAnswer.classList.remove("active");
    if (
      item.compareAnswers(
        serializeText(
          selectedAnswer.querySelector(".option-content").innerText
        ),
        answer
      )
    ) {
      selectedAnswer.classList.add("correct-answer");
      addIconToOption(selectedAnswer, CORRECT_ANSWER);
    } else {
      selectedAnswer.classList.add("wrong-answer");
      addIconToOption(selectedAnswer, WRONG_ANSWER);
      showCorrectAnswerIfWrong(answer);
    }
  }
  this.innerHTML = "Next Question";
  disableOptionsAfterSubmit();
  this.addEventListener("click", function (event) {
    if (!item.isDone()) {
      resetPage();

      console.log(item.counter + 1, item.totalQuestions());
      progress.style.width = `${
        ((item.counter + 2) / item.totalQuestions()) * 100
      }%`;
      item.incrementCounter();
      questionWithOptions(item);
    } else {
      result(item);
    }
  });
}

function submitAnswer(item, answer) {
  const optionsElement = document.querySelectorAll(".option");
  const submitAnswer = document.querySelector(".submit-answer");
  optionsElement.forEach((oEl) => {
    highlightSelected(oEl);
  });
  submitAnswer.addEventListener("click", function (event) {
    event.preventDefault();
    onAnswerSubmit.call(this, item, answer);
  });
}

function result(item) {
  resetPage();
  progressBar.style.display = "none";
  progress.style.display = "none";
  leftElement.innerHTML += `<p class='text-lg'>Quiz completed</p>`;
  leftElement.innerHTML += `<p class='text-lg'><strong>You scored....</strong></p>`;
  rightElement.innerHTML += `
  <div class='score-card'>
    <div class='score-card-content'>
      <div class='topic-heading'>
        ${topicHeading.innerHTML}
      </div>
      <div class='score'>${item.score}</div>
      <p class='helper'>out of ${item.totalQuestions()}</p>
    </div>
    <button class="retake-button item">Play Again</button>
  </div>`;
}

buildHomeScreen();
themeToggle.addEventListener("change", function () {
  if (this.checked) {
    leftElement.classList.add("dark");
    leftElement.classList.remove("light");
    body.style.backgroundImage =
      'url("/assets/images/pattern-background-desktop-dark.svg")';
    body.style.backgroundColor = "#303D50";
    body.style.color = "#F4F6FA";
    lightThemeIcon.setAttribute("src", "/assets/images/icon-sun-light.svg");
    darkThemeIcon.setAttribute("src", "/assets/images/icon-moon-light.svg");
  } else {
    leftElement.classList.add("light");
    leftElement.classList.remove("dark");
    body.style.backgroundImage =
      'url("/assets/images/pattern-background-desktop-light.svg")';
    body.style.backgroundColor = "#F4F6FA";
    body.style.color = "#303D50";
    lightThemeIcon.setAttribute("src", "/assets/images/icon-sun-dark.svg");
    darkThemeIcon.setAttribute("src", "/assets/images/icon-moon-dark.svg");
  }
});
