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
          insertTpl: "<span data-user-id='${id}' data-user-name='${first_name} ${last_name}' data-user-email='${email}' class='task-created' id='span-assigned-to'>${atwho-at}${first_name} ${last_name}</span>",
          displayTpl: "<li>${first_name} ${last_name}<small> ${email}</small></li> ",
          limit: 200
        }
        $('#div-task-assignee').atwho(at_config).atwho('run')
        // only allow @ or " " to be inputted
        $('#div-task-assignee').on('keypress', function(event) {
          console.log('this is the div length - ', $('#span-assigned-to').length);
          if ($('#span-assigned-to').length === 0) {
            if ( event.keyCode === 64 || event.keyCode === 32 ) {
              console.log("#div-task-assignee').on('keypress', function(event)")
            } else {
            return false;
            }
          } else {
            console.log('hello');
            $.notify({
            	title: '<strong>Heads up!</strong>',
            	message: 'You can only add one person to a task.'
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
            return false
          };
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

    // ------- if user hits drop down for me vs someone else -------
    $('#task-type').on('change', function() {
      let currentSelectedBox = $('#task-type').find(":selected").val()
      // console.log($('#task-type').find(":selected").val())
      if ( currentSelectedBox === "#my_own_tasks" ) {
        $('#div-task-assignee').empty();
        for ( let i = 0; i < jsonResponse.length; i++ ) {
          if ( parseInt(`${document.cookie.split('id=')[1]}`) === jsonResponse[i].id ) {
            $("#div-task-assignee").append(`
              <span class="atwho-inserted">
                <span data-user-id='${jsonResponse[i].id}' data-user-name='${jsonResponse[i].first_name} ${jsonResponse[i].last_name}'  data-user-email='${jsonResponse[i].email}' class='task-created' id='span-assigned-to'>@${jsonResponse[i].first_name} ${jsonResponse[i].last_name} </span>
              </span>
              `)
          }
        }
        // need to disable the box and add new div for class
        $("#div-task-assignee").removeAttr("contenteditable");
        $("#div-task-assignee").attr("class", "disable-div");
      } else if ( currentSelectedBox === "#tasks_others_owe_me" ) {
          // empty the div and re-enable the box and update the class
          $('#div-task-assignee').empty();
          $("#div-task-assignee").attr("contenteditable", "true");
          $("#div-task-assignee").attr("class", "div-assign-task");
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
          assignee_id: $("#span-assigned-to").attr('data-user-id'),
          owner_id: `${document.cookie.split('id=')[1]}`,
          status: 'Open',
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
          $("#div-task-assignee").prop('disabled', false);
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
