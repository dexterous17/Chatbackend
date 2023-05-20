// index.js
const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const socketAPI = require('./socketroutes/socket');
const { passport } = require('./middleware/passport');
const { morganMiddleware, corsMiddleware } = require('./middleware/middleware');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(corsMiddleware);
// Passport configuration
app.use(passport.initialize());

//logger
app.use(morganMiddleware);

// Routes
const simpleapp = require('./routes/simpleapp');
app.use('/', simpleapp);

const loginRoutes = require('./routes/login');
app.use('/login', loginRoutes);

const registerRoutes = require('./routes/registration');
app.use('/register', registerRoutes);

const fetchrecipients = require('./routes/fetchrecipients');
app.use('/fetchrecipients', fetchrecipients);

const fetchmessages = require('./routes/fetchmessages');
app.use('/fetchmessages', fetchmessages);

const getprofile = require('./routes/profile/getprofile');
app.use('/getprofile', getprofile)

const passwordreset = require('./routes/passwordreset');
app.use('/resetpassword', passwordreset)

const postprofile = require('./routes/profile/postprofile')
app.use('/postprofile', postprofile)

const image = require('./routes/image')
app.use('/image', image)

// Start the server
const server = http.createServer(app);

// Initialize socket server
socketAPI(server);
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = server;