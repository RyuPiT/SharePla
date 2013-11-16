function initialize(){
  var latlng = new google.maps.LatLng(35.658704,139.745408);
  var opts = {
    zoom: 15,
    center: latlng,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  var map = new google.maps.Map(document.getElementById("map_canvas"), opts);

}
