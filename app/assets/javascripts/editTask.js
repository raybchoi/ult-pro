console.log('editTask.js file loaded');
$(document).on('turbolinks:load', function(){
  $('#div-task-assignee').editable();
  // end of document.ready
});
