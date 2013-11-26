// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

$(function() {
  // [add clicked] or [enter when focus text field of place to go] event
  $('#addplan').submit(function() {
    var postData = { name: $('#addplan input[name=keyword]').val() };
    addCardToPlan(postData);
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
    addContent += '<div class="ui-state-default">';
    addContent += '<span class="title">' + data['name'] + '</span>';
    addContent += '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>';
    addContent += '</div>';//.ui-state-default

    li.append(addContent);
    $('#main-card-sortable').append(li);
    $('#addplan input[name=keyword]').val('');
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
      addContent += '<div class="ui-state-hotel">'
      addContent += '<span class="title"><a>' + name + '</a></span>';
      addContent += '<sapn class="card_type">' + cardType  + '</span>';
      addContent += '<span class="longitude">' + longitude + '</span>';
      addContent += '<span class="latitude">'  + latitude  + '</span>';
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
    Map:     mapCardFunc
  };

  var loopEndCallbacks = {
    Hotel:   hotelLoopEnd,
    Touring: touringLoopEnd,
    Map:     mapLoopEnd
  };

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
    var postUrl  = '/plans/places_search.json';
    jQuery.post(postUrl, postData, apiCallback).fail(failFunc);
  });

  function removeTouringSpot(prefecture) {
    $('#tourist-card-sortable > li[name=' + prefecture + ']').remove();
  }

  // hotel search clicked event
  $('#hotels-search').submit(function() {
    var postData = { name: $('#hotels-search input[name=keyword]').val() };
    var postUrl  = '/plans/hotels_search.json';
    $('#hotel-card-sortable li').remove();
    jQuery.post(postUrl, postData, apiCallback).fail(failFunc);
    return false;
  });

  // map search clicked event
  $('#map-search').submit(function() {
    var postData = { search_word: $('#map-search input[name=keyword]').val() };
    var postUrl  = '/plans/map_search.json';
    $('#map-card-sortable li').remove();
    clearMarkers();
    jQuery.post(postUrl, postData, apiCallback).fail(failFunc);
    return false;
  });

  // Map
  function mapCardFunc(li, metaData, data) {
    $('#map-card-sortable').append(li);
    // put marker
    putMarker(data);
  }

  function mapLoopEnd() {
    $('#map-search input[name=keyword]').val('');
    bindZoomMap();
  }

  function touringCardFunc(li, metaData, data) {
    var searchWord = metaData['search_word'];
    li.attr('name', searchWord);
    $('#tourist-card-sortable').append(li);
  }
  function touringLoopEnd() {
  }

  // Hotel
  function hotelCardFunc(li, metaData, data) {
    $('#hotel-card-sortable').append(li);
    var sub      = 'sub';
    var hotelNo  = data[sub]['number'];
    var imageUrl = data[sub]['image_url'];
    var infoUrl  = data[sub]['info_url'];

    var aSelector = $('li > .title > a');
    aSelector.attr('href','#Modal' + hotelNo);
    aSelector.attr('data-toggle','modal');
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

    $('#hotel-card-sortable').append(dialog);
  }
  function hotelLoopEnd() {
    $('#hotels-search input[name=keyword]').val('');
  }

  // save clicked event
  $('#saveplan').submit(function() {
    var postData   = { plan: { title: $('input[name=plan-title]').val(), description: $('textarea[name=plan-desc]').val(), cards: getAllCard(), area_tags: getAllAreaTags() } };
    var postUrl    = '/plans.json';
    var returnType = 'text';

    jQuery.post(postUrl, postData, saveplanCallback, returnType).fail(failFunc);
    return false;
  });

  // box link
  $('.plans-list > li').bind('click', function() {
    window.location=$(this).find("a").attr("href");
    return false;
  });

  function saveplanCallback(data) {
    location.href = '/';
  }

  var failFunc = function() {
    alert('post failed');
  }

  // return card list from main card list
  function getAllCard() {
    var allCard = new Array();
    var htmlTag = $('#main-card-sortable > li > div');
    var size    = htmlTag.length;
    var keys    = ['title','card_type','longitude','latitude'];
    for(var i = 0; i < size; i++){
      var oneCard = { };
      $.each(keys, function() {
        oneCard[this] = htmlTag.eq(i).children('.' + this).text();
      });
      allCard[i] = oneCard;
    }
    return allCard;
  }

  // return all prefecture array
  function getAllAreaTags() {
    return $.map($('#area-tags-box > span'), function(val) { return $(val).text(); });
  }

  function bindZoomMap() {
    $('#map-card-sortable > .sortable-card >.ui-state-hotel').bind('click', function() {
      var latStr = $(this).children('.latitude').text();
      var lngStr = $(this).children('.longitude').text();
      zoomMap(Number(latStr), Number(lngStr));
    });
  }
});

//plan-list sort
$(function() {
  $('ol.droptrue').sortable({
    connectWith: 'ol',
    placeholder: 'ui-state-highlight'
  });

  $('ol.dropfalse').sortable({
    connectWith: 'ol',
    dropOnEmpty: false
  });

  $('#main-card-sortable, #hotel-card-sortable, #message-card-sortable').disableSelection();
  $('#main-card-sortable').droppable({
    activeClass: 'ui-state-hover',
    hoverClass: 'ui-state-active'
  });
});

$(function() {
  $('#time > .btn').bind('click', function() {
    var timeTxt = $(this).text();
    var li      = $('<li>');
    li.addClass('time-card');
    addContent  = '<hr class="time-border">'
    addContent += '<div class="hour"><span class="title">' + timeTxt + '</span></div>'
    addContent += '<span class="card_type">Time</span>'
    li.append(addContent);
    $('#main-card-sortable').append(li);
  });
});

$(function() {
  $('.nav-tabs > li > a').tooltip();
});
