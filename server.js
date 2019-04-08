const express = require('express');
// const mongoose = require('mongoose'); 
// const passport = require('passport');
const path = require('path') // part of nodejs


// Example of pointing URLs to route files
// const users = require("./routes/api/users");
// const posts = require("./routes/api/posts");
// const profile = require("./routes/api/dashboard");

const app = express();

//bodyparser middleware
//express now has a json parser in it.
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//DB config
// const db = require('./config/keys').mongouURI

//Connect to MongoDB
// mongoose.connect(db, { useNewUrlParser: true })
//   .then(() => console.log('mongodb connected'))
//   .catch(err => console.log(err));

//Passport Middleware
// app.use(passport.initialize());

// Passport Config
// require('./config/passport')(passport);

//Use Routes
// app.use('/api/users', users);
// app.use('/api/posts', posts);
// app.use('/api/profile', dashboard);

// If none of these api routes are being hit, look for index
// Server static assets if in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder to client/build
  app.use(express.static('client/build'));
  // any route gets hit here load the react html file in build
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });

}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));

