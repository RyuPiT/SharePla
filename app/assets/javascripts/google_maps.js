var map; // マップ
var routeMap; // マップ
var infowindow; // マーカーの詳細表示
var latlng;
var markerList;
// for route 
var directionsDisplay;
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
  $("#travel-map-tab a").attr('onclick', '');
}

function routeInitialize(){
  directionsDisplay = new google.maps.DirectionsRenderer();
  var myRouteLatLng   = new google.maps.LatLng(35.681382, 139.766084);
  var mapRouteOptions = {
    center:    myRouteLatLng,
    zoom:      5,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  routeMap = new google.maps.Map(document.getElementById("route-map"), mapRouteOptions);
  directionsDisplay.setMap(routeMap);
  $("#route-tab a").attr('onclick', '');
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
  var from;
  var to;
  var request;
  
  var points = $.map(cards, function(data) {
    if ((data['latitude'] != "") && (data['longitude'] != "")){
      return {
        location: new google.maps.LatLng(+data['latitude'], +data['longitude']),
        stopover: true
      };
    }
  });

  var length = points.length;
  if (length == 0){ return; }
  if (length > 10) {
    alert("Way points are up to 10 positions");
    return;
  }

  if (length == 1){
    from = points.shift()
    to = from;
    request = {
      origin:      from['location'],
      destination: to['location'],
      travelMode:  google.maps.DirectionsTravelMode.DRIVING
    };
  } else { // google service is up to 10 Waypoint.
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
    if(status == google.maps.DirectionsStatus.OK){
      // set card title
      var i = 0;
      $.each(response.routes[0].legs, function() {
        while(cards[i].card_type != "Map"){ i++;}
        this.start_address = cards[i].title;
        i++;
      });
      var last = response.routes[0].legs.pop();
      while(cards[i].card_type != "Map"){ i++;}
      last.end_address = cards[i].title;
      response.routes[0].legs.push(last);
      directionsDisplay.setDirections(response);
    }
  });
}

function viewRoute(){
  routeInitialize()
  getRoute(getAllCard('#show-my-plan-cards > li > div'));
}
