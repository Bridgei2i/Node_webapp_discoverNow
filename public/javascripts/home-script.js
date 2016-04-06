
var autocomplete;
var geocoder;
function initialize() {
   
    //geocoder = new google.maps.Geocoder();
    localStorage.setItem("isFromBackButton","No");
    localStorage.setItem("isSearchChanged","No");
    setCurrentLocation();

}

function setPlaceType(placeType){
  document.getElementById('sel1').value = placeType;
}

function getSearchResults(){
  if(document.getElementById('autocomplete').value == ''){
    alert("please enter a location to search");
  }else{
     var internetConnection = checkInternetConnection();
      if(internetConnection){
       searchForm.action = "googlePlacesSearch/getNearByLocations";
       searchForm.submit();
      }else{
        alert("Looks like there is no internet connection");
      }
  }
}

function setCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(setPosition);
    } else {
        alert("Geolocation is not supported by the browser .Please try a manual search");
    }
}

function setPosition(position) {
        $.ajax({
              type : "POST",
              url : "googlePlacesSearch/getCurrentLocation",
              data : {'latitude' : position.coords.latitude, 'longitude' : position.coords.longitude},
              dataType: "text",
              success : function(response) {
                var jsonResponse =JSON.parse(response);
                var jsonData = JSON.parse(jsonResponse.data);
                if (jsonData[1]) {
                  $("#autocomplete").val(jsonData[1].formatted_address);
                 }else{
                   $("#autocomplete").val(jsonData[0].formatted_address);
                 }
              },
              error : function(e) {
                console.log("ERROR: ", e);
              },
              done : function(e) {
                console.log("DONE");
              }
        });
}

function getAutocompleteResult(){

   var searchString = document.getElementById('autocomplete').value;
   var searchSuggestions = [] ;
   if(searchString!=""){
       $.ajax({
              type : "POST",
              url : "googlePlacesSearch/autoComplete",
              data : {'searchString' : searchString },
              dataType: "text",
              success : function(response) {
                var jsonResponse = JSON.parse(response);
                var jsonDataDescription = JSON.parse(jsonResponse.data);
                for(i=0;i<jsonDataDescription.length;i++){
                 searchSuggestions.push(jsonDataDescription[i].description);
                }
                 $("#autocomplete").autocomplete({
                    source:searchSuggestions,
                    selectFirst: true, //here
                    minLength: 0,
                    _resizeMenu: function() {
                      this.menu.element.outerWidth( 200 );
                    }
                });
                $("#autocomplete").attr('autocomplete','on');
                console.log(jsonResponse);
              },
              error : function(e) {
                console.log("ERROR: ", e);
              },
              done : function(e) {
                console.log("DONE");
              }
        });
   }
  
}