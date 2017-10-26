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
          insertTpl: "<span data-user-id='${id}' class='badge badge-pill badge-secondary task-created' id='task-assigned-to'>${atwho-at}${first_name} ${last_name} - ${email}</span>",
          displayTpl: "<li>${first_name} ${last_name}<small> ${email}</small></li> ",
          limit: 200
        }
        $('#task-assignee_id').atwho(at_config).atwho('run')
        // $('#task-assignee_id').on('change', function() {
        //   let findByEmail = $('#task-assignee_id').val().split(' ')[3]
        //   console.log(findByEmail);
        //   for ( let i = 0; i < res.length; i++ ) {
        //     if ( findByEmail === res[i].name ) {
        //       console.log('this is the name and the ID - ', res[i].email, res[i].id)
        //     }
        //   }
        // });

        $('#task-assignee_id').on('change', function() {
          console.log(document.getElementsByClassName("atwho-inserted"));
          if (document.getElementById("atwho-inserted").childNodes[0] === '<span>' ) {
            console.log('hello');
          }
          $('#task-assignee_id').on('DOMNodeInserted', function(event){
            console.log('hello');
            let parentId = document.getElementById("#task-assignee_id").childNodes.length;
            console.log('this is what');
            // if( event.target.parentNode.id == 'task-assignee_id') {
            //   console.log($('#task-assignee_id').childNodes);
            // };
          });
        });

        // var c = document.getElementById("myDIV").childNodes.length;
        // document.getElementById("demo").innerHTML = c;

      },
      error: function(err) {
        alert('Sorry! We had an error :(')
      }
    });

    // var ckeditor = $('#task-assignee_id').ckeditor({...}).ckeditorGet();
    // ckeditor.enableEnter = true; //Use this as a flag
    //
    // ckeditor.on('instanceReady',function(event) {
    //     var at_config = {...};
    //
    //    this.document.getBody().$.contentEditable = true;
    //     $(this.document.getBody().$).atwho(at_config);
    //     $(this.document.getBody().$).on('shown.atwho', function(event){
    //         ckeditor.enableEnter = false;
    //     });
    //     $(this.document.getBody().$).on('hidden.atwho', function(event){
    //         setTimeout(function(){
    //             //console.log("hide! setting to TRUE");
    //             ckeditor.enableEnter = true;
    //         },100); //Give it a small time so that the ENTER key only affects the popup and not the editor
    //     });
    // });
    //
    // ckeditor.on( 'key', function( event ) {
    //     if ( event.data.keyCode == 13 && !ckeditor.enableEnter ) {
    //         event.cancel();
    //     }
    // });
    // if (
      // there is one span on change don't allow value to change
      // then do not disable but not allow more inputs
      // on input if input is typed and if someone is mentioned
    // )
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
        console.log(userName);
        $("#task-assignee_id").append(`
          <span class="atwho-inserted">
            <span data-user-id=${document.cookie.split('id=')[1]} class='task-created' id='task-assigned-to'>${userName} </span>
          </span>
          `)
          $("#task-assignee_id").prop('disabled', true)
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
