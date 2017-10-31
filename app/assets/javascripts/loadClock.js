// console.log('loadClock.js file loaded');
$(document).on('turbolinks:load', function(){
  let url = "https://chilling-mausoleum-21805.herokuapp.com"
  function renderClock() {
    if ( window.location.href === `${url}/users/${document.cookie.split('id=')[1]}` ) {
      let clock = $('.clock').FlipClock({
        clockFace: 'TwelveHourClock'
      });
      // https://stackoverflow.com/questions/18536726/javascript-to-display-the-current-date-and-time
      // http://jsfiddle.net/EZVbj/1/

      document.getElementById("date").innerHTML = formatAMPM();
      function formatAMPM() {
        var d = new Date(),
        minutes = d.getMinutes().toString().length == 1 ? '0' + d.getMinutes() : d.getMinutes(),
        hours = d.getHours().toString().length == 1 ? '0' + d.getHours() : d.getHours(),
        ampm = d.getHours() >= 12 ? 'pm' : 'am',
        months = ['January', 'January', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        // months = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
        days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        // return days[d.getDay()] + ' ' + months[d.getMonth()] + ' ' + d.getDate() + ' ' + d.getFullYear() + ' ' + hours + ':' + minutes + ampm;
        return days[d.getDay()] + ', ' + months[d.getMonth()] + ' ' + d.getDate();
      }
    };
  };
  renderClock()
  // end of document.ready
});
