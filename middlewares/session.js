var express = require('express'),
  session = require('express-session'),
  SequelizeStore = require('connect-session-sequelize')(session.Store),
  router = express.Router(),
  Sequelize = require('sequelize'),
  models = require('../models/index');

try {
    var config = require('../local/config.js');
} catch (err) {
    console.log(err);
    var config = {};
}

var sequelize = new Sequelize(process.env.PGURI || config.PGURI, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: true
  }
});

router.use(session({
    secret: config.sessionSecret,
    store: new SequelizeStore({
        db: sequelize
    }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 7*24*60*60*1000
    }
}));

module.exports = {
    router:router
};