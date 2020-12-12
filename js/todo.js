(function(){
'use strict';
// HTML elements & variables
const weekDaySpan = document.querySelector('.dateSection--weekday');
const dateSpan = document.querySelector('.dateSection--date');
const listPage = document.querySelector(`.list`);
const emptyListPage = document.querySelector(`.empty-list`);
const pendingTodoItemNrDisplay = document.querySelector('.pending h4 span');
const completedTodoItemPercentDisplay = document.querySelector('.completed h4 span');
const listOfPendingTodo = document.querySelector(`.pendingItemContainer`);
const listOfCompletedTodo = document.querySelector(`.completedItemContainer`);
const todoNoteInputElement = document.querySelector('.manager-window .input-section input');
const todoNoteAdderButton = document.querySelector('.input-section button');
const hideDoneSectionButton = document.querySelector('.list-section .list .controls .hide');
const sectionOfCompletedTodo = document.querySelector(`.completed`);
const clearAllButton = document.querySelector('.list-section .list .controls .clearAll');
let todoArray = [];
let pendingTodoItemNr = 0;
let completedTodoItemNr = 0;


// date updater
const updateDate = () => {
    const date = new Date();
    weekDaySpan.innerHTML=date.toLocaleDateString('en-US', {weekday: 'long'});
    dateSpan.innerHTML=date.toLocaleDateString('en-US').replaceAll('/','-');
}
// localStorage manager
const storage = {
    read(){
        const value = localStorage.getItem('todoApplicationStoredData');
        value ? todoArray = JSON.parse(value) : todoArray = [];
    },
    write(){localStorage.setItem('todoApplicationStoredData', JSON.stringify(todoArray))},
    clear(){localStorage.removeItem('todoApplicationStoredData')},
};
// todoArray manager
const todoArrayManager = {
    index: -1,
    findTodo(todoId){todoArrayManager.index = todoArray.findIndex(todoObject => todoObject.id === todoId)},
    addTodo(todoId, note, selected){
        todoArrayManager.findTodo(todoId);
        todoArray.push({ 'id': todoId, 'content': note, 'isDone': selected});
    },
    deleteTodo(todoId){
        todoArrayManager.findTodo(todoId);
        todoArray = todoArray.filter((todoObject, index) => index !== todoArrayManager.index)
    },
}

// other functions

const chillingTimeIsOver = () => {
    listPage.classList.toggle('invisible', false);
    emptyListPage.classList.toggle('invisible', true);
};
const startChilling = () => {
    listPage.classList.toggle('invisible', true);
    emptyListPage.classList.toggle('invisible', false);
};

const calculateTodoItems = () => {
    pendingTodoItemNrDisplay.innerHTML = pendingTodoItemNr;
    if (pendingTodoItemNr != 0) {
        completedTodoItemPercentDisplay.innerHTML = `${Math.trunc(completedTodoItemNr * 100 / (pendingTodoItemNr + completedTodoItemNr))}%`;
        chillingTimeIsOver();
    } else {
        completedTodoItemPercentDisplay.innerHTML = `100%`;
        let timer = setTimeout(startChilling, 1200);
        setTimeout(clearTimeout, 1300, timer);
    }
};

const todoAdder = (id, note, selected) => {
    let target = null;
    if (!selected) { target = listOfPendingTodo; pendingTodoItemNr += 1;}
    else { target = listOfCompletedTodo; completedTodoItemNr += 1; }
    const todoTemplateLiteral = `
    <div class="todoContainer todo--appear"><label class="todoLabel" for="${id}">
    <input ${selected ? 'checked' : ''} type="checkbox" id="${id}">
    <span class="checkmark"></span>
    <span class="note">${note}</span></label>
    <button class="todoDelButton hideDelButton"><i class="far fa-trash-alt"></i></button></div>` 
    target.insertAdjacentHTML('afterbegin', todoTemplateLiteral);
    target.querySelector(`label[for="${id}"]`).parentElement.addEventListener('mouseenter',revealButton);
    target.querySelector(`label[for="${id}"]`).parentElement.addEventListener('mouseleave',hideButton);
    target.querySelector(`label[for="${id}"]`).parentElement.lastChild.addEventListener('click', deleteTodoDiv);
    target.querySelector(`label[for="${id}"] input`).addEventListener('click', reorganizeTodoDiv);
    storage.write();
};

const deleteDiv = (container, id) => {
    todoArrayManager.deleteTodo(id);
    storage.write()
    if (Array.from(container.parentElement.classList).indexOf("pendingItemContainer")>-1) { pendingTodoItemNr -= 1;} else
    if (Array.from(container.parentElement.classList).indexOf("completedItemContainer")>-1) { completedTodoItemNr -= 1; }
    container.classList.toggle('todo--appear');
    container.classList.toggle('todo--disAppear');
    setTimeout(() => container.remove(), 900);
};



// handlers of events
const revealButton = (event) => {
    event.currentTarget.querySelector('.todoDelButton').classList.toggle('revealDelButton', true);
    event.currentTarget.querySelector('.todoDelButton').classList.toggle('hideDelButton', false);
};
const hideButton = (event) => {
    event.currentTarget.querySelector('.todoDelButton').classList.toggle('hideDelButton', true);
    event.currentTarget.querySelector('.todoDelButton').classList.toggle('revealDelButton', false);
};
const deleteTodoDiv = (ev) => {
    let todoContainer = null;
    if (ev.target.classList.contains('far')) {
        todoContainer = ev.target.parentElement.parentElement;
    } else {
        todoContainer = ev.target.parentElement;
    };
    const id = todoContainer.querySelector('input').getAttribute('id');
    deleteDiv(todoContainer, id);
    calculateTodoItems();
};
const reorganizeTodoDiv = (ev) => {
    const todoContainer = ev.target.parentElement.parentElement;
    const id = todoContainer.querySelector('input').getAttribute('id');
    const noteText = todoContainer.firstChild.lastChild.textContent;
    const checked = ev.target.checked;
    deleteDiv(todoContainer, id);
    todoArrayManager.addTodo(id, noteText, checked);
    todoAdder(id, noteText, checked);
    calculateTodoItems();
};
const insertTodoDiv = () => {
    const todoNote = todoNoteInputElement.value;
    if (!todoNote) {return};
    todoNoteInputElement.value = '';
    const id = new Date().getTime().toString();
    todoArrayManager.addTodo(id, todoNote, false);
    todoAdder(id, todoNote, false);
    calculateTodoItems();
};
const hideDoneSection = (ev) => {
    if (ev.target.textContent === 'Hide Complete') {
        sectionOfCompletedTodo.classList.toggle('todo--appear', false);
        sectionOfCompletedTodo.classList.toggle('todo--disAppear', true);
        ev.target.textContent = 'Show Complete'
        setTimeout(() => {
            sectionOfCompletedTodo.classList.add('invisible');
            sectionOfCompletedTodo.classList.remove('completed');
        }, 950);
    } else if (ev.target.textContent === 'Show Complete') {
        sectionOfCompletedTodo.classList.add('completed');
        sectionOfCompletedTodo.classList.remove('invisible');
        sectionOfCompletedTodo.classList.toggle('todo--disAppear', false);
        sectionOfCompletedTodo.classList.toggle('todo--appear', true);
        ev.target.textContent = 'Hide Complete'
    }
};
const deleteAllTodoItem = () => {
    document.querySelectorAll('.todoContainer').forEach(todoContainer => {
        const id = todoContainer.querySelector('input').getAttribute('id');
        deleteDiv(todoContainer, id);
    });
    calculateTodoItems();
};

// initialization
updateDate();
setInterval(updateDate, 60000);
storage.read();

if (todoArray.length > 0) {
    chillingTimeIsOver();
    todoArray.forEach(todoObject => todoAdder(todoObject.id, todoObject.content, todoObject.isDone))
};
calculateTodoItems();


todoNoteAdderButton.addEventListener('click', insertTodoDiv);
hideDoneSectionButton.addEventListener('click', hideDoneSection);
clearAllButton.addEventListener('click', deleteAllTodoItem);
    
})()
