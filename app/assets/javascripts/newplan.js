// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

$(function() {
  $("#addplan").submit(function() {
    var postData = { name: $("#addplan input[name=keyword]").val(), authenticity_token: getCSRFtoken() };
    var postUrl  = "/newplan/add.json";

    jQuery.post(postUrl, postData, addplanCallback).fail(failFunc);
    return false;
  });

  function addplanCallback(data) {
    var li = $("<li>");
    li.addClass("ui-state-default");
    //add card-title
    li.append("<span class=\"title\">" + data['name'] + "</span>");
    //add delete-botton
    li.append("<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>");

    $("#main-card-sortable").append(li);
    $("#addplan input[name=keyword]").val("");
  }

  $("#search-hotel").submit(function() {
    var postData = { name: $("#search-hotel input[name=keyword]").val(), authenticity_token: getCSRFtoken() };
    var postUrl  = "/newplan/search-hotel.json";

    $("#hotel-card-sortable > li").remove();

    jQuery.post(postUrl, postData, searchHotelCallback).fail(failFunc);
    return false;
  });

  function searchHotelCallback(data) {
    $.each(data["Body"]["KeywordHotelSearch"]["hotel"], function() {
      var li = $("<li>");
      li.addClass("ui-state-hotel");
      li.append("<span class=\"title\">" + this["hotelBasicInfo"]["hotelName"] + "</span>");
      li.append("<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>");
      $("#hotel-card-sortable").append(li);
      $("#search-hotel > input[name=keyword]").val("");
    });
  }


  $("#saveplan").submit(function() {
    var postData   = { plan: { title: $("input[name=plan-title]").val(), desc: $("textarea[name=plan-desc]").val(), "days": getAllCard() }, authenticity_token: getCSRFtoken() };
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
    var size     = $("#main-card-sortable > li ").length;
    for(var i = 0; i < size; i++){
      var json = { };
      json["title"] = $("#main-card-sortable > li > .title").eq(i).text();
      allCard[i] = json;
    }
    return allCard;
  }
});

//plan-list sort
$(function() {
  $( "ol.droptrue" ).sortable({
    connectWith: "ol"
  });

  $( "ol.dropfalse" ).sortable({
    connectWith: "ol",
    dropOnEmpty: false
    });

  $( "#main-card-sortable, #hotel-card-sortable" ).disableSelection();
});



//textarea autosize
$(document).ready(function(){
    $('textarea').autosize();
});
