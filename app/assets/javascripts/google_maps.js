var map; // マップ
var routeMap; // マップ
var infowindow; // マーカーの詳細表示
var myLatLng;
var latlng;
var lat;
var lng;
var marker_list;

var tokyoPosition = {
  latitude:  35.681382,
  longitude: 139.766084
};

function map_initialize(){
  if (typeof lat == 'undefined'){
    lat = tokyoPosition['latitude'];
    lng = tokyoPosition['longitude'];
    markerList = new google.maps.MVCArray();
  }
  myLatLng = new google.maps.LatLng(lat, lng);
  var mapOptions = {
    center:    myLatLng,
    zoom:      5,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
  $("#travel-map-tab a").attr('onclick','');
}

function route_initialize(){
  var myRouteLatLng = new google.maps.LatLng(35.681382, 139.766084);
  var mapRouteOptions = {
    center:    myRouteLatLng,
    zoom:      5,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  routeMap = new google.maps.Map(document.getElementById("route-map"), mapRouteOptions);
  $("#route-tab a").attr('onclick','');
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

function clearMarkers() {
  markerList.forEach(function(mkr, idx){
    mkr.setMap(null);
  });
  markerList = new google.maps.MVCArray();
}

function zoomMap(latitude, longitude) {
  var latlng = new google.maps.LatLng(latitude, longitude);
  map.setCenter(latlng);
  map.setZoom(15);
}

function getRoute(cards){
  clearMarkers();
  var directionsDisplay = new google.maps.DirectionsRenderer();
  var directionsService = new google.maps.DirectionsService();
  directionsDisplay.setMap(routeMap);
  var from;
  var to;
  var points = [];
  var request;

  $.each(cards, function() {
    if ((this['latitude'] != "") && (this['longitude']  !="")){
      var position = {
        location: new google.maps.LatLng(Number(this['latitude']), Number(this['longitude'])),
        stopover: true
      };
      points.push(position);
    }
  });

  var length = points.length;
  if (length == 0){
    return;
  } else if (length == 1){
    from = points.shift()
    to = from;
    request = {
      origin: from,
      destination: to,
      travelMode: google.maps.DirectionsTravelMode.DRIVING
    };
  } else if (length < 11){ // google service is up to 10 Waypoint.
    from = points.shift();
    to = points.pop();
    request = {
      origin: from['location'],
      waypoints: points,
      destination: to['location'],
      travelMode: google.maps.DirectionsTravelMode.DRIVING
    };
  } else {
    alert("Way points are up to 10 positions");
    return;
  }

  directionsService.route(request, function(response, status){
    if(status == google.maps.DirectionsStatus.OK){
      directionsDisplay.setDirections(response);
    }
  });
}
