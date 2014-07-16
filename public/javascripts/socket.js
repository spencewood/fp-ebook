io = io.connect()

// Emit ready event.
io.emit('ready') 

// Listen for the talk event.
io.on('message', function(message) {
  console.log(message);
});