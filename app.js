const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const path = require("path");

// Bring database object
const config = require('./config/database');

// Mongodb Config
mongoose.set('useCreateIndex', true);

// Connect with database
mongoose.connect(config.database, { useNewUrlParser:true})
.then(() => {
    console.log('Database connected successfully: ' + config.database); 
}).catch(err => {
    console.log(err);
});

// Initialize the app
const app = express();

// Defining the PORT
const PORT = process.env.PORT || 5000;

// Defining Middlewares
app.use(cors());

// Set the static folder (public)
app.use(express.static(path.join(__dirname, 'public')));

// BodyParser Middleware
app.use(bodyParser.json());

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  return res.json({
    message: "this is node.js role based authentication system"
  });
});

// Create a custom middleware function
const checkUserType = function(req, res, next){
  const userType = req.originalUrl.split('/')[2];
  // bring in the passport authentication strategy
  require('./config/passport')(userType, passport);
  next();
};

app.use(checkUserType);

// Bring in the password authentication strategy
require('./config/passport')(passport)

// Bring in the user routes
const users = require('./routes/users');
app.use('/api/users', users);

// Bring in the user routes
const admin = require('./routes/admin');
app.use('/api/admin', admin);


app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
