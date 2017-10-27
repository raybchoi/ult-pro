console.log('createNewTask.js file loaded');
$(document).on('turbolinks:load', function(){
  // https://stackoverflow.com/questions/28415178/how-do-you-show-the-current-time-on-a-web-page
  var clockElement = document.getElementById( "clock" );
  function updateClock ( clock ) {
    clock.innerHTML = new Date().toLocaleTimeString();
  }
  setInterval(function () {
    updateClock( clockElement );
    }, 1000);

  (function () {

  var clockElement = document.getElementById( "clock" );

  function updateClock ( clock ) {
    clock.innerHTML = new Date().toLocaleTimeString();
  }

  setInterval(function () {
      updateClock( clockElement );
  }, 1000);
  }());

  // end of document.ready
});
