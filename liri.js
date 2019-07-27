require("dotenv").config()
const fs = require("fs");
const moment = require("moment");
const Spotify = require("node-spotify-api");
const request = require("request")
const keys = require("./keys.js")

var spotify = new Spotify(keys.spotify);

var action = process.argv[2],
    query = process.argv.slice(3).join(" ");
    divider =
"\n------------------------------------------------------------\n\n";

switch (action) {
  case "concert-this":
   concert(query);
    break;
  case "spotify-this-song":
  spotifySearch(query);
    break;
  case "movie-this":
    movies(query);
    break;
  case "do-what-it-says":
    doSomething();
    break;
  default:
    console.log("The commands available are concert-this, spotify-this-song, movie-this and do-what-it-says ")

}

function concert(query) {  

request("https://rest.bandsintown.com/artists/" + query + "/events?app_id=codingbootcamp", function(err, response, data){  
  if(!JSON.parse(data)[0]){
    console.log("Sorry, we couldn't find that artist.")
  } else{
    
    let unformattedTime =  JSON.parse(data)[0].datetime,
        time = moment(unformattedTime).format("MMMM Do YYYY, h:mm:ss a"),
        concertInfo = query + " is going to be playing in " + JSON.parse(data)[0].venue.name + "\n" + "This venue is located in " + JSON.parse(data)[0].venue.city + ", " +JSON.parse(data)[0].venue.region + "\n" + "The concert will start on " + time

        fs.appendFile("log.txt", "Concert \n \n" + concertInfo + divider, function(err) {
          if (err) {
            console.log(err);
          }      
          console.log(concertInfo);
        });
  }
})
}


function movies(query){

  console.log(query)
  request("http://www.omdbapi.com/?apikey=418b7fe2&t=" + query, function(err, response, data) {

    if (query != "") { 
      
      let movieInfo =  "The movie's title is: " + JSON.parse(data).Title + "\n" + "The movie was realeased in the year: " + "\n" + JSON.parse(data).Year + "\n" + "The movie's rating is: " + "\n" + JSON.parse(data).imdbRating + "\n" + "The movie's Rotten Tomato Score is: " + "\n" + JSON.parse(data).Ratings[1].Value + "\n" + "The movie was shot in: " + "\n" + JSON.parse(data).Country + "\n" + "The movie's language is: " + "\n" + JSON.parse(data).Language + "\n" + "The movie's plot is: " + "\n" + JSON.parse(data).Plot + "\n" + "The actors in this movie are: " + "\n" + JSON.parse(data).Actors

      fs.appendFile("log.txt", "Movie \n \n" + movieInfo + divider, function(err) {
        if (err) {
          console.log(err);
        }      
        console.log(movieInfo);
      });

    } else {
      request("http://www.omdbapi.com/?apikey=418b7fe2&t=Mr+Nobody", function (err, response, data) {
      
    if (!err && response.statusCode === 200) {

      let movieInfo =  "The movie's title is: " + JSON.parse(data).Title + "\n" + "The movie was realeased in the year: " + "\n" + JSON.parse(data).Year + "\n" + "The movie's rating is: " + "\n" + JSON.parse(data).imdbRating + "\n" + "The movie's Rotten Tomato Score is: " + "\n" + JSON.parse(data).Ratings[1].Value + "\n" + "The movie was shot in: " + "\n" + JSON.parse(data).Country + "\n" + "The movie's language is: " + "\n" + JSON.parse(data).Language + "\n" + "The movie's plot is: " + "\n" + JSON.parse(data).Plot + "\n" + "The actors in this movie are: " + "\n" + JSON.parse(data).Actors

      fs.appendFile("log.txt", "Movie \n \n" + movieInfo + divider, function(err) {
        if (err) {
          console.log(err);
        }      
        console.log(movieInfo);
      });
     
    }
  });
}
});
}

function spotifySearch (query) {

  if (!query) query = "Por mi reggae muero";

  spotify
  .search({ type: 'track', query: query })
  .then(function(response) {
    let songInfo = "The artists name is: " + response.tracks.items[0].artists[0].name + "\n" + "The songs name is: " + response.tracks.items[0].name + "\n" + "The URL to the song is: " + response.tracks.items[0].external_urls.spotify + "\n" + "The URL to the album is: " + response.tracks.items[0].album.external_urls.spotify

    fs.appendFile("log.txt", "Song \n \n" + songInfo + divider, function(err) {
      if (err) {
        console.log(err);
      }      
      console.log(songInfo);
    });

  })
  .catch(function(err) {
    console.log(err);
  });

}
  
function doSomething () {
  fs.readFile("random.txt", "utf8", function(error, data) {

    
    if (error) {
      return console.log(error);
    }
  
    var dataArr = data.split(",");
    action = dataArr[0];
    query = dataArr[1];

    switch (action) {
      case "concert-this":
       concert(query);
        break;
      case "spotify-this-song":
      spotifySearch(query);
        break;
      case "movie-this":
        movies(query);
    }
  });

}
