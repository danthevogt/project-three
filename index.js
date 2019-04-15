//gives access to the express library
let express = require("express");

//creates an express application obkexct
let app = express();

//gives access to the path
//port communication
let path = require("path");

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

app.get("/", (req, res) => {
    knex.select('SongID', 'SongName', 'ArtistID', 'YearReleased').from('Songs').orderBy('SongID').then(Songs =>{
        res.render('index', {test: Songs});
      }).catch(err => {
        console.log(err);
        res.status(500).json({err});
    });
});

app.post('/DeleteSong/:id', (req, res) => {
    knex('Songs').where('SongID',req.params.id).del().then(test => {
        res.redirect('/');
    }).catch(err => {
        console.log(err);
        res.status(500).json({err});
    })
});


app.get("/email", function(req, res) {
    res.sendFile(path.join(__dirname + "/emailpage.html"));
});

app.listen(port, function() {
    console.log("I am now listening");
});