const express = require('express');
const path = require('path');
const utils = require('./lib/hashUtils');
const partials = require('express-partials');
const bodyParser = require('body-parser');
const Auth = require('./middleware/auth');
const models = require('./models');

const app = express();

app.set('views', `${__dirname}/views`);
app.set('view engine', 'ejs');
app.use(partials());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));



app.get('/',
  (req, res) => {
    res.render('index');
  });

app.get('/create',
  (req, res) => {
    res.render('index');
  });

app.get('/links',
  (req, res, next) => {
    models.Links.getAll()
      .then(links => {
        res.status(200).send(links);
      })
      .error(error => {
        res.status(500).send(error);
      });
  });

app.post('/links',
  (req, res, next) => {
    var url = req.body.url;
    if (!models.Links.isValidUrl(url)) {
      // send back a 404 if link is not valid
      return res.sendStatus(404);
    }

    return models.Links.get({ url })
      .then(link => {
        if (link) {
          throw link;
        }
        return models.Links.getUrlTitle(url);
      })
      .then(title => {
        return models.Links.create({
          url: url,
          title: title,
          baseUrl: req.headers.origin
        });
      })
      .then(results => {
        return models.Links.get({ id: results.insertId });
      })
      .then(link => {
        throw link;
      })
      .error(error => {
        res.status(500).send(error);
      })
      .catch(link => {
        res.status(200).send(link);
      });
  });

app.post('/signup', (req, res, next) => {

  models.Users.get({username: req.body.username})
    .then((userExists) => {
      if (userExists === undefined) {
        models.Users.create(req.body)
          .then(() => {
            res.redirect('/');
          });
      } else {
        res.redirect('/signup');
      }
    });
});

app.post('/login', (req, res, next) => {
  // user goes to login page
  // user tries to login
  // check if username exists
  // models.Users.get({username: user})
  // GET username, password, and salt from database
  // models.Users.get({username: user}, {password: req.body.password}, {salt: req.body.salt})
  // compare attempted password, password on file, and salt
  // models.Users.compare(attempted, password, salt)
  // if passes, redirect to home
  // res.redirect('/');
  // if fails, keep on login page
  // res.redirect('/login');

  models.Users.get({username: user})
    .then((userExists) => {
      if (userExists !== undefined) {
        models.Users.compare(req.body.password, userExists.password, userExists.salt)
          .then((dataComparison) => {
            if (dataComparison) {
              res.redirect('/');
            } else {
              res.redirect('/login');
            }
          });
      }
    });
});


//  params: {},
//     query: {},
//     res: [Circular],
//     body: { username: 'Samantha', password: 'Samantha' },
//     _body: true,
//     length: undefined,
//     route: Route { path: '/signup', stack: [Array], methods: [Object] },
//     [Symbol(kCapture)]: false

/************************************************************/
// Write your authentication routes here
/************************************************************/



/************************************************************/
// Handle the code parameter route last - if all other routes fail
// assume the route is a short code and try and handle it here.
// If the short-code doesn't exist, send the user to '/'
/************************************************************/

app.get('/:code', (req, res, next) => {

  return models.Links.get({ code: req.params.code })
    .tap(link => {

      if (!link) {
        throw new Error('Link does not exist');
      }
      return models.Clicks.create({ linkId: link.id });
    })
    .tap(link => {
      return models.Links.update(link, { visits: link.visits + 1 });
    })
    .then(({ url }) => {
      res.redirect(url);
    })
    .error(error => {
      res.status(500).send(error);
    })
    .catch(() => {
      res.redirect('/');
    });
});

module.exports = app;
