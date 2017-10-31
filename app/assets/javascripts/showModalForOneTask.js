console.log('showModalForOneTask.js file loaded');
$(document).on('turbolinks:load', function(){


  $('.div-tasks').on('click-cell.bs.table', function (event, field, old, row) {
    // console.log('click-cell.bs.table file loaded ', field)
    // console.log('click-cell.bs.table file loaded ', row.id);

    if ( field === 'title' ) {
      $.ajax({
        method: 'GET',
        url: `http://localhost:3000/tasks/${row.id}.json`,
        success: function(res) {
          $('.show-modal').remove();
          console.log('DATA returned from showModalForOneTask', res);
          let taskHtml;

          function createTaskHtmlModal (jsonResponse, status) {
            taskHtml =
            `
            <div class='show-modal'>
              <div class="modal fade" id="showOneTask" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h3 class="modal-title" id="exampleModalLabel">${jsonResponse.title}</h3>
                    </div>
                    <div class="modal-body">
                      <section class='show-task-section'>
                        <div>
                        <div class="row">
                          <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                            <span class='open status single-task'>Status: </span> <span>${status}</span>
                          </div>
                          <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                            <span class='single-task'>Due On: </span>
                            <span>${moment(jsonResponse.due_date).format('MMM Do YY')}</span>
                          </div>
                        </div>
                          <h4 class='task-description'>${jsonResponse.description}</h4>
                        </div>
                      </section>
                    </div>
                    <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            `
          };
          if ( res.status === 'open' ) {
            createTaskHtmlModal (res, 'Open')
          } else if ( res.status === 'inprogress' ) {
            createTaskHtmlModal (res, 'In Progress')
          } else if ( res.status === 'blocked' ) {
            createTaskHtmlModal (res, 'Blocked')
          } else if ( res.status === 'completed' ) {
            console.log('closed');
            taskHtml =
            `
            <div class='show-modal'>
              <div class="modal fade" id="showOneTask" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h3 class="modal-title" id="exampleModalLabel">${res.title}</h3>
                    </div>
                    <div class="modal-body">
                      <section class='show-task-section'>
                        <div>
                        <div class="row">
                          <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                            <span class='open status single-task'>Status:</span>
                            <span> ${status}</span>
                          </div>
                          <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                            <span class='single-task'>Due On: </span>
                            <span>${moment(res.due_date).format('MMM Do YY')}</span>
                          </div>
                          <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                            <span class='single-task'>Completed On:</span>
                            <span> ${moment(res.completed_date).format('MMM Do YY')}</span>
                          </div>
                        </div>
                          <h4 class='task-description'>${res.description} %></h4>
                        </div>
                      </section>
                    </div>
                    <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            `
          }
          $('.show-modal-outer-div').append(taskHtml);
          $('#showOneTask').modal('show');
          // $('#tasks_assigned_to_me').bootstrapTable('refresh');
        },


      })
      }
    });



  // $('#showOneTask').on('show.bs.modal', function (event) {
  //   console.log('showModalForOneTask.js file loaded ',event);
  //   var button = $(event.relatedTarget) // Button that triggered the modal
  //   var recipient = button.data('whatever') // Extract info from data-* attributes
  //   // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
  //   // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
  //   var modal = $(this)
  //   modal.find('.modal-title').text('New message to ' + recipient)
  //   modal.find('.modal-body input').val(recipient)
  // });
});
