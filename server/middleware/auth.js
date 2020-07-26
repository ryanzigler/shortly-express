const models = require('../models');
const Promise = require('bluebird');

module.exports.createSession = (req, res, next) => {

  Promise.resolve(req.cookies.shortlyid)
    .then(hash => {
      if (!hash) {
        throw hash;
      }
      return models.Sessions.get({ hash });
    })
    .tap(session => {
      if (!session) {
        throw session;
      }
    })
    // initializes a new session
    .catch(() => {
      return models.Sessions.create()
        .then(results => {
          return models.Sessions.get({ id: results.insertId });
        })
        .tap(session => {
          res.cookie('shortlyid', session.hash);
        });
    })
    .then(session => {
      req.session = session;
      next();
    });
};

/*
  Start a promise chain re: our cookies object at key shortlyid
    .then
      if hash doesn't exist on req.cookies.shortlyid
        throw an exception
      otherwise (if hash exists)
        attempt to load session from db                | CAN BE CHANGED TO .TAP AS TAP WILL "RETURN"
    .then <-------------------------------------------|  THE WHATEVER WAS PASSED IN TO THE NEXT THEN
      if session doesn't exist                                                             ^
        throw an exception                                                                |
      otherwise (if session exists)                                                      |
        return session                                                                  |
    .catch  <----------- IF ANY OF THE ABOVE STATEMENTS THROW AN EXCEPTION OR ERROR    |
      create and return a new session                                                 |
        .then <----------------------------------------------------------------------|
          get and return the session we just created using the insertId from the create() return
    .then
          send res.cookie with a key of shortlyid and a value of our session hash)
          return the session
          set our req.session to equal the arguments passed into our then statement
          next()
*/

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

module.exports.verifySession = (req, res, next) => {
  if (!models.Sessions.isLoggedIn(req.session)) {
    res.redirect('/login');
  } else {
    next();
  }
};