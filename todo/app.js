const form = document.querySelector("#todo-form");
const input = document.querySelector("#todo-input");
const list = document.querySelector("#todo-list");
const count = document.querySelector("#count");
const filterButtons = document.querySelectorAll(".filter");
const themeBtn = document.querySelector("#theme-btn");
const welcome = document.querySelector("#welcome");
const closeWelcome = document.querySelector("#close-welcome");

let todos = JSON.parse(localStorage.getItem("todos")) || [];
let currentFilter = "all";

function save() {
    localStorage.setItem("todos", JSON.stringify(todos));
}

function getVisibleTodos() {
    if (currentFilter === "active") {
        return todos.filter((t) => !t.done);
    }
    if (currentFilter === "done") {
        return todos.filter((t) => t.done);
    }
    return todos;
}

function render() {
    list.innerHTML = "";

    getVisibleTodos().forEach((todo) => {
        const li = document.createElement("li");
        li.dataset.id = todo.id;
        li.className = todo.done ? "done" : "";
        li.innerHTML = `
            <span class="text"></span>
            <button class="edit">Edit</button>
            <button class="delete">Delete</button>
        `;
        li.querySelector(".text").textContent = todo.text;
        list.append(li);
    });

    const left = todos.filter((t) => !t.done).length;
    count.textContent = left === 1 ? "1 task left" : `${left} tasks left`;
}

function update() {
    save();
    render();
}

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    todos.push({ id: Date.now(), text, done: false });
    input.value = "";
    update();
});

list.addEventListener("click", (e) => {
    const li = e.target.closest("li");
    if (!li) return;

    const id = Number(li.dataset.id);
    const todo = todos.find((t) => t.id === id);

    if (e.target.matches(".text")) {
        todo.done = !todo.done;
    }

    if (e.target.matches(".edit")) {
        const newText = prompt("Edit task", todo.text);
        if (newText && newText.trim()) todo.text = newText.trim();
    }

    if (e.target.matches(".delete")) {
        todos = todos.filter((t) => t.id !== id);
    }

    update();
});

filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
        filterButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        currentFilter = btn.dataset.filter;
        render();
    });
});

function applyTheme(theme) {
    if (theme === "dark") {
        document.body.classList.add("dark");
        themeBtn.textContent = "☀️ Light";
    } else {
        document.body.classList.remove("dark");
        themeBtn.textContent = "🌙 Dark";
    }
}

themeBtn.addEventListener("click", () => {
    const newTheme = document.body.classList.contains("dark") ? "light" : "dark";
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
});

applyTheme(localStorage.getItem("theme"));

if (!sessionStorage.getItem("welcomeSeen")) {
    welcome.classList.remove("hidden");
    sessionStorage.setItem("welcomeSeen", "yes");
}

closeWelcome.addEventListener("click", () => {
    welcome.classList.add("hidden");
});

render();
