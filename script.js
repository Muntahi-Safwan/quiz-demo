// Quiz data
const quizData = [
    {
        question: "What is the capital of France?",
        options: ["London", "Berlin", "Paris", "Madrid"],
        correctAnswer: 2
    },
    {
        question: "Which planet is known as the Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        correctAnswer: 1
    },
    {
        question: "Who painted the Mona Lisa?",
        options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
        correctAnswer: 2
    },
    {
        question: "What is the largest organ in the human body?",
        options: ["Heart", "Brain", "Liver", "Skin"],
        correctAnswer: 3
    },
    {
        question: "Which element has the chemical symbol 'O'?",
        options: ["Gold", "Oxygen", "Iron", "Silver"],
        correctAnswer: 1
    },
    {
        question: "What is the largest ocean on Earth?",
        options: ["Atlantic Ocean", "Indian Ocean", "Pacific Ocean", "Arctic Ocean"],
        correctAnswer: 2
    },
    {
        question: "Who wrote 'Romeo and Juliet'?",
        options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
        correctAnswer: 1
    },
    {
        question: "What is the square root of 144?",
        options: ["10", "12", "14", "16"],
        correctAnswer: 1
    },
    {
        question: "Which country is known as the Land of the Rising Sun?",
        options: ["China", "Korea", "Japan", "Thailand"],
        correctAnswer: 2
    },
    {
        question: "What is the hardest natural substance on Earth?",
        options: ["Gold", "Iron", "Diamond", "Platinum"],
        correctAnswer: 2
    },
    {
        question: "Who invented the telephone?",
        options: ["Thomas Edison", "Alexander Graham Bell", "Nikola Tesla", "Albert Einstein"],
        correctAnswer: 1
    },
    {
        question: "What is the smallest prime number?",
        options: ["0", "1", "2", "3"],
        correctAnswer: 2
    },
    {
        question: "Which gas do plants absorb from the atmosphere?",
        options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
        correctAnswer: 1
    },
    {
        question: "What is the main component of the Sun?",
        options: ["Helium", "Oxygen", "Hydrogen", "Carbon"],
        correctAnswer: 2
    },
    {
        question: "Who painted 'The Starry Night'?",
        options: ["Vincent van Gogh", "Pablo Picasso", "Claude Monet", "Salvador Dalí"],
        correctAnswer: 0
    },
    {
        question: "What is the name of the planet that is closest to the Sun?",
        options: ["Mercury", "Venus", "Earth", "Mars"],
        correctAnswer: 1
    },
    {
        question: "What is the name of the planet that is farthest from the Sun?",
        options: ["Mercury", "Venus", "Earth", "Mars"],
        correctAnswer: 3
    },
    {
        question: "What is the name of the planet that is the second closest to the Sun?",
        options: ["Mercury", "Venus", "Earth", "Mars"],
        correctAnswer: 2
    },

];

// Quiz state
let currentPage = 0;
const questionsPerPage = 5;
const totalPages = Math.ceil(quizData.length / questionsPerPage);
let userAnswers = new Array(quizData.length).fill(null);
let timeLeft = 600; // 10 minutes in seconds
let quizSubmitted = false;

// DOM elements
const quizContent = document.getElementById('quiz-content');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const pagination = document.getElementById('pagination');
const timerElement = document.getElementById('timer');
const successModal = new bootstrap.Modal(document.getElementById('successModal'));

// Initialize quiz
function initializeQuiz() {
    renderQuestions();
    updatePagination();
    startTimer();
}

