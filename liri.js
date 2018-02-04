require("dotenv").config();

// Node module imports needed to run the functions
	var fs = require("fs"); //reads and writes files

	var request = require("request");
	var keys = require("./keys.js");

	var twitter = require("twitter");
	var Spotify = require('node-spotify-api');
	var spotify = new Spotify(keys.spotify);

	var liriArgument = process.argv[2];
	var usersChoice = process.argv[3];
	// var twitterUsername = process.argv[3];
	// var movie = process.argv[3];
	
	// var client = new Twitter(keys.twitter);

// ---------------------------------------------------------------------------------------------------------------
// switch/case of possible commands to use for liri app

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
		// var twitterUsername = process.argv[3];
		if(!usersChoice){
			usersChoice = "wzuschlag";
		}
		params = {screen_name: usersChoice};
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

	// Spotify function, uses the Spotify module to call the Spotify api
	function spotifyThisSong(songName) {
		//var songName = process.argv[3];
		if(!usersChoice){
			usersChoice = "Quinn the Eskimo";
		}

		spotify.search({ type: "track", query: usersChoice }, function(err, data) {
			if(!err){
				var songInfo = data.tracks.items;
				for (var i = 0; i < 10; i++) {
					if (songInfo[i] != undefined) {
						var spotifyResults =
						"Artist: " + songInfo[i].artists[0].name + "\r\n" +
						"Song: " + songInfo[i].name + "\r\n" +
						"Album the song is from: " + songInfo[i].album.name + "\r\n" +
						"Preview Url: " + songInfo[i].preview_url + "\r\n" + 
						"------------------------------ " + i + " ------------------------------" + "\r\n";
						console.log(spotifyResults);
						log(spotifyResults); // calling log function
					}
				}
			}	
			else {
				console.log("Error :"+ err);
				return;
			}
		});
	};
	// Movie function, uses the Request module to call the OMDB api
	function movieThis(){
		// var movie = process.argv[3];
		if(!usersChoice){
			usersChoice = "mr nobody";
		}
		console.log(usersChoice);
		//params = movie
		request("http://www.omdbapi.com/?t=" + usersChoice + "&y=&plot=short&r=json&tomatoes=true&apikey=trilogy", function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var movieObject = JSON.parse(body);
				//console.log(movieObject); // Show the text in the terminal
   				var movieResults = 
   				"------------------------------ start ------------------------------\n"+
				 "Title: " + movieObject.Title +"\n"+
				 "Year: " + movieObject.Year +"\n"+
				 "Imdb Rating: " + movieObject.imdbRating +"\n"+
				 "Rotten Tomatoes Rating: " + movieObject.Ratings[1].Value +"\n"+
				// "Rotten Tomatoes URL: " + movieObject.tomatoURL + "\n" +
				 "Country: " + movieObject.Country +"\n"+
				 "Language: " + movieObject.Language +"\n"+
				 "Plot: " + movieObject.Plot +"\n"+
				 "Actors: " + movieObject.Actors +"\n"+				 
				"------------------------------ finish ------------------------------" + "\n";
				console.log(movieResults);				
				log(movieResults); // calling log function

			} else {
				console.log("Error Error :"+ error);
				return;
			}
		});
	};
	// Do What It Says function, uses the reads and writes module to access the random.txt file and do what's written in it
	function doWhatItSays(){
		fs.readFile("random.txt", "utf8", function(error, data){
			if (!error) {
				doWhatItSaysResults = data.split(",");
				console.log(doWhatItSaysResults[0],doWhatItSaysResults[1]);
		
				switch(doWhatItSaysResults[0]) {
					case "my-tweets": myTweets(doWhatItSaysResults[1]); break;
					case "spotify-this-song": spotifyThisSong(doWhatItSaysResults[1]); break;
					case "movie-this": movieThis(doWhatItSaysResults[1]); break;
					// case "do-what-it-says": doWhatItSays(doWhatItSaysResults[1]); break;
					default: console.log("\nCheck that correct spelling and syntax was used in creating the random.txt file : \n");
				};

			} else {
				console.log("Error occurred" + error);
			}
		});
	};
	//Do What It Says function, uses the reads and writes module to access the log.txt file and write everything that returns in terminal in the log.txt file
	function log(logResults) {
	  fs.appendFile("log.txt", logResults, function(error) {
	    if(error) {
	      throw error;
	    }
	  });
	}
