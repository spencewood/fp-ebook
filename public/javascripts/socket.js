$(function(){
  io = io.connect()

  // Emit ready event.
  io.emit('ready') 

  // Listen for the messages.
  io.on('message', function(message) {
    console.log(message);
  });

  var template = Handlebars.compile($('#format-template').html());

  io.on('format', function(format) {
    $("#book-list").html(template(format));
  });
});