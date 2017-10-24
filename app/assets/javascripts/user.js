console.log('User.js file loaded');
$(document).on('turbolinks:load', function(){
  $.fn.editable.defaults.mode = 'inline';
  // console.log(`${window.location.pathname}.json`);

  function renderAllTasks() {
    $.ajax({
      method: 'GET',
      url: `http://localhost:3000/${window.location.pathname}.json`,
    })
    .then(function(res){
      let jsonResponse = res
      console.log('Response - ', res);
      var tasksAssignedToMe = [];
      var tasksOtherOweMe = [];
      var tasksCreatedForMyself = [];
      for (let i = 0; i < res.assigned_tasks.length; i++) {
        if ( res.assigned_tasks[i].assignee_id.id === res.assigned_tasks[i].owner_id.id ) {
          tasksCreatedForMyself.push(
            {
              id: res.assigned_tasks[i].id,
              title: res.assigned_tasks[i].title.slice(0,40).concat('...').link(`http://localhost:3000/tasks/${res.assigned_tasks[i].id}`),
              taskOwner: res.assigned_tasks[i].owner_id.first_name,
            }
          )
        } else {
          tasksAssignedToMe.push(
            {
              id: res.assigned_tasks[i].id,
              title: res.assigned_tasks[i].title.slice(0,40).concat('...').link(`http://localhost:3000/tasks/${res.assigned_tasks[i].id}`),
              taskIndividual: res.assigned_tasks[i].owner_id.first_name,
            }
          )
        }
      };
      for (let i = 0; i < res.owned_tasks.length; i++) {
        tasksOtherOweMe.push(
          {
            id: res.owned_tasks[i].id,
            title: res.owned_tasks[i].title.slice(0,40).concat('...').link(`http://localhost:3000/tasks/${res.owned_tasks[i].id}`),
            taskIndividual: res.owned_tasks[i].assignee_id.first_name,
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
  if ( window.location.href !== 'http://localhost:3000/' ) {
    renderAllTasks();
  }



  function createTasksTable (tasksAssignedToMe, tableType, taskOwnerAssignee){
    console.log('createTableTasksAssignedToMe - ', tasksAssignedToMe);
    $(tableType).bootstrapTable({
      columns: [
        {
          field: 'id',
          title: 'Task ID',
          sortable: 'true',
          width: '10%',
          // events: this.addEventListener('click', editCellInTable),
        }, {
          field: 'title',
          title: 'title',
          sortable: 'true',
          width: '45%',
        }, {
          field: 'taskIndividual',
          title: taskOwnerAssignee,
          sortable: 'true',
          width: '45%',
          // editable: {
          //           type: 'select',
          //           source: [
          //               {value: 'active', text: 'Active'},
          //               {value: 'blocked', text: 'Blocked'},
          //               {value: 'deleted', text: 'Deleted'}
          //           ]
          //       }
        },
      ],
      data: tasksAssignedToMe,
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
