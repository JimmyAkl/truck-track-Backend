var express = require('express');
const bodyParser = require('body-parser');
var User = require('../models/user');

var passport = require('passport');
var authenticate = require('../authenticate');
var router = express.Router();

router.use(bodyParser.json());
/* GET users listing. */

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.route('/:userId')
.get((req,res,next) => {
    User.findById(req.params.userId)
    .then((user) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(user);
    }, (err) => next(err))
    .catch((err) => next(err));
});

router.post('/signup', (req, res, next) => {
  User.register(new User({ username: req.body.username, email: req.body.email, admin: req.body.admin }), 
    req.body.password, (err, user) => {
    if(err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err: err});
    }
    else {
      passport.authenticate('local')(req, res, () => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, status: 'Registration Successful!'});
      });
    }
  });
});

router.post('/login', passport.authenticate('local'), (req, res) => {
  var token = authenticate.getToken({_id: req.user._id});
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, token: token, status: 'You are successfully logged in!'});
});

router.get('/logout', function(req, res) {
  req.logout();
  res.status(200).json({status: 'Bye!'
  });

});

module.exports = router;