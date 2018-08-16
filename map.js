var restaurants =[];
var sum=0;
var infoRest =document.getElementById("infoRest").innerHTML="<h1> List of Restaurant</h1>";
var star;
var service;
var newSum=0;
var min=0;
var max=5;
var newRate = {
		      		star:0 ,
		      		comment:'',
		      		name:''
		      	};
var selectRest;
var newMarkerId;
var newMakerPoint;
var map;
var newMakerName;
var newLat;
var newLong;
var min=0;
 var max=5;
markerArray=[];
function initMap(){
	$("#inform").show();
	//create map and marker of where you are
	var x=navigator.geolocation;	
	infoWindow = new google.maps.InfoWindow;
	infoWindowMe = new google.maps.InfoWindow;	
	x.getCurrentPosition(function(position){
		var coords = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
		 map = new google.maps.Map(document.getElementById('map'),{zoom:14,center:coords});
		//create marker
		var marker = new google.maps.Marker({map:map,position:coords});
		infoWindowMe.setPosition(coords);
		infoWindowMe.setContent("You are here!");		 
		infoWindowMe.open(map);
		//event click on map
		google.maps.event.addListener(map, 'click', function (event) {
        		var newCoords = new google.maps.LatLng(event.latLng.lat(),event.latLng.lng());
        		$("#inform").hide();
				newLat=event.latLng.lat();
				newLong=event.latLng.lng();
				var latlng = {lat: parseFloat(newLat), lng: parseFloat(newLong)};

				var geocoder = new google.maps.Geocoder;

				geocoder.geocode({'location': latlng}, function(results, status) {
			    
			    	if (status === google.maps.GeocoderStatus.OK){
			    		newMarkerId=results[0].place_id;
			    	}else{
					document.getElementById("infoRest").innerHTML="Failed to take data";
				}
			      });
				document.getElementById("map").style.opacity = "0.3";
                $('#addRest').show();
            });

		//take restaurant nearby with radius=2km
		var request ={
		location:coords,
		radius:2000,
		type:['restaurant']
		}
		var service = new google.maps.places.PlacesService(map);
		service.nearbySearch(request,addNearbyRest);
		function addNearbyRest(results,status){
		if (status !== 'OK'){
          console.error( "Error: nearbySearch( ) failed." );
        }
		if(status==google.maps.places.PlacesServiceStatus.OK){
			for(i=0; i<results.length;i++){			
				restDetails(results[i],results[i].place_id);
									
			}		
		}else{
			document.getElementById("infoRest").innerHTML="Failed to take data";
		}
	}
		

	},function(){
		$('#map').append('Failed to take location!');
	});
}
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
                              'Error: The Geolocation service failed.' :
                              'Error: Your browser doesn\'t support geolocation.');
        infoWindow.open(map);
      }
function takeSelectedRest(rest){
	return rest;
}
function restDetails(place,id){

	service = new google.maps.places.PlacesService(map);
	service.getDetails({placeId:id}, function(place, status) {
    if(status==google.maps.places.PlacesServiceStatus.OK){
			 //creating restaurant object
			 var restaurant = {
			 	  resId: id,
		          restaurantName: place.name,
		          address: place.formatted_address,
		          lat: place.geometry.location.lat(),
		          long: place.geometry.location.lng(),
		          ratings:[ ]
		      };
		      for(i=0;i<place.reviews.length;i++){
		      	restaurant.ratings[i] = {
		      		star:0,
		      		comment:'',
		      		name:''
		      	};
		      	restaurant.ratings[i].star = place.reviews[i].rating;
		      	restaurant.ratings[i].comment = place.reviews[i].text;
		      	restaurant.ratings[i].name = place.reviews[i].author_name;

		      }
		    
		      restaurants.push(restaurant);	
		      
		     showRest(restaurant.restaurantName,restaurant.resId);
		      
		      

		}
	});
}
function showRest(name,i){	
	var restaurant=getRestaurantById(i);
	var avg=averageRating(restaurant);
	document.getElementById("infoRest").innerHTML+='<div class="restDetails"onclick="review(\''+i+'\')">'+'<h3>'+name+'</h3>Rate:' +avg +'<br>Address:' +restaurant.address +'<br></div>';		
	createRestMarker(restaurant.lat,restaurant.long,restaurant.restaurantName,restaurant.resId);
}
function addMoreRating(){
	restaurant.ratings[i].name=document.getElementById('addAuthor').value;
	restaurant.ratings[i].star=document.getElementById('addRate').value;
	restaurant.ratings[i].comment= document.getElementById('addComment').value;
	
}
function review(id){
	var restaurant = getRestaurantById(id);
	var avg=averageRating(restaurant);
	document.getElementById("infoRest").innerHTML="<div>" + "<img src='https://maps.googleapis.com/maps/api/streetview?location=" + restaurant.lat + "," + restaurant.long  + "&size=456x456&key=AIzaSyBII9s4OSF2dylCLvdCmCp5PpaHVXqUb9I' height='142' width='225'>" + "</div>";
	document.getElementById("infoRest").innerHTML+= '<h1>'+restaurant.restaurantName+'</h1>' + '<br>Address: '+restaurant.address+ '<br>Average: '+avg;
	for(i=0;i<restaurant.ratings.length;i++){
		
		document.getElementById("infoRest").innerHTML+='<div class="ratings">'+ restaurant.ratings[i].star+' stars by '+restaurant.ratings[i].name+':'+'</div>';
		document.getElementById("infoRest").innerHTML+= '<div class="comment">'+restaurant.ratings[i].comment+'</div>';
		$("#addReview").show();	
	}
	
	//selectRest=getRestaurantById(id);
}

