console.log('User.js file loaded');
$(document).on('turbolinks:load', function(){
  // $.fn.editable.defaults.mode = 'inline';

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

  $(function(){
    data = ['tom','john'];
    $('#task-assignee_id').atwho({at:"@", 'data':data});
  });

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
        $("#task-assignee_id").prop('disabled', false);
        $('#form-create-new-task')[0].reset();
      },
      error: function(err) {
        console.log('ERROR during the createNewUser returned data', err);
      }
    });

  });

  // end of document.ready
});
