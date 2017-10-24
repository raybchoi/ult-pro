console.log('User.js file loaded');
$(document).on('turbolinks:load', function(){
  // $.fn.editable.defaults.mode = 'inline';
  // console.log(`${window.location.pathname}.json`);

  function renderAllTasksForOneUser() {
    $.ajax({
      method: 'GET',
      url: `http://localhost:3000/users/${document.cookie.split('id=')[1]}.json`,
    })
    .then(function(res){
      // let jsonResponse = jsonResponse
      console.log('Response - ', res);
      var tasksAssignedToMe = [];
      var tasksOtherOweMe = [];
      var tasksCreatedForMyself = [];
      for (let i = 0; i < res.assigned_tasks.length; i++) {
        // check to see if the task is assigned to self
        if ( res.assigned_tasks[i].assignee_info.id === res.assigned_tasks[i].owner_info.id ) {
          // if it is then fill in the array for tasks created for self
          tasksCreatedForMyself.push(
            {
              status: res.assigned_tasks[i].status,
              title: res.assigned_tasks[i].title.slice(0,120).concat('...').link(`http://localhost:3000/tasks/${res.assigned_tasks[i].id}`),
              // description: res.assigned_tasks[i].description.slice(0,240).concat('...'),
              taskResponsibleOwner: `${res.assigned_tasks[i].owner_info.first_name} ${res.assigned_tasks[i].owner_info.last_name}`,
              createdDate: res.assigned_tasks[i].created_date,
              dueDate: res.assigned_tasks[i].due_date,
              id: res.assigned_tasks[i].id,
            }
          )
        } else {
          tasksAssignedToMe.push(
            {
              status: res.assigned_tasks[i].status,
              title: res.assigned_tasks[i].title.slice(0,120).concat('...').link(`http://localhost:3000/tasks/${res.assigned_tasks[i].id}`),
              // description: res.assigned_tasks[i].description.slice(0,240).concat('...'),
              taskResponsibleOwner: `${res.assigned_tasks[i].owner_info.first_name} ${res.assigned_tasks[i].owner_info.last_name}`,
              createdDate: res.assigned_tasks[i].created_date,
              dueDate: res.assigned_tasks[i].due_date,
              id: res.assigned_tasks[i].id,
            }
          )
        }
      };
      for (let i = 0; i < res.owned_tasks.length; i++) {
        tasksOtherOweMe.push(
          {
            status: res.owned_tasks[i].status,
            title: res.owned_tasks[i].title.slice(0,120).concat('...').link(`http://localhost:3000/tasks/${res.owned_tasks[i].id}`),
            // description: res.owned_tasks[i].description.slice(0,240).concat('...'),
            taskResponsibleOwner: `${res.owned_tasks[i].assignee_info.first_name} ${res.assigned_tasks[i].assignee_info.last_name}`,
            createdDate: res.owned_tasks[i].created_date,
            dueDate: res.owned_tasks[i].due_date,
            id: res.owned_tasks[i].id,
          }
        )
      };
      console.log('tasksOtherOweMe - ', tasksOtherOweMe);
      console.log('tasksAssignedToMe - ', tasksAssignedToMe);
      console.log('tasksCreatedForMyself - ', tasksCreatedForMyself);
      // createTableTasksAssignedToMe(tasksAssignedToMe)
      createTasksTable(tasksAssignedToMe, '#tasks_assigned_to_me', 'Task Owner')
      createTasksTable(tasksOtherOweMe, '#tasks_others_owe_me', 'Task Assignee')
      // createTasksTable(tasksCreatedForMyself, '#tasks_created_for_myself', )
    });
  }
  if ( window.location.href === `http://localhost:3000/users/${document.cookie.split('id=')[1]}` ) {
    renderAllTasksForOneUser();
  }

  function createTasksTable (taskData, tableIdFor, tableType){
    console.log('createTableTasksAssignedToMe - ', tableType);
    $(tableIdFor).bootstrapTable({
      columns: [
        {
          field: 'status',
          title: 'Status',
          sortable: 'true',
          width: '10%',
        }, {
          field: 'title',
          title: 'Title',
          sortable: 'true',
          width: '50%',
        },
        // {
        //   field: 'description',
        //   title: 'Description',
        //   sortable: 'true',
        //   width: '10%',
        // },
        {
          field: 'taskResponsibleOwner',
          title: 'Responsible',
          sortable: 'true',
          width: '10%',
        }, {
          field: 'createdDate',
          title: 'Created Date',
          sortable: 'true',
          width: '10%',
        }, {
          field: 'dueDate',
          title: 'Due Date',
          sortable: 'true',
          width: '10%',
        }, {
          field: 'id',
          title: 'id',
          sortable: 'true',
          width: '10%',
        }
      ],
      data: taskData,
      showHeader: 'true',
      pagination: 'true',
      pageSize: '20',
      pageList: [1,10,25,'all'],
      striped: 'true',
      classes: "table table-hover"
    });
  };

let createNewTask = function() {

  // go and get each of the value from the input field. The initial value of each field was populated automatically by using the 'value=' in the input tag of the html
  let newTaskInfo = { task:
      {
      title: $('#task-title').val(),
      description: $('#task-description').val(),
      assignee_id: $('#task-assignee_id').val(),
      owner_id: $('#task-owner_id').val(),
      creator_id: $('#task-creator_id').val(),
      },
    };
  console.log('THIS IS NEW PROFILE HEADER DATA', newTaskInfo);

  $.ajax({
  method: 'POST',
  url: `/tasks`,
  data: newTaskInfo,
  })
  .then(function(newlyCreatedTaskData) {
    $('#tasks_assigned_to_me').bootstrapTable('insertRow',
     {index: 1, row: newlyCreatedTaskData});
    console.log('DATA returned from createNewTask', newlyCreatedTaskData);
    // send back the updated data and pass it through a similar render function again. This time will need to use a different function since this time the data is being passed in from the backend vs the front-end SRP page
    // $('.tasks-for-removal').remove();
    // $('.tasks_assigned_to_me_div').append(`
    //   <div class='tasks-for-removal'>
    //     <table id="tasks_assigned_to_me">
    //     </table>
    //   </div>`)
    // $('.tasks_others_owe_me_div').append(`
    //   <div class='tasks-for-removal'>
    //     <table class='tasks-for-removal' id="tasks_others_owe_me">
    //     </table>
    //   </div>`)
    // $('.tasks_created_for_myself_div').append(`
    //   <div class='tasks-for-removal'>
    //     <table class='tasks-for-removal' id="tasks_created_for_myself" ></table>
    //   </div>`)
    // renderAllTasks();
    // $('#task-title').val('');
    // $('#task-description').val('');
    // $('#task-assignee_id').val('');
    // $('#task-owner_id').val('');
    // $('#task-creator_id').val('');

    // $('#tasks_assigned_to_me').html()
  })
  .catch(function(err) {
    console.log('ERROR during the createNewUser returned data', err);
  });
};

$('.create-task-button').on('click', createNewTask);
});

// function editCellInTable() {
//   console.log(this);
//   $().editable({
//       type: 'text',
//       pk: 1,
//       url: '/post',
//       title: 'Enter username'
//   });
// }


  // function createTableTasksAssignedToMe (tasksAssignedToMe){
  //   console.log('createTableTasksAssignedToMe - ', tasksAssignedToMe);
  //   $('#tasks_assigned_to_me').bootstrapTable({
  //     columns: [
  //       {
  //         field: 'id',
  //         title: 'Item ID'
  //       }, {
  //         field: 'title',
  //         title: 'title'
  //       }, {
  //         field: 'taskOwner',
  //         title: 'task owner'
  //       },
  //     ],
  //     data: tasksAssignedToMe
  // });
  // }


  // title: function(tableIdFor) {
  //   if ( tableIdFor === '#tasks_assigned_to_me' ) {
  //   return 'Task Owner';
  //   } else if ( tableIdFor === '#tasks_others_owe_me' ) {
  //   return 'Hello';
  //   }
  // },