function getRestaurantById(id){
	for(i=0;i<restaurants.length;i++){
		if(restaurants[i].resId == id){
			return restaurants[i];
		}
	}
}
function averageRating(a){
	var sum=0;
	for(i=0;i<a.ratings.length;i++){
		sum+=a.ratings[i].star;
	}
	var avg = sum/a.ratings.length;
	return avg;
}
function createRestMarker(lat,long,name,id){
	var coords = new google.maps.LatLng(lat,long);
	var marker = new google.maps.Marker({map:map, position: coords});
	 markerArray.push(marker);
	
	google.maps.event.addListener(marker, 'click', function() {
    	infoWindow.setContent(name);
    infoWindow.open(map,this);
   

    review(id);

    });
}
//Onclick for Search button
function showAllRest(){
	for (var i = 0; i < markerArray.length; i++) {
    markerArray[i].setMap(null);
  }
  
  markerArray=[];
	$("#addReview").hide();
	document.getElementById("infoRest").innerHTML="";	
	var min=document.getElementById("min").value;
	var max=document.getElementById("max").value;

	for(i=0;i<restaurants.length;i++){
		var sum=0;
		for(j=0;j<restaurants[i].ratings.length;j++){
			sum+=restaurants[i].ratings[j].star;
		}
		var avg = sum/restaurants[i].ratings.length;
		if(avg<=max && avg>=min){
			var name = restaurants[i].restaurantName;
			var id=restaurants[i].resId;
			document.getElementById("infoRest").innerHTML+='<div class="restDetails"onclick="review(\''+id+'\')">'+'<h3>'+name+'</h3>Rate:' + avg +'<br>Address:'+restaurants[i].address +'<br></div>';
			createRestMarker(restaurants[i].lat,restaurants[i].long,restaurants[i].restaurantName,restaurants[i].resId);
		}
		
	}
	
}

//Onclick for Add button
 function add(restaurant)
	{
	newRate.name=document.getElementById('addAuthor').value;
	newRate.star=parseInt(document.getElementById('addRate').value);	
	newRate.comment= document.getElementById('addComment').value;	
	document.getElementById("infoRest").innerHTML+='<div class="ratings">'+ newRate.star +' stars by '+newRate.name+':'+'</div>';
	document.getElementById("infoRest").innerHTML+= '<div class="comment">'+newRate.comment+'</div>';
		
	}

//Onclick for Add Restaurant button	
function addRestButton(){
	document.getElementById("map").style.opacity = "1";
	var newRestaurant = {
			 	  resId: '',
		          restaurantName: '',
		          address: '',
		          lat: '',
		          long: '',
		          ratings:[ ]
		      };
		     	newRestaurant.resId=newMarkerId;
		      	newRestaurant.lat=newLat;
		      	newRestaurant.long=newLong;
		      	newRestaurant.restaurantName = document.getElementById('restName').value;
		      	newMakerName=document.getElementById('restName').value;
		       	newRestaurant.address = document.getElementById('restAddress').value;
		       	newRating = {
		      		star:0,
		      		comment:'',
		      		name:''
		      	}; 
		      	newRating.star=document.getElementById("restRate").value;
		      	newRating.comment=document.getElementById("restComment").value;
		      	newRating.name=document.getElementById("restAuthor").value;
		      	newRestaurant.ratings.push(newRating);
		        restaurants.push(newRestaurant);
		        console.log(restaurants);
		        //refresh to display all restaurant again
		        refresh();
		        //erase all value in "add restaurant" form		       				
				erase();	
		       	$("#addRest").hide();
		     
		      console.log(newMarkerId);
		      createRestMarker(newLat,newLong,newRestaurant.restaurantName,newRestaurant.resId);
		      
	
	}




//Onclick for Refresh button
 function refresh(){
 	$("#addReview").hide();
 	
 	document.getElementById("infoRest").innerHTML="";
 	for(i=0;i<restaurants.length;i++){
		var sum=0;
		for(j=0;j<restaurants[i].ratings.length;j++){
			sum+=restaurants[i].ratings[j].star;
		}
		var avg = sum/restaurants[i].ratings.length;
		if(avg<=max && avg>=min){
			var name = restaurants[i].restaurantName;
			var id=restaurants[i].resId;
			document.getElementById("infoRest").innerHTML+='<div class="restDetails"onclick="review(\''+id+'\')">'+'<h3>'+name+'</h3>Rate:' + avg +'<br>Address:'+restaurants[i].address +'<br></div>';
			createRestMarker(restaurants[i].lat,restaurants[i].long,restaurants[i].restaurantName,restaurants[i].resId);
		}
		
	}
 }
 //Onclick for Cancel button
 function cancel(){
 	document.getElementById("map").style.opacity = "1";
 	erase()
 	$("#addRest").hide();
 }
 function erase(){
 	document.getElementById('restName').value = '';
 	document.getElementById('restAddress').value='';
 	document.getElementById('restRate').value='';
 	document.getElementById('restComment').value='';
 	document.getElementById('restAuthor').value='';
 }