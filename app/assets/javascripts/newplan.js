// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

$(function() {
  $("#addplan").submit(function() {
    var post_data = { name: $("#addplan > input[name=keyword]").val(), authenticity_token: getCSRFtoken() };
    var post_url  = "/newplan/add.json";

    jQuery.post(post_url, post_data, addplan_callback).fail(fail_func);
    return false;
  });

  function addplan_callback(data) {
    var li = $("<li>");
    li.addClass("ui-state-default");
    li.text(data["name"]);
    $("#sortable").append(li);
    $("#addplan > input[name=keyword]").val("");
  }

  $("#saveplan").submit(function() {
    var post_data   = { "all_card": get_all_card(), authenticity_token: getCSRFtoken() };
    var post_url    = "/newplan/save.json";
    var return_type = "text";
    var plan_title = { name: $("#saveplan > input[name=plan-title]").val(), authenticity_token: getCSRFtoken() };
    jQuery.post(post_url, post_data, saveplan_callback, return_type).fail(fail_func);
    return false;
  });

  function saveplan_callback(data) {
    alert("post ok");
  }

  var fail_func = function() {
    alert("post failed");
  }

  function get_all_card() {
    var all_card = new Array();
    var size     = $("#sortable > li").length;
    for(var i = 0; i < size; i++){
      all_card[i] = $("#sortable > li").eq(i).text();
    }
    return all_card;
  }
});
