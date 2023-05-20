const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();


const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

const jwtAuthMiddleware = passport.authenticate('jwt', { session: false });

passport.use(new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
  try {
    const user = await User.findById(jwtPayload.id);
    if (!user) {
      return done(null, false);
    }
    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
}));



const authenticate = (socket, next) => {
  const token = socket.handshake.headers.authorization;
  if (!token) {
    return next(new Error('Authentication error: no token provided'));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(new Error('Authentication error: invalid token'));
    }

    // Attach the decoded token to the request object
    socket.request.user = decoded;

    next();
  });
};

const authenticaterequest = (req, res, next) => {
  console.log(req.body.headers.authorization)
  const token = req.body.headers.Authorization;
  console.log(token)
  if (!token) {
    return res.status(401).json({ error: 'Authentication error: no token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Authentication error: invalid token' });
    }

    // Attach the decoded token to the request object
    req.user = decoded;

    next();
  });
};

module.exports = {
  jwtAuthMiddleware, passport, authenticate, authenticaterequest
};
