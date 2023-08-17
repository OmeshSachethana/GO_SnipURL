// Import necessary libraries and modules
const express = require('express'); // Express framework for building web applications
const mongoose = require('mongoose'); // Mongoose library for MongoDB interaction
const ShortUrl = require('./models/shortUrl'); // Import the ShortUrl model from ./models/shortUrl
const app = express(); // Create an instance of the Express app
const port = 5000; // Port number for the server to listen on

// Connect to the MongoDB database named 'urlShortener'
mongoose.connect('mongodb://localhost/urlShortener', {

});

// Set the view engine to 'ejs' for rendering dynamic content
app.set('view engine', 'ejs');

// Parse incoming request data with extended urlencoded format
app.use(express.urlencoded({ extended: false }));

// Define a route for the homepage
app.get('/', async (req, res) => {
    try {
      // Retrieve all short URLs from the database
      const shortUrls = await ShortUrl.find();
      // Render the 'index' view and pass the retrieved shortUrls data to it
      res.render('index', { shortUrls: shortUrls });
    } catch (error) {
      console.error("Error fetching short URLs:", error);
      res.status(500).send("Internal Server Error");
    }
});  

// Define a route to handle the creation of short URLs
app.post('/shortUrls', async (req, res) => {
  // Create a new ShortUrl document in the database with the provided 'fullUrl'
  await ShortUrl.create({ full: req.body.fullUrl });
  // Redirect back to the homepage after creating the short URL
  res.redirect('/');
});

// Define a route to handle redirection based on the short URL
app.get('/:shortUrl', async (req, res) => {
  // Find a ShortUrl document in the database based on the provided 'shortUrl'
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });
  // If no matching short URL is found, send a 404 status
  if (shortUrl == null) return res.sendStatus(404);

  // Increment the 'clicks' count of the short URL and save it
  shortUrl.clicks++;
  shortUrl.save();

  // Redirect the user to the original full URL associated with the short URL
  res.redirect(shortUrl.full);
});

// Start the Express app and listen on the specified port (or process.env.PORT if available)
app.listen(process.env.PORT || port);
