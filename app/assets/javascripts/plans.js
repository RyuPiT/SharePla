// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

$(function() {
  // [add clicked] or [enter when focus text field of place to go] event
  $('#create-message-card').submit(function() {
    var postData = { name: $('#create-message-card input[name=keyword]').val() };
    addCardToPlan(postData);
    $('.plan-detail').scrollTop($('.plan-detail')[0].scrollHeight);
    return false;
  });
  
  function addCardToPlan(data) {
    var li = $("<li>").hide().animate({ pacity:1 }, function() {
      $(this).show("slide");
    });
    li.addClass('sortable-card');
    //add card-title
    //add delete-function-botton on right side
    var addContent = '';
    addContent += '<div class="default-card">';
    addContent += '<div class="title">' + data['name'] + '</div>';
    addContent += '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>';
    addContent += '</div>';//.default-card

    li.append(addContent);
    $('#new-my-plan-cards').append(li);
    $('#create-message-card input[name=keyword]').val('');
    return true;
  }

  // data = plans_controller's @json_data = services/api_service.rb's formated_data
  function apiCallback(data) {
    var cardType   = data['meta']['type'];
    var main       = 'main';

    $.each(data['cards'], function() {
      var name      = this[main]['name'];
      var latitude  = this[main]['latitude'];
      var longitude = this[main]['longitude'];

      var li        = $('<li>')
      li.hide().animate({ pacity:1 }, function() {
        $(this).show("slide");
      });
      li.addClass('sortable-card'); // TODO: #67

      var addContent = '';
      addContent += '<div class="hotel-card">'
      addContent += '<div class="card_type">' + cardType  + '</div>';
      addContent += '<div class="longitude">' + longitude + '</div>';
      addContent += '<div class="latitude">'  + latitude  + '</div>';
      addContent += '<div class="title"><a>' + name + '</a></div>';
      addContent += '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>';
      addContent += '</div>'

      li.append(addContent);
      tabCallbacks[cardType](li, data['meta'], this);
    });
    loopEndCallbacks[cardType]();
  }

  var tabCallbacks = {
    Hotel:   hotelCardFunc,
    Touring: touringCardFunc,
    Map:     mapCardFunc,
    mark:    markCardFunc
  };

  var loopEndCallbacks = {
    Hotel:   hotelLoopEnd,
    Touring: touringLoopEnd,
    Map:     mapLoopEnd,
    mark:    markEnd
  };

  //hidden-buton
  var flag = 0;
  $('#hidden-btn').bind('click',function() {
    if ( (flag%2) == 0) {
      $("#save-plan > textarea").hide();
      $(this).attr('id', 'show-btn');
      $('.contents').css('padding-top','130px');
    }else{
      $("#save-plan > textarea").show();
      $(this).attr('id', 'hidden-btn');
      $('.contents').css('padding-top','200px');
    }
    flag++;
  });

  // area tag clicked event
  $('#prefectures > .area-division > label').bind('click',function() {
    var rawText    = $(this).text();
    var prefecture = $.trim(rawText);
    if ($(this).hasClass('active')) {
      $('#area-tags-box > span[name=' + prefecture + ']').remove();
      removeTouringSpot(prefecture);
      return;
    }
    var span = $('<span name=' + prefecture + '>');
    span.hide().animate({ pacity:1 }, function() {
        $(this).show("highlight");
      });

    span.append(prefecture);
    span.addClass('label label-default');
    $('#area-tags-box').append(span);

    var postData = { search_word: prefecture };
    var postUrl  = '/searches/place.json';
    jQuery.post(postUrl, postData, apiCallback).fail(failFunc);
  });

  function removeTouringSpot(prefecture) {
    $('#tourist-search-result > li[name=' + prefecture + ']').remove();
  }

  // hotel search clicked event
  $('#hotel-search').submit(function() {
    var postData = { name: $('#hotel-search input[name=keyword]').val() };
    var postUrl  = '/searches/hotel.json';
    $('#hotel-search-result li').remove();
    jQuery.post(postUrl, postData, apiCallback).fail(failFunc);
    return false;
  });

  // map search clicked event
  $('#map-search').submit(function() {
    var postData = { search_word: $('#map-search input[name=keyword]').val() };
    var postUrl  = '/searches/map.json';
    $('#map-search-result li').remove();
    clearMarkers();
    clearOwnMarker();
    jQuery.post(postUrl, postData, apiCallback).fail(failFunc);
    return false;
  });

  // create own card                                                                                                                                
  $('#create-mark').bind('click', function() {
    $('#map-pin-result li').remove();
    if (ownMarker == undefined){
      alert('地図にマークがありません');
      return;
    }
    var meta = {
      name : document.mark.keyword.value,
      type : 'mark'
    };
    var main = {
      name : document.mark.keyword.value,
      latitude: ownMarker.position.nb,
      longitude : ownMarker.position.ob
    };
    var card = {main: main};
    var cards = new Array();
    cards.push(card);
　　var data = {meta : meta, cards: cards};
    apiCallback(data);
  });

  // Map
  function mapCardFunc(li, metaData, data) {
    $('#map-search-result').append(li);
    // put marker
    putMarker(data);
  }

  function markCardFunc(li, metaData, data) {
    $('#map-pin-result').append(li);
  }

  function mapLoopEnd() {
    $('#map-search input[name=keyword]').val('');
    bindZoomMap();
  }

  function markEnd() {
    document.mark.keyword.value = '';
    bindZoomMap();
  }

  function touringCardFunc(li, metaData, data) {
    var searchWord = metaData['search_word'];
    li.attr('name', searchWord);
    $('#tourist-search-result').append(li);
  }
  function touringLoopEnd() {
  }

  // Hotel
  function hotelCardFunc(li, metaData, data) {
    $('#hotel-search-result').append(li);
    var sub      = 'sub';
    var hotelNo  = data[sub]['number'];
    var imageUrl = data[sub]['image_url'];
    var infoUrl  = data[sub]['info_url'];

    li.attr('href','#Modal' + hotelNo);
    li.attr('data-toggle','modal');
    //modal window
    var dialog = '';
    dialog += '<div class="modal fade" id="Modal' + hotelNo + '" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">';
    dialog += '<div class="modal-dialog">';
    dialog += '<div class="modal-content">';
    dialog += '<div class="modal-header">';
    dialog += '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>';
    dialog += '<h4 class="modal-title">' + name + '</h4>';
    dialog += '</div>';// .model-header
    dialog += '<div class="modal-body">';
    dialog += '<img src="' + imageUrl + '" class="img-rounded" height="200px">';
    dialog += '</div>';// .modal-body
    dialog += '<div class="modal-footer">';
    dialog += '<button type="button" class="btn btn-default" data-dismiss="modal">閉じる</button>';
    dialog += '<a href="' + infoUrl + '" class="btn btn-primary" target="_blank">予約</button>';
    dialog += '</div>';// .modal-content
    dialog += '</div>';// .modal-content
    dialog += '</div>';// .modal-dialog
    dialog += '</div>';// .modal fade

    $('#hotel-search-result').append(dialog);
  }
  function hotelLoopEnd() {
    $('#hotel-search input[name=keyword]').val('');
  }

  // save clicked event
  $('#save-plan').submit(function() {
    var allCard = getAllCard('#new-my-plan-cards > li > div');
    if(!allCard) {
      alert('カードを追加してください');
      return false;
    }

    var postData   = { plan: { title: $('input[name=plan-title]').val(), description: $('textarea[name=plan-desc]').val(), cards: allCard, area_tags: getAllAreaTags() } };
    var postUrl    = '/plans.json';
    var returnType = 'text';

    jQuery.post(postUrl, postData, saveplanCallback, returnType).fail(failFunc);
    return false;
  });

  // box link
  $('.plans-list > li > .plan-info').bind('click', function() {
    window.location=$(this).find("a").attr("href");
    return false;
  });

  function saveplanCallback(data) {
    location.href = '/plans';
  }
  var failFunc = function() {
    alert('post failed');
  }

  // return all prefecture array
  function getAllAreaTags() {
    return $.map($('#area-tags-box > span'), function(val) { return $(val).text(); });
  }

  function bindZoomMap() {
    $('#map-search-result > .sortable-card >.hotel-card').bind('click', function() {
      var latlng = new google.maps.LatLng(
                     Number($(this).children('.latitude').text()),
                     Number($(this).children('.longitude').text())
                   );
      zoomMap("map", latlng);
    });

  }
  // duplicate code
  $('#show-my-plan-cards > .sortable-card >.hotel-card').bind('click', function() {
    var latlng = new google.maps.LatLng(
                   Number($(this).children('.latitude').text()),
                   Number($(this).children('.longitude').text())
                 );
    zoomMap("routeMap", latlng);
  });

  // route viewer 
  $('#route-view-btn').bind('click', function() {
    mapInitialize();
    clearMarkers();
    clearOwnMarker();
    var allCard = getAllCard('#new-my-plan-cards > li > div');
    if(!allCard) {
      alert('カードを追加してください');
      return false;
    }
    getRoute(allCard);
  });

  $('#card-search a[data-toggle="tab"]').one('shown.bs.tab', function(data) {
    var tabName = data.target.hash;
    switch(tabName){
    case '#map':
      google.maps.event.trigger(map, 'resize');
      return;
    case '#route':
      google.maps.event.trigger(routeMap, 'resize');
      return;
    default:
      return;
    }
  });

});

