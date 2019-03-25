var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    Restaurant  = require("./models/restaurant"),
    Comment     = require("./models/comment"),
    // User        = require("./models/user"),
    seedDB      = require("./seeds");

mongoose.connect("mongodb://localhost:27017/go_places", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
console.log(__dirname);
mongoose.set("useFindAndModify", false);
// seedDB();

app.get("/", function(req, res) {
    res.render("landing");
});

// INDEX - show all restaurants 
app.get("/restaurants", function(req, res) {
    // Get all restaurants from DB
    Restaurant.find({}, function(err, restaurants) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("restaurants/index", { restaurants: restaurants });
        }
    });
});

// CREATE - add new restaurant to DB
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

// NEW - show form to create new restaurant
app.get("/restaurants/new", function(req, res) {
    res.render("restaurants/new");
});

// SHOW - show more info about one restaurant
app.get("/restaurants/:id", function(req, res) {
    //find the restaurant with provided ID
    Restaurant.findById(req.params.id).populate("comments").exec(function(err, foundRestaurant) {
        if (err) {
            console.log(err);
        }
        else {
            //render show template with that restaurant
            res.render("restaurants/show", {restaurant: foundRestaurant});
        }
    });
});

// =====================
// COMMENTS ROUTES
// =====================

app.get("/restaurants/:id/comments/new", function(req, res) {
    // find restaurant by id
    Restaurant.findById(req.params.id, function(err, restaurant) {
        if(err) {
            console.log(err);
        } else {
            res.render("comments/new", { restaurant: restaurant });
        }
    });
});

app.post("/restaurants/:id/comments", function(req, res) {
    // lookup restaurant using ID
    Restaurant.findById(req.params.id, function(err, restaurant) {
        if(err) {
            console.log(err);
            res.redirect("/goPlaces/restaurants");
        } else {
            // create new comment
            Comment.create(req.body.comment, function(err, comment) {
                if(err) {
                    console.log(err);
                } else {
                    // connect new comment to restaurant
                    restaurant.comments.push(comment);
                    restaurant.save();
                    // redirect to restaurant show page
                    res.redirect("/goPlaces/restaurants/" + restaurant._id);
                }
            });
        }
    });
});

app.listen(3081, function() {
    console.log("The GoPlaces Server Has Started!");
})