// Chatbot state
let isLoggedIn = false;
let studentId = null;
let userType = null; // Tracks if user is 'existing' or 'admission'

// Next-word prediction model (Markov chain)
const wordModel = {
    "sea": [
        { word: "college", prob: 0.6 },
        { word: "cet", prob: 0.3 },
        { word: "engineering", prob: 0.1 }
    ],
    "college": [
        { word: "of", prob: 0.7 },
        { word: "is", prob: 0.3 }
    ],
    "of": [
        { word: "engineering", prob: 0.5 },
        { word: "technology", prob: 0.5 }
    ],
    "engineering": [
        { word: "and", prob: 0.6 },
        { word: "technology", prob: 0.4 }
    ],
    "and": [
        { word: "technology", prob: 0.5 },
        { word: "more", prob: 0.5 }
    ],
    "hi": [
        { word: "how", prob: 0.7 },
        { word: "are", prob: 0.3 }
    ],
    "how": [
        { word: "are", prob: 0.8 },
        { word: "to", prob: 0.2 }
    ],
    "are": [
        { word: "you", prob: 0.6 },
        { word: "the", prob: 0.4 }
    ],
    "default": [
        { word: "the", prob: 0.5 },
        { word: "is", prob: 0.3 },
        { word: "and", prob: 0.2 }
    ]
};

// Function to toggle chatbot visibility
function toggleChatbot() {
    const chatbot = document.getElementById("chatbot");
    if (!chatbot.classList.contains("active")) {
        displayMessage("Welcome to SEACET Assistant! Are you an existing student or seeking admission? (Type 'existing' or 'admission')", "bot");
    }
    chatbot.classList.toggle("active");
}

// Function to close chatbot
function closeChatbot() {
    const chatbot = document.getElementById("chatbot");
    chatbot.classList.remove("active");
}

// Function to predict the top three words
function predictNextWords(input) {
    console.log("predictNextWords: input =", input);
    const words = input.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const lastWord = words.length > 0 ? words[words.length - 1] : "";
    console.log("predictNextWords: lastWord =", lastWord);
    
    const nextWords = wordModel[lastWord] || wordModel["default"];
    
    // Sort by probability (highest first) and take top 3
    return nextWords
        .sort((a, b) => b.prob - a.prob)
        .slice(0, 3)
        .map(option => option.word)
        .filter(word => word !== undefined && word !== null);
}

// Function to select a predicted word
function selectPredictedWord(word) {
    const input = document.getElementById("chatbotInput");
    const currentText = input.value || "";
    
    console.log("selectPredictedWord: currentText =", currentText, "selected word =", word);
    
    // Ensure word is valid
    if (!word || word === "undefined") {
        console.warn("selectPredictedWord: Invalid word detected, skipping");
        return;
    }
    
    // Append the word with proper spacing
    let newText;
    if (currentText && !currentText.endsWith(" ")) {
        newText = currentText + " " + word + " ";
    } else {
        newText = (currentText + word + " ").trimStart();
    }
    
    input.value = newText;
    console.log("selectPredictedWord: new input.value =", input.value);
    
    input.focus();
    updateWordPredictions(newText); // Update predictions with new input
}

// Function to update word predictions display
function updateWordPredictions(input) {
    console.log("updateWordPredictions: input =", input);
    const predictedWords = predictNextWords(input);
    console.log("updateWordPredictions: predictedWords =", predictedWords);
    const predictionDiv = document.getElementById("wordPrediction");
    predictionDiv.innerHTML = "";
    
    if (predictedWords.length > 0 && input.trim()) {
        predictedWords.forEach(word => {
            if (word && word !== "undefined") {
                const wordSpan = document.createElement("span");
                wordSpan.className = "word-prediction";
                wordSpan.textContent = word;
                wordSpan.onclick = () => selectPredictedWord(word);
                predictionDiv.appendChild(wordSpan);
            }
        });
    }
}

