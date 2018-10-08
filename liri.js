//NMPs: 
require("dotenv").config();
// let fs = require('fs');// do i need this?
// let spotify = require('node-spotify-api');// Songs
const request = require('request');// Bands in Town (concerts) & OMDB (movies)
const moment = require('moment');// figureing out how to use this
const chalk = require('chalk'); // Colorizer

// import keys.js and store as variable
// const keys = require('./keys');

// access keys example
// const spotify = new Spotify(keys.spotify);

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

switch (action)
{
    case "concert-this":
    concert ();
    break;
    case "movie-this":
    movie();
    break;
}



// if (action === "concert-this") 
// {
//     concert()
// }

// else (action === "movie-this")
// movie()





// BANDS IN TOWN// node liri.js concert-this '<artist/band name here>'
function concert() {
    let artist = process.argv[3];
    if (artist === undefined) {
        console.log(chalk.red("I'm sorry, I don't recognize that band. Please try another band."))
    }

    const queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

    request(queryUrl, (err, response, body) => {
        if (err)
            return err;
        if (response.statusCode === 200) {
            let jsonConcert = JSON.parse(body);
            for (let i = 0; i < jsonConcert.length; i++) {
                console.log(chalk.green(`Great news! ${artist} will be performing at the ${jsonConcert[i].venue.name} in ${jsonConcert[i].venue.city}, ${jsonConcert[i].venue.region} on ${moment(jsonConcert[i].datetime).format("MMM Do, YYYY")}.`))
                console.log(chalk.yellow(`Find out more: ${jsonConcert[i].url}`))
                console.log(

                )
            }
            if (jsonConcert.length === 0) {
                console.log(chalk.red("It doesn't look like that band is on tour. Please try another band."))
            }
        }
    })
}
















//OMDB// node liri.js movie-this '<movie name here>'
function movie() {
    let movieName = process.argv[3];
    if (movieName === undefined) {
        console.log(chalk.red("If you haven't watched 'Mr. Nobody,' then you should. http://www.imdb.com/title/tt0485947/ It's on Netflix!"))
        movieName = "Mr. Nobody"
    }

    const queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

    request(queryUrl, (err, response, body) => {
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
