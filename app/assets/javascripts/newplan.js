// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

$(function() {
  $("#addplan").submit(function() {
    var postData = { name: $("#addplan > input[name=keyword]").val(), authenticity_token: getCSRFtoken() };
    var postUrl  = "/newplan/add.json";

    jQuery.post(postUrl, postData, addplanCallback).fail(failFunc);
    return false;
  });

  function addplanCallback(data) {
    var li = $("<li>");
    li.addClass("ui-state-default");
    li.text(data["name"]);
    $("#sortable").append(li);
    $("#addplan > input[name=keyword]").val("");
  }

  $("#saveplan").submit(function() {
    var postData   = { title: $("input[name=plan-title]").val(), "all_card": getAllCard(), authenticity_token: getCSRFtoken() };
    var postUrl    = "/newplan/save.json";
    var returnType = "text";

    jQuery.post(postUrl, postData, saveplanCallback, returnType).fail(failFunc);
    return false;
  });

  function saveplanCallback(data) {
    alert("post ok");
  }

  var failFunc = function() {
    alert("post failed");
  }

  function getAllCard() {
    var allCard = new Array();
    var size     = $("#sortable > li").length;
    for(var i = 0; i < size; i++){
      allCard[i] = $("#sortable > li").eq(i).text();
    }
    return allCard;
  }
});
