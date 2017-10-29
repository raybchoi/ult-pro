console.log('createNewTask.js file loaded');
$(document).on('turbolinks:load', function(){
  // initial ajax call
  let jsonResponseFromGetAllUsers;
  function getAllUsers() {
    $.ajax({
      method: 'get',
      url: `/users.json`,
      success: function(res) {
        jsonResponseFromGetAllUsers = res
        // console.log('all users - ', jsonResponseFromGetAllUsers);
        typeAheadForUserName (res, "#div-id-task-assignee")
      },
      error: function(err) {
        $.notify({
          title: '<strong>Sorry!</strong>',
          message: 'Task was not created. Can you try again?'
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
      // end of AJAX call
    });
    // end of getAllUsers function
  };


  function typeAheadForUserName (jsonResponseFromGetAllUsers, divIdToTypeAheadTo) {
    var at_config = {
      at: "@",
      data: jsonResponseFromGetAllUsers,
      insertTpl: "<span data-user-id='${id}' data-user-name='${first_name} ${last_name}' data-user-email='${email}' class='task-created' id='span-assigned-to'>${atwho-at}${first_name} ${last_name}</span>",
      displayTpl: "<li>${first_name} ${last_name}<small> ${email}</small></li> ",
      limit: 200
    }
    $(divIdToTypeAheadTo).atwho(at_config)
    // only allow @ or " " to be inputted
    $(divIdToTypeAheadTo).on('keypress', function(event) {
      // console.log('this is the div length - ', $('#span-assigned-to').length);
      if ($('#span-assigned-to').length === 0) {
        if ( event.keyCode === 64 || event.keyCode === 32 ) {
          // console.log(divIdToTypeAheadTo).on('keypress', function(event)")
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
  }
  getAllUsers()

  function resetFormToBeginning(nameOfDivId, nameOfDivClass) {
    $(nameOfDivId).empty();
    $(nameOfDivId).attr("contenteditable", "true");
    $(nameOfDivId).attr("class", nameOfDivClass);
  }

  $('#create-task-date-picker').datepicker({
    keyboardNavigation: false,
    forceParse: false,
    autoclose: true,
    todayHighlight: true,
  });

  // ------- if user hits drop down for me vs someone else -------
  function checkSelectDropDownBox (jsonData, nameOfSelectDropDownBoxWithChange, divIdToAppendAndRemoveFrom, divClassToAppendAndRemoveFrom) {
    let currentSelectedBox = $(nameOfSelectDropDownBoxWithChange).find(":selected").val()
    // console.log($(nameOfSelectDropDownBoxWithChange).find(":selected").val())
    if ( currentSelectedBox === "#my_own_tasks" ) {
      $(divIdToAppendAndRemoveFrom).empty();
      for ( let i = 0; i < jsonData.length; i++ ) {
        if ( parseInt(`${document.cookie.split('id=')[1]}`) === jsonData[i].id ) {
          $(divIdToAppendAndRemoveFrom).append(`
            <span class="atwho-inserted">
            <span data-user-id='${jsonData[i].id}' data-user-name='${jsonData[i].first_name} ${jsonData[i].last_name}'  data-user-email='${jsonData[i].email}' class='task-created' id='span-assigned-to'>@${jsonData[i].first_name} ${jsonData[i].last_name} </span>
            </span>
            `)
          }
        }
        // need to disable the box and add new div for class
        $(divIdToAppendAndRemoveFrom).removeAttr("contenteditable");
        $(divIdToAppendAndRemoveFrom).attr("class", "disable-div");
      } else if ( currentSelectedBox === "#tasks_others_owe_me" ) {
        // empty the div and re-enable the box and update the class
        resetFormToBeginning(divIdToAppendAndRemoveFrom, divClassToAppendAndRemoveFrom);
      }
    };

    $('#task-type').on('change', function() {
      checkSelectDropDownBox(jsonResponseFromGetAllUsers, '#task-type', '#div-id-task-assignee', "div-class-assign-task");
    })



    // console.log('EPIOCH TIME,', moment.unix(1508828400).format("MM/DD/YY"));

    $('#form-create-new-task').on('submit', function() {
      event.preventDefault();
      // go and get each of the value from the input field. The initial value of each field was populated automatically by using the 'value=' in the input tag of the html
      if ($('#span-assigned-to').length === 0) {
        $.notify({
          title: '<strong>Uh oh!</strong>',
          message: 'You need to assign a task to a person!'
        },{
          type: 'danger',
          timer: 1000,
          placement: {
            from: "top",
            align: "right"
          },
          delay: 5000,
          timer: 1000,
        });
        return
      };
      let getSelectDropDownId = document.getElementById("task-type")
      let tableType = getSelectDropDownId.options[getSelectDropDownId.selectedIndex].value;
      let newTaskInfo = { task:
        {
          title: $('#task-title').val(),
          description: $('#task-description').val(),
          assignee_id: $("#span-assigned-to").attr('data-user-id'),
          owner_id: `${document.cookie.split('id=')[1]}`,
          status: 'open',
          due_date: new Date($('#create-task-date-picker').val()).getTime(),
        },
      };


      // console.log(newTaskInfo);
      function addNewTaskToTable (newlyCreatedTaskData, tableName) {
        $(tableType).bootstrapTable('insertRow', {
          index: 0,
          row: {
            status: newlyCreatedTaskData.status,
            title:`<span class='task-title fake-link'> ${newlyCreatedTaskData.title.slice(0,120).concat('...')}</span>`,
            description: newlyCreatedTaskData.description.slice(0,240).concat('...'),
            taskResponsibleOwner: `${newlyCreatedTaskData.assignee_info.first_name} ${newlyCreatedTaskData.assignee_info.last_name}`,
            createdDate:  moment(newlyCreatedTaskData.created_date).format("MM/DD/YY"),
            dueDate: moment(newlyCreatedTaskData.due_date).format("MM/DD/YY"),
            id: newlyCreatedTaskData.id,
            editTask: `<span class="glyphicon glyphicon-pencil fake-span"></span>`,
            deleteTask: `<span class="glyphicon glyphicon-trash fake-span"></span>`,
            tableName: tableName,
          }
        });
      };

      $.ajax({
        method: 'POST',
        url: `/tasks`,
        data: newTaskInfo,
        success: function(newlyCreatedTaskData) {
          // console.log('DATA returned from createNewTask', newlyCreatedTaskData);
          // console.log('THIS IS THE TABLE TYPE', tableType);
          if ( $("#span-assigned-to").attr('data-user-id') === `${document.cookie.split('id=')[1]}` ) {
            addNewTaskToTable (newlyCreatedTaskData, `tasksCreatedForMyself`)
          } else {
            addNewTaskToTable (newlyCreatedTaskData, `tasksOtherOweMe`)
          };
          $("#task-type").val('default');
          $("#task-type").selectpicker("refresh");
          $('#form-create-new-task')[0].reset();
          resetFormToBeginning("#div-id-task-assignee", "div-class-assign-task");
          return
        },
        error: function(err) {
          // console.log('ERROR during the createNewUser returned data', err);
        }
        // end of post ajax
      });
      // #form-create-new-task
    });

    // $(tableType).bootstrapTable('insertRow', {
    //   index: 0,
    //   row: {
    //     status: newlyCreatedTaskData.status,
    //     title:`<span class='task-title fake-link'> ${newlyCreatedTaskData.title.slice(0,120).concat('...')}</span>`,
    //     description: newlyCreatedTaskData.description.slice(0,240).concat('...'),
    //     taskResponsibleOwner: `${newlyCreatedTaskData.assignee_info.first_name} ${newlyCreatedTaskData.assignee_info.last_name}`,
    //     createdDate:  moment(newlyCreatedTaskData.created_date).format("MM/DD/YY"),
    //     dueDate: moment(newlyCreatedTaskData.due_date).format("MM/DD/YY"),
    //     id: newlyCreatedTaskData.id,
    //     editTask: `<span class="glyphicon glyphicon-pencil fake-span"></span>`,
    //     deleteTask: `<span class="glyphicon glyphicon-trash fake-span"></span>`,
    //     tableName: `tasksOtherOweMe`,
    //   }


    $('.div-tasks').on('click-cell.bs.table', function (event, field, old, row) {
      console.log(field);
      console.log('this is event ', event);
      console.log('this is event ', row);
      let editTaskHtml;
      let selectPickerHtml;
      let assignedIndividualTypeAheadHtml;

      function editTaskHtmlDrawer (res) {
        editTaskHtml =
        `
        <div class='edit-drawer'>
        <div id="drawer-edit-task" class="drawer dw-xs-10 dw-sm-6 dw-md-4 fold " aria-labelledby="drawerEditTask">
        <div class="drawer-controls">
        <a href="#drawer-edit-task" data-toggle="drawer" aria-foldedopen="false" aria-controls="drawerEditTask" class="btn btn-primary btn-sm">Menu</a>
        </div>
        <div class="drawer-contents">
        <div class="drawer-heading">
        <h2 class="drawer-title">Update Task</h2>
        </div>
        <div class="drawer-body">

        <section class='section-create-task'>
        <div class="create-task">
        <form id='form-create-new-task' name='form-create-new-task'>
        <label for="task-type">Who is this for?</label>

        <select class='selectpicker' name="taskTypeListDrawer" id="task-type-drawer">
        <option value="#tasks_others_owe_me" id='table-type-for-task-drawer' class='tasks_others_owe_me'>Someone Else</option>
        <option value="#my_own_tasks" id='table-type-for-task-drawer' class='my_own_tasks'>Me</option>
        </select>



        <label for="task-title">Title</label>
        <input type='text' id='task-title' autocomplete="off" maxlength=120 value='${res.title}' required/>

        <div class='select-picker-goes-here'></div>


        <label for="task-assignee_id-drawer">assignee_id</label>
        <div id='div-id-task-assignee-drawer' class="div-class-assign-task-drawer" contenteditable="true" autocomplete="off" required></div>


        <label for="task-description">Description</label>
        <input type='text' id='task-description' maxlength=200 autocomplete="off" value='${res.description}' required/>

        <label for="edit-task-date-picker">When is this due?</label>
        <input type='text' id="edit-task-date-picker" autocomplete="off"  value='${moment(res.due_date).format('MMM Do YY')}' required>

        <label for="completed-task-date-picker">When was this completed?</label>
        <input type='text' id="completed-task-date-picker" autocomplete="off"  value='${moment(res.completed_date).format('MMM Do YY')}' required>

        <button type='submit' class='btn create-task-button'>Create New Task</button>
        </form>
        </div>
        </section>

        </div>
        </div>
        </div>
        </div>
        `
      };

      function insertSelectPickerDrawer (res) {
        if ( res.status === 'open' ) {
          selectPickerHtml =
          `
          <select class='selectpicker' name="taskTypeList" id="task-type">
          <option value="open" id='table-type-for-task' class='tasks_others_owe_me'>Open</option>
          <option value="inprogress" id='table-type-for-task' class='my_own_tasks'>In Progress</option>
          <option value="blocked" id='table-type-for-task' class='my_own_tasks'>Blocked</option>
          <option value="complete" id='table-type-for-task' class='my_own_tasks'>Complete</option>
          </select>
          `
        } else if ( res.status === 'blocked' ) {
          selectPickerHtml =
          `
          <select class='selectpicker' name="taskTypeList" id="task-type">
          <option value="blocked" id='table-type-for-task' class='my_own_tasks'>Blocked</option>
          <option value="complete" id='table-type-for-task' class='my_own_tasks'>Complete</option>
          <option value="open" id='table-type-for-task' class='tasks_others_owe_me'>Open</option>
          <option value="inprogress" id='table-type-for-task' class='my_own_tasks'>In Progress</option>
          </select>
          `
        } else if ( res.status === 'inprogress' ) {
          selectPickerHtml =
          `
          <select class='selectpicker' name="taskTypeList" id="task-type">
          <option value="inprogress" id='table-type-for-task' class='my_own_tasks'>In Progress</option>
          <option value="blocked" id='table-type-for-task' class='my_own_tasks'>Blocked</option>
          <option value="complete" id='table-type-for-task' class='my_own_tasks'>Complete</option>
          <option value="open" id='table-type-for-task' class='tasks_others_owe_me'>Open</option>\
          </select>
          `
        } else if ( res.status === 'complete' ) {
          selectPickerHtml =
          `
          <select class='selectpicker' name="taskTypeList" id="task-type">
          <option value="complete" id='table-type-for-task' class='my_own_tasks'>Complete</option>
          <option value="open" id='table-type-for-task' class='tasks_others_owe_me'>Open</option>
          <option value="inprogress" id='table-type-for-task' class='my_own_tasks'>In Progress</option>
          <option value="blocked" id='table-type-for-task' class='my_own_tasks'>Blocked</option>
          </select>
          `
        }
      };
    function insertTypeAheadUserNameDrawer (res) {
      assignedIndividualTypeAheadHtml =
      `
        <span class="atwho-inserted">
        <span data-user-id='${res.owner_info.id}' data-user-name='${res.owner_info.first_name} ${res.owner_info.last_name}'  data-user-email='${res.owner_info.first_name.email}' class='task-assigned-edit-drawer' id='span-assigned-to'>@${res.owner_info.first_name} ${res.owner_info.last_name} </span>
        </span>
        `
    };

    function reitializeFunctionalityPostAppendHtml(jsonResponseFromGetAllUsers) {
      // initalize date picker
      $('#edit-task-date-picker').datepicker({
        keyboardNavigation: false,
        forceParse: false,
        autoclose: true,
        todayHighlight: true,
      });
      $('#completed-task-date-picker').datepicker({
        keyboardNavigation: false,
        forceParse: false,
        autoclose: true,
        todayHighlight: true,
      });
      // initalize selectbox
      $('.selectpicker').selectpicker();
      // initalize checkSelectDropDownBox
      $('#task-type-drawer').on('change', function() {
        checkSelectDropDownBox(jsonResponseFromGetAllUsers, '#task-type-drawer', '#div-id-task-assignee-drawer', 'div-class-assign-task-drawer');
      })
      // initalize type ahead box
      typeAheadForUserName (jsonResponseFromGetAllUsers, "#div-id-task-assignee-drawer");
    }

      if ( field === 'editTask' && row.tableName === "tasksAssignedToMe" ) {

        $.ajax({
          method: 'GET',
          url: `http://localhost:3000/tasks/${row.id}.json`,
          success: function(res) {
            $('.edit-drawer').remove();
            console.log('DATA returned from editFullTaskTask', res);
            // create the different html forms
            editTaskHtmlDrawer(res);
            insertSelectPickerDrawer(res);
            insertTypeAheadUserNameDrawer(res);
            // append all the html forms
            $('.edit-drawer-outer-div').append(editTaskHtml);
            $('.select-picker-goes-here').append(selectPickerHtml);
            $('#div-id-task-assignee-drawer').append(assignedIndividualTypeAheadHtml);
            // reinitalize everything
            reitializeFunctionalityPostAppendHtml(jsonResponseFromGetAllUsers)
            // open drawer
            $('#drawer-edit-task').drawer('toggle');
              // end of ajax success call
            }
          });
        }


        // end of edit task
      });


      // typeAheadForUserName (jsonResponseFromGetAllUsers, "#div-id-task-assignee-drawer");



      // end of document.ready
    });
