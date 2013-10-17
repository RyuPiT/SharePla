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
    //add icon
    li.append("<span class=\"glyphicon glyphicon-flag\">");
    //add card-title
    li.append("<span class=\"title\">" + data["name"] + "</span>");
    //add delete-botton
    li.append("<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>");

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
    location.href = "/";
  }

  var failFunc = function() {
    alert("post failed");
  }

  function getAllCard() {
    var allCard = new Array();
    var size     = $("#sortable > li ").length;
    for(var i = 0; i < size; i++){
      allCard[i] = $("#sortable > li > .title").eq(i).text();
    }
    return allCard;
  }
});
