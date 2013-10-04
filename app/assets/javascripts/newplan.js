// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

$(function() {
  $("#addplan").submit(function(){
    jQuery.post("/newplan/add.json", { name: $("#addplan > input[name=keyword]").val() }, addplan_callback)
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
