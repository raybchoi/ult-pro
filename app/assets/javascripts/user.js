console.log('User.js file loaded');
$(document).on('turbolinks:load', function(){
  // $.fn.editable.defaults.mode = 'inline';

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
      let resAssignedTasks = res.assigned_tasks
      let resOwnedTasks = res.owned_tasks
      let userCookieInformation = parseInt(`${document.cookie.split('id=')[1]}`)
      // console.log('THIS IS USER COOKIE INFO - ', userCookieInformation);
      console.log(`${document.cookie.split('id=')[1]}`, resAssignedTasks.length + resOwnedTasks.length);
      for (let i = 0; i < resOwnedTasks.length ; i++) {
        // console.log('MOMENT- ', moment(resAssignedTasks[i].created_date).format("MM/DD/YY"));
        // check to see if the task is assigned to self
        // if ( resAssignedTasks[i].assignee_info.id === resAssignedTasks[i].owner_info.id ) {

        if ( ( resOwnedTasks[i].assignee_info.id === userCookieInformation) &&
        ( resOwnedTasks[i].owner_info.id === userCookieInformation )
      ) {
        // if it is then fill in the array for tasks created for self
        tasksCreatedForMyself.push(
          {
            status: resOwnedTasks[i].status,
            title: resOwnedTasks[i].title.slice(0,120).concat('...').link(`http://localhost:3000/tasks/${resOwnedTasks[i].id}`),
            description: resOwnedTasks[i].description.slice(0,240).concat('...'),
            taskResponsibleOwner: `${resOwnedTasks[i].owner_info.first_name} ${resOwnedTasks[i].owner_info.last_name}`,
            createdDate: moment(resOwnedTasks[i].created_date).format("MM/DD/YY"),
            dueDate: moment(resOwnedTasks[i].due_date).format("MM/DD/YY"),
            id: resOwnedTasks[i].id,
          }
        )
      } else if ( ( resOwnedTasks[i].assignee_info.id !== userCookieInformation ) &&
      ( resOwnedTasks[i].owner_info.id === userCookieInformation  ) ) {
        tasksOtherOweMe.push(
          {
            status: resOwnedTasks[i].status,
            title: resOwnedTasks[i].title.slice(0,120).concat('...').link(`http://localhost:3000/tasks/${resOwnedTasks[i].id}`),
            description: resOwnedTasks[i].description.slice(0,240).concat('...'),
            taskResponsibleOwner: `${resOwnedTasks[i].assignee_info.first_name} ${resOwnedTasks[i].assignee_info.last_name}`,
            createdDate:  moment(resOwnedTasks[i].created_date).format("MM/DD/YY"),
            dueDate: moment(resOwnedTasks[i].due_date).format("MM/DD/YY"),
            id: resOwnedTasks[i].id,
          }
        )
      }
    };
    for (let i = 0; i < resAssignedTasks.length ; i++) {
      if ( ( resAssignedTasks[i].assignee_info.id === userCookieInformation ) &&
      ( resAssignedTasks[i].owner_info.id !== userCookieInformation )
    ) {
      tasksAssignedToMe.push({
        status: resAssignedTasks[i].status,
        title: resAssignedTasks[i].title.slice(0,120).concat('...').link(`http://localhost:3000/tasks/${resAssignedTasks[i].id}`),
        description: resAssignedTasks[i].description.slice(0,240).concat('...'),
        taskResponsibleOwner: `${resAssignedTasks[i].owner_info.first_name} ${resAssignedTasks[i].owner_info.last_name}`,
        createdDate: moment(resAssignedTasks[i].created_date).format("MM/DD/YY"),
        dueDate: moment(resAssignedTasks[i].due_date).format("MM/DD/YY"),
        id: resAssignedTasks[i].id,
      })
    }
  };


  console.log('tasksOtherOweMe - ', tasksOtherOweMe);
  console.log('tasksAssignedToMe - ', tasksAssignedToMe);
  console.log('tasksCreatedForMyself - ', tasksCreatedForMyself);
  createTasksTable(tasksAssignedToMe, '#tasks_assigned_to_me')
  createTasksTable(tasksOtherOweMe, '#tasks_others_owe_me')
  createTasksTable(tasksCreatedForMyself, '#my_own_tasks')
});
}

if ( window.location.href === `http://localhost:3000/users/${document.cookie.split('id=')[1]}` ) {
  renderAllTasksForOneUser();
}

function createTasksTable (taskData, tableIdFor){

  console.log('createTableTasksAssignedToMe - ', tableIdFor);
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
        width: '15%',
      },
      {
        field: 'description',
        title: 'Description',
        sortable: 'true',
        width: '35%',
      },
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
$('#create-task-date-picker').datepicker({
  keyboardNavigation: false,
  forceParse: false,
  autoclose: true,
  todayHighlight: true,
});
$('#task-type').on('change', function() {
  let currentSelectedBox = $('#task-type').find(":selected").val()
  // console.log($('#task-type').find(":selected").val())
  if ( currentSelectedBox === "#my_own_tasks" ) {
      $("#task-assignee_id").prop('disabled', true);
      $("#task-assignee_id").val(`${document.cookie.split('id=')[1]}`);
      // disable and set the value to the new user ID
  } else if ( currentSelectedBox === "#tasks_others_owe_me" ) {
    $("#task-assignee_id").prop('disabled', false);
    $("#task-assignee_id").val('');
  }
})

// console.log('EPIOCH TIME,', moment.unix(1508828400).format("MM/DD/YY"));

$('#form-create-new-task').on('submit', function() {
  event.preventDefault();
  // go and get each of the value from the input field. The initial value of each field was populated automatically by using the 'value=' in the input tag of the html
  let getSelectDropDownID = document.getElementById("task-type")
  let tableType = getSelectDropDownID.options[getSelectDropDownID.selectedIndex].value;
  let newTaskInfo = { task:
    {
      title: $('#task-title').val(),
      description: $('#task-description').val(),
      assignee_id: $('#task-assignee_id').val(),
      owner_id: `${document.cookie.split('id=')[1]}`,
      status: 'Open',
      // due_date: new Date($('#create-task-date-picker').val())
      due_date: new Date($('#create-task-date-picker').val()).getTime(),
    },
  };
  console.log(newTaskInfo);

  $.ajax({
    method: 'POST',
    url: `/tasks`,
    data: newTaskInfo,
    success: function(newlyCreatedTaskData) {
      console.log('DATA returned from createNewTask', newlyCreatedTaskData);
      console.log('THIS IS THE TABLE TYPE', tableType);
      $(tableType).bootstrapTable('insertRow', {
        index: 0,
        row: {
          status: newlyCreatedTaskData.status,
          title: newlyCreatedTaskData.title.slice(0,120).concat('...').link(`http://localhost:3000/tasks/${newlyCreatedTaskData.id}`),
          description: newlyCreatedTaskData.description.slice(0,240).concat('...'),
          taskResponsibleOwner: `${newlyCreatedTaskData.assignee_info.first_name} ${newlyCreatedTaskData.assignee_info.last_name}`,
          createdDate:  moment(newlyCreatedTaskData.created_date).format("MM/DD/YY"),
          dueDate: moment(newlyCreatedTaskData.due_date).format("MM/DD/YY"),
          id: newlyCreatedTaskData.id,
        }
      });
      $('#form-create-new-task')[0].reset();
    },
    error: function(err) {
      console.log('ERROR during the createNewUser returned data', err);
    }
  });

});



// end of document.ready
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
