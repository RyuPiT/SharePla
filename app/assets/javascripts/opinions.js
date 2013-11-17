// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

var opinion = {
  onReady: function(){
    $('.opinion-list button').bind('click', function(){
      var postUrl  = 'opinions/like.json';
      var postData = { id: $(this).val() };

      $.post(postUrl, postData, opinion.likeCallback);
    });
  },
  likeCallback: function(data){
    if (data['status'] == "ok") {
      var likes = $('.opinion-list button[name='+data['id']+'] span').text();
      $('.opinion-list button[name='+data['id']+'] span').text(parseInt(likes) + 1);
      $('.opinion-list button[name='+data['id']+']').addClass('disabled');
    } else {
      var message = '';
      message += '<div class="alert alert-warning alert-dismissable">';
      message += '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">';
      message += '&times;</button>';
      message += 'すでにiine!されています';
      message += '</div>';
      $('#opinion-page .page-header').append(message);
    }
  }
}

$(function(){
  opinion.onReady();
});
