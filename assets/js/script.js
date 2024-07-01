// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id
function generateTaskId() {
    nextId = JSON.parse(localStorage.getItem("nextId"));
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
    `<section id="${task.id}" class="draggable" style = "margin-top: 3%; background-color: silver; border-style: solid; border-width: 3px; padding: 1%; font-weight: bold;"> 
    <p>Title: ${task.title}</p>
    <p>Description: ${task.description}</p>
    <p>Due date: ${task.Date}</p>
    <button onclick="handleDeleteTask(event)" style="background-color: red; color: white;">DELETE</button>
    </section>`;
    return card;
}

//Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    taskList = JSON.parse(localStorage.getItem("tasks"));
    if (taskList != null) {
        for (let i = 0; i < taskList.length; i++) {
            $('.row').find(`#${taskList[i].id}`).remove();
        };

        for (i = 0; i < taskList.length; i++) {
            var card = createTaskCard(taskList[i]);
            var lane = taskList[i].Status;
            $(`#${lane}`).append(card);
            $(`#${lane}`).sortable({containment: "document"});
            $(`#${lane}`).find('section').draggable({revert: "invalid", containment: "document", stack: ".draggable", connectToSortable: `#${lane}`});
        };
    
    } else {
        return;
    }
}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    const task = {
        id: generateTaskId(),
        title: $('#taskTitle').val(),
        description: $('#taskDescription').val(),
        Date: $('#taskDate').val(),
        Status: 'to-do'
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
    var target = $(event.target);
    var id = target[0].offsetParent.attributes.id.nodeValue;
    $(`#${id}`).remove();
    taskList = taskList.filter((pass) => pass.id != id);
    if (taskList.length != 0) {
        for (let i = id - 1; i < taskList.length; i++) {
            taskList[i].id = taskList[i].id - 1;
        }
        nextId = nextId - 1;    
        localStorage.setItem('tasks', JSON.stringify(taskList));
        localStorage.setItem('nextId', JSON.stringify(nextId));
    } else {
        localStorage.removeItem('tasks');
        localStorage.removeItem('nextId');
    }
    location.reload();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    taskList = JSON.parse(localStorage.getItem("tasks"));
    var card = $(ui.draggable);
    var lanes = $(event.target);
    var lane = lanes[0].id;
    var id = card[0].id;
    var status = taskList[Number(id) - 1].Status;
    $(`#${status}`).find(`#${id}`).remove(); 
    taskList[Number(id) - 1].Status = `${lane}`;
    localStorage.setItem('tasks', JSON.stringify(taskList));
    renderTaskList();
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    $.fn.bootstrapBtn = $.fn.button.noConflict();
    
    renderTaskList();

    $('#to-do').droppable({
        accept: `.draggable`,
        drop: handleDrop
    });

    $('#in-progress').droppable({
        accept: `.draggable`,
        drop: handleDrop
    });

    $('#done').droppable({
        accept: `.draggable`,
        drop: handleDrop
    });
        
    $(".btn").on('click', function () {
        $('#taskDate').datepicker();
        $("#modal1").dialog({height: 300, rezisable: true});
        $("#form").on('submit', function () {
            createTaskCard(handleAddTask());
            $("#modal1").dialog('close');
            renderTaskList();
        });
    });
});