// Render questions for current page
function renderQuestions() {
    const startIdx = currentPage * questionsPerPage;
    const endIdx = Math.min(startIdx + questionsPerPage, quizData.length);
    
    quizContent.innerHTML = '';
    
    for (let i = startIdx; i < endIdx; i++) {
        const question = quizData[i];
        const isCorrect = quizSubmitted && userAnswers[i] === question.correctAnswer;
        const isWrong = quizSubmitted && userAnswers[i] !== null && userAnswers[i] !== question.correctAnswer;
        
        const questionHtml = `
            <div class="question-container ${isCorrect ? 'correct-answer' : ''} ${isWrong ? 'wrong-answer' : ''}">
                <h5 class="mb-3">Question ${i + 1}: ${question.question}</h5>
                <div class="options">
                    ${question.options.map((option, optionIndex) => `
                        <div class="option-container">
                            <input type="radio" name="question${i}" id="q${i}o${optionIndex}" 
                                ${userAnswers[i] === optionIndex ? 'checked' : ''}
                                ${quizSubmitted ? 'disabled' : ''}
                                onchange="handleAnswer(${i}, ${optionIndex})">
                            <label for="q${i}o${optionIndex}" class="${quizSubmitted && optionIndex === question.correctAnswer ? 'correct-option' : ''} 
                                                                    ${quizSubmitted && optionIndex === userAnswers[i] && optionIndex !== question.correctAnswer ? 'wrong-option' : ''}">
                                ${option}
                                ${quizSubmitted && optionIndex === question.correctAnswer ? 
                                    '<span class="badge bg-success ms-2"><i class="bi bi-check-lg"></i> Correct</span>' : ''}
                                ${quizSubmitted && optionIndex === userAnswers[i] && optionIndex !== question.correctAnswer ? 
                                    '<span class="badge bg-danger ms-2"><i class="bi bi-x-lg"></i> Incorrect</span>' : ''}
                            </label>
                        </div>
                    `).join('')}
                </div>
                ${quizSubmitted && isWrong ? `
                    <div class="mt-3 text-danger">
                        <strong>Correct Answer:</strong> ${question.options[question.correctAnswer]}
                    </div>
                ` : ''}
            </div>
        `;
        quizContent.innerHTML += questionHtml;
    }

    // Update navigation buttons
    prevBtn.disabled = currentPage === 0;
    if (currentPage === totalPages - 1) {
        nextBtn.textContent = quizSubmitted ? 'Review Complete' : 'Submit';
        nextBtn.classList.remove('btn-primary');
        nextBtn.classList.add(quizSubmitted ? 'btn-secondary' : 'btn-success');
    } else {
        nextBtn.textContent = 'Next';
        nextBtn.classList.remove('btn-success', 'btn-secondary');
        nextBtn.classList.add('btn-primary');
    }
}

// Handle user's answer
function handleAnswer(questionIndex, answerIndex) {
    if (!quizSubmitted) {
        userAnswers[questionIndex] = answerIndex;
        updatePagination();
    }
}

// Update pagination indicators
function updatePagination() {
    pagination.innerHTML = '';
    for (let i = 0; i < totalPages; i++) {
        const startIdx = i * questionsPerPage;
        const endIdx = Math.min(startIdx + questionsPerPage, quizData.length);
        const isAnswered = userAnswers.slice(startIdx, endIdx).every(answer => answer !== null);
        
        const pageIndicator = document.createElement('div');
        pageIndicator.className = `page-indicator ${currentPage === i ? 'active' : ''} ${isAnswered ? 'answered' : ''}`;
        pageIndicator.textContent = i + 1;
        pageIndicator.onclick = () => navigateToPage(i);
        pagination.appendChild(pageIndicator);
    }
}

// Navigate to specific page
function navigateToPage(pageNumber) {
    currentPage = pageNumber;
    renderQuestions();
    updatePagination();
}

// Handle next/submit button click
nextBtn.addEventListener('click', () => {
    if (currentPage === totalPages - 1 && !quizSubmitted) {
        submitQuiz();
    } else if (!quizSubmitted) {
        currentPage++;
        renderQuestions();
        updatePagination();
    }
});

// Handle previous button click
prevBtn.addEventListener('click', () => {
    if (currentPage > 0) {
        currentPage--;
        renderQuestions();
        updatePagination();
    }
});

// Submit quiz
function submitQuiz() {
    clearInterval(timerInterval);
    quizSubmitted = true;
    const score = calculateScore();
    const scoreDisplay = document.getElementById('score-display');
    scoreDisplay.innerHTML = `
        <div class="alert alert-success">
            <h5>Your Score: ${score} / ${quizData.length}</h5>
            <p>Time Taken: ${formatTime(600 - timeLeft)}</p>
        </div>
        <p class="text-muted">Review your answers by navigating through the questions.</p>
    `;
    successModal.show();
    currentPage = 0;
    renderQuestions();
    updatePagination();
}

// Calculate score
function calculateScore() {
    return userAnswers.reduce((score, answer, index) => {
        return score + (answer === quizData[index].correctAnswer ? 1 : 0);
    }, 0);
}

// Timer functionality
let timerInterval;

function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            submitQuiz();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerElement.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

// Initialize the quiz when the page loads
document.addEventListener('DOMContentLoaded', initializeQuiz);