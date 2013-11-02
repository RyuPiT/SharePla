// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

$(function() {
  $("#addplan").submit(function() {
    var postData = { name: $("#addplan input[name=keyword]").val(), authenticity_token: getCSRFtoken() };
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

  $("#search-hotel").submit(function() {
    var postData = { name: $("#search-hotel input[name=keyword]").val(), authenticity_token: getCSRFtoken() };
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
    var postData   = { plan: { title: $("input[name=plan-title]").val(), desc: $("textarea[name=plan-desc]").val(), "days": getAllCard(), area_tags: getAllAreaTags() }, authenticity_token: getCSRFtoken() };
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
    var size     = $("#main-card-sortable > li ").length;
    for(var i = 0; i < size; i++){
      var json = { };
      json["title"] = $("#main-card-sortable > li > .title").eq(i).text();
      allCard[i] = json;
    }
    return allCard;
  }

  function getAllAreaTags() {
    var allAreaTags = new Array();
    var size     = $("#area-tags-box > span ").length;
    for(var i = 0; i < size; i++){
      allAreaTags[i] = $("#area-tags-box > span").eq(i).text();
    }
    return allAreaTags;
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


$(function(){
    alert("yoshiaki");
    var prefectures = ["北海道",
                       "青森県","岩手県","宮城県","秋田県","山形県","福島県",
                       "茨城県","栃木県","群馬県","埼玉県","千葉県","東京都","神奈川県",
                       "新潟県","富山県","石川県","福井県","山梨県","長野県","岐阜県","静岡県","愛知県",
                       "三重県","滋賀県","京都府","大阪府","兵庫県","奈良県","和歌山県",
                       "鳥取県","島根県","岡山県","広島県","山口県",
                       "徳島県","香川県","愛媛県","高知県",
                       "福岡県","佐賀県","長崎県","熊本県","大分県","宮崎県","鹿児島県",
                       "沖縄県"];
   $.each(prefectures, function(){
       var label = $("<label>");
       var input = "<input type=\"checkbox\">" + this;


       label.addClass("btn btn-primary");

       label.append(input);
       $("#prefectures").append(label)
   });
});
