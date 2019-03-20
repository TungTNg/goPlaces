var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    Restaurant  = require("./models/restaurant"),
    // Comment     = require("./models/comment"),
    // User        = require("./models/user"),
    seedDB      = require("./seeds");

seedDB();
mongoose.connect("mongodb://localhost:27017/go_places", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
mongoose.set("useFindAndModify", false);


app.get("/", function(req, res) {
    res.render("landing");
});

//INDEX - show all restaurants 
app.get("/restaurants", function(req, res) {
    // Get all restaurants from DB
    Restaurant.find({}, function(err, restaurants) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("index", { restaurants: restaurants });
        }
    });
});

//CREATE - add new restaurant to DB
app.post("/restaurants", function(req, res) {
    // get data from form and add to restaurants array
    var name    = req.body.name;
    var image   = req.body.image;
    var desc    = req.body.description;     
    var newRestaurant = { name: name, image: image, description: desc };
    // Create a new campground and save to DB
    Restaurant.create(newRestaurant, function(err, restaurant) {
        if (err) {
            console.log(err);
        }
        else {
            // redirect back to restaurants
            res.redirect("/goPlaces/restaurants");
        }
    });

});

//NEW - show form to create new restaurant
app.get("/restaurants/new", function(req, res) {
    res.render("new");
});


app.get("/restaurants/:id", function(req, res) {
    //find the restaurant with provided ID
    Restaurant.findById(req.params.id, function(err, foundRestaurant) {
        if (err) {
            console.log(err);
        }
        else {
            //render show template with that restaurant
            res.render("show", {restaurant: foundRestaurant});
        }
    });
});

app.listen(3081, function() {
    console.log("The GoPlaces Server Has Started!");
})