//  createMessagesChannel() function --> this is being referenced from the /chatrooms/show.html.erb. This is a function so the server only listens and broadcast when you are looking at a chat versus always running the the background. This method created the subscription to the corresponding MessagesChannel, receives data (messages) that is being broadcasted by the Message Controller, and then appends it onto the screen.

function createTaskChannel() {
  // for this the messages table is going to equal the app.cable.subscriptions table and create one
  // A consumer becomes a subscriber by creating a subscription to a given channel
  // MessagesChannel is going into the channels => message_channel.rb
  console.log('here');
  App.tasks = App.cable.subscriptions.create({
        channel: 'TasksChannel', id: parseInt(`${document.cookie.split('id=')[1]}.json`)
        },
        {
        received: function(resData) {
          // console.log('This is the createTaskChannel Data - ', resData);
          // return $('#messages').append(this.renderMessage(data));
          let taskInfo = resData.task
          let assignee_info = resData.assignee_info
          $('#tasks_assigned_to_me').bootstrapTable('insertRow', {
            index: 0,
            row: {
              status: taskInfo.status,
              title:`<span class='task-title fake-link'> ${taskInfo.title.slice(0,120).concat('...')}</span>`,
              description: taskInfo.description.slice(0,240).concat('...'),
              taskResponsibleOwner: `${assignee_info.first_name} ${assignee_info.last_name}`,
              createdDate:  moment(taskInfo.created_date).format("MM/DD/YY"),
              dueDate: moment(taskInfo.due_date).format("MM/DD/YY"),
              id: taskInfo.id,
              editTask: `<span class="glyphicon glyphicon-pencil fake-span"></span>`,
              deleteTask: `<span class="glyphicon glyphicon-trash fake-span"></span>`,
              tableName: 'tasksAssignedToMe',
            }
          });
          $.notify({
            title: '<strong>Check it out!</strong>',
            message: 'A new task was assigned to you.'
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
        renderMessage: function(data) {
    // return "<p> <b>" + data.user + ": </b>" + data.message + "</p>";
  },
      });
      // return what was created above
return App.tasks;
}
