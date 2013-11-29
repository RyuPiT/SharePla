var map; // マップ
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

function initialize(){
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
  directionsDisplay.setMap(map);
  var from;
  var to;
  var DirectionsWaypoint = [];
  var request;
  if (cards.length==0){
    return;
  } else if (cards.length == 1){ 
    from = new google.maps.LatLng(Number(cards[0]['latitude']), Number(cards[0]['longitude']));
    to = from;
    request = {
      origin: from,
      destination: to,
      travelMode: google.maps.DirectionsTravelMode.DRIVING
    };
  } else if (cards.length < 11) { // google service is up to 10 Waypoint.
    $.each(cards, function() {
      var position = {
        location: new google.maps.LatLng(Number(this['latitude']), Number(this['longitude'])),
        stopover: false
      };
      DirectionsWaypoint.push(position);
    });

    from = DirectionsWaypoint.shift();
    to = DirectionsWaypoint.pop();
    request = {
      origin: from['location'],
      waypoints: DirectionsWaypoint,
      destination: to['location'],
      travelMode: google.maps.DirectionsTravelMode.DRIVING
    };
  } else {
    alert("Way point is up to 10 positions");
    return;
  }

  directionsService.route(request, function(response, status){
    if(status == google.maps.DirectionsStatus.OK){
      directionsDisplay.setDirections(response);
    }
  });
}
