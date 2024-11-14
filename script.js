// Questions (they're pre-made)
const questions = [
  ["4 + 5", 4 + 5, 1], // Addition
  ["8 + 6", 8 + 6, 1],
  ["3 + 2 + 6", 3 + 2 + 6, 1],
  ["7 + 11", 7 + 11, 1],
  ["12 + 10", 12 + 10, 1],
  ["6 - 4", 6 - 4, 1], // Subtraction
  ["12 - 5", 12 - 5, 1],
  ["3 - 7", 3 - 7, 1],
  ["6 - 3 + 8", 6 - 3 + 8, 1],
  ["-5 + 4 - 2", -5 + 4 - 2, 1],
  ["2 * 4", 2 * 4, 2], // Multiplication
  ["5 * 3", 5 * 3, 3],
  ["4 * 3 + 6", 4 * 3 + 6, 3],
  ["4 * (2 + 5)", 4 * (2 + 5), 4],
  ["-2 * 5", -2 * 5, 2],
  ["8 / 2", 8 / 2, 1], // Division
  ["18 / 3", 18 / 3, 1],
  ["6 / 2 * 5", (6 / 2) * 5, 3],
  ["20 / (2 + 3)", 20 / (2 + 3), 1],
  ["9 + 12 / 4", 9 + 12 / 4, 3],
  ["5 + 6 * 3 - 2", 5 + 6 * 3 - 2, 3], // Mixed
  ["-11 + 6 * (1 + 2)", -11 + 6 * (1 + 2), 1],
  ["4 * 2 + 3 * 5", 4 * 2 + 3 * 5, 2],
  ["16 / 4 + 9 / 3", 16 / 4 + 9 / 3, 1],
  ["30 / (2 + 4) + 12", 30 / (2 + 4) + 12, 1],
];
const expressions = [];

// Global variables
let questionNumber = 1,
  questionsAnswered = 0;
let answered = false;
let correct = 0,
  incorrect = 0;
let timeSpent = 0;

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("play").addEventListener("click", startGame);
  document.getElementById("retry").addEventListener("click", startGame);
  document.getElementById("back").addEventListener("click", () => {
    document.getElementById("results").style.display = "none";
    document.getElementById("instructions").style.display = "block";
    document.getElementById("answers").innerHTML = "";
    answered = false;
  });
});

for (const question of questions)
  expressions.push(makeExpression(question[0], question[1], question[2]));

function randomNumber(min, max) {
  /* Don't worry about messing up the order, it still works
     and produces the same result */
  return Math.floor(Math.random() * (max + 1 - min)) + min;
}

function renderTime(time) {
  const seconds = time >= 60 ? Math.floor(time) % 60 : time.toFixed(1);
  const minutes = Math.floor(time / 60);
  let text = time >= 60 ? `${minutes}m ${seconds}s` : `${seconds}s`;
  text = seconds === 0 ? `${minutes}m` : text;

  return text;
}

function startGame() {
  const screens = document.querySelectorAll("main div");

  for (const screen of screens) {
    if (screen.id != "questions") screen.style.display = "none";
    else screen.style.display = "block";
  }

  questionNumber = 1;
  questionsAnswered = correct = incorrect = 0;
  timeSpent = 0;
  makeQuestion();
}

function makeQuestion() {
  // Makes the question and the possible answers
  const currentQuestion = expressions[questionNumber - 1];
  const correctAnswer = parseFloat(currentQuestion.answer.toFixed(2));
  const differences = currentQuestion.differences;
  const answers = document.getElementById("answers");

  let differenceArray = [];
  let operation = currentQuestion.text;

  for (const difference of differences) differenceArray.push(difference);

  operation = operation.replaceAll("*", "&times;");
  operation = operation.replaceAll("/", "&div;");

  document.getElementById(
    "question-number"
  ).innerHTML = `Question ${questionNumber}/${questions.length}`;
  document.getElementById("question").innerHTML = operation;

  while (differenceArray.length) {
    const answerNumber = randomNumber(0, differenceArray.length - 1);
    const answerBtn = document.createElement("li");
    const answer = document.createTextNode(
      correctAnswer + differenceArray[answerNumber]
    );

    answerBtn.appendChild(answer);
    answerBtn.classList.add("answer");
    if (parseFloat(answerBtn.innerHTML) === correctAnswer)
      answerBtn.classList.add("correct");
    answers.appendChild(answerBtn);
    answerBtn.onclick = () => {
      checkAnswer(answerBtn);
      answered = true;
      questionsAnswered++;
    };

    differenceArray.splice(answerNumber, 1);
  }

  setTimer(10);
}

