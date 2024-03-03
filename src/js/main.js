import "../css/style.css";
import data from "../data/data.json" assert { type: "json" };
import FrontEndQuiz from "./FrontendQuiz";
import QuizData from "./QuizData";
const leftElement = document.querySelector(".left");
const rightElement = document.querySelector(".right");

const letters = ["A", "B", "C", "D"];

function resetPage() {
  leftElement.innerHTML = "";
  rightElement.innerHTML = "";
}

function serializeOption(option) {
  return option.replace("&lt;", /</g).replace("&gt;", />/g);
}

function parseOption(option) {
  return option.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function buildHomeScreen() {
  const frontendQuiz = new QuizData(data.quizzes);
  const topics = frontendQuiz.getTopics();

  leftElement.innerHTML += `<p class="heading">Welcome to the <strong>Frontend Quiz!</strong></p>`;
  leftElement.innerHTML += `<p class="helper"><em>Pick a subject to get started</em></p>`;
  rightElement.innerHTML += `<ul class='topics'></ul>`;
  const topicsElement = document.querySelector(".topics");
  topicsElement.innerHTML += topics
    .map((topic) => {
      return `<li class='topic item'>
      <img src=${topic.icon} alt="icon" />
      <span>${topic.title}</span>
    </li>`;
    })
    .join("");

  const topicElement = document.querySelectorAll(".topic");
  topicElement.forEach((tl) => {
    tl.addEventListener("click", (event) => {
      const topic = event.target.innerText;
      const data = frontendQuiz.getDataFromTopic(topic);
      startQuiz(data);
    });
  });
}

function loadQuestion(question, questionNumber, totalQuestions) {
  leftElement.innerHTML += `<p class='question-number'>Question ${
    questionNumber + 1
  } of ${totalQuestions} </p>`;
  leftElement.innerHTML += `<p class='question'>${parseOption(question)}</p>`;
}

function loadOptionsWithSubmit(options) {
  rightElement.innerHTML += `<form id='quiz-form'></form>`;
  const formElement = document.querySelector("#quiz-form");

  formElement.innerHTML += options
    .map((option, index) => {
      return `<div class='option item'>
      <span class='letter'>${letters[index]}</span>
      <span class='option-content'>${parseOption(option)}</span>
    </div>`;
    })
    .join("");
  formElement.innerHTML += `<button class='submit-answer item'>Submit Answer</button>`;
}

function startQuiz(topic) {
  resetPage();
  const frontendQuiz = new FrontEndQuiz(topic[0].questions);
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

function showCorrectAnswerIfWrong(answer) {
  const optionsElement = document.querySelectorAll(".option");
  optionsElement.forEach((optionElement) => {
    const text = optionElement.querySelector(".option-content").innerText;
    if (text === answer) {
      optionElement.classList.add("correct-answer");
    }
  });
}

function onAnswerSubmit(item, answer) {
  const selectedAnswer = document.querySelector(".active");
  if (selectedAnswer) {
    selectedAnswer.classList.remove("active");
    if (
      item.compareAnswers(
        serializeOption(
          selectedAnswer.querySelector(".option-content").innerText
        ),
        answer
      )
    )
      selectedAnswer.classList.add("correct-answer");
    else {
      selectedAnswer.classList.add("wrong-answer");
      showCorrectAnswerIfWrong(answer);
    }
  }
  this.innerHTML = "Next Question";
  this.addEventListener("click", function (event) {
    console.log("here", item.isDone(), item.getScore());
    if (!item.isDone()) {
      resetPage();
      item.incrementCounter();
      questionWithOptions(item);
    } else {
      console.log("Quiz is complete!");
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

buildHomeScreen();
