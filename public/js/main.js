$(document).ready(function() {

  var socket = io('http://localhost');
  socket.on('connect', function(){
    console.log('conected');
  });
  socket.on('event', function(data){});
  socket.on('disconnect', function(){
    console.log('disconected');
  });

});