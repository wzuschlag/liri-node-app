// Node module imports needed to run the functions
	require("dotenv").config();

	var fs = require("fs"); //read, write & append files
	var inquirer = require("inquirer");

	var request = require("request");
	var keys = require("./keys.js");

	var Twitter = require("twitter");
	var twitter = new Twitter(keys.twitter); //Api keys and pass codes

	var Spotify = require('node-spotify-api');
	var spotify = new Spotify(keys.spotify); //Api keys and pass codes

	var liriArgument = process.argv[2]; //user inputs
	var usersChoice = process.argv[3]; //user inputs

//----------------- user prompt test ----------------------------------
	inquirer.prompt([

	  {
	    type: "list",
	    name: "liriArg",
	    message: "Choose your option",
	    choices: ["my-tweets", "spotify-this-song", "movie-this", "do-what-it-says"]
	  },

	  {
	    type: "input",
	    name: "typeName",
	    message: "Just continue for do-what-it-says or enter your choice of twitter account, Song or Movie"
	  }
	  
	]).then(function(user){
		liriArgument = user.liriArg; //user inputs
	    usersChoice = user.typeName; //user inputs
	    console.log(liriArgument, usersChoice)

	    switch(liriArgument) {
		case "my-tweets": myTweets(); break;
		case "spotify-this-song": spotifyThisSong(); break;
		case "movie-this": movieThis(); break;
		case "do-what-it-says": doWhatItSays(); break;
		// Instructions displayed in terminal to the user
		default: console.log("\nUse one of the following commands after 'node liri.js' : \n");
		};
	});


//------------------end user prompt test-------------------------------

// switch/case of possible commands to use for liri app

	// switch(liriArgument) {
	// 	case "my-tweets": myTweets(); break;
	// 	case "spotify-this-song": spotifyThisSong(); break;
	// 	case "movie-this": movieThis(); break;
	// 	case "do-what-it-says": doWhatItSays(); break;
	// 	// Instructions displayed in terminal to the user
	// 	default: console.log("\nUse one of the following commands after 'node liri.js' : \n",
	// 		"1. my-tweets 'add any twitter account name without quotes'\n",
	// 		"2. spotify-this-song 'add any song name wrap name in quotes'\n",
	// 		"3. movie-this 'add any movie name wrap name in quotes'\n",
	// 		"4. do-what-it-says.\n");
	// };

// Functions
	// Tweet function, uses the Twitter module to call the Twitter api
	function myTweets() {

		if(!usersChoice){
			usersChoice = "Thesimpsons";
		}

		params = {screen_name: usersChoice};
		twitter.get("statuses/user_timeline/", params, function(error, data, response){
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
	function spotifyThisSong() {
		if(!usersChoice){
			usersChoice = "Quinn the Eskimo";
		}
		console.log(usersChoice);
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
		request("http://www.omdbapi.com/?t=" + usersChoice + "&y=&plot=short&r=json&tomatoes=true&apikey=trilogy", function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var movieObject = JSON.parse(body);
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
				"------------------------------ finish ------------------------------\n";
				console.log(movieResults);				
				log(movieResults); // calling log function

			} else {
				console.log("Error Error :"+ error);
				return;
			}
		});
	};
	// Do What It Says function, uses the reads and writes module to access the random.txt file and do what's written in it.
	function doWhatItSays(){
		fs.readFile("random.txt", "utf8", function(error, data){
			if (!error) {
				doWhatItSaysResults = data.split(",");				
				usersChoice = doWhatItSaysResults[1];
				console.log(doWhatItSaysResults[0],doWhatItSaysResults[1]);

				switch(doWhatItSaysResults[0]) {
					case "my-tweets": myTweets(usersChoice); break;
					case "spotify-this-song": spotifyThisSong(usersChoice); break;
					case "movie-this": movieThis(usersChoice); break;
					case "do-what-it-says": doWhatItSays(usersChoice); break;
					default: console.log("\nCheck that correct spelling and syntax was used in creating the random.txt file : \n");
				};

			} else {
				console.log("Error occurred" + error);
			}
		});
	};
	//Uses the append module to access log.txt file and writes/appends everything that returns in terminal window to log.txt file.
	function log(logResults) {
	  fs.appendFile("log.txt", logResults, function(error) {
	    if(error) {
	      throw error;
	    }
	  });
	}
