
/* ==========================================================================
   1. STATE & CONFIGURATION
   ========================================================================== */
const state = {
    totalSteps: 0,
    currentStep: 0,
    results: [],
    participant: {
        id: "",
        age: "",
        gender: "",
        tools: "" 
    },
    timerInterval: null
};

function initState(dataLength) {
    state.totalSteps = dataLength;
    state.currentStep = 0;
    state.results = [];
    state.participant = {
        id: "",
        age: "",
        gender: "",
        tools: ""
    };
    if (state.timerInterval) clearInterval(state.timerInterval);
}

/* ==========================================================================
   2. UTILITIES
   ========================================================================== */
function generateRandomId() {
    return 'P' + Math.random().toString(36).substr(2, 6).toUpperCase();
}

function hideAllScreens() {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => screen.classList.add('hidden'));
}

function downloadCSV(results, participant) {
    if (results.length === 0) {
        alert("No results to download.");
        return;
    }

    let csvContent = "\uFEFF"; // BOM
    // Header
    csvContent += "Participant_ID,Age,Gender,Tools_Used,Step,Context,Image,Question,Answer,Difficulty,Comment\n";

    // Rows
    results.forEach(row => {
        const cleanContext = row.context.replace(/"/g, '""');
        const cleanQuestion = row.question.replace(/"/g, '""');
        const cleanAnswer = (row.answer || "").replace(/"/g, '""');
        const cleanComment = (row.comment || "").replace(/"/g, '""');
        const cleanTools = (participant.tools || "").replace(/"/g, '""');
        
        const rowString = [
            `"${participant.id}"`,
            `"${participant.age}"`,
            `"${participant.gender}"`,
            `"${cleanTools}"`,
            row.step,
            `"${cleanContext}"`,
            `"${row.image}"`,
            `"${cleanQuestion}"`,
            `"${cleanAnswer}"`,
            `"${row.difficulty}"`,
            `"${cleanComment}"`
        ].join(',');

        csvContent += rowString + "\n";
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `experiment_results_${participant.id}_${new Date().toISOString().slice(0,10)}.csv`;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/* ==========================================================================
   3. SCREEN LOGIC
   ========================================================================== */

// --- Demographics Screen ---
const demoScreen = document.getElementById('demographic-screen');
const progressContainer = document.getElementById('progress-container');
const idInput = document.getElementById('participant-id');
const ageInput = document.getElementById('participant-age');
const genderInput = document.getElementById('participant-gender');
const nextBtn = document.getElementById('to-background-btn');
const randomIdBtn = document.getElementById('generate-id-btn');

function initDemographics() {
    randomIdBtn.addEventListener('click', () => {
        idInput.value = generateRandomId();
    });

    nextBtn.addEventListener('click', () => {
        const pId = idInput.value.trim();
        const pAge = ageInput.value.trim();
        const pGender = genderInput.value;

        if (!pId) {
            alert("Please enter a Participant ID or generate one.");
            return;
        }
        if (!pAge) {
             alert("Please enter your age.");
             return;
        }

        // Save partial state
        state.participant.id = pId;
        state.participant.age = pAge;
        state.participant.gender = pGender;

        // Proceed
        initBackgroundScreen();
    });
}

function showDemographics() {
    hideAllScreens();
    progressContainer.classList.add('hidden');
    demoScreen.classList.remove('hidden');
    
    // Auto-fill random ID if empty
    if (!idInput.value) {
        idInput.value = generateRandomId();
    }
}

// --- Background Screen ---
const bgScreen = document.getElementById('background-screen');
const toolsInput = document.getElementById('participant-tools');
const startBtn = document.getElementById('start-experiment-btn');

function initBackground() {
    startBtn.addEventListener('click', () => {
        const tools = toolsInput.value.trim();
        
        // Save state
        state.participant.tools = tools;

        // Proceed to experiment
        showContextStep();
    });
}

function initBackgroundScreen() {
    hideAllScreens();
    progressContainer.classList.add('hidden');
    bgScreen.classList.remove('hidden');
}

// --- Context Screen ---
const ctxScreen = document.getElementById('context-screen');
const currentStepSpan = document.getElementById('current-step');
const contextText = document.getElementById('context-text');
const startTrialBtn = document.getElementById('start-trial-btn');

function initContext() {
    startTrialBtn.addEventListener('click', () => {
        showStimulusStep();
    });
}

function showContextStep() {
    console.log("Current Step:", state.currentStep, "Total Steps:", state.totalSteps);
    if (state.currentStep >= state.totalSteps) {
        showFinishScreen();
        return;
    }

    hideAllScreens();
    // Show progress container when entering the experiment phase
    progressContainer.classList.remove('hidden');
    ctxScreen.classList.remove('hidden');
    
    // Update progress
    currentStepSpan.textContent = state.currentStep + 1;
    
    // Load data
    const data = window.experimentData[state.currentStep];
    contextText.textContent = data.context;
}

// --- Stimulus Screen ---
const stimScreen = document.getElementById('stimulus-screen');
const targetImage = document.getElementById('target-image');
const stimulusQuestion = document.getElementById('stimulus-question');
const timerDisplay = document.getElementById('timer-display');

function showStimulusStep() {
    hideAllScreens();
    stimScreen.classList.remove('hidden');

    const data = window.experimentData[state.currentStep];
    targetImage.src = data.image;
    stimulusQuestion.textContent = data.question;
    
    // Timer setup
    let timeLeft = data.timeLimit / 1000;
    timerDisplay.textContent = `Time left: ${timeLeft} seconds`;
    
    if (state.timerInterval) clearInterval(state.timerInterval);

    state.timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `Time left: ${timeLeft} seconds`;
        
        if (timeLeft <= 0) {
            clearInterval(state.timerInterval);
            showResponseStep();
        }
    }, 1000);
}

// --- Response Screen ---
const respScreen = document.getElementById('response-screen');
const respNextBtn = document.getElementById('next-btn');
const answerInput = document.getElementById('user-answer');
const difficultyInput = document.getElementById('difficulty-rating');
const commentInput = document.getElementById('user-comment');

function initResponse() {
    respNextBtn.addEventListener('click', () => {
        const answer = answerInput.value.trim();
        
        if (!answer) {
            alert("Please provide an answer before proceeding.");
            return;
        }

        const data = window.experimentData[state.currentStep];
        
        state.results.push({
            step: state.currentStep + 1,
            context: data.context,
            image: data.image,
            question: data.question,
            answer: answer,
            difficulty: difficultyInput.value,
            comment: commentInput.value
        });

        state.currentStep++;
        showContextStep();
    });
}

function showResponseStep() {
    if (state.timerInterval) clearInterval(state.timerInterval);

    hideAllScreens();
    respScreen.classList.remove('hidden');

    answerInput.value = "";
    difficultyInput.value = "4"; 
    commentInput.value = "";
}

// --- Finish Screen ---
const finScreen = document.getElementById('finish-screen');
const downloadBtn = document.getElementById('download-btn');
const restartBtn = document.getElementById('restart-btn');

function initFinish() {
    downloadBtn.addEventListener('click', () => {
        downloadCSV(state.results, state.participant);
    });

    restartBtn.addEventListener('click', () => {
        if(confirm("Are you sure you want to restart? All data will be lost.")) {
            mainInit();
        }
    });
}

function showFinishScreen() {
    hideAllScreens();
    progressContainer.classList.add('hidden');
    finScreen.classList.remove('hidden');
}


/* ==========================================================================
   4. MAIN INITIALIZATION
   ========================================================================== */
const totalStepsSpan = document.getElementById('total-steps');

function mainInit() {
    // Initialize State
    if (typeof window.experimentData === 'undefined') {
        console.error("experimentData is missing!");
        return;
    }

    initState(window.experimentData.length);
    
    // Update UI for total steps
    if (totalStepsSpan) {
        totalStepsSpan.textContent = window.experimentData.length;
    }

    // Show first screen
    showDemographics();
}

// Wire up event listeners once
function bindEvents() {
    initDemographics();
    initBackground();
    initContext();
    initResponse();
    initFinish();
}

// Start
document.addEventListener('DOMContentLoaded', () => {
    bindEvents();
    mainInit();
});
