$(document).ready(function(){
  function readjustButtons(clickedButton, otherButton1, otherButton2){
    $('#arena').empty();
    $(clickedButton).prop("disabled",true);
    $(otherButton1).prop("disabled",false);
    $(otherButton2).prop("disabled",false);
    $(clickedButton).addClass('active');
    $(otherButton1).removeClass('active');
    $(otherButton2).removeClass('active');
  }

  function listPolls(apiRoute, method, pollRoute){
    var text='';
    $.ajax({
      url:  'https://nicks-polling-app-2016.herokuapp.com/' + apiRoute,
      type: method,
      success: function(results){
        results.forEach(function(obj){
          text += '<a href="' + pollRoute + obj["_id"] + '" class="list-group-item">' + obj.question + '</a>';
        })
        $('.list-group').append(text);
       }
     })
  }

  $('#allPolls').on('click', function(){
    readjustButtons(this, $('#new'), $('#userPolls'));
    $('#arena').html('<div class="list-group"><h2>View Polls:</h2></div>');
    listPolls('api/viewpolls', 'GET', '/poll/');
  })

  $('#userPolls').on('click', function(){
    readjustButtons(this, $('#new'), $('#allPolls'));
    $('#arena').html('<div class="list-group"><h2>Your Polls:</h2></div>');
    listPolls('api/userpolls', 'GET', '/userpoll/');
  })

  $('#new').on('click', function(){
    readjustButtons(this, $('#allPolls'), $('#userPolls'));
    $('#arena').append('<h3>How many choices would you like folks to choose from?</h3><select class="form-control"></select><input class="btn btn-default" id="numChoices" type="submit"></input>');
    for(var j=2; j<= 30; j++){
      $('.form-control').append('<option>' + j + '</option>')
    }

    $('#numChoices').on('click', function(){
      var numChoices = +($('.form-control').val());
      $('#arena').empty();
      $('#arena').append('<form id="poll" role="form"><div class="form-group"><label for="question" class="control-label">Question</label><input type="text" id="question" placeholder="Enter your poll question here" required class="form-control"/></div><div class="choices form-group"><label for="choices" class="control-label">Choices <a href="#" id="addChoice">+</a></label></div><input type="submit" id="sub" class="btn btn-default"/></form>');

      for(var i = 0; i<+numChoices; i++){
        $('.choices').append('<input class="form-control" type="text" id="choice' + (i + 1) + '"></div>')
      }

      $('#addChoice').on('click', function(event){
        event.preventDefault();
        if(+$('input').length - 1 < 31){
          $('.choices').append('<input class="form-control" type="text" id="choice' + (i + 1) + '"></div>');
          i += 1;
        }
      })

      $('#poll').on('submit', function(event){
        event.preventDefault();

        var question = $('#question').val(),
          data = {question: question, options: {}},
          choices = +$('input').length - 2,
          choiceArray = [];

        for(var j=1; j<=choices; j++){
          if($('#choice' + j).val() && choiceArray.indexOf($('#choice' + j).val()) == -1){
            choiceArray.push($('#choice' + j).val());
            data['options'][j] = { choice: $('#choice' + j).val(), votes: 0 };
          }
        }

        if(choiceArray.length <= 1){
          $("#alertModalBody").text('You need to create at least two unique choices for this poll.');
          $("#alertModal").modal();
          return false;
        }

        $.ajax({
          url: 'https://nicks-polling-app-2016.herokuapp.com/api/newpoll',
          type: 'POST',
          data: data,
          success: function(data){
            if(typeof data.redirect == 'string'){
              return window.location = data.redirect;
            }
            $('#arena').text("Poll has been posted!");
          }
        })
      })
    })
  })
})
