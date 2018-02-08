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

	//var liriArgument = process.argv[2]; //user inputs
	//var usersChoice = process.argv[3]; //user inputs

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
	    message: "If choice was Twitter, Spotify or Movies.  Please enter a selection to search or 'enter' for default option.\n" +
	    		 "for do-what-it-says just hit 'enter'"
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

	// Tweet function, uses the Twitter module to call the Twitter api
	function myTweets() {

		if(!usersChoice){
			usersChoice = "Thesimpsons";
		}

		params = {screen_name: usersChoice};
		twitter.get("statuses/user_timeline/", params, function(error, data, response){
			if (!error) {
				for(var i = 0; i < data.length; i++) {
					var twitterResults = 
					"------------------------------ " + i + " ------------------------------\n" +
					"@" + data[i].user.screen_name + ": " + 
					data[i].text + "\n" + 
					data[i].created_at + "\n" + 
					"----------------------------------------------------------------\n";
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
						"------------------------------ " + i + " ------------------------------\n" +
						"Artist: " + songInfo[i].artists[0].name + "\n" +
						"Song: " + songInfo[i].name + "\n" +
						"Album the song is from: " + songInfo[i].album.name + "\n" +
						"Preview Url: " + songInfo[i].preview_url + "\n" + 
						"---------------------------------------------------------------\n";
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

		if(!usersChoice){
			usersChoice = "mr nobody";
		}
		console.log(usersChoice);
		request("http://www.omdbapi.com/?t=" + usersChoice + "&y=&plot=short&r=json&tomatoes=true&apikey=baca7f8", function (error, response, body) {
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
