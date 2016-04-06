#DiscoverNow
	A one stop destination where you can find Restaurants to Hospitals, Schools to ATMs, Stores to Shopping Malls, and much more. This web app not only provides basic search results, but also other information such as contact information, website, place ratings,location details, distance etc.
	This application uses the node.js GOOGLE PLACES library for getting nearby places and uses Javascript API for displaying map and location markers.

###Prerequisities

	Node
	Npm
	
### Getting started

    1. Setting up the application

     Enable Google Places API on [Google API Console](https://console.developers.google.com)
		- Create an app
		- Enable the Places Webservice API
		- Create credentials 


    2. Configure the application

     Set environment variables in config.js file
   
		exports.apiKey = process.env.GOOGLE_PLACES_API_KEY || "your google places webservice API Key";
		exports.outputFormat = process.env.GOOGLE_PLACES_OUTPUT_FORMAT || "json";

    3. Running the application 
	
		- Open the cmd prompt inside the application folder and type the command
					$ npm install 
		- Now npm will download and install all the dependencies that are mentioned in package.json file
		- After everything is installed type
		            $ npm start
					
    4. Now your application will start in the default port no : 3000
         	    http://localhost:3000/

# Supported searches

	Hotel,hospital,school,airport,atm,bank,bus_station,cafe,doctor and much more.
	
#Functionality Description
    Functionality List                       Description                           Usage Type
     Autocomplete                  Uses google location Autocomplete              Node Package 
	 Location Service              Uses Reverse geocoding service                 Node Package
	 Places Service                Uses  Google Places search API                 Node Package
	 Place Details                 Uses Google Place Details API                  Node Package and javascript API 
	 Direction service             Uses Google Direction search                   Javascript API
	 Initializing map              Uses Google maps API                           Javascipt API
	 and creating Markers
	 
###Contribution

  Fork it, hack it and send me a pull request
  
###License

Copyright © 2016 Bridgei2i Analytics Pvt Ltd.

This product is licensed under the MIT License (MIT)

