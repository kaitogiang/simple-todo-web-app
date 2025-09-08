const todoInput = document.getElementById("todo-input");
const addBtn = document.getElementById("add-btn");
const todoList = document.getElementById("todoList");
const completedTodoAmount = document.getElementById("completed-task");
const uncompletedTodoAmount = document.getElementById("uncompleted-task");

addBtn.addEventListener("click", addTodoItem);
todoInput.addEventListener("keydown", addTodoItem);

/**
 * @param {Event} event
 */
function addTodoItem(event) {
    if (event.key !== 'Enter' && (event.type !== 'click')) {
        console.log(`Type is: ${event.type}`);
        return;
    }
    const value = todoInput.value;
    const div = document.createElement("div");
    const subDiv = document.createElement("div");
    const span = document.createElement("span");
    const deleteBtn = document.createElement("button");
    const editBtn = document.createElement("button");
    //Omit empty value
    if (value == "") return;
    //set the properties
    div.className = "task-list-item";
    span.id = "todo-item";
    subDiv.className = "task-list-item-action";
    deleteBtn.innerHTML = "Delete";
    editBtn.innerHTML = "Edit";
    //Setup action listener
    deleteBtn.addEventListener("click", deleteTodoItem);
    //Append action btn child
    span.innerHTML = value;
    subDiv.appendChild(deleteBtn);
    subDiv.appendChild(editBtn);
    //Append parent child
    div.appendChild(span);
    div.appendChild(subDiv);
    //Setup listener for div
    div.addEventListener("dblclick", markCompleteTodo);
    todoList.appendChild(div);
    updateTodoCount(true);
}

/**
 * @this {HTMLElement}
 */
function deleteTodoItem() {
    //Access the delete button itself via 'this' keyword
    const todoListItem = this.parentElement.parentElement;
    todoList.removeChild(todoListItem);
    updateTodoCount();
}
/**
 * 
 * @param {Boolean} isAdded 
 */
function updateTodoCount(isAdded = false) {  
    const completedTodoElements = document.getElementsByClassName("task-list-item--done");
    const allTodoElements = todoList.childElementCount;
    completedTodoAmount.innerHTML = completedTodoElements.length;
    uncompletedTodoAmount.innerHTML = allTodoElements - completedTodoElements.length;
    if (isAdded) {
        todoInput.value = "";
    }
}
/**
 * @this {HTMLElement}
 */
function markCompleteTodo() {
    console.log("Mark complete");
    const innerTodoTextElement = this.firstElementChild;
    innerTodoTextElement.className = "task-list-item--done";
    updateTodoCount();
}

