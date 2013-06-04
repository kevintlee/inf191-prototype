var sys = require("sys"),
	util = require("util"),  
    http = require("http"),  
    url = require("url"),  
    path = require("path"),  
    fs = require("fs"),  
    events = require("events"); 

//Initilize MongoJS connection
var databaseUrl = "mydb"; // "username:password@example.com/mydb"
var tweetCollection = ["user", "tweets"]
var db = require("mongojs").connect(databaseUrl, tweetCollection);


function load_static_file(uri, response) {  
    var filename = path.join(process.cwd(), uri);  
    path.exists(filename, function(exists) {  
        if(!exists) {  
            response.writeHead(404, {"Content-Type": "text/plain"});  
            response.write("404 Not Found\n");  
            response.end();  
            return;  
        }  
  
        fs.readFile(filename, "binary", function(err, file) {  
            if(err) {  
                response.writeHead(500, {"Content-Type": "text/plain"});  
                response.write(err + "\n");  
                response.end();  
                return;  
            }  
  
            response.writeHead(200);  
            response.write(file, "binary");  
            response.end();  
        });  
    });  
}  

//var twitter_client = http.createClient(80, "api.twitter.com");  

var tweet_emitter = new events.EventEmitter();  

  
function get_tweets() {  
    //var request = twitter_client.request("GET", "/1/statuses/public_timeline.json", {"host": "api.twitter.com"});  
  	var request = http.request({
    method:'GET',
    port:80,
    //This one below needs oauth authentication... haven't figured it out yet
    //path:'/1.1/search/tweets.json?q=uci%20ucirvine%20ucirvinhealth&result_type=mixed&count=4',
    path:'/1/statuses/user_timeline.json?include_entities=true&include_rts=true&screen_name=UCIrvineHealth&count=20',
    hostname:'api.twitter.com'
  	});

    request.addListener("response", function(response) {  
        var body = "";  
        response.addListener("data", function(data) {  
            body += data;  

            //Prints JSON Data retrieved from GET request
            // console.log("data " + data);
		    // console.log("body " + body);
        });  
  	
  		

        response.addListener("end", function() {  
            var tweets = JSON.parse(body);  
            if(tweets.length > 0) {  
                tweet_emitter.emit("tweets", tweets);

		var i=0;
		var x = tweets.length;
		while(i<x){
			var json_tweets = 
				"\nTWEETED AT: " + tweets[i].created_at + 
				"\nSCREEN NAME: " + tweets[i].user.name + 
				"\n" + tweets[i].text + 
				"\n=================================================================";

            //Saving data into mydb, db.tweets.find() displays all this data
            db.tweets.save({username: tweets[i].user.name, created: tweets[i].created_at, tweet: tweets[i].text}, function(err, saved) {
              if( err || !saved ) console.log("Tweet not saved");
              else console.log("Tweet saved");
            });

			if(tweets[i].error) {
				json_tweets = "ERROR: " + body;
			}
			util.puts(json_tweets); 
			i++;
		}
	
            }  
        });  
    });  
  
    request.end();  
}  

//Sets time interval of grabbing new tweets
//setInterval(get_tweets, 5000);
setInterval(get_tweets, 8000); 

http.createServer(function(request, response) {  
    var uri = url.parse(request.url).pathname;  
    if(uri === "/stream") {  
  
        var listener = tweet_emitter.addListener("tweets", function(tweets) {  
            response.writeHead(200, { "Content-Type" : "text/plain" });  
            response.write(JSON.stringify(tweets));  
            response.end();  
  
            clearTimeout(timeout);  
        });  
  
        var timeout = setTimeout(function() {  
            response.writeHead(200, { "Content-Type" : "text/plain" });  
            response.write(JSON.stringify([]));  
            response.end();  
  
           
        }, 10000);  
  
    }  
    else {  
        load_static_file(uri, response);  
    }  
}).listen(1337);  	 

sys.puts("Server running at http://localhost:1337/");  