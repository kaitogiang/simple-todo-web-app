const todoInput = document.getElementById("todo-input");
const addBtn = document.getElementById("add-btn");
const todoList = document.getElementById("todoList");
const completedTodoAmount = document.getElementById("completed-task");
const uncompletedTodoAmount = document.getElementById("uncompleted-task");
const ERROR_TITLE = "ERROR";
const ERROR_CONTENT = "Please enter something!";
const SUCCESS_TITLE = "SUCCESS";
const SUCCESS_CONTENT = "The todo added successfully";


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
    if (value == "") {
        showAlert(false);
        return;
    };
    //set the properties
    div.className = "task-list-item";
    span.id = "todo-item";
    subDiv.className = "task-list-item-action";
    deleteBtn.innerHTML = "Delete";
    editBtn.innerHTML = "Edit";
    //Setup action listener
    deleteBtn.addEventListener("click", deleteTodoItem);
    editBtn.addEventListener("click", editTask);
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
    if (innerTodoTextElement.tagName === 'INPUT') {
        return;
    }
    innerTodoTextElement.className = "task-list-item--done";
    updateTodoCount();
}
/**
 * @this {HTMLElement}
 */
function editTask() {
    const todoListItem = this.parentElement.parentElement;
    const originalTodoName = todoListItem.firstElementChild
    const cloneToDoListItem = todoListItem.cloneNode(true);
    //Replace with the edit input field
    todoListItem.innerHTML = createEditTexField(originalTodoName.textContent);
    const btnList = todoListItem.lastElementChild.children;
    const okBtn = btnList[0];
    const cancelBtn = btnList[1];
    const inputField = todoListItem.querySelector("#edit-input");
    
    inputField.addEventListener("keydown", (event)=>{
        if (event.key !== 'Enter') {
            return;
        }
        updateTodoItem(todoListItem, cloneToDoListItem, inputField.value);
    });

    cancelBtn.addEventListener("click", ()=>{
        todoListItem.innerHTML = cloneToDoListItem.innerHTML;
    });
    okBtn.addEventListener("click", ()=> {
        updateTodoItem(todoListItem, cloneToDoListItem, inputField.value);
    });
    console.log(`last child is: ${btnList}`);
}
/**
 * 
 * @param {HTMLElement} todoListItem 
 * @param {HTMLElement} cloneToDoListItem 
 * @param {*} value
 */
function updateTodoItem(todoListItem, cloneToDoListItem, value) {
    todoListItem.innerHTML = cloneToDoListItem.innerHTML;
    const updatedTodoListItem = todoListItem.querySelector("#todo-item");
    console.log(`Todo : ${updatedTodoListItem}`);
    //Re-attach the listener
    const deleteBtn = todoListItem.querySelector("button:nth-child(1)");
    const editBtn = todoListItem.querySelector("button:nth-child(2)");
    deleteBtn.addEventListener("click", deleteTodoItem);
    editBtn.addEventListener("click", editTask);
    updatedTodoListItem.innerHTML = value;
}
/**
 * 
 * @param {String} value 
 * @returns 
 */
function createEditTexField(value) {
    return `
    <input id="edit-input" class="no-border" type="text" value="${value}">
    <div class="task-list-item-action">
        <button>Ok</button>
        <button>Cancel</button>
    </div>
    `;
}

/**
 * 
 * @param {Boolean} isSuccessAlert 
 */
function showAlert(isSuccessAlert = true) {
    const template = document.getElementById("alert");
    const templateIcons = document.getElementById("icon-list");
    const cloneTemplate = template.content.cloneNode(true);
    const cloneIconTemplate = templateIcons.content.cloneNode(true);
    /** @type {HTMLElement} */
    const alertElement = cloneTemplate.querySelector('.alert');
    /** @type {HTMLElement} */
    const prefixIconContainer = alertElement.querySelector('.prefix-icon');
    const oldPrefixIcon = prefixIconContainer.firstElementChild;
    const newPrefixIcon = cloneIconTemplate.querySelector(isSuccessAlert ? '#success-icon' : '#error-icon');
    const titleElement = alertElement.querySelector('#alert-title');
    const contentElement = alertElement.querySelector('#alert-content');
    const closeIconElement = alertElement.querySelector('.close-icon').firstElementChild;
    //Set attribute
    if (isSuccessAlert) {
        alertElement.classList.add("alert__success");
    } else {
        alertElement.classList.add("alert__error");
    }
    titleElement.innerHTML = isSuccessAlert ? SUCCESS_TITLE : ERROR_TITLE;
    contentElement.innerHTML = isSuccessAlert ? SUCCESS_CONTENT : ERROR_CONTENT;
    prefixIconContainer.replaceChild(newPrefixIcon, oldPrefixIcon);

    //Add listener for close icon in the popup
    closeIconElement.addEventListener("click", ()=> {
        console.log("Click on Close");
        alertElement.parentElement.removeChild(alertElement);
    });
    //Add the alert to the body finally
    document.body.appendChild(alertElement);
    setTimeout(()=> {
        alertElement.style.animation = "alertBackToTop 0.7s ease forwards";
        //Add animation before remove the child
        alertElement.addEventListener("animationend", () => {
            if (alertElement.parentElement) {
                console.log("Remove....");
                alertElement.parentElement.removeChild(alertElement);
            }
        }, { once: true });
    }, 2000);
}
