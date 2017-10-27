// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, or any plugin's
// vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require rails-ujs
//= require turbolinks
//= require jquery
//= require jquery_ujs
//= require jquery.atwho
//= require typeahead.bundle.min
//= require bootstrap-sprockets
//= require bootstrap-table
//= require bootstrap-datepicker
//= require bootstrap-notify
//= require bootstrap-select.min
//= require flipclock
//= require moment
//= require bootstrap-editable
//= require_tree .
/**
 * Initialize tagsinput behaviour on inputs and selects which have
 * data-role=tagsinput
 */
 $(document).on('turbolinks:load', function(){

  // $("input[data-role=tagsinput], select[multiple][data-role=tagsinput]").tagsinput();



  // https://stackoverflow.com/questions/28415178/how-do-you-show-the-current-time-on-a-web-page

});
