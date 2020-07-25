

const parseCookies = (req, res, next) => {
  console.log(req, 'req');
  console.log(Object.keys(req.headers), 'req.headers');
  console.log(req.headers.cookies, 'req.headers.cookies');
  console.log(req.cookies, 'req.cookies');

  if (req.headers.cookie === undefined) {
    req.cookies = {};
  } else {

    var requestCookies = req.headers.cookie.split(';');
    // requestCookies = ['shortlyid=18ea...', 'otherCookie=2a99038200...']

    for (var i = 0; i < requestCookies.length; i++) {
      var cookieID = requestCookies[i];
      cookieID.split('=');
      var currentKey = cookieID[i];
      var currentValue = cookieID[i + 1];

      // requestCookies = ['shortlyid', 18ea...', 'otherCookie', 2a99038200...']
      // key: requestCookies[0], value: requestCookies[1];
      // key: requestCookies[2], value: requestCookies[3];
    }

    var cookieKey = cookieID[0];
    // req.cookies = {cookieKey: cookieID[1]};
    req.cookies[cookieKey] = cookieID[1];
  }
  next();

  // headers: {
  //   Cookie: 'shortlyid=18ea4fb6ab3178092ce936c591ddbb90c99c9f66; otherCookie=2a990382005bcc8b968f2b18f8f7ea490e990e78; anotherCookie=8a864482005bcc8b968f2b18f8f7ea490e577b20'
  // }
  // parses cookies and assigns an object of key-value pairs to a session property on the request

  /*
  var headers = {

    cookies: {name: shortlyid,
            value: '8a864482005bcc8b968f2b18f8f7ea490e577b20'}
  }
  */

  // shortlyid=8a864482005bcc8b968f2b18f8f7ea490e577b20
  // -> shortlyid: '8a864482005bcc8b968f2b18f8f7ea490e577b20'



};

module.exports = parseCookies;