// Function to display messages in chatbot
function displayMessage(message, sender) {
    const chatbotBody = document.getElementById("chatbotBody");
    const messageDiv = document.createElement("div");
    messageDiv.className = sender === "bot" ? "bot-message" : "user-message";
    messageDiv.textContent = message;
    chatbotBody.appendChild(messageDiv);
    chatbotBody.scrollTop = chatbotBody.scrollHeight;
}

// Function to show follow-up prompt for existing students
function showExistingFollowUpPrompt() {
    displayMessage("What next? Options: marks, attendance, complaint, back to main menu, logout", "bot");
}

// Function to show follow-up prompt for admission users
function showAdmissionFollowUpPrompt() {
    displayMessage("What next? Options: courses, fees, entrance exam cutoffs, back to main menu, exit", "bot");
}

// Function to validate student ID
function isValidStudentId(input) {
    const normalizedInput = input.trim().toUpperCase();
    const idPattern = /^1SP\d{2}[A-Z]{2}\d{3}$/;
    console.log("Validating ID:", normalizedInput, "Pattern Match:", idPattern.test(normalizedInput));
    return idPattern.test(normalizedInput);
}

// Function to handle user input
function sendMessage() {
    const input = document.getElementById("chatbotInput").value;
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    console.log("Raw Input:", input, "Trimmed Input:", trimmedInput);
    displayMessage(trimmedInput, "user");
    document.getElementById("chatbotInput").value = "";
    document.getElementById("wordPrediction").innerHTML = "";

    processInput(trimmedInput.toLowerCase(), trimmedInput);
}

// Function to process user input
function processInput(inputLower, originalInput) {
    console.log("Processing input:", inputLower, "UserType:", userType, "IsLoggedIn:", isLoggedIn);
    if (!userType) {
        if (inputLower.includes("existing")) {
            userType = "existing";
            displayMessage("Please enter your student ID (e.g., 1SP22AI047)", "bot");
        } else if (inputLower.includes("admission")) {
            userType = "admission";
            displayMessage("How can I assist you? Ask about courses, fees, or entrance exam cutoffs.", "bot");
            showAdmissionFollowUpPrompt();
        } else {
            displayMessage("Please type 'existing' for current students or 'admission' for prospective students.", "bot");
        }
    } else if (userType === "existing") {
        if (!isLoggedIn) {
            if (isValidStudentId(originalInput)) {
                studentId = originalInput.trim().toUpperCase();
                console.log("Checking student data for ID:", studentId);
                if (getStudentMarks(studentId).ml !== undefined) {
                    isLoggedIn = true;
                    displayMessage(`Logged in as ${studentId}. How can I assist you? (marks, attendance, complaint, back to main menu, logout)`, "bot");
                } else {
                    displayMessage("Student ID not found in database. Please try another ID.", "bot");
                }
            } else {
                displayMessage("Invalid student ID format. Please enter a valid ID (e.g., 1SP22AI047)", "bot");
            }
        } else {
            if (inputLower.includes("logout")) {
                isLoggedIn = false;
                studentId = null;
                userType = null;
                displayMessage("Logged out. Are you an existing student or seeking admission? (Type 'existing' or 'admission')", "bot");
            } else if (inputLower.includes("marks")) {
                const marks = getStudentMarks(studentId);
                displayMessage(`Marks:\nMachine Learning: ${marks.ml}\nBlockchain: ${marks.bc}\nProject Management: ${marks.pm}\nNLP: ${marks.nlp}\nLabs: ${marks.labs}`, "bot");
                showExistingFollowUpPrompt();
            } else if (inputLower.includes("attendance")) {
                const attendance = getStudentAttendance(studentId);
                displayMessage(`Attendance:\nMachine Learning: ${attendance.ml}%\nBlockchain: ${attendance.bc}%\nProject Management: ${attendance.pm}%\nNLP: ${attendance.nlp}%\nLabs: ${attendance.labs}%`, "bot");
                showExistingFollowUpPrompt();
            } else if (inputLower.includes("complaint")) {
                displayMessage("Please describe your complaint.", "bot");
                sessionStorage.setItem("complaintMode", "true");
            } else if (inputLower.includes("back to main menu")) {
                displayMessage("Main menu: How can I assist you? (marks, attendance, complaint, back to main menu, logout)", "bot");
            } else if (sessionStorage.getItem("complaintMode") === "true") {
                draftComplaint(inputLower);
            } else {
                displayMessage("Options: marks, attendance, complaint, back to main menu, logout", "bot");
            }
        }
    } else if (userType === "admission") {
        if (inputLower.includes("courses") || inputLower.includes("fees")) {
            displayMessage("Available courses:\n- CSE: INR 1.5L/year\n- AIML: INR 1.6L/year\n- IoT: INR 1.5L/year\n- Mech: INR 1.2L/year\n- ECE: INR 1.3L/year\n- ISE: INR 1.4L/year", "bot");
            showAdmissionFollowUpPrompt();
        } else if (inputLower.includes("cutoff") || inputLower.includes("entrance")) {
            displayMessage("Approximate cutoffs:\n- KCET: 50,000-65,000 (CSE, AIML, IoT), 60,000-80,000 (Mech, ECE, ISE)\n- COMEDK: 40,000-60,000 (all branches)", "bot");
            showAdmissionFollowUpPrompt();
        } else if (inputLower.includes("back to main menu")) {
            displayMessage("How can I assist you? Ask about courses, fees, or entrance exam cutoffs.", "bot");
            showAdmissionFollowUpPrompt();
        } else if (inputLower.includes("exit")) {
            userType = null;
            displayMessage("Thank you for using SEACET Assistant! Are you an existing student or seeking admission? (Type 'existing' or 'admission')", "bot");
        } else {
            displayMessage("How can I assist you? Ask about courses, fees, or entrance exam cutoffs.", "bot");
            showAdmissionFollowUpPrompt();
        }
    }
}

