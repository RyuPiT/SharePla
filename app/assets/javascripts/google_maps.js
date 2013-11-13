var map;
var service;
var infowindow;

function initialize() {
  var pyrmont = new google.maps.LatLng(35.689487,139.691706);

  map = new google.maps.Map(document.getElementById('map'), {
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    center: pyrmont,
      zoom: 15
	});
    
  var request = {
    location: pyrmont,
	  radius: '500',
    types: ['store']
  };

  service = new google.maps.places.PlacesService(map);
  service.search(request, callback);
}

function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
	  for (var i = 0; i < results.length; i++) {
      var place = results[i];
        createMarker(results[i]);
	    }
  }
}


function createMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
        });

    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(place.name);
        infowindow.open(map, this);
        });
}
