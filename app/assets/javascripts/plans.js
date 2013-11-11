// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

$(function() {

  // add card event
  $('#addplan').submit(function() {
    var postData = { 'name': $('#addplan input[name=keyword]').val() };
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

    addTouringSpot(prefecture);
  });

  $('#hotels-search').submit(function() {
    var postData = { 'name': $('#hotels-search input[name=keyword]').val(), 'authenticity_token': getCSRFtoken() };
    var postUrl  = '/plans/hotels_search.json';

    $('#hotel-card-sortable li').remove();

    jQuery.post(postUrl, postData, apiCallback).fail(failFunc);
    return false;
  });

  function apiCallback(data) {
    $.each(data['Body']['KeywordHotelSearch']['hotel'], function() {
      var li = $('<li>');
      li.addClass('ui-state-hotel');
      //add card-title
      li.append('<span class="title"><a data-toggle="modal"href="#Modal' + this['hotelBasicInfo']['hotelNo'] + '">' + this['hotelBasicInfo']['hotelName'] + '</a></span>');
      li.append('<span style="visibility: hidden;" class="card_type">Hotel</span>');
      li.append('<span style="visibility: hidden;" class="longitude">' + this['hotelBasicInfo']['longitude'] + '</span>');
      li.append('<span style="visibility: hidden;" class="latitude">' + this['hotelBasicInfo']['latitude'] + '</span>');
      //add delete-botton
      li.append('<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>');

      $('#hotel-card-sortable').append(li);

      //modal window
      var dialog = '<div class="modal fade" id="Modal' + this['hotelBasicInfo']['hotelNo'] + '" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">        <div class="modal-dialog">'
      + '<div class="modal-content">'
      + '<div class="modal-header">'
      + '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'
      + '<h4 class="modal-title">' + this['hotelBasicInfo']['hotelName'] + '</h4>'
      + '</div><!-- .model-header -->'
      + '<div class="modal-body">'
      + '<img src="' + this['hotelBasicInfo']['hotelImageUrl'] + '">'
      + '</div><!-- .modal-body -->'
      + '<div class="modal-footer">'
      + '<button type="button" class="btn btn-default" data-dismiss="modal">閉じる</button>'
      + '<a href="' + this['hotelBasicInfo']['hotelInformationUrl'] + '" class="btn btn-primary" target="_blank">予約</button>'
      + '</div><!-- .modal-content -->'
      + '</div><!-- .modal-content -->'
      + '</div><!-- .modal-dialog -->'
      + '</div><!-- .modal fade -->';

    $('#hotel-card-sortable').append(dialog);
    });
    $('#hotels-search input[name=keyword]').val('');
  }

  function addTouringSpot(prefecture) {
    var postData = { 'search_word': prefecture };
    var postUrl  = '/plans/places_search.json';

    jQuery.post(postUrl, postData, touringSpotSearchCallback).fail(failFunc);
  }

  function touringSpotSearchCallback(data) {
    console.log(data);
    $.each(data['main'], function() {
      var li = $('<li>');
      li.addClass('ui-state-default');
      li.attr('name',data['posted_data']);
      //add card-title
      li.append('<span class="title">' + this['name'] + '</span>');
      li.append('<span style="visibility: hidden;" class="card_type">Touring</span>');
      li.append('<span style="visibility: hidden;" class="longitude">' + this['lingitude'] + '</span>');
      li.append('<span style="visibility: hidden;" class="latitude">' + this['latitude'] + '</span>');
      //add delete-botton
      li.append('<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>');

      $('#tourist-card-sortable').append(li);
    });
  }

  function removeTouringSpot(prefecture) {
    $('#tourist-card-sortable > li[name=' + prefecture + ']').remove();
  }

  $('#saveplan').submit(function() {
    var postData   = { 'plan': { 'title': $('input[name=plan-title]').val(), 'description': $('textarea[name=plan-desc]').val(), 'cards': getAllCard(), 'area_tags': getAllAreaTags() }, 'authenticity_token': getCSRFtoken() };
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

  function getAllAreaTags() {
    return $.map($('#area-tags-box > span'), function(val) { return $(val).text(); });
  }

});

//plan-list sort
$(function() {
  $( 'ol.droptrue' ).sortable({
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
