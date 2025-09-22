const container = document.querySelector(".cards");
const scoreEl = document.getElementById("score");
const guessesEl = document.getElementById("guesses");
const streakEl = document.getElementById("streak");
const timeEl = document.getElementById("time");
const accuracyEl = document.getElementById("accuracy");
const restartBtn = document.getElementById("restart");
const resultDiv = document.getElementById("result");
const finalScore = document.getElementById("finalScore");
const finalGuesses = document.getElementById("finalGuesses");
const finalAccuracy = document.getElementById("finalAccuracy");
const finalTime = document.getElementById("finalTime");
const playAgainBtn = document.getElementById("playAgain");
const backHomeBtn = document.getElementById("backHome");

let cards = [];
let cardOne, cardTwo;
let disableDeck = false;
let score = 0;
let totalGuesses = 0;
let streak = 0;
let timer;
let seconds = 0;

const urlParams = new URLSearchParams(window.location.search);
let mode = urlParams.get("mode") || "easy";

function createCards() {
  container.innerHTML = "";
  for (let i = 1; i <= 8; i++) {
    const cardHTML = `
      <li class="card">
        <div class="front"><img src="images/que_icon.svg" alt="?"></div>
        <div class="back"><img src="images/img-${i}.png" alt="${i}"></div>
      </li>`;
    container.insertAdjacentHTML("beforeend", cardHTML);
  }
  container.innerHTML += container.innerHTML;
  cards = document.querySelectorAll(".card");
}

function startTimer() {
  clearInterval(timer);
  seconds = 0;
  timer = setInterval(() => {
    seconds++;
    timeEl.textContent = seconds;
  }, 1000);
}

function shuffleCards() {
  let arr = Array.from({ length: 8 }, (_, i) => i + 1);
  arr = [...arr, ...arr];
  arr.sort(() => Math.random() - 0.5);
  cards.forEach((card, i) => {
    card.classList.remove("flip");
    card.querySelector(".back img").src = `images/img-${arr[i]}.png`;
    card.addEventListener("click", flipCard);
  });
}

function flipCard() {
  if (this !== cardOne && !disableDeck) {
    this.classList.add("flip");
    if (!cardOne) {
      cardOne = this;
      return;
    }
    cardTwo = this;
    disableDeck = true;

    totalGuesses++;
    guessesEl.textContent = totalGuesses;

    const img1 = cardOne.querySelector(".back img").src;
    const img2 = cardTwo.querySelector(".back img").src;

    if (img1 === img2) {
      score++;
      streak++;
      scoreEl.textContent = score;
      streakEl.textContent = streak;

      if (mode === "standard") {
        setTimeout(() => {
          cardOne.classList.remove("flip");
          cardTwo.classList.remove("flip");
          cardOne = cardTwo = "";
          disableDeck = false;
        }, 800);
      } else {
        cardOne.removeEventListener("click", flipCard);
        cardTwo.removeEventListener("click", flipCard);
        cardOne = cardTwo = "";
        disableDeck = false;
      }
    } else {
      streak = 0;
      streakEl.textContent = streak;
      setTimeout(() => {
        cardOne.classList.remove("flip");
        cardTwo.classList.remove("flip");
        cardOne = cardTwo = "";
        disableDeck = false;
      }, 1000);
    }

    const accuracy = ((score / totalGuesses) * 100).toFixed(2);
    accuracyEl.textContent = accuracy;

    if (score === 8) {
      clearInterval(timer);
      setTimeout(showResult, 500);
    }
  }
}

function showResult() {
  finalScore.textContent = score;
  finalGuesses.textContent = totalGuesses;
  finalAccuracy.textContent = accuracyEl.textContent;
  finalTime.textContent = seconds;
  resultDiv.style.display = "block";
}

function shuffleGame() {
  score = totalGuesses = streak = 0;
  scoreEl.textContent = score;
  guessesEl.textContent = totalGuesses;
  streakEl.textContent = streak;
  accuracyEl.textContent = 0;
  resultDiv.style.display = "none";
  createCards();
  shuffleCards();
  startTimer();
}

createCards();
shuffleCards();
startTimer();
restartBtn.addEventListener("click", shuffleGame);
playAgainBtn.addEventListener("click", shuffleGame);
backHomeBtn.addEventListener(
  "click",
  () => (window.location.href = "index.html")
);
cards.forEach((card) => card.addEventListener("click", flipCard));
