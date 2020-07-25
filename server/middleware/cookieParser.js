const parseCookies = (req, res, next) => {
  if (req.headers.cookie === undefined) {
    req.cookies = {};
  } else {
    req.cookies = Object.fromEntries(req.headers.cookie.split('; ').map((item) => {
      return item.split('=');
    }));
  }
  next();
};


// var cookieKey = cookieID[0];
// req.cookies = {cookieKey: cookieID[1]};
// req.cookies[cookieKey] = cookieID[1];

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

module.exports = parseCookies;