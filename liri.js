require("dotenv").config();
var axios = require("axios");
var moment = require("moment");
var fs = require("fs");
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var actionType = process.argv[2];
var request = process.argv[3];

function liri() {
    switch (actionType) {
        case "concert-this":
            axios.get(`https://rest.bandsintown.com/artists/${request}/events?app_id=codingbootcamp`)
                .then(function (response) {
                    var randIdx = Math.floor(Math.random() * response.data.length)
                    if (typeof response.data[randIdx] != "undefined") {
                        var venueName = response.data[randIdx].venue.name;
                        var location = `${response.data[randIdx].venue.city}, ${response.data[randIdx].venue.region}, ${response.data[randIdx].venue.country}`;
                        var thisDate = response.data[randIdx].datetime;
                        thisDate = thisDate.substring(0, thisDate.length - 9);
                        var concertDate = moment(thisDate).format("MM/DD/YYYY");
                        fs.appendFile("output.txt", `Venue: ${venueName}\n`, (err) => {
                            if (err) {
                                return console.log("There was a problem writing to the file.")
                            }
                            console.log(`Venue: ${venueName}`);
                        });
                        fs.appendFile("output.txt", `City: ${location}\n`, (err) => {
                            if (err) {
                                return console.log("There was a problem writing to the file.")
                            }
                            console.log(`City: ${location}`);
                        });
                        fs.appendFile("output.txt", `Date: ${concertDate}\n`, (err) => {
                            if (err) {
                                return console.log("There was a problem writing to the file.")
                            }
                            console.log(`Date: ${concertDate}`);
                        });
                    } else {
                        fs.appendFile("output.txt", `I'm sorry, there are no upcoming concert dates available for ${request}.\n`, (err) => {
                            if (err) {
                                return console.log("There was a problem writing to the file.")
                            }
                            console.log(`I'm sorry, there are no upcoming concert dates available for ${request}.`)
                        });
                    }
                });
            break;
        case "spotify-this-song":
            if (typeof request === "undefined") {
                request = "The Sign"
            }
            spotify.search({ type: "track", query: request }, function (err, data) {
                if (err) {
                    console.log("I'm sorry, we couldn't find that song.", err);
                } else {
                    var songName = data.tracks.items[0].name;
                    var artist = "";
                    data.tracks.items[0].artists.forEach((element) => {
                        artist = artist + element.name + ", "
                    });
                    artist = artist.substring(0, artist.length - 2);
                    var songLink = data.tracks.items[0].external_urls.spotify;
                    var album = data.tracks.items[0].album.name;
                    fs.appendFile("output.txt", `Song: ${songName}\n`, (err) => {
                        if (err) {
                            return console.log("There was a problem writing to the file.")
                        }
                        console.log(`Song: ${songName}`);
                    });
                    fs.appendFile("output.txt", `Album: ${album}\n`, (err) => {
                        if (err) {
                            return console.log("There was a problem writing to the file.")
                        }
                        console.log(`Album: ${album}`);
                    });
                    fs.appendFile("output.txt", `Artist(s): ${artist}\n`, (err) => {
                        if (err) {
                            return console.log("There was a problem writing to the file.")
                        }
                        console.log(`Artist(s): ${artist}`);
                    });
                    fs.appendFile("output.txt", `URL: ${songLink}\n`, (err) => {
                        if (err) {
                            return console.log("There was a problem writing to the file.")
                        }
                        console.log(`URL: ${songLink}`);
                    });
                };
            });
            break;
        case "movie-this":
            if (typeof request === "undefined") {
                console.log(`If you haven't watched "Mr. Nobody," then you should: http://www.imdb.com/title/tt0485947/`);
                console.log("It's on Netflix!");
            } else {
                axios.get(`http://www.omdbapi.com/?apikey=trilogy&t=${request}`)
                    .then(function (response) {
                        var movieInfo = [
                            `Title: ${response.data.Title}`,
                            `Release Year: ${response.data.Year}`,
                            `IMDB Rating: ${response.data.Ratings[0].value}`,
                            `Rotten Tomatoes Rating: ${response.data.Ratings[1].value}`,
                            `Production Country: ${response.data.Country}`,
                            `Language: ${response.data.Language}`,
                            `Plot: ${response.data.Plot}`,
                            `Actors: ${response.data.Actors}`,
                        ];
                        movieInfo.forEach(function (element) {
                            if (!element.includes("undefined")) {
                                fs.appendFile("output.txt", `${element}\n`, (err) => {
                                    if (err) {
                                        return console.log("There was a problem writing to the file.")
                                    }
                                    console.log(element);
                                });
                            };
                        });
                    });
            };
            break;
        case "do-what-it-says":
            fs.readFile("random.txt", "UTF-8", (err, data) => {
                if (err) {
                    console.log("Sorry, there was an error reading the file.");
                } else {
                    var fileInput = data.split(',');
                    actionType = fileInput[0];
                    request = fileInput[1];
                    liri();
                };
            });
            break;
        default:
            console.log("Sorry, you didn't use an appropiate command. Try these:");
            console.log("node liri.js concert-this {band-name}");
            console.log("node liri.js spotify-this-song {song-name}");
            console.log("node liri.js movie-this {movie-name}");
            console.log("node liri.js do-what-it-says");
            break;
    };
};

liri();