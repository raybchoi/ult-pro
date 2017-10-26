console.log('User.js file loaded');
$(document).on('turbolinks:load', function(){
  // initial ajax call
  function getAllUsers() {
    let jsonResponse;
    $.ajax({
      method: 'get',
      url: `/users.json`,
      success: function(res) {
        jsonResponse = res
        console.log('all users - ', jsonResponse);
        var at_config = {
          at: "@",
          data: res,
          headerTpl: '<div class="atwho-header">Member List<small>↑&nbsp;↓&nbsp;</small></div>',
          insertTpl: "${atwho-at}${first_name} ${last_name} - ${email}",
          displayTpl: "<li>${first_name} ${last_name}<small> ${email}</small></li> ",
          limit: 200
        }
        $('#task-assignee_id').atwho(at_config).atwho('run')
        $('#task-assignee_id').on('change', function() {
          let findByEmail = $('#task-assignee_id').val().split(' ')[3]
          console.log(findByEmail);
          for ( let i = 0; i < res.length; i++ ) {
            if ( findByEmail === res[i].name ) {
              console.log('this is the name and the ID - ', res[i].email, res[i].id)
            }
          }
        });
      },
      error: function(err) {
        alert('Sorry! We had an error :(')
      }
    });
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
        let userName;
        for ( let i = 0; i < jsonResponse.length; i++ ) {
          if ( parseInt(`${document.cookie.split('id=')[1]}`) === jsonResponse[i].id ) {
            userName = `@${jsonResponse[i].first_name} ${jsonResponse[i].last_name} - ${jsonResponse[i].email}`
          }
        }
        $("#task-assignee_id").val(userName);
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
      let findByEmail = $('#task-assignee_id').val().split(' ')[3]
      console.log(findByEmail);
      let assignee_number;
      console.log('res', jsonResponse);
      for ( let i = 0; i < jsonResponse.length; i++ ) {
        if ( findByEmail === jsonResponse[i].email ) {
          assignee_number = jsonResponse[i].id
          console.log('this is the name and the ID - ', jsonResponse[i].email, res[i].id)
        }
      }
      console.log('assignee_number - ', assignee_number);
      let getSelectDropDownID = document.getElementById("task-type")
      let tableType = getSelectDropDownID.options[getSelectDropDownID.selectedIndex].value;
      let newTaskInfo = { task:
        {
          title: $('#task-title').val(),
          description: $('#task-description').val(),
          assignee_id: assignee_number,
          owner_id: `${document.cookie.split('id=')[1]}`,
          status: 'Open',
          // due_date: new Date($('#create-task-date-picker').val())
          due_date: new Date($('#create-task-date-picker').val()).getTime(),
        },
      };
      // console.log(newTaskInfo);

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
        // end of post ajax
      });
      // #form-create-new-task
    });
    // end of getAllUsers function
  };
  getAllUsers()
  // end of document.ready
});
