const puzzleGrid = document.getElementById("puzzle-grid");
const piecesContainer = document.getElementById("pieces-container");
const retryButton = document.getElementById("retry-button");
const popup = document.getElementById("popup");

const quizContainer = document.getElementById("quiz-container");
const quizQuestion = document.getElementById("quiz-question");
const quizOptions = document.getElementById("quiz-options");
const quizPopup = document.getElementById("quiz-popup");
const quizFeedback = document.getElementById("quiz-feedback");
const unlockButton = document.getElementById("unlock-button");
const quizRetryButton = document.getElementById("quiz-retry-button");

const levels = [
  { 
    imageSrc: "level-1.jpeg", 
    quiz: {
      question: "Which of the following BIS standards governs the quality of cement in India?",
      options: [
        { text: "a) IS 8112", correct: true },
        { text: "b) IS 2062", correct: false },
        { text: "c) IS 2706", correct: false },
        { text: "d) IS 1786", correct: false }
      ]
    }
  },
  { 
    imageSrc: "level-2.jpeg", 
    quiz: {
      question: "What is the focus of IS 3370?",
      options: [
        { text: "a) Testing the compressive strength of concrete", correct: false },
        { text: "b) Protection of reinforced concrete structures against corrosion", correct: true },
        { text: "c) Standardization of cement mixing methods", correct: false },
        { text: "d) Designing building foundations", correct: false }
      ]
    }
  },
  { 
    imageSrc: "level-3.jpeg", 
    quiz: {
      question: "Which BIS standard is used for determining the compressive strength of concrete blocks?",
      options: [
        { text: "a) IS 1443", correct: false },
        { text: "b) IS 2185", correct: true },
        { text: "c) IS 9000", correct: false },
        { text: "d) IS 2116", correct: false }
      ]
    }
  }
];

let currentLevelIndex = 0;

const rows = 4, cols = 4;  
const pieceSize = 100;
const pieces = [];

// Initialize the puzzle for the current level
function loadLevel(levelIndex) {
  const level = levels[levelIndex];
  const image = new Image();
  image.src = level.imageSrc;

  image.onload = () => {
    createPuzzle(image);
    document.getElementById("hint-image").src = level.imageSrc;
  };

  // Hide quiz and puzzle sections initially, reset for new level
  quizContainer.classList.add("hidden");
  popup.classList.add("hidden");
  retryButton.classList.remove("hidden");
}

// Create the puzzle grid and pieces
function createPuzzle(image) {
  puzzleGrid.innerHTML = "";
  piecesContainer.innerHTML = "";
  pieces.length = 0;

  for (let i = 0; i < rows * cols; i++) {
    const cell = document.createElement("div");
    cell.classList.add("grid-cell");
    cell.dataset.index = i;
    puzzleGrid.appendChild(cell);
  }

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const piece = {
        x: col * pieceSize,
        y: row * pieceSize,
        correctIndex: row * cols + col,
      };
      pieces.push(piece);
    }
  }

  pieces.sort(() => Math.random() - 0.5);

  pieces.forEach((piece) => {
    const pieceDiv = document.createElement("div");
    pieceDiv.classList.add("piece");
    pieceDiv.style.backgroundImage = `url(${image.src})`;
    pieceDiv.style.backgroundPosition = `-${piece.x}px -${piece.y}px`;
    pieceDiv.style.width = `${pieceSize}px`;
    pieceDiv.style.height = `${pieceSize}px`;
    pieceDiv.draggable = true;
    pieceDiv.dataset.index = piece.correctIndex;
    piecesContainer.appendChild(pieceDiv);
  });

  enableDragAndDrop();
}

// Handle drag and drop
let draggedPiece = null;

function enableDragAndDrop() {
  const allPieces = document.querySelectorAll(".piece");
  const allCells = document.querySelectorAll(".grid-cell");

  allPieces.forEach((piece) => {
    piece.addEventListener("dragstart", (e) => {
      draggedPiece = e.target;
    });
  });

  allCells.forEach((cell) => {
    cell.addEventListener("dragover", (e) => {
      e.preventDefault();
    });

    cell.addEventListener("drop", (e) => {
      if (!draggedPiece) return;

      if (cell.firstChild) {
        piecesContainer.appendChild(cell.firstChild);
      }

      cell.appendChild(draggedPiece);
      checkIfSolved();
    });
  });

  piecesContainer.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  piecesContainer.addEventListener("drop", (e) => {
    if (draggedPiece) {
      piecesContainer.appendChild(draggedPiece);
    }
  });
}

function checkIfSolved() {
  const allCells = Array.from(puzzleGrid.children);
  const isSolved = allCells.every((cell, index) => {
    const piece = cell.firstChild;
    return piece && parseInt(piece.dataset.index) === index;
  });

  if (isSolved) {
    showPopup();
  }
}

function showPopup() {
  popup.classList.remove("hidden");
  setTimeout(() => {
    popup.classList.add("hidden");
    loadQuiz(currentLevelIndex);
  }, 2000);
}

// Load the quiz for the current level
function loadQuiz(levelIndex) {
  const quiz = levels[levelIndex].quiz;
  quizContainer.classList.remove("hidden");
  quizQuestion.textContent = quiz.question;
  quizOptions.innerHTML = "";

  quiz.options.forEach((option) => {
    const button = document.createElement("button");
    button.classList.add("answer");
    button.textContent = option.text;

    if (option.correct) {
      button.dataset.correct = "true";
    }

    quizOptions.appendChild(button);

    button.addEventListener("click", (e) => {
      const isCorrect = e.target.dataset.correct === "true";

      quizPopup.style.display = "block";

      if (isCorrect) {
        quizFeedback.textContent = "Correct! Get ready for the next puzzle.";
        unlockButton.classList.remove("hidden");
        unlockButton.onclick = () => {
          quizPopup.style.display = "none";
          quizContainer.classList.add("hidden");
          currentLevelIndex++;
          if (currentLevelIndex < levels.length) {
            loadLevel(currentLevelIndex);
          } else {
            quizFeedback.textContent = "Congratulations! You finished all puzzles.";
            unlockButton.textContent = "Restart";
            unlockButton.onclick = () => {
              // Restart from the first level
              currentLevelIndex = 0;
              loadLevel(currentLevelIndex);
            };
          }
        };
      } else {
        quizFeedback.textContent = "Wrong! Try again.";
        quizRetryButton.classList.remove("hidden");
        quizRetryButton.onclick = () => {
          quizPopup.style.display = "none";
        };
      }
    });
  });
}

// Retry button functionality
retryButton.addEventListener("click", () => {
  loadLevel(currentLevelIndex);
  popup.classList.add("hidden");
});

// Load the first level on start
loadLevel(currentLevelIndex);
