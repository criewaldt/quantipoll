var Sequelize = require('sequelize');
try {
  var config = require('../local/config.js');
} catch (err) {
  var config = {};
}
// sequelize initialization

var sequelize = new Sequelize(process.env.PGURI || config.PGURI, {
  dialect: 'postgres',
  logging: false, //turn off logging
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
      //notNull: true
    }
  },
  answers: {
    type: Sequelize.JSONB,
    validate: {
      //notNull: true
    }
  },
  userid: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      //notNull: true
    }
  },
  handle: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      
    }
  }
});

var User = sequelize.define('User', {
  userid: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  handle: {
    type: Sequelize.STRING,
    allowNull: false,
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
    allowNull: false,
    validate: {
      //notNull: true
    }
  },
  handle: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      //notNull: true
    }
  },
  userid: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      //notNull: true
    }
  },
  vote: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {
      //notNull: true
    }
  }
});

var Session = sequelize.define('Session', {
    sid: {
        type: Sequelize.STRING,
        primaryKey: true
    },
    expires: {
        type: Sequelize.DATE,
        allowNull: true
    },
    userId: Sequelize.STRING,
    data: Sequelize.STRING(50000)
});



User.sync().then(function() {
  //sync the db
});
Poll.sync().then(function() { // use {force:true} to drop table first
  //sync the db
});
Vote.sync().then(function() {
  //sync the db
});
Session.sync().then(function() {
  //sync the db
});

Session.belongsTo(User);


module.exports = {
    Vote: Vote,
    User: User,
    Poll: Poll,
    Session: Session
};
