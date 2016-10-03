$(document).ready(function(){
  $('#deleteButton').on('click', function(){
    var data = {id: window.location.pathname.split('poll/')[1]};
    
    $("#confirmModal").modal();
      
    $('#confirmDelete').on('click', function(){
      $("#confirmModal").modal('hide');
      $.ajax({
        url: 'http://localhost:8080/api/deletePoll',
        type: 'DELETE',
        data: data,
        success: function(results){
          $('.jumbotron').empty().append('Poll deleted!');
        }
      })
    })
  })
  
  var ctx = $("canvas"),
      baseColors = ['#ff3333','#0099ff','#ff80ff','#ffff66','#99ff33','#00e673','#1ab2ff','#b84dff','#4dffff','#b2b266'],
      lightColors = ['#ffe6e6','#ccebff','#ffe6ff','#ffffe6','#f2ffe6','#ccffe6','#cceeff','#f5e6ff','#e6ffff','#eeeedd'],
      data = [],
      labels = [],
      backgroundColors = [],
      hoverColors = [];
  
  datum[0].options.forEach(function(item, i){
    labels[i] = item.choice;
    data[i] = item.votes;
    backgroundColors[i] = baseColors[i];
    hoverColors[i] = lightColors[i];
  });
  
  var chartData = {
    labels: labels,
    datasets: [
      {
        data: data,
        backgroundColor: backgroundColors,
        hoverBackgroundColor: hoverColors
      }]
  };
  
  var myDoughnutChart = new Chart(ctx, {
    type: 'doughnut',
    data: chartData,
  });
  
  $('#submit').on('click', function(event){
    event.preventDefault();
    
    $.getJSON('//freegeoip.net/json/?callback=?', function(info) {
      var userIp = info.ip,
          choice = $('select').val(),
          data = { id: window.location.pathname.split('poll/')[1], choice: choice };
      
      if(!choice){
        return false;
      }
      
      if(user){
        for(var i=0; i<datum[0].voters.length; i++){
          if(datum[0].voters[i] == user){
            $("#alertModalBody").text('User has already voted...');
            $("#alertModal").modal();
            return false;
          }
        }
        data.user = user;
      } else {
        for(var i=0; i<datum[0].voters.length; i++){
          if(datum[0].voters[i] == userIp){
            $("#alertModalBody").text('Client IP has already voted...');
            $("#alertModal").modal();
            return false;
          }
        }
        data.user = userIp;
      }

      $.ajax({
        url: 'http://localhost:8080/api/upvote',
        type: 'POST',
        data: data,
        success: function(results){
          $('#submit').attr('disabled', true);
          
          if(window.innerWidth > 767){
            $('<img src="http://www.warblogle.com/wp-content/uploads/2010/11/Option-1.jpg">').hide().prependTo('.navbar-right').fadeIn(1000).fadeOut(2000);
          }
          
          datum[0].options.forEach(function(item, i){
            for(var key in item){
              if(item[key] == choice){
                chartData.datasets[0].data[i] = item.votes + 1;
              }
            }
          });

          var myDoughnutChart = new Chart(ctx, {
              type: 'doughnut',
              data: chartData
          });
        }
      })  
    })
  })
})
