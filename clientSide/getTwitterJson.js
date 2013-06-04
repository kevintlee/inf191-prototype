//var db = require("./db");
// var db = new mongo.Db('mydb', new mongo.Server('localhost', 27017, {}, {}));
// db.open(function() {
// 	//This is my callback function when db.open() returns
// })

$(document).ready(function() {
      $("#getJson").click(function(event){
          $.getJSON('http://search.twitter.com/search.json?q=ucirvine&UCIrvineHealth&rpp=55&callback=?', function(jd) {
             // $('#jsonData').html('<p> id: ' + jd.id + '</p>');
             // $('#jsonData').append('<p> id_str : ' + jd.id_str+ '</p>');
             // $('#jsonData').append('<p> completed_in: ' + jd.completed_in+ '</p>');
             myjson = jd;
             console.log("This is all the JSON Data from Twitter API - As one object");
             console.log(myjson);

			 //var obj = { "p1": "v1", "p2": "v2" };
			console.log("These of all the JSON Data from the Twitter API - As separate print statements");
			for (i in myjson) {
			console.log( i + " : " + myjson[i] + " ");
			}

			for (var i = 0; i < myjson.results.length; i++) { 
				user = myjson.results[i].from_user;
				textPost = myjson.results[i].text;
				createdAt = myjson.results[i].created_at
				userName = myjson.results[i].from_user_name
				id = myjson.results[i].id
				idStr = myjson.results[i].id_str
				geo = myjson.results[i].geo
				if(geo != null){
					latitude = myjson.results[i].geo.coordinates[0];
					longitude = myjson.results[i].geo.coordinates[1];
				}




				$('#jsonData').append('<p> Post#' + i + '</p>');
			    $('#jsonData').append('<p> User: ' + user + '</p>');
			    $('#jsonData').append('<p> User Name: ' + userName + '</p>');
                $('#jsonData').append('<p> Text : ' + textPost + '</p>');
                $('#jsonData').append('<p> Created at: ' + createdAt + '</p>');
                $('#jsonData').append('<p> ID : ' + id + '</p>');
                $('#jsonData').append('<p> ID Str : ' + idStr + '</p>');
                $('#jsonData').append('<p> Geo : ' + geo + '</p>');

                if(geo != null){
					 $('#jsonData').append('<p> Latitude : ' + latitude + '</p>');
                	 $('#jsonData').append('<p> Longitude : ' + longitude + '</p>');
				}

                $('#jsonData').append('-------------------------------------');

			    // console.log(i + " : " + myjson.results[i].from_user);
			    // console.log(i + " : " + myjson.results[i].text);
			    // console.log(i + " : " + myjson.results[i].created_at);
			    // console.log(i + " : " + myjson.results[i].from_user_name);

			    //console.log(user);
			}
          });
  });
});	
