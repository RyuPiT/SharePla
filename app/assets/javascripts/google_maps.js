var map; // マップ
var infowindow; // マーカーの詳細表示

// マップオブジェクトを作成し、マーカーを表示
function initialize(){
  myLatLng = new google.maps.LatLng(35.681382, 139.766084);
  var mapOptions = {
	  center: myLatLng,
	  zoom:11,
	  mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
    
  // ユーザのマーカーアイコンを変更
  var markerImage = new google.maps.MarkerImage(
	  // 画像の場所
	  "http://blog-imgs-44.fc2.com/p/c/r/pcrice/mark2.png",
	  // マーカーのサイズ
	  new google.maps.Size(20, 24),
	  // 画像の基準位置
	  new google.maps.Point(0, 0),
	  // Anchorポイント
	  new google.maps.Point(10, 24)
  );
    
  // 現在地のマーカー表示
  var marker = new google.maps.Marker({
	  map:map,
	  draggable:false,
	  animation: google.maps.Animation.DROP,
	  position: myLatLng,
	  title: "現在地",
	  icon: markerImage
  });
    
  // サークルオプションの設定
  var circleOptions = { 
	  center: myLatLng, 
	  map: map,
	  radius: 10000, 
	  strokeWeight: 3, 
	  strokeColor: "#cd5c5c", 
	  strokeOpacity: 0.5, 
	  fillColor: "#e9967a", 
	  fillOpacity: 0.5 
  }; 
    
  // サークル表示（半径10k）
  var circle = new google.maps.Circle(circleOptions); 
    
  // プレイス検索
  var request = {
	  location: myLatLng,
	  radius: '10000',
	  query:'郵便局'
  };

  infowindow = new google.maps.InfoWindow();
  var service = new google.maps.places.PlacesService(map);
  service.textSearch(request, callback);
}
// Windowがロードされたとき表示させる
google.maps.event.addDomListener(window, 'load', initialize);

// プレイス検索のコールバック関数
function callback(results, status){
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      var place = results[i];
      createMarker(results[i]);
    }
  }
}

// プレイス検索のときに表示するマーカー
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
