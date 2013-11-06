// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

$(function() {
  $("#addplan").submit(function() {
    var postData = { "name": $("#addplan input[name=keyword]").val(), "authenticity_token": getCSRFtoken() };
    var postUrl  = "/plan/add.json";

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

  $("#prefectures > .area-division > label").bind("click",function() {
    var rawText    = $(this).text();
    var prefecture = $.trim(rawText);
    if ($(this).hasClass("active")) {
      $("#area-tags-box > span[name="+prefecture+"]").remove();
      return;
    }
    var span = $("<span name="+prefecture+">");
    span.append(prefecture);
    span.addClass("label label-default");
    $("#area-tags-box").append(span);
  });

  $("#search-hotel").submit(function() {
    var postData = { "name": $("#search-hotel input[name=keyword]").val(), "authenticity_token": getCSRFtoken() };
    var postUrl  = "/plan/search/hotel.json";

    $("#hotel-card-sortable li").remove();

    jQuery.post(postUrl, postData, searchHotelCallback).fail(failFunc);
    return false;
  });

  function searchHotelCallback(data) {
    $.each(data["Body"]["KeywordHotelSearch"]["hotel"], function() {
      var li = $("<li>");
      li.addClass("ui-state-hotel");
      //add card-title
      li.append("<span class=\"title\"><a data-toggle=\"modal\"href=\"#Modal" + this["hotelBasicInfo"]["hotelNo"] + "\">" + this["hotelBasicInfo"]["hotelName"] + "</a></span>");
      //add delete-botton
      li.append("<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>");

      $("#hotel-card-sortable").append(li);

      //modal window
      var dialog = "<div class=\"modal fade\" id=\"Modal" + this["hotelBasicInfo"]["hotelNo"] +  "\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"myModalLabel\" aria-hidden=\"true\">        <div class=\"modal-dialog\">"
      + "<div class=\"modal-content\">"
      + "<div class=\"modal-header\">"
      + "<button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button>"
      + "<h4 class=\"modal-title\">" + this["hotelBasicInfo"]["hotelName"] + "</h4>"
      + "</div><!-- .model-header -->"
      + "<div class=\"modal-body\">"
      + "<img src=\"" +  this["hotelBasicInfo"]["hotelImageUrl"] + "\">"
      + "</div><!-- .modal-body -->"
      + "<div class=\"modal-footer\">"
      + "<button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">閉じる</button>"
      + "<a href=\"" + this["hotelBasicInfo"]["hotelInformationUrl"] +  "\" class=\"btn btn-primary\" target=\"_blank\">予約</button>"
      + "</div><!-- .modal-content -->"
      + "</div><!-- .modal-content -->"
      + "</div><!-- .modal-dialog -->"
      + "</div><!-- .modal fade -->";

    $("#hotel-card-sortable").append(dialog);
    });
    $("#search-hotel input[name=keyword]").val("");
  }


  $("#saveplan").submit(function() {
    var postData   = { "plan": { "title": $("input[name=plan-title]").val(), "desc": $("textarea[name=plan-desc]").val(), "days": getAllCard(), "area_tags": getAllAreaTags() }, "authenticity_token": getCSRFtoken() };
    var postUrl    = "/plan/save.json";
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
    var htmlTag = "#main-card-sortable > li";
    var size    = $(htmlTag).length;
    var keys    = ["title"];

    for(var i = 0; i < size; i++){
      var oneCard = { };
      $.each(keys, function(j, val) {
        oneCard[val] = $(htmlTag).children("." + val).eq(i).text();
      });
      allCard[i] = oneCard;
    }

    return allCard;
  }

  function getAllAreaTags() {
    return $.map($('#area-tags-box > span'), function(val) { return $(val).text(); });
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
