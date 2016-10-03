var express = require('express'),
  routes = require('./app/routes/index'),
  app = express(),
  myUrl = 'mongodb://phillipn:bunker1@ds029725.mlab.com:29725/url_shortener',
  path = require('path'),
  mongoose = require('mongoose'),
  passport = require('passport'),
  session = require('express-session');
  
  require('dotenv').load();
  require('./app/config/passport')(passport);
  
  mongoose.connect(myUrl, function(err, success){
    if(err){
      console.log(err);
    } else {
      console.log('Connected to db');
    }
  });
  
  app.locals.basedir = path.join(__dirname, 'views');
  app.use('/public', express.static( __dirname + '/public'));
  app.use('/app', express.static( __dirname + '/app'));
  app.set('view engine', 'jade');
  
  app.use(session({
    secret: 'secretClementine',
    resave: false,
    saveUninitialized: true
  }));

  app.use(passport.initialize());
  app.use(passport.session());
  
  app.use(function (req, res, next) {
    res.locals.loggedIn = req.isAuthenticated();
    next();
  });
  
  app.use(function (req, res, next) {
    if(req.user){
      res.locals.user = req.user.github.username;
    }
    next();
  });
  
  routes(app, passport);

  app.listen(process.env.PORT || 8080, function(){
    console.log('listening');
  })

