$(document).ready(function() {
  console.log('JQ');
  // addTask(); // Call to add Tasks
  getTasks(); // Call to get Tasks

  $('#addTaskform').on('submit', addTask);
  $("#task-list").on('click', '.completed-button', completeTasks);
  $('#task-list').on('click', '.delete-button', deleteTasks);
  $('#task-list').on('click', '.completed-button2', getupdatedTasks);

}); // end doc ready

function addTask() {
  // test get call to server
  var objectToSend = {
    task: $('#addTask').val(),
    person: $('#addPerson').val(),
    duedate: $('#addDate').val()
  }; //end objectToSend
  $.ajax({
      type: 'POST',
      url: '/add',
      data: objectToSend,
      success: function(response) {
        console.log('back from get call with:', response);
      } //end for
      // } end success
    } //end ajax
  ); //end submit function
  console.log('objectToSend');
  $('#myTasks').empty();
  getTasks();
} //end add_task


function getTasks() {
  $('#myTasks').empty();
  $('#completedTasks').empty();

  // test get call to server
  $.ajax({
      type: 'GET',
      url: '/tasks',
      success: function(response) {
        console.log('back from get call with:', response);
        for (var i = 0; i < response.length; i++) {

          if (response[i].completed === false) {
            var listItem = '<li data-id="' + response[i].id + '" class="taskitem">';
            listItem += response[i].task;
            listItem += '<button id="' + response[i].id + '" class="delete-button" >delete';
            listItem += '</button>';
            listItem += '<button id="' + response[i].id + '" class="completed-button" > completed';
            listItem += '</button>';
            listItem += '</li>';
            $('#myTasks').append(listItem);
          } else {
            var completedItem = '<li data-id="' + response[i].id + '" class="completeditem">';
            completedItem += response[i].task;
            completedItem += '<button id="' + response[i].id + '" class="delete-button" >delete';
            completedItem += '</button>';
            completedItem += '<button id="' + response[i].id + '" class="completed-button2" > not completed';
            completedItem += '</button>';
            completedItem += '</li>';
            $('#completedTasks').append(completedItem);
          }
        }
      } //end for
    } //end success
  ); //end ajax
} //end post_task


function getupdatedTasks() {
  // test get call to server
  var objectToSend = {
    id: $(this).attr('id')
  };
  console.log(objectToSend);
  $.ajax({
      type: 'POST',
      url: '/updateagain',
      data: objectToSend,
      success: function(res) {
        console.log('Back from the server with', res);
        console.log(objectToSend);
        getTasks();
        // getTasks();
      } //end for
    } //end success
  );
} //end of ajax

function completeTasks() {
  console.log('inside completed');
  var objectToSend = {
    id: $(this).attr('id')
  };
  console.log(objectToSend);
  $.ajax({
      type: 'POST',
      url: '/update',
      data: objectToSend,
      success: function(res) {
        console.log('Back from the server with', res);
        console.log(objectToSend);
        getTasks();
      } //end for
    } //end success
  );
} //end of ajax

function deleteTasks() {
  console.log('delete button working');
  var objectToSend = {
    id: $(this).attr('id')
  };
  console.log(objectToSend);
  $.ajax({
    type: 'DELETE',
    url: '/delete',
    data: objectToSend,
    success: function(response) {
      console.log('back from server with:', response);
    }
  });
  $(this).parent().remove();
} //end delete_task
