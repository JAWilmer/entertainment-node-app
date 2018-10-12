//NMPs: 
require("dotenv").config();
const fs = require('fs');// Read and write
const Spotify = require('node-spotify-api');// Songs
const request = require('request');// Bands in Town (concerts) & OMDB (movies)
const Twitter = require('twitter'); // Twitter
const moment = require('moment');// Time formatter
const chalk = require('chalk'); // Colorizer

// Access spotify keys
const keys = require('./keys');
const spotify = new Spotify(keys.spotify);
const twitter = new Twitter(keys.twitter);


// Establish actions for LIRI to take
const action = process.argv[2];

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
    case "my-tweets":
        tweet();
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
            if (jsonConcert.length != 0) {
                console.log(chalk.green(`\nTour dates for ${artist}:\n`))
                logIt(`\n\nTour stops for ${artist}:\n`)

                for (let i = 0; i < jsonConcert.length; i++) {
                    console.log(chalk.cyan(`\t•  ${moment(jsonConcert[i].datetime).format("MMM Do, YYYY")} at ${jsonConcert[i].venue.name} in ${jsonConcert[i].venue.city}, ${jsonConcert[i].venue.region}`))

                    logIt(`\t•  ${moment(jsonConcert[i].datetime).format("MMM Do, YYYY")} at ${jsonConcert[i].venue.name} in ${jsonConcert[i].venue.city}, ${jsonConcert[i].venue.region}`)
                }
            } else {
                console.log(chalk.red(`\nI'm sorry, it doesn't look like ${artist} is on tour. Please try another artist.`))
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
            console.log(chalk.green(`\nI found a few listings for ${song}.\n`))
            logIt(`\n\n${song}:\n`)

            for (let i = 0; i < data.tracks.items.length; i++) {
                console.log(chalk.cyan(`•  ${data.tracks.items[i].name} was recorded by ${data.tracks.items[i].artists[0].name} on ${data.tracks.items[i].album.name}.\nPreivew at Spotify: ${data.tracks.items[i].preview_url}\n`))

                logIt(`\t•  ${data.tracks.items[i].name} was recorded by ${data.tracks.items[i].artists[0].name} on ${data.tracks.items[i].album.name}`)
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
            if (jsonMovie.Title != undefined) {

                console.log(chalk.green(`\n${jsonMovie.Title}, ${jsonMovie.Year}, with ${jsonMovie.Actors} was produced in ${jsonMovie.Language} in ${jsonMovie.Country}\n`))
                console.log(chalk.magenta(`Ratings:\n\tFilm: ${jsonMovie.Rated}\n \tIMDB: ${jsonMovie.imdbRating}\n\tRotten Tomatoes: ${jsonMovie.Ratings[1].Value}\n`))
                console.log(chalk.cyan(`Plot: ${jsonMovie.Plot}`))

                logIt(`\n\n${jsonMovie.Title}, ${jsonMovie.Year}\n\t${jsonMovie.Plot}\n`)
            }
            else {
                console.log(chalk.red(`\nI'm sorry but I can't find that movie. Please try another movie.`))
            }
        }
    })
}

////TWITTER//// 
// node liri my-tweets
function tweet() {
    let tweetList = process.argv[3];
    var params = { screen_name: 'ReingerTX', count: 10 };
    twitter.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (error) {
            return console.log('\nError occurred: ' + error);
        }
        else if (!error) {
            console.log(chalk.green(`\nRangerTX Tweeted:\n`))
            logIt(`\n\nRangerTX Tweeted:\n`)

            for (let i = 0; i < tweets.length; i++) {
                console.log(chalk.cyan(`•  ${tweets[i].created_at.slice(0, 10)}, 2018: ${tweets[i].text}\n`))
                logIt(`\t•  ${tweets[i].created_at.slice(0, 10)}, 2018: ${tweets[i].text}  `)
            }
        }
    });
}

    //// RANDOM.TXT////
    // node liri.js do-what-it-says
    function doIt() {
        // let text = process.argv[3];
        fs.readFile("random.txt", "utf8", function (err, data) {
            if (err) {
                return console.log(err);
            }
            // console.log(data)
            var textArr = data.split(",");
            // console.log(textArr[0])
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
                case "my-tweets":
                    tweet();
                    break;
            }
        });
    }

    // Create log.txt file and enter data returned from searches into file
    function logIt(logfile) {
        fs.appendFileSync("log.txt", logfile, function (err) {
            if (err) {
                return console.log(err);
            }
        });
    }
