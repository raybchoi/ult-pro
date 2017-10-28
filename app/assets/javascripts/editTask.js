console.log('editTask.js file loaded');
$(document).on('turbolinks:load', function(){


  // function statusTextColor(eventData, rowData) {
  //   if ( rowData.status === 'inprogress' ) {
  //     console.log('THIS WORKED');
  //     console.log('statusTextColore ', rowData);
  //     console.log('statusTextColore ', eventData);
  //     console.log('statusTextColore ', eventData);
  //   }
  // }

  $('.div-tasks').on('editable-save.bs.table', function (event, field, row, old) {
    console.log('this is event ', event)
    let oldStatus = old
    console.log('this is oldStatus ', oldStatus)
    let updateTaskStatusData;
    if ( `${row.status}` === 'complete' ) {
      updateTaskStatusData = { task:
        {
          status: `${row.status}`,
          completed_date: new Date().getTime(),
        }
      };
    } else {
      updateTaskStatusData = { task:
        {
          status: `${row.status}`,
        }
      };
    }
    $.ajax({
    method: 'PUT',
    url: `/tasks/${row.id}`,
    data: updateTaskStatusData,
    success: function(res) {
      console.log('DATA returned from updateTaskStatusData', res);
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
  });


      // $(event.target.children[1].childNodes[0].children[0].children[0]).removeAttr("data-value");
      // $(event.target.children[1].childNodes[0].children[0].children[0]).attr("data-value", "blocked");
      // event.target.children[1].childNodes[0].children[0].children[0].textContent='Blocked';
      // console.log('THIS IS IT', event.target.children[1].childNodes[0].children[0].children[0].innerText)
        // console.log('THIS IS IT', event.target.children[1].childNodes[0].children[0].children[0])

});
