$(document).ready(function(){
  $.ajax({
    url: 'http://localhost:8080/api/:id',
    type: 'GET',
    success: function(result){
      $('#profile-id').text(result.id);
      $('#profile-username').text(result.username);
      $('#display-name').text(result.displayName);
      $('#profile-repos').text(result.publicRepos);
     }       
   })  
})