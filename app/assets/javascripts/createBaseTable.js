// console.log('renderAllTasksForOneUser.js file loaded');
$(document).on('turbolinks:load', function(){
  let url2 = "https://chilling-mausoleum-21805.herokuapp.com"
  let url = "http://localhost:3000"
  function renderAllTasksForOneUser() {
    // console.log('LOADING ALL USERS');
    // let ajaxurl = 'http://localhost:3000/users/'
  console.log('createBaseTable - ', `${url}/users/${document.cookie.split('id=')[1]}.json`);

    $.ajax({
      method: 'GET',
      url: `${url}/users/${document.cookie.split('id=')[1]}.json`,
      success: function(res){
        // console.log('Response - ', res);
        var tasksAssignedToMe = [];
        var tasksOtherOweMe = [];
        var tasksCreatedForMyself = [];
        let resAssignedTasks = res.assigned_tasks;
        let resOwnedTasks = res.owned_tasks;
        let userCookieInformation = parseInt(`${document.cookie.split('id=')[1]}`);
        let editTaskIcon = `<span class="glyphicon glyphicon-pencil fake-span"></span>`;
        let deleteTask = `<span class="glyphicon glyphicon-trash fake-span"></span>`;
        // console.log('THIS IS USER COOKIE INFO - ', userCookieInformation);
        // console.log(`${document.cookie.split('id=')[1]}`, resAssignedTasks.length + resOwnedTasks.length);
        for (let i = 0; i < resOwnedTasks.length ; i++) {
          // console.log('MOMENT- ', moment(resAssignedTasks[i].created_date).format("MM/DD/YY"));
          // check to see if the task is assigned to self
          if ( ( resOwnedTasks[i].assignee_info.id === userCookieInformation) &&
          ( resOwnedTasks[i].owner_info.id === userCookieInformation )
        ) {
          tasksCreatedForMyself.push(
            {
              status: resOwnedTasks[i].status,
              title:`<span class='task-title fake-link'> ${resOwnedTasks[i].title.slice(0,120).concat('...')}</span>`,
              description: resOwnedTasks[i].description.slice(0,100).concat('...'),
              taskResponsibleOwner: `${resOwnedTasks[i].owner_info.first_name} ${resOwnedTasks[i].owner_info.last_name}`,
              taskResponsibleId: `${resOwnedTasks[i].owner_info.id}`,
              taskAssigneeName: `${resOwnedTasks[i].assignee_info.first_name} ${resOwnedTasks[i].assignee_info.last_name}`,
              taskAssigneeId: `${resOwnedTasks[i].assignee_info.id}`,
              createdDate: moment(resOwnedTasks[i].created_date).format("MM/DD/YY"),
              dueDate: moment(resOwnedTasks[i].due_date).format("MM/DD/YY"),
              id: parseInt(resOwnedTasks[i].id),
              editTask: editTaskIcon,
              deleteTask: deleteTask,
              tableName: `tasksCreatedForMyself`,
            }
          )
        } else if ( ( resOwnedTasks[i].assignee_info.id !== userCookieInformation ) &&
        ( resOwnedTasks[i].owner_info.id === userCookieInformation  ) ) {
          tasksOtherOweMe.push(
            {
              status: resOwnedTasks[i].status,
              title: `<span class='task-title fake-link'> ${resOwnedTasks[i].title.slice(0,120).concat('...')} </span>`,
              description: resOwnedTasks[i].description.slice(0,100).concat('...'),
              taskResponsibleOwner: `${resOwnedTasks[i].assignee_info.first_name} ${resOwnedTasks[i].assignee_info.last_name}`,
              taskResponsibleId: `${resOwnedTasks[i].assignee_info.id}`,
              taskAssigneeName: `${resOwnedTasks[i].owner_info.first_name} ${resOwnedTasks[i].owner_info.last_name}`,
              taskAssigneeId: `${resOwnedTasks[i].owner_info.id}`,
              createdDate:  moment(resOwnedTasks[i].created_date).format("MM/DD/YY"),
              dueDate: moment(resOwnedTasks[i].due_date).format("MM/DD/YY"),
              id: parseInt(resOwnedTasks[i].id),
              editTask: editTaskIcon,
              deleteTask: deleteTask,
              tableName: `tasksOtherOweMe`,
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
          title:`<span class='task-title fake-link'> ${resAssignedTasks[i].title.slice(0,120).concat('...')}</span>`,
          description: resAssignedTasks[i].description.slice(0,100).concat('...'),
          taskResponsibleOwner: `${resAssignedTasks[i].owner_info.first_name} ${resAssignedTasks[i].owner_info.last_name}`,
          taskResponsibleId: `${resAssignedTasks[i].owner_info.id}`,
          taskAssigneeName: `${resAssignedTasks[i].assignee_info.first_name} ${resAssignedTasks[i].assignee_info.last_name}`,
          taskAssigneeId: `${resAssignedTasks[i].assignee_info.id}`,
          createdDate: moment(resAssignedTasks[i].created_date).format("MM/DD/YY"),
          dueDate: moment(resAssignedTasks[i].due_date).format("MM/DD/YY"),
          id: parseInt(resAssignedTasks[i].id),
          editTask: editTaskIcon,
          deleteTask: deleteTask,
          tableName: `tasksAssignedToMe`,
        })
      }
    };
    // console.log('tasksOtherOweMe - ', tasksOtherOweMe);
    // console.log('tasksAssignedToMe - ', tasksAssignedToMe);
    // console.log('tasksCreatedForMyself - ', tasksCreatedForMyself);
    createTasksTable(tasksAssignedToMe, '#tasks_assigned_to_me', 'Assigned By')
    createTasksTable(tasksOtherOweMe, '#tasks_others_owe_me', 'Assigned To')
    createTasksTable(tasksCreatedForMyself, '#my_own_tasks', 'Assigned To')

  },
  error: function(err) {
    $.notify({
      title: '<strong>Sorry!</strong>',
      message: 'We ran into an error. Could you refresh the screen'
    },{
      type: 'warning',
      timer: 1000,
      placement: {
        from: "top",
        align: "right"
      },
      delay: 5000,
      timer: 1000,
    });
  }
});
};

function renderAllTaskFirstTime() {
  if ( window.location.href === `${url}/users/${document.cookie.split('id=')[1]}` ) {
    renderAllTasksForOneUser()
  };
};
renderAllTaskFirstTime()

function createTasksTable (taskData, tableIdFor, nameOfAssignedToColumnName){

  // console.log('createTableTasksAssignedToMe - ', tableIdFor);
  $(tableIdFor).bootstrapTable({
    columns: [
      {
        field: 'status',
        title: 'Status',
        sortable: true,
        width: '10%',
        editable: {
          type: 'select',
          source: [
            {value: 'open', text: 'Open'},
            {value: 'inprogress', text: 'In Progress'},
            {value: 'blocked', text: 'Blocked'},
            {value: 'completed', text: 'Completed'}
          ],
        },
      }, {
        field: 'title',
        title: 'Title',
        sortable: true,
        width: '20%',
        // editable: true,
      },
      {
        field: 'description',
        title: 'Description',
        sortable: true,
        width: '50%',
      },
      {
        field: 'taskResponsibleOwner',
        title: nameOfAssignedToColumnName,
        sortable: true,
        width: '5%',
        // editable: true,
      }, {
        field: 'createdDate',
        title: 'Created',
        sortable: true,
        width: '5%',
      },
      {
        field: 'dueDate',
        title: 'Due',
        sortable: true,
        width: '5%',
        type: 'combobox',
      },
      {
        field: 'editTask',
        title: 'Edit',
        width: '2%',
        align: 'center',
      },
      {
        field: 'deleteTask',
        title: 'Delete',
        width: '2%',
        align: 'center',
      },
      {
        field: 'id',
        title: 'id',
        visible: false,
      },
    ],
    uniqueId: 'id',
    data: taskData,
    showHeader: true,
    pagination: true,
    pageSize: '5',
    pageList: [10,25,100,'all'],
    classes: "table table-hover table-condensed table-no-bordered",
    sortName: 'status',
    sortOrder: 'desc',
    rowStyle: $(tableIdFor).on('click-row.bs.table', function (e, row, $element) {
      $('.success').removeClass('success');
      $($element).addClass('success');
    }),
  });
};
// end of document.ready
});
