console.log('User.js file loaded');
$(document).on('turbolinks:load', function(){
  // console.log(`${window.location.pathname}.json`);
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
            title: res.assigned_tasks[i].title.slice(0,15).concat('...').link(`http://localhost:3000/tasks/${res.assigned_tasks[i].id}`),
            taskOwner: res.assigned_tasks[i].owner_id.first_name,
          }
        )
      } else {
        tasksAssignedToMe.push(
          {
            id: res.assigned_tasks[i].id,
            title: res.assigned_tasks[i].title.slice(0,15).concat('...').link(`http://localhost:3000/tasks/${res.assigned_tasks[i].id}`),
            taskIndividual: res.assigned_tasks[i].owner_id.first_name,
          }
        )
      }
    };
    for (let i = 0; i < res.owned_tasks.length; i++) {
      tasksOtherOweMe.push(
        {
          id: res.owned_tasks[i].id,
          title: res.owned_tasks[i].title.slice(0,15).concat('...').link(`http://localhost:3000/tasks/${res.owned_tasks[i].id}`),
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


  function createTasksTable (tasksAssignedToMe, tableType, taskOwnerAssignee){
    console.log('createTableTasksAssignedToMe - ', tasksAssignedToMe);

    $(tableType).bootstrapTable({
      columns: [
        {
          field: 'id',
          title: 'Task ID',
          sortable: true,
          width: '10%',
        }, {
          field: 'title',
          title: 'title',
          sortable: true,
          width: '45%',
        }, {
          field: 'taskIndividual',
          title: taskOwnerAssignee,
          sortable: true,
          width: '45%',
        },
      ],
      data: tasksAssignedToMe,
      showHeader: true,
      pagination: true,
      pageSize: 1,
      pageList: [1,10,25,'all'],
  });


  }



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

})
