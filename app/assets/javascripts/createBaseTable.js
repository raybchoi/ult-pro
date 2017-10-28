console.log('renderAllTasksForOneUser.js file loaded');
$(document).on('turbolinks:load', function(){
  function renderAllTasksForOneUser() {
    $.ajax({
      method: 'GET',
      url: `http://localhost:3000/users/${document.cookie.split('id=')[1]}.json`,
    })
    .then(function(res){
      // console.log('Response - ', res);
      var tasksAssignedToMe = [];
      var tasksOtherOweMe = [];
      var tasksCreatedForMyself = [];
      let resAssignedTasks = res.assigned_tasks
      let resOwnedTasks = res.owned_tasks
      let userCookieInformation = parseInt(`${document.cookie.split('id=')[1]}`)
      // console.log('THIS IS USER COOKIE INFO - ', userCookieInformation);
      // console.log(`${document.cookie.split('id=')[1]}`, resAssignedTasks.length + resOwnedTasks.length);
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
            title:`<span class='task-title fake-link'> ${resOwnedTasks[i].title.slice(0,120).concat('...')}</span>`,
            description: resOwnedTasks[i].description.slice(0,100).concat('...'),
            taskResponsibleOwner: `${resOwnedTasks[i].owner_info.first_name} ${resOwnedTasks[i].owner_info.last_name}`,
            taskResponsibleId: `${resOwnedTasks[i].owner_info.id}`,
            taskAssigneeName: `${resOwnedTasks[i].assignee_info.first_name} ${resOwnedTasks[i].assignee_info.last_name}`,
            taskAssigneeId: `${resOwnedTasks[i].assignee_info.id}`,
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
            title: `<span class='task-title fake-link'> ${resOwnedTasks[i].title.slice(0,120).concat('...')} </span>`,
            description: resOwnedTasks[i].description.slice(0,100).concat('...'),
            taskResponsibleOwner: `${resOwnedTasks[i].assignee_info.first_name} ${resOwnedTasks[i].assignee_info.last_name}`,
            taskResponsibleId: `${resOwnedTasks[i].assignee_info.id}`,
            taskAssigneeName: `${resOwnedTasks[i].owner_info.first_name} ${resOwnedTasks[i].owner_info.last_name}`,
            taskAssigneeId: `${resOwnedTasks[i].owner_info.id}`,
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
        title:`<span class='task-title fake-link'> ${resAssignedTasks[i].title.slice(0,120).concat('...')}</span>`,
        description: resAssignedTasks[i].description.slice(0,100).concat('...'),
        taskResponsibleOwner: `${resAssignedTasks[i].owner_info.first_name} ${resAssignedTasks[i].owner_info.last_name}`,
        taskResponsibleId: `${resAssignedTasks[i].owner_info.id}`,
        taskAssigneeName: `${resAssignedTasks[i].assignee_info.first_name} ${resAssignedTasks[i].assignee_info.last_name}`,
        taskAssigneeId: `${resAssignedTasks[i].assignee_info.id}`,
        createdDate: moment(resAssignedTasks[i].created_date).format("MM/DD/YY"),
        dueDate: moment(resAssignedTasks[i].due_date).format("MM/DD/YY"),
        id: resAssignedTasks[i].id,
      })
    }
  };
    // console.log('tasksOtherOweMe - ', tasksOtherOweMe);
    // console.log('tasksAssignedToMe - ', tasksAssignedToMe);
    // console.log('tasksCreatedForMyself - ', tasksCreatedForMyself);
    createTasksTable(tasksAssignedToMe, '#tasks_assigned_to_me')
    createTasksTable(tasksOtherOweMe, '#tasks_others_owe_me')
    createTasksTable(tasksCreatedForMyself, '#my_own_tasks')
  });
  }

  if ( window.location.href === `http://localhost:3000/users/${document.cookie.split('id=')[1]}` ) {
    renderAllTasksForOneUser();
  }

  function createTasksTable (taskData, tableIdFor){

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
                       {value: 'complete', text: 'Complete'}
                   ],
               },
        }, {
          field: 'title',
          title: 'Title',
          sortable: true,
          width: '35%',
          // editable: true,
        },
        {
          field: 'description',
          title: 'Description',
          sortable: true,
          width: '40%',
        },
        {
          field: 'taskResponsibleOwner',
          title: 'Responsible',
          sortable: true,
          width: '5%',
          // editable: true,
        }, {
          field: 'createdDate',
          title: 'Created Date',
          sortable: true,
          width: '5%',
        }, {
          field: 'dueDate',
          title: 'Due Date',
          sortable: true,
          width: '5%',
          type: 'combobox',
        },
        // {
        //   field: 'id',
        //   title: 'id',
        //   sortable: true,
        //   width: '10%',
        //   class: 'table-header',
        // },
      ],
      data: taskData,
      showHeader: true,
      pagination: true,
      pageSize: '20',
      pageList: [1,10,25,'all'],
      classes: "table table-hover table-condensed table-no-bordered",
      sortName: 'dueDate',
      sortOrder: 'desc',
      rowStyle: $(tableIdFor).on('click-row.bs.table', function (e, row, $element) {
            $('.success').removeClass('success');
            $($element).addClass('success');
        }),
    });
    // function rowStyle(0);
  };

// end of document.ready
});
