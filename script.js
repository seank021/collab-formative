const totalSteps = experimentData.length;
let currentStep = 0;
let results = [];
let timerInterval;

// DOM
const currentStepSpan = document.getElementById('current-step');
const totalStepsSpan = document.getElementById('total-steps');

// Component elements
const contextScreen = document.getElementById('context-screen');
const stimulusScreen = document.getElementById('stimulus-screen');
const responseScreen = document.getElementById('response-screen');
const finishScreen = document.getElementById('finish-screen');
const progressContainer = document.getElementById('progress-container');

// Context screen elements
const contextText = document.getElementById('context-text');
const startTrialBtn = document.getElementById('start-trial-btn');

// Stimulus screen elements
const targetImage = document.getElementById('target-image');
const stimulusQuestion = document.getElementById('stimulus-question');
const timerDisplay = document.getElementById('timer-display');

// Response screen elements
const responseNextBtn = document.getElementById('next-btn');
const downloadBtn = document.getElementById('download-btn');
const restartBtn = document.getElementById('restart-btn');
const commentInput = document.getElementById('user-comment');
const answerInput = document.getElementById('user-answer');
const difficultyInput = document.getElementById('difficulty-rating'); 

// Init
function init() {
    currentStep = 0;
    results = [];
    totalStepsSpan.textContent = totalSteps;
    showContextStep();
}

// 1st step: Show context (prior information)
function showContextStep() {
    if (currentStep >= totalSteps) {
        finishExperiment();
        return;
    }

    // Screen transition
    finishScreen.classList.add('hidden');
    responseScreen.classList.add('hidden');
    stimulusScreen.classList.add('hidden');
    contextScreen.classList.remove('hidden');
    
    // Update progress
    currentStepSpan.textContent = currentStep + 1;
    
    // Load data for current step
    const data = experimentData[currentStep];
    contextText.textContent = data.context;
}

// 2nd step: Show stimulus (image + question) with timer
function showStimulusStep() {
    contextScreen.classList.add('hidden');
    stimulusScreen.classList.remove('hidden');

    const data = experimentData[currentStep];
    targetImage.src = data.image;
    stimulusQuestion.textContent = data.question;
    
    // Timer setup
    let timeLeft = data.timeLimit / 1000;
    timerDisplay.textContent = `Time left: ${timeLeft} seconds`;
    
    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `Time left: ${timeLeft} seconds`;
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            showResponseStep();
        }
    }, 1000);
}

// 3rd step: Collect response and judgment
function showResponseStep() {
    stimulusScreen.classList.add('hidden');
    responseScreen.classList.remove('hidden');

    // Reset inputs
    answerInput.value = "";
    difficultyInput.value = "4";
}

// Event listeners

// Click on "Start Trial" button
startTrialBtn.addEventListener('click', () => {
    showStimulusStep();
});

// Click on "Next" button after response
responseNextBtn.addEventListener('click', () => {
    // Validation
    const answer = answerInput.value.trim();
    if (!answer) {
        alert("Please provide an answer before proceeding.");
        return;
    }

    const data = experimentData[currentStep];

    // Save results
    results.push({
        step: currentStep + 1,
        context: data.context,
        image: data.image,
        question: data.question,
        answer: answer,
        judgment: selectedJudgment.value,
        difficulty: difficultyInput.value,
        comment: commentInput.value
    });

    currentStep++;
    showContextStep();
});

// End of experiment
function finishExperiment() {
    contextScreen.classList.add('hidden');
    stimulusScreen.classList.add('hidden');
    responseScreen.classList.add('hidden');
    finishScreen.classList.remove('hidden');
}

// Download results as CSV
function downloadCSV() {
    if (results.length === 0) {
        alert("No results to download.");
        return;
    }

    let csvContent = "\uFEFF";
    // Header
    csvContent += "Step,Context,Image,Question,Answer,Difficulty,Comment\n";

    results.forEach(row => {
        const cleanContext = row.context.replace(/"/g, '""');
        const cleanQuestion = row.question.replace(/"/g, '""');
        const cleanAnswer = (row.answer || "").replace(/"/g, '""');
        const cleanComment = (row.comment || "").replace(/"/g, '""');
        
        const rowString = `${row.step},"${cleanContext}","${row.image}","${cleanQuestion}","${cleanAnswer}","${row.difficulty}","${cleanComment}"`;
        csvContent += rowString + "\n";
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `experiment_results_${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

downloadBtn.addEventListener('click', downloadCSV);
restartBtn.addEventListener('click', init);

// Start the experiment
init();
