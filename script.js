// SMART STUDENT CALCULATOR

// Sidebar Navigation
const navigationLinks = document.querySelectorAll(".sidebar nav a");

function showDashboard() {
    location.reload();
}

// Scientific Calculator
function openScientificCalculator() {

    document.querySelector(".main-content").innerHTML = `
        <h1>Scientific Calculator</h1>
        <p>Perform basic and scientific calculations.</p>

        <div class="calculator">

            <input type="text" id="display" value="0" readonly>

            <div class="calculator-buttons">

                <button data-action="clear">AC</button>
                <button data-action="delete">DEL</button>
                <button data-value="(">(</button>
                <button data-value=")">)</button>

                <button data-value="sin(">sin</button>
                <button data-value="cos(">cos</button>
                <button data-value="tan(">tan</button>
                <button data-value="/">÷</button>

                <button data-value="7">7</button>
                <button data-value="8">8</button>
                <button data-value="9">9</button>
                <button data-value="*">×</button>

                <button data-value="4">4</button>
                <button data-value="5">5</button>
                <button data-value="6">6</button>
                <button data-value="-">−</button>

                <button data-value="1">1</button>
                <button data-value="2">2</button>
                <button data-value="3">3</button>
                <button data-value="+">+</button>

                <button data-value="0">0</button>
                <button data-value=".">.</button>
                <button data-value="sqrt(">√</button>
                <button data-value="^">xʸ</button>

                <button data-value="pi">π</button>
                <button data-value="%">%</button>
                <button data-action="calculate" class="equal">=</button>

            </div>
        </div>

        <br>
        <button onclick="showDashboard()">Back to Dashboard</button>
    `;

    const display = document.getElementById("display");

    document.querySelectorAll(".calculator-buttons button").forEach(button => {

        button.addEventListener("click", function () {

            const value = this.dataset.value;
            const action = this.dataset.action;

            if (action === "clear") {
                display.value = "0";
            }

            else if (action === "delete") {
                display.value = display.value.slice(0, -1) || "0";
            }

            else if (action === "calculate") {
                calculateResult();
            }

            else {
                if (display.value === "0") {
                    display.value = value;
                } else {
                    display.value += value;
                }
            }

        });

    });

    function calculateResult() {

        try {

            let expression = display.value;

            // Check allowed characters
            if (!/^[0-9+\-*/().\s%a-zA-Z]*$/.test(expression)) {
                throw new Error("Invalid input");
            }

            // Allow only supported function names
            const names = expression.match(/[a-zA-Z]+/g) || [];

            if (names.some(name => !["sin", "cos", "tan", "sqrt", "pi"].includes(name))) {
                throw new Error("Invalid function");
            }

            // Convert scientific functions
            expression = expression.replace(/sin\(/g, "Math.sin(Math.PI/180*");
            expression = expression.replace(/cos\(/g, "Math.cos(Math.PI/180*");
            expression = expression.replace(/tan\(/g, "Math.tan(Math.PI/180*");
            expression = expression.replace(/sqrt\(/g, "Math.sqrt(");
            expression = expression.replace(/pi/g, "Math.PI");

            // Power
            expression = expression.replace(/\^/g, "**");

            // Percentage
            expression = expression.replace(/(\d+(?:\.\d+)?)%/g, "($1/100)");

            const result = Function('"use strict"; return (' + expression + ')')();

            if (!Number.isFinite(result)) {
                throw new Error("Invalid calculation");
            }
            let history = JSON.parse(localStorage.getItem("calculationHistory")) || [];
            
            history.push({
                type: "Scientific Calculation",
                details: `${expression} = ${Number(result.toFixed(8))}`,
                date: new Date().toLocaleString()
            });

            localStorage.setItem("calculationHistory", JSON.stringify(history));
            display.value = Number(result.toFixed(8)).toString();

        }

        catch (error) {
            display.value = "Error";
        }

    }

}

// Attendance Calculator
function openAttendanceCalculator() {
    document.querySelector(".main-content").innerHTML = `
        <h1>Attendance Calculator</h1>
        <p>Calculate your attendance percentage and plan your classes.</p>

        <div class="calculator">
            <label>Total Classes:</label>
            <input type="number" id="totalClasses" placeholder="Enter total classes">

            <br><br>

            <label>Classes Attended:</label>
            <input type="number" id="attendedClasses" placeholder="Enter attended classes">

            <br><br>

            <label>Required Attendance (%):</label>
            <input type="number" id="requiredAttendance" value="75">

            <br><br>

            <button id="calculateAttendance">Calculate</button>

            <h3 id="attendanceResult"></h3>
        </div>

        <br>
        <button onclick="showDashboard()">Back to Dashboard</button>
    `;

    document.getElementById("calculateAttendance").addEventListener("click", function () {
        const total = Number(document.getElementById("totalClasses").value);
        const attended = Number(document.getElementById("attendedClasses").value);
        const required = Number(document.getElementById("requiredAttendance").value);

        const result = document.getElementById("attendanceResult");

        if (
            total <= 0 ||
            attended < 0 ||
            attended > total ||
            required <= 0 ||
            required >= 100 ||
            !Number.isInteger(total) ||
            !Number.isInteger(attended)
        ) {
            result.innerHTML = "Please enter valid values.";
            return;
        }

        const percentage = (attended / total) * 100;

        localStorage.setItem("attendanceData", JSON.stringify({
            total: total,
            attended: attended,
            percentage: percentage
        }));

        let history = JSON.parse(localStorage.getItem("calculationHistory")) || [];

        history.push({
            type: "Attendance Calculation",
            details: `Attendance: ${percentage.toFixed(2)}% (${attended}/${total} classes)`,
            date: new Date().toLocaleString()
        });

        localStorage.setItem("calculationHistory", JSON.stringify(history));

        let message = `Your Attendance: ${percentage.toFixed(2)}%<br>`;

        if (percentage >= required) {
            const bunkable = Math.max(
                0,
                Math.floor((attended * 100 - required * total) / required)
            );

            message += `<span style="color:green;">Eligible! You meet the required attendance.</span><br>`;
            message += `You can miss ${bunkable} more classes.`;
        } else {
            const needed = Math.ceil(
                (required * total - 100 * attended) / (100 - required)
            );

            message += `<span style="color:red;">Not Eligible! You are below the required attendance.</span><br>`;
            message += `Attend the next ${needed} consecutive classes to reach ${required}%.`;
        }

        result.innerHTML = message;

        updateDashboard();
    });
}

// Smart Study Planner
function openStudyPlanner() {
    document.querySelector(".main-content").innerHTML = `
        <h1>Smart Study Planner</h1>
        <p>Plan your daily study tasks and track your progress.</p>

        <div class="calculator">
            <label>Subject Name:</label>
            <input type="text" id="subjectName" placeholder="Enter subject name">

            <br><br>

            <label>Study Hours:</label>
            <input type="number" id="studyHours" placeholder="Enter study hours">

            <br><br>

            <label>Study Task:</label>
            <input type="text" id="studyTask" placeholder="Enter your task">

            <br><br>

            <button id="addTask">Add Task</button>

            <h3>My Study Progress</h3>

<div style="display:flex; gap:15px; flex-wrap:wrap; margin:20px 0;">

    <div class="card">
        <h3>Total Tasks</h3>
        <p id="totalTasks">0</p>
    </div>

    <div class="card">
        <h3>Completed</h3>
        <p id="completedTasks">0</p>
    </div>

    <div class="card">
        <h3>Pending</h3>
        <p id="pendingTasks">0</p>
    </div>

</div>

<h3>My Study Tasks</h3>
<div id="taskList"></div>
        </div>

        <br>
        <button onclick="showDashboard()">Back to Dashboard</button>
    `;

    let tasks = JSON.parse(localStorage.getItem("studyTasks")) || [];

    const taskList = document.getElementById("taskList");

   function displayTasks() {
    taskList.innerHTML = "";
    const completedCount = tasks.filter(task => task.completed).length;
const pendingCount = tasks.length - completedCount;

document.getElementById("totalTasks").textContent = tasks.length;
document.getElementById("completedTasks").textContent = completedCount;
document.getElementById("pendingTasks").textContent = pendingCount;

    if (tasks.length === 0) {
        taskList.innerHTML = "<p>No study tasks added yet.</p>";
        return;
    }

    tasks.forEach((task, index) => {
        const status = task.completed ? "Completed" : "Pending";

        taskList.innerHTML += `
            <div style="padding:10px; margin:10px 0; background:#f0f3f8; border-radius:8px;">
                <strong>${task.subject}</strong><br>
                ${task.task}<br>
                Study Hours: ${task.hours}<br>
                Status: ${status}<br>

                <button class="complete-task-btn" data-index="${index}">
                    ${task.completed ? "Undo" : "Mark Completed"}
                </button>

                <button onclick="deleteStudyTask(${index})">Delete</button>
            </div>
        `;
    });

    document.querySelectorAll(".complete-task-btn").forEach(button => {
        button.addEventListener("click", function () {
            const index = Number(this.dataset.index);

            tasks[index].completed = !tasks[index].completed;

            localStorage.setItem("studyTasks", JSON.stringify(tasks));

            displayTasks();
        });
    });
}

    document.getElementById("addTask").addEventListener("click", function () {
        const subject = document.getElementById("subjectName").value.trim();
        const hours = Number(document.getElementById("studyHours").value);
        const task = document.getElementById("studyTask").value.trim();

        if (!subject || !task || hours <= 0 || !Number.isFinite(hours)) {
            alert("Please enter valid subject, task, and study hours.");
            return;
        }

        tasks.push({ subject, hours, task });

        localStorage.setItem("studyTasks", JSON.stringify(tasks));

        document.getElementById("subjectName").value = "";
        document.getElementById("studyHours").value = "";
        document.getElementById("studyTask").value = "";

        displayTasks();
    });


    displayTasks();
}

// Delete Study Task
function deleteStudyTask(index) {
    let tasks = JSON.parse(localStorage.getItem("studyTasks")) || [];

    tasks.splice(index, 1);

    localStorage.setItem("studyTasks", JSON.stringify(tasks));

    openStudyPlanner();
}

// CGPA Target Predictor
function openCGPAPredictor() {
    document.querySelector(".main-content").innerHTML = `
        <h1>CGPA Target Predictor</h1>
        <p>Calculate the SGPA required to achieve your academic goal.</p>

        <div class="calculator">
            <label>Current CGPA:</label>
            <input type="number" id="currentCGPA" placeholder="Example: 8.5" step="0.01">

            <br><br>

            <label>Completed Semesters:</label>
            <input type="number" id="completedSemesters" placeholder="Example: 2">

            <br><br>

            <label>Total Semesters:</label>
            <input type="number" id="totalSemesters" value="8">

            <br><br>

            <label>Target CGPA:</label>
            <input type="number" id="targetCGPA" placeholder="Example: 9.0" step="0.01">

            <br><br>

            <button id="predictCGPA">Predict CGPA</button>

            <div id="cgpaResult"></div>
        </div>

        <br>
        <button onclick="showDashboard()">Back to Dashboard</button>
    `;

    document.getElementById("predictCGPA").addEventListener("click", function () {

        const current = Number(document.getElementById("currentCGPA").value);
        const completed = Number(document.getElementById("completedSemesters").value);
        const total = Number(document.getElementById("totalSemesters").value);
        const target = Number(document.getElementById("targetCGPA").value);

        const result = document.getElementById("cgpaResult");

        if (
            current <= 0 || current > 10 ||
            target <= 0 || target > 10 ||
            completed <= 0 ||
            total <= completed ||
            !Number.isInteger(completed) ||
            !Number.isInteger(total)
        ) {
            result.innerHTML = "Please enter valid values.";
            return;
        }

        const remaining = total - completed;

        const required = (
            (target * total) - (current * completed)
        ) / remaining;

        let message = `
            <h3>Prediction Results</h3>
            <p>Current CGPA: ${current.toFixed(2)}</p>
            <p>Target CGPA: ${target.toFixed(2)}</p>
            <p>Completed Semesters: ${completed}</p>
            <p>Remaining Semesters: ${remaining}</p>
        `;

        if (required > 10) {
            message += `
                <h3 style="color:red;">
                    Target Not Achievable
                </h3>
                <p>Required Average SGPA: ${required.toFixed(2)}</p>
                <p>You would need an average above 10.</p>
            `;
        } else if (required <= 0) {
            message += `
                <h3 style="color:green;">
                    Target Already Achieved
                </h3>
            `;
        } else {
            message += `
                <h3 style="color:green;">
                    Target Achievable!
                </h3>
                <p>Required Average SGPA:
                <strong>${required.toFixed(2)}</strong></p>
                <p>Maintain this average in your remaining semesters.</p>
            `;
        }

        result.innerHTML = message;

        let history = JSON.parse(localStorage.getItem("calculationHistory")) || [];

        history.push({
            type: "CGPA Prediction",
            details: `Current CGPA: ${current}, Target: ${target}, Required Average: ${required.toFixed(2)}`,
            date: new Date().toLocaleString()
        });

        localStorage.setItem("calculationHistory", JSON.stringify(history));
    });
}

// Calculation History
function openHistory() {
    document.querySelector(".main-content").innerHTML = `
        <h1>Calculation History</h1>
        <p>View your saved academic calculations.</p>

        <div class="calculator">
            <h3>Total Records: <span id="historyCount">0</span></h3>

            <div id="historyList"></div>

            <br>
            <button id="clearHistory">Clear History</button>
        </div>

        <br>
        <button onclick="showDashboard()">Back to Dashboard</button>
    `;

    const historyList = document.getElementById("historyList");

    let history = JSON.parse(localStorage.getItem("calculationHistory")) || [];

    function displayHistory() {
        historyList.innerHTML = "";

        document.getElementById("historyCount").textContent = history.length;

        if (history.length === 0) {
            historyList.innerHTML = "<p>No calculation history available.</p>";
            return;
        }

        const latestHistory = [...history].reverse();

        latestHistory.forEach(item => {
            historyList.innerHTML += `
                <div style="padding:15px; margin:10px 0; background:#f0f3f8; border-radius:8px;">
                    <strong>${item.type}</strong><br>
                    ${item.details}<br>
                    <small>${item.date}</small>
                </div>
            `;
        });
    }

    document.getElementById("clearHistory").addEventListener("click", function () {
        if (confirm("Are you sure you want to clear all history?")) {
            localStorage.removeItem("calculationHistory");
            history = [];
            displayHistory();
        }
    });

    displayHistory();
}

// Update Dashboard Information
function updateDashboard() {

    const attendanceData = JSON.parse(
        localStorage.getItem("attendanceData")
    );

    if (attendanceData) {
        document.getElementById("dashboardAttendance").textContent =
            attendanceData.percentage.toFixed(2) + "%";
    }
}

// Student Academic Profile
function initializeAcademicProfile() {

    const savedProfile = JSON.parse(
        localStorage.getItem("studentProfile")
    );

    // Load previously saved details
    if (savedProfile) {
        document.getElementById("profileCurrentCGPA").value = savedProfile.currentCGPA;
        document.getElementById("profileTargetCGPA").value = savedProfile.targetCGPA;
        document.getElementById("profileCompletedSemesters").value = savedProfile.completedSemesters;
        document.getElementById("profileTotalSemesters").value = savedProfile.totalSemesters;
    }

    document.getElementById("saveProfile").addEventListener("click", function () {

        const current = Number(document.getElementById("profileCurrentCGPA").value);
        const target = Number(document.getElementById("profileTargetCGPA").value);
        const completed = Number(document.getElementById("profileCompletedSemesters").value);
        const total = Number(document.getElementById("profileTotalSemesters").value);

        const message = document.getElementById("profileMessage");

        if (
            current <= 0 || current > 10 ||
            target <= 0 || target > 10 ||
            completed <= 0 ||
            total <= completed ||
            !Number.isInteger(completed) ||
            !Number.isInteger(total)
        ) {
            message.textContent = "Please enter valid academic details.";
            return;
        }

        const profile = {
            currentCGPA: current,
            targetCGPA: target,
            completedSemesters: completed,
            totalSemesters: total
        };

        localStorage.setItem("studentProfile", JSON.stringify(profile));

        message.textContent = "Academic profile saved successfully!";

        updateDashboard();
    });
}


// Update Dashboard
function updateDashboard() {

    const profile = JSON.parse(localStorage.getItem("studentProfile"));

    if (profile) {
        document.getElementById("dashboardCurrentCGPA").textContent =
            profile.currentCGPA.toFixed(2);

        document.getElementById("dashboardTargetCGPA").textContent =
            profile.targetCGPA.toFixed(2);

        const progress = (profile.currentCGPA / profile.targetCGPA) * 100;

        document.getElementById("cgpaProgress").value =
            Math.min(progress, 100);

        document.getElementById("progressMessage").textContent =
            "You have achieved " + progress.toFixed(2) +
            "% of your target CGPA.";
        document.getElementById("dashboardCompletedSemesters").textContent =
        profile.completedSemesters;
        
        document.getElementById("dashboardRemainingSemesters").textContent =
        profile.totalSemesters - profile.completedSemesters;    
    }

    const attendance = JSON.parse(localStorage.getItem("attendanceData"));

    if (attendance) {
        document.getElementById("dashboardAttendance").textContent =
            attendance.percentage.toFixed(2) + "%";
    }

    const tasks = JSON.parse(localStorage.getItem("studyTasks")) || [];

    const totalHours = tasks.reduce((sum, task) => sum + Number(task.hours), 0);

    document.getElementById("dashboardStudyHours").textContent =
        totalHours + " hrs";
}

// Sidebar Navigation Events
navigationLinks.forEach(link => {

    link.addEventListener("click", function (event) {

        event.preventDefault();

        navigationLinks.forEach(item => {
            item.classList.remove("active");
        });

        this.classList.add("active");

        const page = this.dataset.page;

        if (page === "dashboard") {
            showDashboard();
        }

        else if (page === "scientific") {
            openScientificCalculator();
        }
        else if (page === "attendance") {
            openAttendanceCalculator();
        }
        else if (page === "study") {
            openStudyPlanner();
        }
        else if (page === "cgpa") {
            openCGPAPredictor();
        }
        else if (page === "history") {
            openHistory();
        }

        else {

            const pageNames = {
                attendance: "Attendance Calculator",
                study: "Smart Study Planner",
                cgpa: "CGPA Target Predictor",
                history: "Calculation History"
            };

            document.querySelector(".main-content").innerHTML = `
                <h1>${pageNames[page]}</h1>
                <p>Welcome to ${pageNames[page]}.</p>
                <br>
                <button onclick="showDashboard()">Back to Dashboard</button>
            `;

        }

    });

});
initializeAcademicProfile();
updateDashboard();