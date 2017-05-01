var Sequelize = require('sequelize'),
  config = require('../local/config.js');
// sequelize initialization

var sequelize = new Sequelize(config.PGURI, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: true
  }
});

sequelize
  .authenticate()
  .then(function(err) {
    console.log('Connection to Sequelize has been established successfully.');
  }, function (err) { 
    console.log('Unable to connect Sequelize to the database:', err);
  });
  
var Poll = sequelize.define('Poll', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  question: {
    type:Sequelize.TEXT,
    validate: {
      notNull: true
    }
  },
  answers: {
    type: Sequelize.JSONB,
    validate: {
      notNull: true
    }
  },
  userid: {
    type: Sequelize.STRING,
    validate: {
      notNull: true
    }
  }
});

var User = sequelize.define('User', {
  userid: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  googledata : {
    type: Sequelize.JSONB
  },
  phonedata: {
    type: Sequelize.JSONB
  }
});

var Vote = sequelize.define('Vote', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  pollid: {
    type:Sequelize.INTEGER,
    validate: {
      notNull: true
    }
  },
  userid: {
    type: Sequelize.STRING,
    validate: {
      notNull: true
    }
  },
  vote: {
    type: Sequelize.INTEGER,
    validate: {
      notNull: true
    }
  }
});

//require('./seed.js');


module.exports = {
    Vote: Vote,
    User: User,
    Poll: Poll,
};
