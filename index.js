/*Project 3*/

/*
Daniel Vogt
London Wheeler
Anita Wu
Matt King
Bonnie McDougal
*/

/*
This program displays a database and dynamically allows you to edit, add, delete songs and
reset the database. Buttons are included in the table to do so.
*/

//gives access to the express library
let express = require("express");

//creates an express application obkexct
let app = express();

//gives access to the path
//port communication
let path = require("path");

//we use this variable for our port community
app.set("port",process.env.PORT || 3000);

//extracting data from the request
let port = 3000;

//gives acess to the body-parser library used in the req extracting
//data from the request IOW the form
let bodyParser = require("body-parser");

//gives access to knex which provides SQL in out app
let knex = require("knex")({
    client: 'sqlite3',
    connection: {
        filename: "./MusicLibrary.db"
    },
    useNullAsDefault: true
})

//allows us to use objects and arrays like JSON format
app.use(bodyParser.urlencoded({ extended: true}));

//this specifies how our EJS pages are converted to HTML
//and helps the browser so it can display it
app.set("view engine", "ejs");

//This gets the table from sqlite3 and adds it to the page
app.get("/", (req, res) => {
    knex.select('SongID', 'SongName', 'ArtistID', 'YearReleased').from('Songs').orderBy('SongID').then(Songs =>{
        res.render('index', {test: Songs});
      }).catch(err => {
        console.log(err);
        res.status(500).json({err});
    });
});

//Delete Song
app.post('/DeleteSong/:id', (req, res) => {
    knex('Songs').where('SongID',req.params.id).del().then(test => {
        res.redirect('/');
    }).catch(err => {
        console.log(err);
        res.status(500).json({err});
    })
});

//Add a Song
app.get('/addSong', (req,res) => {
    res.render('addSong');
});

app.post('/addSong', (req, res) => {
    console.log(req.body);
    //We use req because the res doesn't have the data, the request does
    knex('Songs').insert(req.body).then(test => {
        res.redirect('/');
    });
});

//Edit Song
app.get('/EditSong/:id', (req,res) => {
    knex('Songs').where('SongID',req.params.id).then(song => {
        console.log(song);
        res.render('EditSong', {song: song});
});
});

app.post('/EditSong/:id', (req, res) => {
    console.log(req.body.SongID);
    knex('Songs').where('SongID',req.params.id).update({ SongName: req.body.SongName, ArtistID: req.body.ArtistID,
        YearReleased: req.body.YearReleased }).then(() => {
    res.redirect('/');
        });
    });


//Start over button
    app.post("/StartOver",(req,res) => {
    knex("Songs").del().then(Songs => {
    knex("Songs").insert([
        { SongID: 1, SongName: 'Bohemian Rhapsody', ArtistID: 'QUEEN', YearReleased: 1975 },
        { SongID: 2, SongName: 'Don\'t Stop Believing', ArtistID: 'JOURNEY', YearReleased: 1981 },
        { SongID: 3, SongName: 'Hey Jude', ArtistID: 'BEATLES', YearReleased: 1968}
    ]).then(Songs => {
        res.redirect("/");
        });
    }).catch(err =>
    {
    console.log(err);
    res.status(500).json({err});
    });
});

//This is so the server does not die.
app.listen(port, function() {
    console.log("I am now listening");
});