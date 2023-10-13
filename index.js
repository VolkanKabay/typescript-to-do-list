"use strict";
// Get Items from HTML doc & create arrays //
const ulEl = document.getElementById("ul-el");
const inputFieldEl = document.getElementById("input-el");
const addButton = document.getElementById("add-btn");
const clearButton = document.getElementById("clear-btn");
const infoParagraph = document.getElementById("info-el");
const clearInfoParagraph = document.getElementById("clearinfo-el");
const currentDateDay = document.getElementById("current-date");
const datePicker = document.getElementById("dateOfTaskEnd");
const clearFiltersButton = document.getElementById("clear-filters-btn");
const completedButton = document.getElementById("completed-btn");
const sortAscButton = document.getElementById("sort-asc-btn");
const sortDescButton = document.getElementById("sort-desc-btn");
let tasks = [];
let selectedFilter = "all";
// Logic for adding Items to the UL and their According items (Paragraphs, Buttons etc)
function addToUl(task, createdOn, status, dueDate) {
    const createList = document.createElement("li");
    createList.setAttribute("data-status", status);
    const statusCheckbox = document.createElement("input");
    statusCheckbox.type = "checkbox";
    statusCheckbox.id = "status-checkbox";
    const createTaskDiv = document.createElement("div");
    const createDate = document.createElement("p");
    createDate.innerText = "Created on: " + createdOn;
    createDate.id = "create-date";
    const createTaskSpan = document.createElement("span");
    createTaskSpan.textContent = task;
    const createEditButton = document.createElement("button");
    createEditButton.id = "edit-btn";
    const editImg = document.createElement("img");
    editImg.src = "/images/edit.png";
    editImg.id = "edit-img";
    createEditButton.appendChild(editImg);
    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.innerHTML = '<img src="/images/bin.png" alt="Delete" />';
    deleteButton.addEventListener("click", function () {
        deleteTask(task);
    });
    createList.style.display = "flex";
    createList.style.justifyContent = "space-between";
    createList.appendChild(deleteButton);
    createTaskDiv.style.display = "block";
    createDate.style.display = "block";
    statusCheckbox.addEventListener("change", function () {
        const newStatus = statusCheckbox.checked ? "Completed" : "Active";
        updateStatus(task, newStatus);
    });
    if (status === "Completed") {
        createTaskSpan.style.textDecoration = "line-through";
        statusCheckbox.checked = true;
    }
    createTaskDiv.appendChild(createTaskSpan);
    createList.appendChild(createTaskDiv);
    createList.appendChild(createEditButton);
    createList.appendChild(createDate);
    createList.appendChild(statusCheckbox);
    ulEl.appendChild(createList);
    if (dueDate) {
        const dueDatePara = document.createElement("p");
        dueDatePara.id = "dueDateParagraph";
        const dueDateObj = new Date(dueDate);
        dueDatePara.textContent = `Due on: ${dueDateObj.getDate() + "."} ${dueDateObj.toLocaleString('en', { month: 'short' }) + ","} ${dueDateObj.getFullYear()}`;
        dueDatePara.style.fontWeight = "bold";
        createList.appendChild(dueDatePara);
    }
}
function deleteTask(task) {
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].task === task) {
            tasks.splice(i, 1);
            loadTasks();
            break;
        }
    }
}
function updateStatus(task, newStatus) {
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].task === task) {
            tasks[i].status = newStatus;
            loadTasks();
            break;
        }
    }
}
function loadTasks() {
    ulEl.innerHTML = "";
    let completedTasksCount = 0; // Initialize the count
    tasks.forEach(function (taskData) {
        if (selectedFilter === "all" ||
            (selectedFilter === "completed" && taskData.status === "Completed")) {
            const task = taskData.task || '';
            const createdOn = taskData.createdOn || '';
            const status = taskData.status || '';
            const dueDate = taskData.dueDate || '';
            addToUl(task, createdOn, status, dueDate);
            if (taskData.status === "Completed") {
                completedTasksCount++; // Increment the count for completed tasks
            }
        }
    });
    if (selectedFilter === "completed" && completedTasksCount === 0) {
        const noCompletedTasksMessage = document.createElement("p");
        noCompletedTasksMessage.textContent = "No completed tasks found.";
        noCompletedTasksMessage.style.fontWeight = "bold";
        noCompletedTasksMessage.style.textAlign = "center";
        noCompletedTasksMessage.style.color = "red";
        ulEl.appendChild(noCompletedTasksMessage);
    }
}
// Clear Button Logic, clear the task array //
clearButton.addEventListener("click", function () {
    if (tasks.length === 0) {
        clearInfoParagraph.innerText = "The task list is already empty!";
        clearInfoParagraph.style.color = "red";
        clearInfoParagraph.style.textAlign = "center";
    }
    else {
        tasks = [];
        loadTasks();
        clearInfoParagraph.innerText = "All Tasks Cleared!";
        clearInfoParagraph.style.color = "darkblue";
        clearInfoParagraph.style.textAlign = "center";
    }
});
// Logic for Add Button, push values to Array //
addButton.addEventListener("click", function () {
    var _a;
    const inputValue = ((_a = inputFieldEl.value) === null || _a === void 0 ? void 0 : _a.trim()) || ''; // Use an empty string as the default if inputFieldEl.value is null
    const selectedDate = datePicker.value;
    if (inputValue === "") {
        clearInfoParagraph.style.color = "red";
        infoParagraph.innerText = "There's nothing to add!";
        return;
    }
    else if (!selectedDate) {
        clearInfoParagraph.style.color = "red";
        infoParagraph.innerText = "Please select a due date!";
        return;
    }
    const currentDateTime = getCurrentDateAndTime(); // Get the current date and time
    tasks.push({
        task: inputValue,
        createdOn: currentDateTime,
        status: "Active",
        dueDate: `Task due on ${selectedDate}`,
    });
    function formatDate(date) {
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return ((day < 10 ? '0' : '') + day +
            '/' +
            (month < 10 ? '0' : '') + month +
            '/' +
            year);
    }
    function formatTime(date) {
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
        return ((hours < 10 ? '0' : '') + hours +
            ':' +
            (minutes < 10 ? '0' : '') + minutes +
            ':' +
            (seconds < 10 ? '0' : '') + seconds);
    }
    addToUl(inputValue, currentDateTime, "Active", `Task due on ${selectedDate}`);
    inputFieldEl.value = "";
    infoParagraph.innerText = "";
    clearInfoParagraph.innerText = "";
});
// Logic for pressing Enter Key instead of "Add" Button //
inputFieldEl.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        const inputValue = inputFieldEl.value.trim();
        const selectedDate = datePicker.value;
        if (inputValue !== "" && selectedDate !== "") {
            const currentDateTime = getCurrentDateAndTime();
            tasks.push({
                task: inputValue,
                createdOn: currentDateTime,
                status: "Active",
                dueDate: `Task due on ${selectedDate}`,
            });
            addToUl(inputValue, currentDateTime, "Active", `Task due on ${selectedDate}`);
            inputFieldEl.value = "";
            infoParagraph.innerText = "";
            clearInfoParagraph.innerText = "";
        }
        if (!selectedDate) {
            infoParagraph.innerText = "Please select a due date!";
            return;
        }
        else if (!inputValue) {
            infoParagraph.innerText = "There's nothing to add!";
        }
    }
});
// Logic for Edit button and Edit Date/Input //
document.addEventListener("click", function (event) {
    if (event.target && (event.target.id === "edit-btn" || event.target.id === "edit-img")) {
        const listItem = event.target.closest("li");
        if (listItem) {
            const taskSpan = listItem.querySelector("span");
            const dueDatePara = listItem.querySelector("#dueDateParagraph");
            if (taskSpan) {
                const taskText = taskSpan.textContent || "";
                const editInput = document.createElement("input");
                editInput.type = "text";
                editInput.value = taskText;
                editInput.style.borderRadius = "3px";
                editInput.style.padding = "3px";
                editInput.style.textAlign = "center";
                editInput.style.border = "1px solid #c2c2c2";
                editInput.style.boxShadow = "1px 1px 4px #9c9c9c";
                const editDateInput = document.createElement("input");
                editDateInput.id = "edit-date";
                editDateInput.type = "date";
                if (dueDatePara) {
                    const dueDateText = dueDatePara.textContent;
                    const dueDateMatch = dueDateText ? dueDateText.match(/\d{1,2}\.\s\w+,\s\d{4}/) : null;
                    if (dueDateMatch) {
                        const dueDateString = dueDateMatch[0];
                        const dueDateArray = dueDateString.split(' ');
                        const dueYear = dueDateArray[2];
                        const dueMonth = dueDateArray[1].slice(0, -1);
                        const dueDay = dueDateArray[0].slice(0, -1);
                        editDateInput.value = `${dueYear}-${dueMonth}-${dueDay}`;
                    }
                }
                if (taskSpan.parentElement) {
                    taskSpan.parentElement.replaceChild(editInput, taskSpan);
                    taskSpan.parentElement.appendChild(editDateInput);
                    editInput.addEventListener("keyup", function (e) {
                        if (e.key === "Enter") {
                            const editedTask = editInput.value.trim();
                            const editedDueDate = editDateInput.value;
                            if (editedTask !== "") {
                                updateTask(taskText, editedTask, editedDueDate);
                            }
                        }
                    });
                }
            }
        }
    }
});
// Completed Filter //
completedButton.addEventListener("click", function () {
    selectedFilter = "completed";
    completedButton.style.backgroundColor = "green";
    completedButton.style.border = "1px solid green";
    loadTasks();
});
function updateTask(oldTask, editedTask, editedDueDate) {
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].task === oldTask) {
            tasks[i].task = editedTask;
            tasks[i].dueDate = "Task due on ".concat(editedDueDate);
            loadTasks();
            break;
        }
    }
}
// Format Date to correct Format //
// Format Date to correct Format
function formatDate(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return ((day < 10 ? '0' : '') + day +
        '/' +
        (month < 10 ? '0' : '') + month +
        '/' +
        year);
}
function formatTime(date) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return ((hours < 10 ? '0' : '') + hours +
        ':' +
        (minutes < 10 ? '0' : '') + minutes +
        ':' +
        (seconds < 10 ? '0' : '') + seconds);
}
// Show current date //
const dateObj = new Date();
const month = dateObj.getUTCMonth() + 1;
const day = dateObj.getDate() + "/";
const dayString = dateObj.toLocaleString('en', { weekday: 'long' });
const year = dateObj.getUTCFullYear();
const newDate = dayString + ", the " + day + month + "/" + year;
currentDateDay.textContent = newDate;
var newDates = new Date();
var createdOnThisDateAndTime = " " + formatDate(newDates) + " / " + formatTime(newDates);
function getCurrentDateAndTime() {
    const newDates = new Date();
    return " " + formatDate(newDates) + " / " + formatTime(newDates);
}
// Clear Filters Button //
clearFiltersButton.addEventListener("click", function () {
    selectedFilter = "all";
    loadTasks();
    // Style buttons normal again when filters get cleared //
    completedButton.style.backgroundColor = "#3a86ff";
    completedButton.style.border = "1px solid #3a86ff";
    sortAscButton.style.backgroundColor = "#3a86ff";
    sortAscButton.style.border = "1px solid #3a86ff";
    sortDescButton.style.backgroundColor = "#3a86ff";
    sortDescButton.style.border = "1px solid #3a86ff";
});
// Change Color of Asc or Desc Button & Sort by Due Date //
let activeSortButton = null;
sortAscButton.addEventListener("click", function () {
    if (activeSortButton) {
        activeSortButton.style.backgroundColor = "#3a86ff";
        activeSortButton.style.border = "1px solid #3a86ff";
    }
    tasks.sort((a, b) => {
        const dueDateA = a.dueDate ? new Date(a.dueDate.replace("Task due on ", "")).getTime() : 0;
        const dueDateB = b.dueDate ? new Date(b.dueDate.replace("Task due on ", "")).getTime() : 0;
        return dueDateA - dueDateB;
    });
    loadTasks();
    activeSortButton = sortAscButton;
    sortAscButton.style.backgroundColor = "green";
    sortAscButton.style.border = "1px solid green";
});
sortDescButton.addEventListener("click", function () {
    if (activeSortButton) {
        activeSortButton.style.backgroundColor = "#3a86ff";
        activeSortButton.style.border = "1px solid #3a86ff";
    }
    tasks.sort((a, b) => {
        const dueDateA = a.dueDate ? new Date(a.dueDate.replace("Task due on ", "")).getTime() : 0;
        const dueDateB = b.dueDate ? new Date(b.dueDate.replace("Task due on ", "")).getTime() : 0;
        return dueDateB - dueDateA; // Change this line to sort in descending order
    });
    loadTasks();
    activeSortButton = sortDescButton;
    sortDescButton.style.backgroundColor = "green";
    sortDescButton.style.border = "1px solid green";
});
