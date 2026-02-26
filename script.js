
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
        role: "",
        roleOther: "",
        meetingFreq: "",
        langComfort: "",
        aiUsage: "",
        aiPurpose: [],
        reEntryExp: "",
        reEntryStrategy: "",
        speakingConf: "",
        email: ""
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
        role: "",
        roleOther: "",
        meetingFreq: "",
        langComfort: "",
        aiUsage: "",
        aiPurpose: [],
        reEntryExp: "",
        reEntryStrategy: "",
        speakingConf: "",
        email: ""
    };
    if (state.timerInterval) clearInterval(state.timerInterval);
}

/* ==========================================================================
   2. UTILITIES
   ========================================================================== */
function generateRandomId() {
    // Generate a random 4-character string + current timestamp fragment to ensure uniqueness
    const randomPart = Math.random().toString(36).substr(2, 4).toUpperCase();
    const timePart = Date.now().toString(36).substr(-4).toUpperCase();
    return `P${randomPart}-${timePart}`;
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
    csvContent += "Participant_ID,Age,Gender,Role,Role_Other,Meeting_Freq,Lang_Comfort,AI_Usage,AI_Purpose,ReEntry_Experience,ReEntry_Strategy,Speaking_Confidence,Email,Step,Context,Transcript,Answer_Q1,Answer_Q2,Answer_Q3,Likert_L1,Likert_L2,Likert_L3,Comment\n";

    // Rows
    results.forEach(row => {
        const cleanA1 = (row.answer_q1 || "").replace(/"/g, '""');
        const cleanA2 = (row.answer_q2 || "").replace(/"/g, '""');
        const cleanA3 = (row.answer_q3 || "").replace(/"/g, '""');
        const cleanComment = (row.comment || "").replace(/"/g, '""');
        const cleanContext = (row.context || "").replace(/"/g, '""');
        const cleanTranscript = (row.transcript || "").replace(/"/g, '""');
        
        // Demographic & Background field cleaning
        const cleanRole = (participant.role || "").replace(/"/g, '""');
        const cleanRoleOther = (participant.roleOther || "").replace(/"/g, '""');
        const cleanMeetingFreq = (participant.meetingFreq || "").replace(/"/g, '""');
        const cleanAIUsage = (participant.aiUsage || "").replace(/"/g, '""');
        // Join array with semicolon for AI purpose
        const cleanAIPurpose = (participant.aiPurpose ? participant.aiPurpose.join(';') : "").replace(/"/g, '""');
        const cleanReEntryExp = (participant.reEntryExp || "").replace(/"/g, '""');
        const cleanReEntryStrategy = (participant.reEntryStrategy || "").replace(/"/g, '""');
        const cleanEmail = (participant.email || "").replace(/"/g, '""');
        
        const rowString = [
            `"${participant.id}"`,
            `"${participant.age}"`,
            `"${participant.gender}"`,
            `"${cleanRole}"`,
            `"${cleanRoleOther}"`,
            `"${cleanMeetingFreq}"`,
            `"${participant.langComfort}"`,
            `"${cleanAIUsage}"`,
            `"${cleanAIPurpose}"`,
            `"${cleanReEntryExp}"`,
            `"${cleanReEntryStrategy}"`,
            `"${participant.speakingConf}"`,
            `"${cleanEmail}"`,
            row.step,
            `"${cleanContext}"`,
            `"${cleanTranscript}"`,
            `"${cleanA1}"`,
            `"${cleanA2}"`,
            `"${cleanA3}"`,
            `"${row.likert_l1}"`,
            `"${row.likert_l2}"`,
            `"${row.likert_l3}"`,
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
    
function sendEmail(participant) {
    const emailTo = "seahn1021@snu.ac.kr";
    const subject = encodeURIComponent(`Experiment Result: ${participant.id} (Formative Study)`);
    const body = encodeURIComponent(
        `Hello,\n\nHere are the results for Participant ID: ${participant.id}.\n\n` +
        `Please attach the downloaded .csv file to this email and send it.\n\n` +
        `Thank you!\n\n` +
        `Participant Info:\n` +
        `- ID: ${participant.id}\n` +
        `- Age: ${participant.age}\n` +
        `- Role: ${participant.role}\n` +
        `- Email: ${participant.email}\n`
    );
    
    // Open default mail client
    window.location.href = `mailto:${emailTo}?subject=${subject}&body=${body}`;
}

/* ==========================================================================
   3. SCREEN LOGIC
   ========================================================================== */

// --- Welcome Screen ---
const welcomeScreen = document.getElementById('welcome-screen');
const startWelcomeBtn = document.getElementById('start-welcome-btn');

function initWelcome() {
    if (startWelcomeBtn) {
        startWelcomeBtn.addEventListener('click', () => {
             showDemographics();
        });
    }
}

function showWelcome() {
    hideAllScreens();
    progressContainer.classList.add('hidden');
    if (welcomeScreen) welcomeScreen.classList.remove('hidden');
}

// --- Demographics Screen ---
const demoScreen = document.getElementById('demographic-screen');
const progressContainer = document.getElementById('progress-container');
const idInput = document.getElementById('participant-id');
const ageInput = document.getElementById('participant-age');
const genderInput = document.getElementById('participant-gender');

const roleInput = document.getElementById('participant-role');
const roleOtherInput = document.getElementById('participant-role-other');
const meetingFreqInput = document.getElementById('participant-meeting-freq');
const langComfortInput = document.getElementById('participant-lang-comfort');
const emailInput = document.getElementById('participant-email');

const nextBtn = document.getElementById('to-background-btn');
const randomIdBtn = document.getElementById('generate-id-btn');

function initDemographics() {
    randomIdBtn.addEventListener('click', () => {
        idInput.value = generateRandomId();
    });

    // Show/Hide "Other" input for Role
    roleInput.addEventListener('change', () => {
        if (roleInput.value === 'other') {
            roleOtherInput.style.display = 'block';
        } else {
            roleOtherInput.style.display = 'none';
            roleOtherInput.value = '';
        }
    });

    nextBtn.addEventListener('click', () => {
        const pId = idInput.value.trim();
        const pAge = ageInput.value.trim();
        const pGender = genderInput.value;
        const pRole = roleInput.value;
        const pRoleOther = roleOtherInput.value.trim();
        const pMeetingFreq = meetingFreqInput.value;
        const pLangComfort = langComfortInput.value;
        const pEmail = emailInput ? emailInput.value.trim() : "";

        if (!pId) { alert("Please enter a Participant ID or generate one."); return; }
        if (!pAge) { alert("Please enter your age."); return; }
        if (!pGender) { alert("Please select your gender."); return; }
        if (!pRole) { alert("Please select your primary role."); return; }
        if (pRole === 'other' && !pRoleOther) { alert("Please specify your role."); return; }
        if (!pMeetingFreq) { alert("Please select your meeting frequency."); return; }

        // Save state
        state.participant.id = pId;
        state.participant.age = pAge;
        state.participant.gender = pGender;
        state.participant.role = pRole;
        state.participant.roleOther = pRoleOther;
        state.participant.meetingFreq = pMeetingFreq;
        state.participant.langComfort = pLangComfort;
        state.participant.email = pEmail;

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
const bgAiUsage = document.getElementById('bg-ai-usage');
const bgReEntryExp = document.getElementById('bg-reentry-exp');
const bgReEntryStrategy = document.getElementById('bg-reentry-strategy');
const bgSpeakingConf = document.getElementById('bg-speaking-conf');

const startBtn = document.getElementById('start-experiment-btn');

function initBackground() {
    startBtn.addEventListener('click', () => {
        const uUsage = bgAiUsage.value;
        const uExp = bgReEntryExp.value;
        const uStrategy = bgReEntryStrategy.value.trim();
        const uConf = bgSpeakingConf.value;
        
        // Collect checkbox values for Purpose
        const purposeCheckboxes = document.querySelectorAll('input[name="bg-ai-purpose"]:checked');
        const purposeList = Array.from(purposeCheckboxes).map(cb => cb.value);

        if (!uUsage) { alert("Please select your AI tool usage frequency."); return; }
        if (purposeList.length === 0) { alert("Please select at least one purpose for AI tool usage."); return; }
        if (!uExp) { alert("Please select your re-entry experience frequency."); return; }
        if (!uStrategy) { alert("Please describe your re-entry strategy."); return; }

        // Save state
        state.participant.aiUsage = uUsage;
        state.participant.aiPurpose = purposeList;
        state.participant.reEntryExp = uExp;
        state.participant.reEntryStrategy = uStrategy;
        state.participant.speakingConf = uConf;

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
const transcriptText = document.getElementById('transcript-text'); 
const timerDisplay = document.getElementById('timer-display');

function showStimulusStep() {
    hideAllScreens();
    stimScreen.classList.remove('hidden');

    const data = window.experimentData[state.currentStep];
    
    // Show transcript as text instead of image for now
    if (transcriptText) {
        transcriptText.textContent = data.transcript;
    }
    
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

// New Inputs
const answerQ1 = document.getElementById('user-answer-q1');
const answerQ2 = document.getElementById('user-answer-q2');
const answerQ3 = document.getElementById('user-answer-q3');
const labelQ1 = document.getElementById('label-q1');
const labelQ2 = document.getElementById('label-q2');
const labelQ3 = document.getElementById('label-q3');

const likertL1 = document.getElementById('likert-l1');
const likertL2 = document.getElementById('likert-l2');
const likertL3 = document.getElementById('likert-l3');
const commentInput = document.getElementById('user-comment');

function showResponseStep() {
    if (state.timerInterval) clearInterval(state.timerInterval);

    hideAllScreens();
    respScreen.classList.remove('hidden');

    const data = window.experimentData[state.currentStep];

    // Update Question Labels dynamically
    labelQ1.textContent = data.q1;
    labelQ2.textContent = data.q2;
    labelQ3.textContent = data.q3;

    // Reset inputs
    answerQ1.value = "";
    answerQ2.value = "";
    answerQ3.value = "";
    likertL1.value = "4";
    likertL2.value = "4";
    likertL3.value = "4";
    commentInput.value = "";
}

function initResponse() {
    respNextBtn.addEventListener('click', () => {
        // Collect answers
        const a1 = answerQ1.value.trim();
        const a2 = answerQ2.value.trim();
        const a3 = answerQ3.value.trim();
        
        if (!a1 || !a2 || !a3) {
            alert("Please provide an answer for all 3 questions.");
            return;
        }

        const data = window.experimentData[state.currentStep];
        
        state.results.push({
            step: state.currentStep + 1,
            context: data.context,
            transcript: data.transcript, // Save transcript for reference
            
            // Saved Answers
            answer_q1: a1,
            answer_q2: a2,
            answer_q3: a3,
            
            // Likert Ratings
            likert_l1: likertL1.value,
            likert_l2: likertL2.value,
            likert_l3: likertL3.value,
            
            comment: commentInput.value
        });

        state.currentStep++;
        showContextStep();
    });
}

// --- Finish Screen ---
const finScreen = document.getElementById('finish-screen');
const downloadBtn = document.getElementById('download-btn');
const emailBtn = document.getElementById('email-btn');
const restartBtn = document.getElementById('restart-btn');

function initFinish() {
    if(downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            downloadCSV(state.results, state.participant);
            // Optionally, we could show an alert reminding them to email it.
            // alert("File downloaded. Please remember to email it!");
        });
    }
    
    if(emailBtn) {
        emailBtn.addEventListener('click', () => {
            sendEmail(state.participant);
        });
    }

    if(restartBtn) {
        restartBtn.addEventListener('click', () => {
            if(confirm("Are you sure you want to restart? All data will be lost.")) {
                location.reload();
            }
        });
    }
}

function showFinishScreen() {
    hideAllScreens();
    progressContainer.classList.add('hidden');
    finScreen.classList.remove('hidden');
}


/* ==========================================================================
   4. MAIN INITIALIZATION
   ========================================================================== */
function mainInit() {
    // 1. Get data from global window object
    if (!window.experimentData) {
        console.error("Experiment data not found in window.experimentData");
        alert("Experiment data is missing. Please check console.");
        return;
    }
    
    // 2. Initialize State
    initState(window.experimentData.length);
    const totalStepsSpan = document.getElementById('total-steps');
    if (totalStepsSpan) {
        totalStepsSpan.textContent = state.totalSteps;
    }

    // 3. Initialize Event Listeners
    initWelcome(); // Added
    initDemographics();
    initBackground();
    initContext();
    initResponse();
    initFinish();

    // 4. Start with Welcome Screen
    showWelcome(); // Changed from showDemographics()
}

// Run when DOM is ready
document.addEventListener('DOMContentLoaded', mainInit);
