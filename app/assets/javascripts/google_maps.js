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
  map.setZoom(11);
}