function nextQuestion() {
  if (questionNumber != questions.length) {
    setTimeout(() => {
      questionNumber++;
      document.getElementById("answers").innerHTML = "";
      answered = false;
      makeQuestion();
    }, 1000);
  } else {
    setTimeout(() => {
      document.getElementById("questions").style.display = "none";
      document.getElementById("results").style.display = "block";
    }, 1000);

    displayScore();
    displayTime();
  }
}

function makeExpression(operation, answer, difference) {
  const expression = {};

  difference = Math.abs(difference);

  expression.text = operation;
  expression.answer = answer;
  expression.differences = [-difference, 0, difference, 2 * difference];

  return expression;
}

function setTimer(time) {
  const timeRemaining = document.getElementById("current-time");
  let progress = 100;
  let interval;

  interval = setInterval(() => {
    progress -= 1 / time;
    timeRemaining.style.width = `${progress}%`;

    if (progress <= 0 || answered) {
      timeSpent += ((100 - progress) / 100) * time;
      showAnswer();
      clearInterval(interval);
    }
  }, 10);
}

function checkAnswer(answer) {
  if (!answer.classList.contains("correct")) {
    const btn = answer.style;
    btn.background = "#dc143c";
    btn.boxShadow = "0 6px #8b000099";
    btn.color = "#fff";

    incorrect++;
  } else {
    correct++;
  }
}

function showAnswer() {
  const correctBtn = document.querySelector(".correct").style;

  correctBtn.background = "#32cd32";
  correctBtn.boxShadow = "0 6px #00640099";
  correctBtn.color = "#fff";

  for (const answer of document.querySelectorAll(".answer")) {
    answer.onclick = undefined;
    answer.style.cursor = "default";
  }

  nextQuestion();
}

function gradeScore() {
  const score = correct * 4;
  const gradedScore = {};
  let grade = "",
    comment = "";

  if (score === 100) grade = "A+";
  else if (score >= 90 && score < 100) grade = "A";
  else if (score >= 80 && score < 90) grade = "B";
  else if (score >= 70 && score < 80) grade = "C";
  else if (score >= 60 && score < 70) grade = "D";
  else grade = "F";

  switch (grade) {
    case "A+":
      comment = `You got a perfect score!! 
      Try harder math quizzes if you think this one is easy!`;
      break;
    case "A":
      comment = "You did great! I'm proud of you on this one.";
      break;
    case "B":
      comment = `You did really well! 
      Practice more and you'll achieve a higher score!`;
      break;
    case "C":
      comment = `You did pretty well! 
      Pay attention to the questions and you'll achieve a higher score.`;
      break;
    case "D":
      comment = "You did good. Of course, you can do better. Don't give up!";
      break;
    default:
      comment =
        "You should improve your math skills and try again. You can do it!";
  }

  gradedScore.score = score;
  gradedScore.grade = grade;
  gradedScore.comment = comment;

  return gradedScore;
}

function displayScore() {
  const numbers = document.querySelectorAll("#question-results .number");
  const gradedScore = gradeScore();

  document.getElementById("score-number").innerHTML = gradedScore.score;
  document.getElementById("grade").innerHTML = `(${gradedScore.grade})`;
  document.getElementById("comment").innerHTML = gradedScore.comment;

  numbers[0].innerHTML = questionsAnswered;
  numbers[1].innerHTML = correct;
  numbers[2].innerHTML = incorrect;
}

function displayTime() {
  const avgTimeSpent = timeSpent / questions.length;
  const numbers = document.querySelectorAll("#time-results .number");

  numbers[0].innerHTML = renderTime(timeSpent);
  numbers[1].innerHTML = renderTime(avgTimeSpent);
}
