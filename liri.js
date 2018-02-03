require("dotenv").config();

// Node module imports needed to run the functions
	var fs = require("fs"); //reads and writes files

	var request = require("request");
	var keys = require("./keys.js");

	var twitter = require("twitter");
	var Spotify = require('node-spotify-api');
	var spotify = new Spotify(keys.spotify);

	var liriArgument = process.argv[2];
	
	// var client = new Twitter(keys.twitter);

// ---------------------------------------------------------------------------------------------------------------
// switch/case of possible commands to use for liri app
// * `my-tweets`
// * `spotify-this-song`
// * `movie-this`
// * `do-what-it-says`

	switch(liriArgument) {
		case "my-tweets": myTweets(); break;
		case "spotify-this-song": spotifyThisSong(); break;
		case "movie-this": movieThis(); break;
		case "do-what-it-says": doWhatItSays(); break;
		// Instructions displayed in terminal to the user
		default: console.log("\nUse one of the following commands after 'node liri.js' : \n",
			"1. my-tweets 'add any twitter account name without quotes'\n",
			"2. spotify-this-song 'add any song name wrap name in quotes'\n",
			"3. movie-this 'add any movie name wrap name in quotes'\n",
			"4. do-what-it-says.\n");
	};
// ---------------------------------------------------------------------------------------------------------------
// Functions
	// Tweet function, uses the Twitter module to call the Twitter api
	function myTweets() {
		var client = new twitter({
			consumer_key: keys.twitter.consumer_key,
			consumer_secret: keys.twitter.consumer_secret,
			access_token_key: keys.twitter.access_token_key,
			access_token_secret: keys.twitter.access_token_secret, 
		});
		var twitterUsername = process.argv[3];
		if(!twitterUsername){
			twitterUsername = "wzuschlag";
		}
		params = {screen_name: twitterUsername};
		client.get("statuses/user_timeline/", params, function(error, data, response){
			if (!error) {
				for(var i = 0; i < data.length; i++) {
					//console.log(response); // Show the full response in the terminal
					var twitterResults = 
					"@" + data[i].user.screen_name + ": " + 
					data[i].text + "\n" + 
					data[i].created_at + "\n" + 
					"------------------------------ " + i + " ------------------------------\n";
					console.log(twitterResults);
					log(twitterResults); // calling log function
				}
			}  
			else {
				console.log("Error :"+ error);
				return;
			}
		});
	};
	function log(logResults) {
	  fs.appendFile("log.txt", logResults, (error) => {
	    if(error) {
	      throw error;
	    }
	  });
	}
