// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));
var tracker = 0;
// Todo: create a function to generate a unique task id
function generateTaskId() {
    if (nextId != null) {
        nextId += 1;
        localStorage.setItem('nextId', JSON.stringify(nextId));
    } else {
        nextId = 1;
        localStorage.setItem('nextId', JSON.stringify(nextId));
    }
    return nextId;
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    var card = 
    `<section id="${task.id}" style = "margin-top: 3%; background-color: silver; border-style: solid; border-width: 3px; padding: 1%; font-weight: bold;"> 
    <p>Title: ${task.title}</p>
    <p>Description: ${task.description}</p>
    <p>Due date: ${task.Date}</p>
    <button style="background-color: red; color: white;">DELETE</button>
    </section>`;
    return card;
}

//Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    if (taskList != null) {
        if (tracker == 0) {
            for (i = 0; i < taskList.length; i++) {
                var card = createTaskCard(taskList[i]);
                $('#todo-cards').append(card);
                $('#todo-cards').find('section').draggable({revert: "true", containment: "document"});
            };
            tracker += 1;
        } else {
            var card = createTaskCard(taskList[taskList.length - 1]);
            $('#todo-cards').append(card);  
        };
        $('#todo-cards').sortable({revert: true, contaiment: "#todo-cards"});
        $('#todo-cards').find('section').draggable({revert: "invalid", containment: "document", connectToSortable: "#todo-cards"});
    } else {
        return;
    };
}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    const task = {
        id: generateTaskId(),
        title: $('#taskTitle').val(),
        description: $('#taskDescription').val(),
        Date: $('#taskDate').val(),
        Status: 'todo'
    }

    if (taskList != null) {
        taskList.push(task);
        localStorage.setItem('tasks', JSON.stringify(taskList));
    } else {
        taskList = [];
        taskList.push(task);
        localStorage.setItem('tasks', JSON.stringify(taskList));
    }
    return task;
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
    event.preventDefault();
    $('#taskcards').remove();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    event.preventDefault();
    $('#todo-cards').droppable({
        drop: function(event, ui) {
            $('#todo-cards').append(this);
            $(this).remove();
        }
    });
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    renderTaskList();
    $(".btn").on('click', function () {
        $('#taskDate').datepicker();
        $("#modal1").dialog({height: 300});
        $("#form").on('submit', function (event) {
            event.preventDefault();
            createTaskCard(handleAddTask());
            renderTaskList();
        });
    });
});
