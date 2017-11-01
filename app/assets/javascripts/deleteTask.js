// console.log('delete.js file loaded');
$(document).on('turbolinks:load', function(){
  $('.div-tasks').on('click-cell.bs.table', function (event, field, old, row) {
    // console.log('THIS IS DELETE - ', row);
    let url = "https://chilling-mausoleum-21805.herokuapp.com"
    let url2 = "http://localhost:3000"
    let deleteTaskInfo;
    function deleteSingleTask (row, tableName) {
      swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this task!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
          deleteTaskInfo = { task:
            {
              delete_flag: true,
            }
          };
          $.ajax({
            method: 'DELETE',
            url: `${url}/tasks/${row.id}`,
            data: deleteTaskInfo,
            success: function(res) {
              $(tableName).bootstrapTable('removeByUniqueId', res.id);
              // console.log('DATA returned from deleteAjaxCall', res);
              swal("Poof! Your task has been deleted!", {
                icon: "success",
              });
            },
            error: function(err) {
              $.notify({
                title: '<strong>Sorry!</strong>',
                message: 'We were not able to delete the task. Can you try again?'
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
          // end of delete a task

        } else {
          swal("Your imaginary file is safe!");
        }
        // end of sweetAlert delete
      });

    }

    if ( field === 'deleteTask' && row.tableName === 'tasksAssignedToMe' ) {
      deleteSingleTask(row, '#tasks_assigned_to_me');
    } else if ( field === 'deleteTask' && row.tableName === 'tasksOtherOweMe' ) {
      deleteSingleTask(row, '#tasks_others_owe_me');
    } else if ( field === 'deleteTask' && row.tableName === 'tasksCreatedForMyself' ) {
      deleteSingleTask(row, '#my_own_tasks');
    }
  });
});
