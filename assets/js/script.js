// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

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
    if ($('#to-do')[0].childElementCount > 2) {
        $('#to-do').find('section').remove();
    };
    if ($('#in-progress')[0].childElementCount > 2) {
        $('#in-progress').find('section').remove();
    };
    if ($('#done')[0].childElementCount > 2) {
        $('#done').find('section').remove();
    };   

    if (taskList != null) {
        if ($('#todo-cards').length) {
            for (i = 0; i < taskList.length; i++) {
                var card = createTaskCard(taskList[i]);
                var lane = taskList[i].Status;
                $(`#${lane}`).append(card);
                $(`#${lane}`).sortable({containment: "document"});
                $(`#${lane}`).find('section').draggable({revert: "invalid", containment: "document", stack: ".draggable", connectToSortable: `#${lane}`});
            };
        } else {
            var card = createTaskCard(taskList[taskList.length - 1]);
            var lane = taskList[taskList.length - 1].Status;
            $(`#${lane}`).append(card);
            $(`#${lane}`).sortable({containment: "document"});
            $(`#${lane}`).find('section').draggable({revert: "invalid", containment: "document", connectToSortable: `#${lane}`}); 
        };
        
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
    console.log(id);
    $(`#${id}`).remove();
    taskList = taskList.filter((pass) => pass.id != id);
    console.log(taskList);
    if (taskList.length != 0) {
        localStorage.setItem('tasks', JSON.stringify(taskList));
    } else {
        localStorage.removeItem('tasks');
    }
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    var card = $(ui.draggable);
    var lanes = $(event.target);
    var lane = lanes[0].id;
    var id = card[0].id;
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
