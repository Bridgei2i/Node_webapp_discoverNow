
var mapCenter;
var map;
var infowindow;
var marker;
var service;
var autocomplete;
var markers = [] ;
var imageMap = {};
var reviewsMap = {};
var directionsDisplay;
var directionsService;
var initialSearchString;

function initialize() {

   mapCenter = new google.maps.LatLng(41.85, -87.65);
   
    var mapOptions = {
    zoom: 14,
    center: mapCenter
};
  
  map = new google.maps.Map(document.getElementById('map-canvas'),
    mapOptions);

  directionsDisplay = new google.maps.DirectionsRenderer;
  directionsService = new google.maps.DirectionsService;

  directionsDisplay.setMap(map);
  directionsDisplay.setPanel(document.getElementById('place-details'));

  var control = document.getElementById('floating-panel');
  control.style.display = 'block';
  
  document.getElementById('autocomplete').value = jsonData.startingPosition

  map.controls[google.maps.ControlPosition.TOP_CENTER].push(control);

  var onChangeHandler = function() {
    calculateAndDisplayRoute(directionsService, directionsDisplay);
  };

  document.getElementById('autocomplete').addEventListener('change', onChangeHandler);
  document.getElementById('end').addEventListener('change', onChangeHandler);

  document.getElementById('autocomplete').value = jsonData.startingPosition;
  document.getElementById('end').value = jsonData.destination;
  document.getElementById('placeType').value = jsonData.placeType;

  localStorage.setItem("isFromBackButton" ,"yes");

  calculateAndDisplayRoute(directionsService, directionsDisplay);

   $("#right-panel").slimScroll({
        height: '500px'
    });
}

function goBack(){
    window.history.back();
    //directionResultForm.action = "getNearByLocations";
    //directionResultForm.submit();
}

function calculateAndDisplayRoute(directionsService, directionsDisplay) {
  var start = document.getElementById('autocomplete').value;
  var end = document.getElementById('end').value;
  directionsService.route({
    origin: start,
    destination: end,
    travelMode: google.maps.TravelMode.DRIVING
  }, function(response, status) {
    if (status === google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });
}