$(document).ready(function() {

  var socket = io('ws://localhost:3000');
  socket.on('connect', function(){
    console.log('conected socket:');
  });
  socket.on('server-response', function(data){
    console.log('server-response: ', data)
  });
  socket.on('disconnect', function(){
    console.log('disconected');
  });

  $('#event-emiter').on('click', function(){
    console.log('emiting test-event');
    socket.emit('test-event');
  })

  $('#myFileInput').on('change', function(e) {

    var file = e.target.files[0];
console.log('file: ', file);

    // do not open file if it is not a CSV
    if (file.type !== 'text/csv') {
      alert('Invalid file. Only CSV allowed');
      return
    }

    var reader = new FileReader();

    reader.onload = function(e) {
      var text = reader.result;// the entire file

      var firstLine = text.split('\n').shift(); // first line 

      console.log('firstLine', firstLine);
    }

    reader.readAsText(file, 'UTF-8');

  })

  $('#csvForm').on('submit', function(e){
    e.preventDefault();
    console.log('form submited');

    // var file = e.target[0].files[0];

    // var reader = new FileReader();

    // reader.onload = function(e) {
    //   var text = reader.result;// the entire file

    //   var firstLine = text.split('\n').shift(); // first line 

    //   console.log('firstLine', firstLine);
    // }

    // reader.readAsText(file, 'UTF-8');

    // validate only CSV files
    if (file.type !== 'text/csv') {
      alert('Invalid file. Only CSV allowed');
      return
    }

    console.log('file: ', file);
    socket.emit('test-event');
  })


  var app = new Vue({
    el: '#app',
    data: {
      fileInputs: [
        {id: 1},
        {id: 2},
        {id: 3},
      ],
      message: 'a message',
    }
  })


});