// Function to draft complaint letter
function draftComplaint(description) {
    const department = description.includes("faculty") ? "Academic" : description.includes("hostel") ? "Hostel" : "Administration";
    const letter = `
Dear ${department} Department,

Subject: Complaint Regarding ${description.slice(0, 50)}...

I, ${studentId}, am writing to bring to your attention the following issue: ${description}.

Please address this matter at the earliest convenience.

Sincerely,
${studentId}
S.E.A College of Engineering and Technology
`;

    displayMessage(`Drafted complaint:\n${letter}\nConfirm submission? (yes/no)`, "bot");
    sessionStorage.setItem("complaintLetter", letter);
    sessionStorage.setItem("complaintMode", "confirm");
}

// Function to handle complaint confirmation
function handleComplaintConfirmation(input) {
    if (input.toLowerCase() === "yes") {
        const letter = sessionStorage.getItem("complaintLetter");
        fetch("http://localhost:3000/send-complaint", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ letter, studentId })
        })
        .then(response => response.json())
        .then(data => {
            displayMessage("Complaint submitted and emailed to the department.", "bot");
            sessionStorage.removeItem("complaintLetter");
            sessionStorage.removeItem("complaintMode");
            showExistingFollowUpPrompt();
        })
        .catch(error => {
            displayMessage("Error submitting complaint. Try again.", "bot");
            showExistingFollowUpPrompt();
        });
    } else {
        displayMessage("Complaint discarded. How else can I assist you?", "bot");
        sessionStorage.removeItem("complaintLetter");
        sessionStorage.removeItem("complaintMode");
        showExistingFollowUpPrompt();
    }
}

// Event listener for real-time word prediction
document.getElementById("chatbotInput").addEventListener("input", function() {
    const input = this.value;
    updateWordPredictions(input);
});

// Override sendMessage for complaint confirmation
document.getElementById("chatbotInput").addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        const input = this.value.trim().toLowerCase();
        if (sessionStorage.getItem("complaintMode") === "confirm") {
            displayMessage(input, "user");
            this.value = "";
            document.getElementById("wordPrediction").innerHTML = "";
            handleComplaintConfirmation(input);
        } else {
            sendMessage();
        }
    }
});