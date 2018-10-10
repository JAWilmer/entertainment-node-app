//NMPs: 
require("dotenv").config();
let fs = require('fs');// Read and write
const Spotify = require('node-spotify-api');// Songs
const request = require('request');// Bands in Town (concerts) & OMDB (movies)
const moment = require('moment');// Time formatter
const chalk = require('chalk'); // Colorizer

// Access spotify keys
const keys = require('./keys');
const spotify = new Spotify(keys.spotify);

const action = process.argv[2];
console.log(chalk.red('You asked me to:', action))// take out after testing

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
    case "do-what-it-says":
        doIt()
        break;
}

//// BANDS IN TOWN //// 
// node liri.js concert-this '<artist/band name here>'
function concert(artistName) {
    let artist = artistName || process.argv[3];
    if (artist === undefined) {
        console.log(chalk.red(`\nI'm sorry, I don't recognize that band. Maybe you would like to see my favorite artist, Sir Paul McCartney.\n`));
artist = "Paul McCartney";
    }
    const queryConcertUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
    request(queryConcertUrl, (err, response, body) => {
        if (err) {
            return console.log('\nError occurred: ' + err);
        } else if (response.statusCode === 200) {
            let jsonConcert = JSON.parse(body);
            console.log(chalk.green(`\nI hope you can catch one of these tour stops for ${artist}:\n`))
            for (let i = 0; i < jsonConcert.length; i++) {
                console.log(chalk.cyan(`•  ${moment(jsonConcert[i].datetime).format("MMM Do, YYYY")} at ${jsonConcert[i].venue.name} in ${jsonConcert[i].venue.city}, ${jsonConcert[i].venue.region}\n`))
            } if (jsonConcert.length === 0) {
                console.log(chalk.red("I'm sorry, it doesn't look like that band is on tour. Please try another band."))
            }
        }
    })
}

//// SPOTIFY //// 
// node liri.js spotify-this-song '<song name here>'
function music(songTitle) {
    let song = songTitle || process.argv[3];
    if (song === undefined) {
        console.log(chalk.red(`\nHave you heard my favorite song?  It's called "Pink Shoe Laces."\n`))
        song = "Pink Shoe Laces"
    }
    spotify.search({ type: 'track', query: song, limit: 7 }, function (err, data) {
        if (err) {
            return console.log('\nError occurred: ' + err);
        } else if (data.tracks.items.length === 0) {
            console.log(chalk.red(`\nI'm sorry but I can't find that track. Please try another track.`))
        } else {
            console.log(chalk.green(`\nI found a few listings for "${song}."\n`))
            for (let i = 0; i < data.tracks.items.length; i++) {
                console.log(chalk.cyan(`•  ${data.tracks.items[i].name} was recorded by ${data.tracks.items[i].artists[0].name} on ${data.tracks.items[i].album.name}.\nPreivew at Spotify: ${data.tracks.items[i].preview_url}\n`))
            }
        }
    });
};

//// OMDB //// 
// node liri.js movie-this '<movie name here>'
function movie(movieTitle) {
    let movieName = movieTitle || process.argv[3];
    if (movieName === undefined) {
        console.log(chalk.red(`\nIf you haven't watched 'Mr. Nobody,' then you should. http://www.imdb.com/title/tt0485947/ It's on Netflix!`))
        movieName = "Mr. Nobody"
    }
    const queryMovieUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
    request(queryMovieUrl, (err, response, body) => {
        if (err) {
            return console.log('\nError occurred: ' + err);
        } else if (response.statusCode === 200) {
            let jsonMovie = JSON.parse(body);
            console.log(chalk.green(`\n${jsonMovie.Title}, ${jsonMovie.Year}, with ${jsonMovie.Actors} was produced in ${jsonMovie.Language} in ${jsonMovie.Country}\n`))
            console.log(chalk.magenta(`Ratings:\n\tFilm: ${jsonMovie.Rated}\n \tIMDB: ${jsonMovie.imdbRating}\n\tRotten Tomatoes: ${jsonMovie.Ratings[1].Value}\n`))
            console.log(chalk.cyan('Plot Synopsis: ', jsonMovie.Plot))
        }
    })
}

// RANDOM.TXT////
// node liri.js do-what-it-says
function doIt() {
    let text = process.argv[3];
    // if (text === undefined) {
    //     console.log(chalk.red("I'm sorry, I didn't catch that request. Please try again."))
    // }
    fs.readFile("random.txt", "utf8", function (err, data) {
        if (err) {
            return console.log(err);
        }
        var textArr = data.split(",");
        switch (textArr[0]) {
            case "movie-this":
                movie(textArr[1]);
                break;
            case "spotify-this-song":
                music(textArr[1]);
                break;
            case "concert-this":
                concert(textArr[1]);
                break;
            // }
        }
    });
}

