var Polls = require('../models/poll.js'),
    Users = require('../models/user.js'),
    bodyParser = require('body-parser'),
    ObjectId = require('mongodb').ObjectID;


module.exports = function(app, passport){
  function isLoggedIn (req, res, next) {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.send({redirect: '/login'});
    }
  }

  app.use(bodyParser.urlencoded({ extended: true }));
  
  app.get('/login', function (req, res) {
    res.render('login');
  });
  
  app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/login');
  });
  
  app.get('/profile', isLoggedIn, function (req, res) {
    res.render('githubInfo');
  });
  
  app.get('/auth/github', passport.authenticate('github'));
  
  app.get('/auth/github/callback', passport.authenticate(
    'github', {
      successRedirect: '/',
      failureRedirect: '/login'
  }));
  
  app.get('/', function(req, res){
    res.render('dashboard');
  })
  
  app.get('/poll/*', function(req, res){
    var id = req.params['0'];
    if(req.user){
      var user = req.user.github.username;
    } else {
      var user = '';
    }
    Polls.find({_id: ObjectId(id)}).exec(function(err, result){
      res.render("pollViewer", {result, user});
    })
  })
  
  app.get('/userpoll/*', function(req, res){
    var id = req.params['0'];
    if(req.user){
      var user = req.user.github.username;
    } else {
      res.redirect('/login');
    }
    Polls.find({_id: ObjectId(id)}).exec(function(err, result){
      res.render("userPollViewer", {result, user});
    })
  })
  
  app.post('/api/upvote', function(req, res){
    var id = req.body.id,
        choice = req.body.choice,
        user = req.body.user;

    Polls.findOneAndUpdate(
      {
        _id: ObjectId(id),
        'options.choice': choice
      },
      { $inc: {'options.$.votes': 1}, $push: {voters: user} }).exec(function(err, result){
        res.end();
      }
    )
  })
  
  app.get('/api/viewpolls', function(req, res){
    Polls.find({}).exec(function(err, results){
      res.send(results);
    });    
  });
  
  app.get('/api/userpolls', isLoggedIn, function(req, res){
    Polls.find({author: req.user.github.username}).exec(function(err, results){
      res.send(results);
    });    
  });
  
  app.delete('/api/deletePoll', isLoggedIn, function(req, res){
    var id = req.body.id;
    Polls.find({_id: ObjectId(id)}).remove(function(err, result){
      res.end('');
    });
  });
  
  app.post('/api/newpoll', isLoggedIn, function(req, res){
    req.body.options.forEach(function(item, i){
      item.votes = parseInt(0);
    })
    var Poll = new Polls(req.body);
    Poll['author'] = req.user.github.username;
    Poll.save(function (err, doc) {
      if (err) { console.log(err); }
      res.end();
    })
  });
  
  app.get('/api/:id', isLoggedIn, function (req, res) {
    res.json(req.user.github);
  });
}