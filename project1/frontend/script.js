const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const addBtn = document.getElementById("addBtn");

const loadTasks = async () => {
    const res = await fetch("/api/tasks");
    const tasks = await res.json();
    taskList.innerHTML = "";
    tasks.forEach(task => addTaskToDOM(task));
};

const addTaskToDOM = (task) => {
    const li = document.createElement("li");
    li.textContent = task.text;
    if (task.completed) li.classList.add("completed");

    li.addEventListener("click", async () => {
        const newStatus = task.completed ? 0 : 1;
        await fetch(`/api/tasks/${task.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ completed: newStatus })
        });
        loadTasks();
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "❌";
    deleteBtn.addEventListener("click", async () => {
        await fetch(`/api/tasks/${task.id}`, { method: "DELETE" });
        loadTasks();
    });

    li.appendChild(deleteBtn);
    taskList.appendChild(li);
};

addBtn.addEventListener("click", async () => {
    const text = taskInput.value.trim();
    if (!text) return;
    await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
    });
    taskInput.value = "";
    loadTasks();
});

loadTasks();
