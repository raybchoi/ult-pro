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


    function notificationIfSpanTaskIsNotAssignedToAnyone () {
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
    }

    function addNewTaskToTable (newlyCreatedTaskData, tableTypeToAppend, tableNameWithinTheTable) {
      $(tableTypeToAppend).bootstrapTable('insertRow', {
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
          tableName: tableNameWithinTheTable,
        }
      });
    };

    // console.log('EPIOCH TIME,', moment.unix(1508828400).format("MM/DD/YY"));)
    $('#form-create-new-task').on('submit', function() {
      event.preventDefault();
      // go and get each of the value from the input field. The initial value of each field was populated automatically by using the 'value=' in the input tag of the html
      if ($('#span-assigned-to').length === 0) {
        notificationIfSpanTaskIsNotAssignedToAnyone();
        return;
      };
      let getSelectDropDownId = document.getElementById("task-type")
      let tableTypeToAppend = getSelectDropDownId.options[getSelectDropDownId.selectedIndex].value;
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


      $.ajax({
        method: 'POST',
        url: `/tasks`,
        data: newTaskInfo,
        success: function(newlyCreatedTaskData) {
          // console.log('DATA returned from createNewTask', newlyCreatedTaskData);
          // console.log('THIS IS THE TABLE TYPE', tableTypeToAppend);
          if ( $("#span-assigned-to").attr('data-user-id') === `${document.cookie.split('id=')[1]}` ) {
            addNewTaskToTable (newlyCreatedTaskData, tableTypeToAppend, `tasksCreatedForMyself`)
          } else {
            addNewTaskToTable (newlyCreatedTaskData, tableTypeToAppend, `tasksOtherOweMe`)
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

    // $(tableTypeToAppend).bootstrapTable('insertRow', {
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
      console.log('on edit cell this is the field - ', field);
      console.log('on edit cell this is the event - ', event);
      console.log('on edit cell this is the row - ', row);
      let editTaskHtml;
      let selectPickerHtml;
      let assignedIndividualTypeAheadHtml;

      function editTaskHtmlDrawer (res) {
        editTaskHtml =
        `
        <div class='edit-drawer'>
        <div id="drawer-edit-task" class="drawer drawer-left dw-xs-10 dw-sm-6 dw-md-6 fold " aria-labelledby="drawerEditTask">

        <div class="drawer-heading">
        <h2 class="drawer-title">Update Task</h2>
        </div>
        <div class="drawer-body">

        <section class='section-update-task'>
        <div class="update-task">

        <form id='form-update-task' name='form-update-task'>

        <label for="task-type">Who is this for?</label>


        <label for="task-title">Title</label>
        <input type='text' id='task-title-drawer' autocomplete="off" value='${res.title}' maxlength=120 required/>




        <label for="task-assignee_id-drawer">Assign this task to someone else?</label>
        <input id="openAssignIdCheckMarkBox" type="checkbox"/>
        <div class='appendUserInputBox'>
        </div>

        <label for="task-description">Description</label>
        <textarea id='task-description-drawer' autocomplete="off" required> ${res.description}</textarea>

        <label for="due-date-task-date-picker">When is this due?</label>
        <input type='text' id="due-date-task-date-picker" autocomplete="off"  value='${moment(res.due_date).format('MM/DD/YY')}' required>


        <button type='submit' class='btn update-task-button'>Update Task</button>


        <div class='select-picker-goes-here'></div>
        </form>
        <a href="#drawer-edit-task" data-toggle="drawer" aria-controls="drawerEditTask" class="btn btn-primary btn-sm">Close</a>
        </div>
        </section>

        </div>
        </div>
        </div>
        </div>
        `
      };

      function insertStatusSelectPickerDrawer (res) {
        // console.log('insertStatusSelectPickerDrawer ', res);
        if ( res.status === 'open' ) {
          selectPickerHtml =
          `
          <select class='selectpicker' name="statusTypeList" id="status-type">
          <option value="open" id='status-type-for-task'>Open</option>
          <option value="inprogress" id='status-type-for-task'>In Progress</option>
          <option value="blocked" id='status-type-for-task'>Blocked</option>
          <option value="completed" id='status-type-for-task'>Complete</option>
          </select>
          `
        } else if ( res.status === 'blocked' ) {
          selectPickerHtml =
          `
          <select class='selectpicker' name="statusTypeList" id="status-type">
          <option value="blocked" id='status-type-for-task'>Blocked</option>
          <option value="completed" id='status-type-for-task'>Complete</option>
          <option value="open" id='status-type-for-task'>Open</option>
          <option value="inprogress" id='status-type-for-task'>In Progress</option>
          </select>
          `
        } else if ( res.status === 'inprogress' ) {
          selectPickerHtml =
          `
          <select class='selectpicker' name="statusTypeList" id="status-type">
          <option value="inprogress" id='status-type-for-task'>In Progress</option>
          <option value="blocked" id='status-type-for-task'>Blocked</option>
          <option value="completed" id='status-type-for-task'>Complete</option>
          <option value="open" id='status-type-for-task'>Open</option>\
          </select>
          `
        } else if ( res.status === 'completed' ) {
          selectPickerHtml =
          `
          <select class='selectpicker' name="statusTypeList" id="status-type">
          <option value="completed" id='status-type-for-task'>Complete</option>
          <option value="open" id='status-type-for-task'>Open</option>
          <option value="inprogress" id='status-type-for-task'>In Progress</option>
          <option value="blocked" id='status-type-for-task'>Blocked</option>
          </select>
          `
        }
      };
      function insertTypeAheadUserNameDrawer (res) {
        assignedIndividualTypeAheadHtml =
        `
        <span class="atwho-inserted">
        <span data-user-id='${res.assignee_info.id}' data-user-name='${res.assignee_info.first_name} ${res.assignee_info.last_name}'  data-user-email='${res.assignee_info.first_name.email}' class='task-assigned-edit-drawer' id='span-assigned-to'>@${res.assignee_info.first_name} ${res.assignee_info.last_name} </span>
        </span>
        `
      };

      function reitializeFunctionalityPostAppendHtml(jsonResponseFromGetAllUsers) {
        // initalize date picker
        $('#due-date-task-date-picker').datepicker({
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

      }

      function showEditAndUpdateSingleTask (row, tableName) {
        console.log('showEditAndUpdateSingleTask - ROW INFO', row );
        console.log('showEditAndUpdateSingleTask - tableName INFO', tableName );
        $.ajax({
          method: 'GET',
          url: `http://localhost:3000/tasks/${row.id}.json`,
          success: function(res) {

            $('.edit-drawer').remove();
            console.log('DATA returned from editFullTaskTask', res);
            // create the different html form
            editTaskHtmlDrawer(res);
            insertStatusSelectPickerDrawer(res);
            // append all the html forms
            $('.edit-drawer-outer-div').append(editTaskHtml);
            $('.select-picker-goes-here').append(selectPickerHtml);

            // reinitalize everything
            reitializeFunctionalityPostAppendHtml(jsonResponseFromGetAllUsers)
            // open drawer
            $('#drawer-edit-task').drawer('toggle');
            // listen for changes to assign ID checkmark
            $('#openAssignIdCheckMarkBox').on('change', function() {
              if (this.checked) {
                $('.appendUserInputBox').append(`
                  <div id='div-id-task-assignee-drawer' class="div-class-assign-task-drawer" contenteditable="true" autocomplete="off" required></div>
                  `)
                insertTypeAheadUserNameDrawer(res);
                $('#div-id-task-assignee-drawer').append(assignedIndividualTypeAheadHtml);
                typeAheadForUserName (jsonResponseFromGetAllUsers, "#div-id-task-assignee-drawer");
              } else {
                $('#div-id-task-assignee-drawer').remove()
              }
            });

            function runAjaxCallToUpdateSingleTask (resFromGettingRowDataAjaxCall, updatedTaskInfo, tableName) {
              // console.log('runAjaxCallToUpdateSingleTask response - ', resFromGettingRowDataAjaxCall);
              // console.log('runAjaxCallToUpdateSingleTask updatedTaskInfo - ', updatedTaskInfo);
              // console.log('runAjaxCallToUpdateSingleTask tableName - ', tableName);
              $.ajax({
                method: 'PUT',
                url: `/tasks/${resFromGettingRowDataAjaxCall.id}`,
                data: updatedTaskInfo,
                success: function(res) {
                  console.log('DATA returned from runAjaxCallToUpdateSingleTask', res);
                  $.notify({
                    title: '<strong>Yay!</strong>',
                    message: 'Status was updated.'
                  },{
                    type: 'success',
                    timer: 1000,
                    placement: {
                      from: "top",
                      align: "right"
                    },
                    delay: 5000,
                    timer: 1000,
                  });
                  // if the assignee ID is the same as the cookie id then update the row
                  console.log('resFromAjax response - ', res);

                  function updateTableWhereAssigneeNameDoesNotChange (resFromAjaxCallToGetTaskInfo, nameOfTableToUpdate) {
                    $(nameOfTableToUpdate).bootstrapTable('updateByUniqueId', {
                      id: resFromAjaxCallToGetTaskInfo.id,
                      row: {
                        status: resFromAjaxCallToGetTaskInfo.status,
                        title: `<span class='task-title fake-link'> ${resFromAjaxCallToGetTaskInfo.title.slice(0,120).concat('...')}</span>`,
                        description : resFromAjaxCallToGetTaskInfo.description,
                        dueDate: moment(resFromAjaxCallToGetTaskInfo.due_date).format("MM/DD/YY"),
                      }
                    });
                  };

                  function updateTableAddAssigneeName (resFromAjaxCallToGetTaskInfo, nameOfTableToUpdate) {
                    $(nameOfTableToUpdate).bootstrapTable('updateByUniqueId', {
                      id: resFromAjaxCallToGetTaskInfo.id,
                      row: {
                        status: resFromAjaxCallToGetTaskInfo.status,
                        title: `<span class='task-title fake-link'> ${resFromAjaxCallToGetTaskInfo.title.slice(0,120).concat('...')}</span>`,
                        description : resFromAjaxCallToGetTaskInfo.description,
                        dueDate: moment(resFromAjaxCallToGetTaskInfo.due_date).format("MM/DD/YY"),
                      }
                    });
                  };

                  if ( tableName === '#tasks_assigned_to_me' ) {
                    if ( parseInt(`${document.cookie.split('id=')[1]}`) === res.assignee_info.id ) {
                      console.log('THIS IS TABLE NAME if table = #tasks_assigned_to_me - ', tableName);
                      console.log('THIS IS RES.id if table = #tasks_assigned_to_me - ', res.id);
                      updateTableWhereAssigneeNameDoesNotChange(res, tableName)
                    } else {
                      console.log('THIS IS TABLE NAME IF NOT MINE if table = #tasks_assigned_to_me - ', tableName);
                      console.log('THIS IS res NAME IF NOT MINE if table = #tasks_assigned_to_me - ', res);
                      console.log('THIS IS RES.id IF NOT MINE if table = #tasks_assigned_to_me - ', res.id);
                      $(tableName).bootstrapTable('removeByUniqueId', res.id)
                    };
                  } else if ( tableName === '#tasks_others_owe_me' ) {
                    console.log('#tasks_others_owe_me - ', res);
                    if ( ( parseInt(`${document.cookie.split('id=')[1]}`) === res.owner_info.id ) && ( parseInt(`${document.cookie.split('id=')[1]}`) === res.assignee_info.id ) ) {
                      console.log(' THIS IS RES if table = #tasks_others_owe_me IF cookie all matches - ', res);
                      $(tableName).bootstrapTable('removeByUniqueId', res.id)
                      addNewTaskToTable(res, '#my_own_tasks', 'tasksCreatedForMyself')
                    } else {
                      $(tableName).bootstrapTable('updateByUniqueId', {
                        id: res.id,
                        row: {
                          status: res.status,
                          title: `<span class='task-title fake-link'> ${res.title.slice(0,120).concat('...')}</span>`,
                          taskResponsibleOwner: `${res.assignee_info.first_name} ${res.assignee_info.last_name}`,
                          description : res.description,
                          dueDate: moment(res.due_date).format("MM/DD/YY"),
                        }
                    });
                  }
                } else if ( tableName === '#my_own_tasks' ) {
                    if ( ( parseInt(`${document.cookie.split('id=')[1]}`) === res.owner_info.id ) && ( parseInt(`${document.cookie.split('id=')[1]}`) === res.assignee_info.id ) ) {
                      updateTableWhereAssigneeNameDoesNotChange(res, tableName)
                    } else {
                      // means i still own the task by I assinged it to someone else
                      $(tableName).bootstrapTable('removeByUniqueId', res.id);
                      addNewTaskToTable(res, '#tasks_others_owe_me', 'tasksOtherOweMe');
                    }
                }
                  // close the drawer
                  $('#drawer-edit-task').drawer('toggle');
                  // end of ajax sucess call
                },
                error: function(err) {
                  $.notify({
                    title: '<strong>Sorry!</strong>',
                    message: 'Status was not updated. Can you try again?'
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
              // end of function runAjaxCallToUpdateSingleTask
            };

            // updating the form
            $('#form-update-task').on('submit', function(event) {
              event.preventDefault()
              let dueDate = $('#due-date-task-date-picker').val();
              let status = $('#status-type option:selected').val();
              let updatedTaskInfo;

              function statusCheck (status) {
                if ( status !== 'completed' ) {
                  return ''
                } else {
                  return new Date().getTime()
                }
              }

              if ( document.getElementById('openAssignIdCheckMarkBox').checked ) {
                if ($('#span-assigned-to').length === 0) {
                  notificationIfSpanTaskIsNotAssignedToAnyone();
                  return;
                };
                updatedTaskInfo = { task:
                  {
                    title: $('#task-title-drawer').val(),
                    description: $('#task-description-drawer').val(),
                    status: status,
                    due_date: new Date(dueDate).getTime(),
                    assignee_id: $("#span-assigned-to").attr('data-user-id'),
                    completed_date: statusCheck(status),
                }
              }
            }
            else {
                updatedTaskInfo = { task:
                  {
                    title: $('#task-title-drawer').val(),
                    description: $('#task-description-drawer').val(),
                    status: status,
                    due_date: new Date(dueDate).getTime(),
                    completed_date: statusCheck(status),
                }
              }
            }
              runAjaxCallToUpdateSingleTask(res, updatedTaskInfo, tableName);
              // end of submit form for updating task
            });
            // end of first ajax sucess call
          }
          // end of first ajax call
        });
        // end of function showEditAndUpdateSingleTask
      }

      if ( field === 'editTask' && row.tableName === 'tasksAssignedToMe' ) {
        console.log('EDIT TASK THAT IS ASSIGNED TO ME -')
        showEditAndUpdateSingleTask(row, '#tasks_assigned_to_me');
        console.log('EDIT TASK THAT IS ASSIGNED TO ME -', row);

      } else if ( field === 'editTask' && row.tableName === 'tasksOtherOweMe' ) {
        console.log('EDIT TASK OTHERS OWE ME');
        showEditAndUpdateSingleTask(row, '#tasks_others_owe_me');
        console.log('EDIT TASK OTHERS OWE ME - ', row);
      } else if ( field === 'editTask' && row.tableName === 'tasksCreatedForMyself' ) {
        console.log('EDIT TASK CREATED FOR MYSELF');
        showEditAndUpdateSingleTask(row, '#my_own_tasks');
        console.log('EDIT TASK CREATED FOR MYSELF - ', row);
      }

    });




  // end of document.ready
});
