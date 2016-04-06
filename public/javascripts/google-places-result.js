  var mapCenter; 
  var map;
  var infowindow;
  var marker;
  var service;
  var autocomplete;
  var markers = [] ;
  var imageMap = {};
  var reviewsMap = {};

 /*------------------Function which tells where to get the data to initialize google maps - uses local storage of browser-------------*/
   function checkInitializationStatus(){
      var isSearchChanged = localStorage.getItem("isSearchChanged");
      if (localStorage.getItem("isFromBackButton")=="yes" && isSearchChanged == "yes"){
         initialSearchParameters = JSON.parse(localStorage.getItem("initialSearchParameters"));
         latitude = localStorage.getItem("latitude");
         longitude = localStorage.getItem("longitude");
         jsonData = JSON.parse(localStorage.getItem("jsonData"));
         initialize();
      }else{
        initialize();
      }
    }

 /*------------------Function which initializes google maps-------------*/
      function initialize() {

          mapCenter = new google.maps.LatLng(latitude,longitude);

          var mapOptions = {
          zoom: 14,
          center: mapCenter
      };

          
          map = new google.maps.Map(document.getElementById('map-canvas'),
          mapOptions);

          service = new google.maps.places.PlacesService(map);

        if(isFromErrorPage==1){
            $('#place-details').html("<div style='margin-left:3%'>No search results. try a different search</div>");
        }else{
              
              for(var i = 0; i < jsonData.length; i++) {
                  createMarker(jsonData[i],i);
              } 
            
        }
         $("#reviewsStack,#imageStack").slimScroll({
                    height: '400px',
                    color: '#ffffff',
                    alwaysVisible: true,
                });
       

          document.getElementById("autocomplete").value = initialSearchParameters.searchString;
         document.getElementById("placeType").value = initialSearchParameters.placeType;

      }

      /*------------- Autocomplete using node api------------------ */

      function getAutocompleteResult(event){
         var searchString = document.getElementById('autocomplete').value;
         var code = (event.keyCode ? event.keyCode : event.which);
         var searchSuggestions = [] ;
         if(code==13){
            if(searchString==""){
                alert('Please enter a location to search');
            }else{
                getNearbyLocations();
            }
         }else{
           if(searchString!=""){
               $.ajax({
                      type : "POST",
                      url : "autoComplete",
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
                            selectFirst : true,
                            select : function(event,ui){
                              document.getElementById('autocomplete').value = ui.item.value;
                              getNearbyLocations();
                            },
                            minLength: 0
                        });
                        $("#autocomplete").attr('autocomplete','on');
                        
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
      }  

      /*--------------Function which gets nearby locations ----------------*/

      function getNearbyLocations(){
         
          var placeName =  document.getElementById('autocomplete').value;
          if(placeName==""){
             alert('Please enter a location to search');
          }else{
              var formData = {
               "searchString": placeName,
                "placeType": $('#placeType').val(),
                "typeOfRequest" : "Result Page"
             };
                $.ajax({
                    type : "POST",
                    url : "getNearByLocations",  
                    data : formData,
                    dataType: "text",
                    success : function(response) {
                      $("#place-details").empty();
                      clearMarkers();
                      var jsonResponse = JSON.parse(response);
                      var jsonData = JSON.parse(jsonResponse.data);
              
                      localStorage.setItem("initialSearchParameters" ,jsonResponse.searchParameters);
                      localStorage.setItem("latitude" ,JSON.parse(jsonResponse.latitude));
                      localStorage.setItem("longitude" ,JSON.parse(jsonResponse.longitude));
                      localStorage.setItem("jsonData",JSON.stringify(jsonData));
                      localStorage.setItem("isSearchChanged","yes");

                      for(var i=0; i<jsonData.length;i++){
                        if(i==0){

                           map.setOptions({
                            center:jsonData[i].geometry.location,
                            zoom: 14
                           });
                          createMarker(jsonData[i],i);
                        }else{
                          createMarker(jsonData[i],i);
                        }
                        
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
      }

      /*--------------Function which calls google direction service----------------*/

      function getDirection(destination){
         document.getElementById('startingPosition').value = document.getElementById('autocomplete').value;
         document.getElementById('destination').value = destination;
         directionForm.action = "getDirection";
         directionForm.submit();

      }

       /*--------------Function which gets details of the locations ----------------*/

      function getPlaceDetails(searchKey,placeName){
          var tempImageArray = [];
          var tempReviewArray = [];
          tempImageArray = imageMap[searchKey];
          tempReviewArray = reviewsMap[searchKey];
          var modalBody = "";
          var imageStack="";
          var modalReviewsStack="";

          if(tempImageArray == null || tempImageArray == 'undefined'){
            modalBody +="<div class='item active'><img src='/images/noImageAvailable.gif'/></div>";
            imageStack+="<div><p>No Images to display</p></div>"
          }else{
             for(var i=0 ;i<tempImageArray.length;i++){
             if(i==0){
               modalBody +="<div id='defaultImage' class='item active'><img src='"+tempImageArray[i]+"'/></div>";
               imageStack+="<img src='"+tempImageArray[i]+"' style='width:100px;height:80px;margin-bottom:10px'/><br/>";
             }else{
               modalBody +="<div class='item'><img src='"+tempImageArray[i]+"'/></div>";
               imageStack+="<img src='"+tempImageArray[i]+"' onClick=setDefaultImage('"+tempImageArray[i]+"'); style='width:100px;height:80px;margin-bottom:10px;cursor:pointer'/><br/>";
             }
            
            }
          }
         
         if(tempReviewArray == null || tempReviewArray == 'undefined'){
            modalReviewsStack+="<div><p>There are no reviews</p></div>"
          }else{
             
              for(var i=0 ;i<tempReviewArray.length;i++){
                var reviewDetails = [];
                reviewDetails = tempReviewArray[i].split("@@");
                modalReviewsStack+="<div class='well' style='width:270px'><p>Name:&nbsp; "+reviewDetails[0]+"</p><p>Rating:&nbsp;"+reviewDetails[2]+"</p><p>Review:<br/>"+reviewDetails[1]+"</p></div><br/>";
              }
          }
          $('#modalBody').html(modalBody);
          $('#imageStack').html(imageStack);
          $('#reviewsStack').html(modalReviewsStack);
          $('#modalTitle').html(placeName);
          $('#myModal').modal('show');

        
      }

      function setDefaultImage(imageSrc){
        $('#defaultImage').html("<img src='"+imageSrc+"'/>");
      }
           
      function clearMarkers(){
        for(var i=0;i<markers.length;i++){
             markers[i].setMap(null);
        }
      }

      /*---------------Function which creates new markers in the map----------------*/
      function createMarker(placeDetails,iteration) {

       /* uses google places javascript places API instead of node places API to avoid unnecessary function calling to fetch images*/
        service.getDetails({
              placeId: placeDetails.place_id 
          }, function(place,status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                var marker;
                if(iteration==0){
                    marker= new google.maps.Marker({
                    position: place.geometry.location,
                    map: map,
                    icon : "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                    title: 'You are here'
                 });
                }else{
                   marker = new google.maps.Marker({
                        map: map,
                        position:  place.geometry.location,
                        draggable: false,
                        animation: google.maps.Animation.DROP
                       });
                }
                  
                markers.push(marker);
                 infowindow = new google.maps.InfoWindow({
                    maxWidth: 300
                 });
                    
                       var searchString = place.name+",\t"+place.formatted_address;
                       var rating = "No Rating";
                       var phoneNumber = "No number";
                       var imageUrl = '/images/noImageAvailable.gif';
                       var website = "Website not available";
                       if(place.rating){
                          rating = place.rating ;
                       }
                       if(place.formatted_phone_number){
                        phoneNumber = place.formatted_phone_number;
                       }
                       if(place.website){
                        website = place.website;
                       }

                     if(place.photos){
                        var imageArray = [];
                        for(var i=0;i<place.photos.length;i++){
                          imageArray[i] = place.photos[i].getUrl({'maxWidth': 1400, 'maxHeight': 400});
                        }
                        imageMap[iteration] = imageArray;
                        imageUrl =  place.photos[0].getUrl({'maxWidth': 150, 'maxHeight': 70});
                      } 
                       
                      $("#place-details").append("<div  class='box-content' ><div class='row' >"
                      +"<img src="+imageUrl+" onClick='getPlaceDetails("+iteration+",\""+place.name.replace(/'/,"&apos;")+"\")' class='image-style'><br/><div class='place-description'><b><p  class='place-name'>"+place.name+"</b><br/>Rating : "+rating+"<br/></p><p class='address-field'>"+place.formatted_address+",<br/>Ph no: "+phoneNumber+".<br/>"
                      +"<a href='"+website+"' target='_blank'><i class='fa fa-globe fa-2x'></i></a>&nbsp; <a href='#' onClick='getPlaceDetails("+iteration+",\""+place.name.replace(/'/,"&apos;")+"\")' ><i class='fa fa-info-circle fa-2x'></i> </a> &nbsp;"
                      +"<a href='#'  onclick='getDirection(\""+searchString.replace(/'/g,"&apos;")+"\");' ><i class='fa fa-arrow-circle-o-right fa-2x'></i> </p>"
                      +"</a></div></div></div><br/>").show('slow');
        

                      if(place.reviews){
                        var reviewArray = [];
                        for(var i=0;i<place.reviews.length;i++){
                          reviewArray[i] = place.reviews[i].author_name+"@@"+ place.reviews[i].text +"@@"+place.reviews[i].rating;
                        }
                        reviewsMap[iteration] = reviewArray;
                      }
              
                   google.maps.event.addListener(marker, 'click', function() {
             
                    if(!place.photos){
                       infowindow.setContent("<div style='color:#333'><strong>" + place.name + "</strong><br/>" +
                        "<div class='col-md-5'><img style='width:80%' src='/images/noImageAvailable.gif'></div><div class='col-md-7'>"+
                        place.formatted_address + "<br/>Ph no:"+phoneNumber+"</div><br/><a href='"+website+"'>"+website+"</a></div>");
                    }
                   else{
                      var imageUrl =  place.photos[0].getUrl({'maxWidth': 150, 'maxHeight': 100});
                      infowindow.setContent("<div style='color:#333'><strong>" + place.name + "</strong><br/>" +
                        "<div class='col-md-4'><img style='width:80px;height:80px' src=" +  imageUrl + "></div><div class='col-md-8'>"+
                        place.formatted_address + "<br/>Ph no:"+phoneNumber+"</div><br/><a href='"+website+"' target='_blank'>"+website+"</a></div>");
                   }
                infowindow.open(map, this);
              });
            } 
        });
      }