//new-plan-page sort
$(function() {
  $('ol.droptrue').sortable({
    connectWith: 'ol',
    placeholder: 'ui-state-highlight'
  });

  $('ol.dropfalse').sortable({
    connectWith: 'ol',
    dropOnEmpty: false
  });

  $('#new-my-plan-cards, #hotel-search-result, #example-message-card').disableSelection();
  $('#new-my-plan-cards').droppable({
    activeClass: 'ui-state-hover',
    hoverClass: 'ui-state-active'
  });
});

$(function() {
  $('#time > .btn').bind('click', function() {
    var rawTxt  = $(this).text();
    var timeTxt = $.trim(rawTxt);
    var li      = $('<li>');
    li.addClass('time-card');
    addContent  = '<hr class="time-border">';
    addContent += '<div class="hour">';
    addContent += '<div class="title">' + timeTxt + '</div>';
    addContent += '<div class="card_type">Time</div>';
    addContent += '</div>';
    addContent += '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>';
    li.append(addContent);
    $('#new-my-plan-cards').append(li);
  });
});

$(function() {
  $('.nav-tabs > li > a').tooltip();
  $('.comment-cont').tooltip();
});

$(function() {
  $('#map-block').resizable({
    handles: 'se',
    maxHeight: 470,
    maxWidth: 455,
    minHeight: 100,
    minWidth: 455
  });
});

// return card list from main card list
function getAllCard(position_word) {
  var allCard = new Array();
  var htmlTag = $(position_word);
  var size    = htmlTag.length;
  var keys    = ['title','card_type','longitude','latitude'];

  if(size == 0){
    return false;
  }

  for(var i = 0; i < size; i++){
    var oneCard = { };
    $.each(keys, function() {
      oneCard[this] = $.trim(htmlTag.eq(i).children('.' + this).text());
    });
    allCard[i] = oneCard;
  }
  return allCard;
}
