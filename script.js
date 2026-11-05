const taskForm = document.querySelector("#task-form");
const taskTitleInput = document.querySelector("#task-title");
const taskSubjectInput = document.querySelector("#task-subject");
const taskDateInput = document.querySelector("#task-date");
const taskList = document.querySelector("#task-list");
const filterButtons = document.querySelectorAll(".filter-button");

const totalCount = document.querySelector("#total-count");
const completedCount = document.querySelector("#completed-count");
const remainingCount = document.querySelector("#remaining-count");

let tasks = [];
let currentFilter = "all";

function updateSummary() {
  const completedTasks = tasks.filter(function (task) {
    return task.completed;
  }).length;

  totalCount.textContent = tasks.length;
  completedCount.textContent = completedTasks;
  remainingCount.textContent = tasks.length - completedTasks;
}

function showTasks() {
  taskList.textContent = "";

  const visibleTasks = tasks.filter(function (task) {
    if (currentFilter === "active") {
      return !task.completed;
    }

    if (currentFilter === "completed") {
      return task.completed;
    }

    return true;
  });

  if (visibleTasks.length === 0) {
    const emptyMessage = document.createElement("li");
    emptyMessage.className = "empty-message";
    emptyMessage.textContent = tasks.length === 0
      ? "No tasks yet. Add your first study task above!"
      : "There are no tasks in this list.";
    taskList.appendChild(emptyMessage);
    updateSummary();
    return;
  }

  visibleTasks.forEach(function (task) {
    const listItem = document.createElement("li");
    listItem.className = task.completed ? "task-item completed" : "task-item";

    const checkbox = document.createElement("input");
    checkbox.className = "task-checkbox";
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", "Mark " + task.title + " as complete");
    checkbox.addEventListener("change", function () {
      task.completed = checkbox.checked;
      showTasks();
    });

    const details = document.createElement("div");
    details.className = "task-details";

    const title = document.createElement("strong");
    title.className = "task-title";
    title.textContent = task.title;

    const meta = document.createElement("span");
    meta.className = "task-meta";
    meta.textContent = task.subject + " · Due " + task.dueDate;

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.setAttribute("aria-label", "Delete " + task.title);
    deleteButton.addEventListener("click", function () {
      tasks = tasks.filter(function (item) {
        return item.id !== task.id;
      });
      showTasks();
    });

    details.appendChild(title);
    details.appendChild(meta);
    listItem.appendChild(checkbox);
    listItem.appendChild(details);
    listItem.appendChild(deleteButton);
    taskList.appendChild(listItem);
  });

  updateSummary();
}

taskForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const newTask = {
    id: Date.now(),
    title: taskTitleInput.value.trim(),
    subject: taskSubjectInput.value.trim(),
    dueDate: taskDateInput.value,
    completed: false
  };

  tasks.push(newTask);
  taskForm.reset();
  showTasks();
  taskTitleInput.focus();
});

filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    currentFilter = button.dataset.filter;

    filterButtons.forEach(function (filterButton) {
      filterButton.classList.remove("active");
    });

    button.classList.add("active");
    showTasks();
  });
});

showTasks();
