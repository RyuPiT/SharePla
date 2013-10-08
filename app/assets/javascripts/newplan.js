// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

$(function() {
  $("#addplan").submit(function(){
    jQuery.post("/newplan/add.json", { name: $("#addplan > input[name=keyword]").val(), authenticity_token: getCSRFtoken()}, addplan_callback)
    .fail(
      function(){
      alert("post failed");
      }
    );
    return false;
  });
});

function addplan_callback(data) {
  var li = $("<li>");
  li.addClass("ui-state-default");
  li.text(data["name"]);
  $("#sortable").append(li);
  $("#addplan > input[name=keyword]").val("");
};

$(function() {
  $("#saveplan").submit(function() {
    var all_card = get_all_card();
    jQuery.post("/newplan/save.json", { "all_card": all_card, authenticity_token: getCSRFtoken() }, saveplan_callback, "text")
    .fail(
      function() {
      alert("save plan post failed");
      }
    );
    return false;
  });
});

function saveplan_callback(data) {
  alert("post ok");
};

function get_all_card() {
  var arr = new Array();
  for(var i = 0 ; i < $("#sortable > li").length ; i++){
    arr[i] = $("#sortable > li").eq(i).text();
  }
  return arr;
}
