console.log('User.js file loaded');
$(document).on('turbolinks:load', function(){
  // $.fn.editable.defaults.mode = 'inline';



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
