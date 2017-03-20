$(document).ready(function(){
  $.ajax({
    url: 'https://nicks-polling-app-2016.herokuapp.com/api/:id',
    type: 'GET',
    success: function(result){
      $('#profile-id').text(result.id);
      $('#profile-username').text(result.username);
      $('#display-name').text(result.displayName);
      $('#profile-repos').text(result.publicRepos);
     }
   })
})
