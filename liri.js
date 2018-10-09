//NMPs: 
require("dotenv").config();
// let fs = require('fs');// use this to read and write
const Spotify = require('node-spotify-api');// Songs
const request = require('request');// Bands in Town (concerts) & OMDB (movies)
const moment = require('moment');// Time formatter
const chalk = require('chalk'); // Colorizer

// Access spotify keys
const keys = require('./keys');
const spotify = new Spotify(keys.spotify);

const action = process.argv[2];
console.log(action)
// if (action === "concert-this") {
//     concert() 
// } else if (action === "spotify-this-song") {
//     song()
// } else if (action === "movie-this") {
//     movie()
// } else (action === "do-what-it-says") 
//     doIt()

switch (action) {
    case "concert-this":
        concert();
        break;
    case "spotify-this-song":
        music();
        break;
    case "movie-this":
        movie();
        break;
    // case "do-what-it-says":
    // doIt()
    // break;
}


//// BANDS IN TOWN //// 
// node liri.js concert-this '<artist/band name here>'
function concert() {
    let artist = process.argv[3];
    if (artist === undefined) {
        console.log(chalk.red("I'm sorry, I don't recognize that band. Please try another band."))
    }
    const queryConcertUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
    request(queryConcertUrl, (err, response, body) => {
        if (err)
            return err;
        if (response.statusCode === 200) {
            console.log(chalk.green(`Great news! ${artist} is on tour!`))
            console.log(

            )
            let jsonConcert = JSON.parse(body);
            for (let i = 0; i < jsonConcert.length; i++) {
                console.log(chalk.yellow(`${moment(jsonConcert[i].datetime).format("MMM Do, YYYY")} at ${jsonConcert[i].venue.name} in ${jsonConcert[i].venue.city}, ${jsonConcert[i].venue.region}`))
                console.log(
                )
            }
            if (jsonConcert.length === 0) {
                console.log(chalk.red("It doesn't look like that band is on tour. Please try another band."))
            }
        }
    })
}

//// SPOTIFY //// 
// node liri.js spotify-this-song '<song name here>'
function music() {
    let song = process.argv[3];
    if (song === undefined) {
        console.log(chalk.red("Have you heard my favorite song?  It's called 'The Sign' by Ace of Base."))
    }
    spotify.search({ type: 'track', query: song, limit: 5 }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        if (data.tracks.items.length === 0) {
            console.log(chalk.red("I'm sorry but I can't find that track. Please try another track."))
        }
        else {
            console.log(chalk.blue(`I found a few listings for "${song}."  Is one of these what you were looking for?`))
            console.log(

            )
            for (let i = 0; i < data.tracks.items.length; i++) {
                console.log(chalk.green(`${data.tracks.items[i].name} was recorded by ${data.tracks.items[i].artists[0].name} on ${data.tracks.items[i].album.name}. Preivew at Spotify ${data.tracks.items[i].preview_url}`))
            console.log(
            )
            }
        }
    });
};

//// OMDB //// 
// node liri.js movie-this '<movie name here>'
function movie() {
    let movieName = process.argv[3];
    if (movieName === undefined) {
        console.log(chalk.red("If you haven't watched 'Mr. Nobody,' then you should. http://www.imdb.com/title/tt0485947/ It's on Netflix!"))
        movieName = "Mr. Nobody"
    }

    const queryMovieUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

    request(queryMovieUrl, (err, response, body) => {
        if (err)
            return err;
        if (response.statusCode === 200) {
            let jsonMovie = JSON.parse(body);
            console.log(chalk.magenta('Title: ', jsonMovie.Title))
            console.log(chalk.magenta('Release Year: ', jsonMovie.Year))
            console.log(chalk.magenta('Film Rating: ', jsonMovie.Rated))
            console.log(chalk.magenta('IMDB Rating: ', jsonMovie.imdbRating))
            console.log(chalk.magenta('Rotten Tomatoes Rating: ', jsonMovie.Ratings[1].Value))
            console.log(chalk.magenta('Produced in: ', jsonMovie.Country))
            console.log(chalk.magenta('Language: ', jsonMovie.Language))
            console.log(chalk.magenta('Plot Synopsis: ', jsonMovie.Plot))
            console.log(chalk.magenta('Actors: ', jsonMovie.Actors))
        }
    })
}
