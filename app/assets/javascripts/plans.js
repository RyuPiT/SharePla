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
    var li = $('<li>');
    li.addClass('ui-state-default');
    //add card-title
    //add delete-function-botton on right side
    li.append('<span class="title">' + data['name'] + '</span>');
    li.append('<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>');

    $('#main-card-sortable').append(li);
    $('#addplan input[name=keyword]').val('');
  }

  // data = plans_controller's @json_data = services/api_service.rb's formated_data
  function apiCallback(data) {
    var cardType = data['meta']['type'];
    $.each(data['cards'], function() {
      var main      = 'main';
      var name      = this[main]['name'];
      var latitude  = this[main]['latitude'];
      var longitude = this[main]['longitude'];

      var hiddenSpan = 'span style="visibility: hidden;"';
      var li = $('<li>');
      li.addClass('ui-state-hotel');
      li.append('<span class="title"><a>' + name + '</a></span>');
      li.append('<' + hiddenSpan + ' class="card_type">' + cardType  + '</span>');
      li.append('<' + hiddenSpan + ' class="longitude">' + longitude + '</span>');
      li.append('<' + hiddenSpan + ' class="latitude">'  + latitude  + '</span>');
      li.append('<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>');
      tabCallback[cardType](li, data['meta'], this);
    });
    loopEndCallback[cardType]();
  }

  var tabCallback = {
    Hotel:   hotelCardFunc,
    Touring: touringCardFunc,
    Map:     mapCardFunc
  }

  var loopEndCallback = {
    Hotel:   hotelLoopEnd,
    Touring: touringLoopEnd,
    Map:     mapLoopEnd
  }

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
    console.log(postData);
    $('#map-card-sortable li').remove();
    jQuery.post(postUrl, postData, apiCallback).fail(failFunc);
    return false;
  });

  // Map
  function mapCardFunc(li, metaData, data) {
    var searchWord = metaData['search_word'];
    $('#map-card-sortable').append(li);
  }
  function mapLoopEnd() {
    $('#map-search input[name=keyword]').val('');
  }

  // Touring 
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
    var dialog = '<div class="modal fade" id="Modal' + hotelNo + '" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">        <div class="modal-dialog">'
      + '<div class="modal-content">'
      + '<div class="modal-header">'
      + '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'
      + '<h4 class="modal-title">' + name + '</h4>'
      + '</div><!-- .model-header -->'
      + '<div class="modal-body">'
      + '<img src="' + imageUrl + '">'
      + '</div><!-- .modal-body -->'
      + '<div class="modal-footer">'
      + '<button type="button" class="btn btn-default" data-dismiss="modal">閉じる</button>'
      + '<a href="' + infoUrl + '" class="btn btn-primary" target="_blank">予約</button>'
      + '</div><!-- .modal-content -->'
      + '</div><!-- .modal-content -->'
      + '</div><!-- .modal-dialog -->'
      + '</div><!-- .modal fade -->';

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

  function saveplanCallback(data) {
    location.href = '/';
  }

  var failFunc = function() {
    alert('post failed');
  }

  // return card list from main card list
  function getAllCard() {
    var allCard = new Array();
    var htmlTag = '#main-card-sortable > li';
    var size    = $(htmlTag).length;
    var keys    = ['title','card_type','longitude','latitude'];
    for(var i = 0; i < size; i++){
      var oneCard = { };
      $.each(keys, function() {
        oneCard[this] = $(htmlTag).eq(i).children('.' + this).text();
      });
      allCard[i] = oneCard;
    }
    return allCard;
  }

  // return all prefecture array
  function getAllAreaTags() {
    return $.map($('#area-tags-box > span'), function(val) { return $(val).text(); });
  }

});

//plan-list sort
$(function() {
  $('ol.droptrue').sortable({
    connectWith: 'ol',
    placeholder: 'ui-state-highlight'
  });

  $( 'ol.dropfalse' ).sortable({
    connectWith: 'ol',
    dropOnEmpty: false
  });

  $( '#main-card-sortable, #hotel-card-sortable, #distination-card-sortable' ).disableSelection();
  $( '#main-card-sortable' ).droppable({
    activeClass: 'ui-state-hover',
    hoverClass: 'ui-state-active',
  });
});
