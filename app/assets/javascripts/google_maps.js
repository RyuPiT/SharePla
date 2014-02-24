var map; // マップ
var infowindow; // マーカーの詳細表示
var markerList;
var ownMarker;
// for route
var directionsDisplayArray = new Array();
var directionsService = new google.maps.DirectionsService();

var tokyoPosition = {
  latitude:  35.681382,
  longitude: 139.766084
};

function mapInitialize(){
  var lat;
  var lng;

  if (typeof lat == 'undefined'){
    lat        = tokyoPosition['latitude'];
    lng        = tokyoPosition['longitude'];
    markerList = new google.maps.MVCArray();
  }

  myLatLng = new google.maps.LatLng(lat, lng);
  var mapOptions = {
    center:    myLatLng,
    zoom:      5,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

  // for marker
  google.maps.event.addListener(map, 'rightclick', putOwnMarker);

  $("#travel-map-tab a").attr('onclick', '');
}

function routeInitialize(){
  var directionsDisplay = new google.maps.DirectionsRenderer();
  var myRouteLatLng   = new google.maps.LatLng(35.681382, 139.766084);
  markerList = new google.maps.MVCArray();
  var mapRouteOptions = {
    center:    myRouteLatLng,
    zoom:      5,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  map = new google.maps.Map(document.getElementById("route-map"), mapRouteOptions);
  directionsDisplay.setMap(map);

}

function putOwnMarker(event) {
  clearRouteLine();
  clearMarkers();
  clearOwnMarker();
  ownMarker = new google.maps.Marker({
    position: new google.maps.LatLng(event.latLng.lat(), event.latLng.lng()),
  });
  ownMarker.setMap(map);
}

function putMarker(data) {
  var main      = 'main';
  var latitude  = data[main]['latitude'];
  var longitude = data[main]['longitude'];
  var name      = data[main]['name'];
  var latlng = new google.maps.LatLng(latitude, longitude);
  var marker = new google.maps.Marker({
    position: latlng,
    map:      map
  });
  markerList.push(marker);

  // マーカーをクリックするとタイトル表示
  var infoWindow = new google.maps.InfoWindow();
  google.maps.event.addListener(marker, 'click', function() {
    infoWindow.setContent(name);
    infoWindow.open(map, this);
  });
}

function clearRouteLine(){
  var length = directionsDisplayArray.length;
  for (var i=0;i<length;i++){
    var directionsDisplay = directionsDisplayArray.pop();
    directionsDisplay.setMap(null);
  }
}

function clearOwnMarker(){
  if (ownMarker !=undefined){
    ownMarker.setMap(null);
  }
}

function clearMarkers() {
  markerList.forEach(function(mkr, idx){
    mkr.setMap(null);
  });
  markerList = new google.maps.MVCArray();
}


function zoomMap(latlng){
  map.setCenter(latlng);
  map.setZoom(15);
}

function getRoute(cards){
  var from;
  var to;
  var request;
  var names = new Array();
  var points = new Array();

  $.map(cards, function(data) {
    if ((data['latitude'] != "") && (data['longitude'] != "")){
      names.push(data['title']);
      points.push({
        location: new google.maps.LatLng(+data['latitude'], +data['longitude']),
        stopover: true
      });
    }
  });

  var length = points.length;
  if (length == 0){ return; }
  if (length == 1){
    from = points.shift()
    to = from;
    request = {
      origin:      from['location'],
      destination: to['location'],
      travelMode:  google.maps.DirectionsTravelMode.DRIVING
    };
  } else if (length > 10){
    for (var i=0; i<length-1;i++){
      calcRoute(points[i].location,points[i+1].location);
    }
    var i=0;
    $.each(cards, function(){
      if ((cards[i]['latitude'] != "") && (cards[i]['longitude'] != "")){
        putMarker({main: cards[i]});
      }
      i++;
    });
    return;
  } else { // google route service is up to 10 Waypoint.
    from = points.shift();
    to = points.pop();
    request = {
      origin:      from['location'],
      waypoints:   points,
      destination: to['location'],
      travelMode:  google.maps.DirectionsTravelMode.DRIVING
    };
  }

  directionsService.route(request, function(response, status){
    var directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setMap(map)

    if(status == google.maps.DirectionsStatus.OK){
      // set card title
      var i = 0;
      $.each(response.routes[0].legs, function(){
        this.start_address = names[i];
        this.end_address = names[i+1];
        i++;
      });
      directionsDisplay.setDirections(response);
    }
  });
  directionsDisplayArray.push(directionsDisplay);
}

function viewRoute(){
  routeInitialize()
  getRoute(getAllCard('#show-my-plan-cards > li > div'));
}

function calcRoute(start, end){
  var directionsDisplay = new google.maps.DirectionsRenderer();
  directionsDisplay.setMap(map);
  directionsDisplay.setOptions({
    suppressMarkers: true
  });

  var request = {
    origin: start,
    destination: end,
    optimizeWaypoints: true,
    travelMode: google.maps.DirectionsTravelMode.DRIVING
  };
  directionsService.route(request, function(response, status){
    if (status == google.maps.DirectionsStatus.OK){
      directionsDisplay.setDirections(response);
    }
  });
  directionsDisplayArray.push(directionsDisplay);
}
