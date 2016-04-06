var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/getNearByLocations', function(req, res, next) {
   "use strict";
    var assert = require("assert");

    var config = require("../config.js");
    var googleGeoLocation = require('geocoder');
    var googlePlaceSearch = require('googleplaces');
    var parameters;
    var latitude;
    var longitude;

   googleGeoLocation.geocode(req.body.searchString, function (error, response) {

      if(response.results == null || response.results == ''){
        res.render('googlePlacesResult', { title: 'Google places Search',data :JSON.stringify('No data'),searchParameters : JSON.stringify(req.body),isFromErrorPage : 1,latitude : 12.9667, longitude : 77.5667});
      }else{
        
         latitude = parseFloat(response.results[0].geometry.location.lat);
         longitude =parseFloat(response.results[0].geometry.location.lng);
         
         
         var googlePlaces = new googlePlaceSearch(config.apiKey, config.outputFormat);  

            parameters = {
               location : [latitude,longitude],
               radius : 800,
               query: req.body.placeType
            };
            googlePlaces.textSearch(parameters, function (error, response) {
                if (error) 
                  res.status(500).render('googlePlacesResult', { title: 'No Result', data : 'No result', latitude : latitude , longitude :longitude ,  searchParameters : JSON.stringify(req.body),isFromErrorPage : 1});
                if(req.body.typeOfRequest != "Result Page"){
                   res.render('googlePlacesResult', { title: 'Google places Search', data :JSON.stringify(response.results), latitude : latitude , longitude :longitude ,  searchParameters : JSON.stringify(req.body),isFromErrorPage : 0});
                }else{
                  res.send({ title: 'Google places Search', data :JSON.stringify(response.results), latitude : latitude , longitude :longitude, searchParameters : JSON.stringify(req.body)});
                }
        
            });
      }
 
    });
   
});

router.post('/getDirection', function(req, res, next) {
 
  console.log(req.body);
  res.render('directionResult',{ title: 'Google direction Search', data :JSON.stringify(req.body)});

});

router.post('/getCurrentLocation', function(req, res, next) {
   "use strict";
    var assert = require("assert");
    var geocoder = require('geocoder');
    
    geocoder.reverseGeocode(req.body.latitude, req.body.longitude, function(err, response) {
      if(err){
          res.send({ title: 'Current Location', data :{'results' : 'No data found'}});
      }else{
        res.send({ title: 'Current Location', data :JSON.stringify(response.results)});
      }
    });

   
});


router.post('/autoComplete', function(req, res, next) {
 
   "use strict";

    var assert = require("assert");

    
    var config = require("../config.js");
    var GoogleLocations = require('google-locations');
 
    var locations = new GoogleLocations(config.apiKey);

    var parameters = {
        input: req.body.searchString
    };

    locations.autocomplete(parameters, function (error, response) {
        if (error) 
           res.send({ title: 'Autocomplete', data :{"description":'No matching results'}});    
        res.send({ title: 'Autocomplete', data :JSON.stringify(response.predictions)});

    });
   

});
//not used because we cant get images directly using this method - alternative javascript API is used
router.post('/getPlaceDetails', function(req, res, next) {

  "use strict";

    var assert = require("assert");
    
    var config = require("../config.js");
    var GoogleLocations = require('google-locations');
 
    var locations = new GoogleLocations(config.apiKey);

    var parameters = {
        placeid : req.body.placeId,
    };

    console.log(parameters);
    locations.details(parameters, function(error, response) {
       if (error) throw error;
            assert.equal(response.status, "OK", "Place autocomplete request response status is OK");
        console.log(response);
        res.send({ title: 'placeDetails', data :JSON.stringify(response.result)});
    });
});

module.exports = router;
