const models = require('../models');
const Promise = require('bluebird');

module.exports.createSession = (req, res, next) => {
};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

/*
// if no cookies, generate new session with unique hash and store in sessions database
    // use hash to set a cookie in res.headers

  if (req.cookies. === undefined)

  // if cookie exists, check that it's valid in session database

  // if cookie exists and it's not valid, replace invalid cookie with new cookie and create new session

  Object.keys
  req.cookies = {}

  req.cookies =

  session.Sessions.get({});
*/