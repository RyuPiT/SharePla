// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

$(function(){

  $('.opinion-list button').bind('click', function(){
    var postUrl  = 'opinions/like.json';
    var postData = { id: $(this).val() };

    $.post(postUrl, postData, opinionLikeCallback);
  });

});

function opinionLikeCallback(data) {
  $('.opinion-list button[name='+data['id']+']').addClass('disabled');
}
